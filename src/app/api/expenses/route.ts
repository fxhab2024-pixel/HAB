import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const companyId = searchParams.get('companyId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (companyId) where.companyId = companyId;

    const [expenses, total] = await Promise.all([
      db.expense.findMany({
        where,
        orderBy: { date: 'desc' },
        take: limit,
        skip: offset,
        include: {
          company: { select: { id: true, name: true, industry: true } },
          creator: { select: { id: true, name: true, email: true } },
        },
      }),
      db.expense.count({ where }),
    ]);

    return NextResponse.json({ expenses, total, limit, offset });
  } catch (error) {
    console.error('List expenses error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const body = await request.json();
    const { companyId, category, amount, description, date, receipt, status, approvedBy } = body;

    if (!companyId || !category || !amount || !date) {
      return NextResponse.json(
        { error: 'companyId, category, amount, and date are required' },
        { status: 400 }
      );
    }

    const expense = await db.expense.create({
      data: {
        companyId,
        creatorId: user!.id,
        category,
        amount,
        description,
        date: new Date(date),
        receipt,
        status: status || 'pending',
        approvedBy,
      },
      include: {
        company: { select: { id: true, name: true, industry: true } },
        creator: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    console.error('Create expense error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
