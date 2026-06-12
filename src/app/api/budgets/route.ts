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
    const companyId = searchParams.get('companyId');
    const period = searchParams.get('period');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = {};
    if (companyId) where.companyId = companyId;
    if (period) where.period = period;

    const [budgets, total] = await Promise.all([
      db.budget.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          company: { select: { id: true, name: true, industry: true } },
        },
      }),
      db.budget.count({ where }),
    ]);

    return NextResponse.json({ budgets, total, limit, offset });
  } catch (error) {
    console.error('List budgets error:', error);
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
    const { companyId, name, period, startDate, endDate, categories, totalBudget } = body;

    if (!companyId || !name || !period || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'companyId, name, period, startDate, and endDate are required' },
        { status: 400 }
      );
    }

    const budget = await db.budget.create({
      data: {
        companyId,
        name,
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        categories: typeof categories === 'string' ? categories : JSON.stringify(categories || {}),
        totalBudget: totalBudget || 0,
      },
      include: {
        company: { select: { id: true, name: true, industry: true } },
      },
    });

    return NextResponse.json({ budget }, { status: 201 });
  } catch (error) {
    console.error('Create budget error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
