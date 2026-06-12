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
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const [workflows, total] = await Promise.all([
      db.workflow.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          _count: { select: { instances: true } },
        },
      }),
      db.workflow.count({ where }),
    ]);

    return NextResponse.json({ workflows, total, limit, offset });
  } catch (error) {
    console.error('List workflows error:', error);
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
    const { name, description, type, steps, triggerType, triggerConfig, status } = body;

    if (!name || !steps) {
      return NextResponse.json(
        { error: 'name and steps are required' },
        { status: 400 }
      );
    }

    const workflow = await db.workflow.create({
      data: {
        name,
        description,
        type: type || 'approval',
        status: status || 'active',
        steps: typeof steps === 'string' ? steps : JSON.stringify(steps),
        triggerType: triggerType || 'manual',
        triggerConfig: triggerConfig
          ? typeof triggerConfig === 'string'
            ? triggerConfig
            : JSON.stringify(triggerConfig)
          : undefined,
      },
      include: {
        _count: { select: { instances: true } },
      },
    });

    return NextResponse.json({ workflow }, { status: 201 });
  } catch (error) {
    console.error('Create workflow error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
