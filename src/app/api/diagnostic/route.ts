import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const body = await request.json();
    const { companyId } = body;

    // Verify company belongs to user if provided
    if (companyId) {
      const company = await db.company.findFirst({
        where: { id: companyId, userId: user!.id },
      });
      if (!company) {
        return NextResponse.json(
          { error: 'Company not found or does not belong to you' },
          { status: 403 }
        );
      }
    }

    const diagnostic = await db.diagnostic.create({
      data: {
        userId: user!.id,
        companyId: companyId || null,
        status: 'in_progress',
      },
    });

    return NextResponse.json({ diagnostic }, { status: 201 });
  } catch (error) {
    console.error('Create diagnostic error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = { userId: user!.id };
    if (status) {
      where.status = status;
    }

    const [diagnostics, total] = await Promise.all([
      db.diagnostic.findMany({
        where,
        include: {
          company: {
            select: { id: true, name: true, industry: true },
          },
          _count: {
            select: { answers: true, recommendations: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.diagnostic.count({ where }),
    ]);

    return NextResponse.json({
      diagnostics,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('List diagnostics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
