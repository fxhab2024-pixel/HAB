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
    const leadId = searchParams.get('leadId');
    const completed = searchParams.get('completed');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = {};
    if (leadId) where.leadId = leadId;
    if (completed !== null && completed !== undefined) {
      where.completed = completed === 'true';
    }

    const [followUps, total] = await Promise.all([
      db.crmFollowUp.findMany({
        where,
        orderBy: { dueDate: 'asc' },
        take: limit,
        skip: offset,
        include: {
          lead: { select: { id: true, name: true, company: true, stage: true } },
          creator: { select: { id: true, name: true, email: true } },
        },
      }),
      db.crmFollowUp.count({ where }),
    ]);

    return NextResponse.json({ followUps, total, limit, offset });
  } catch (error) {
    console.error('List CRM follow-ups error:', error);
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
    const { leadId, type, subject, notes, dueDate, completed } = body;

    if (!leadId || !subject || !dueDate) {
      return NextResponse.json(
        { error: 'leadId, subject, and dueDate are required' },
        { status: 400 }
      );
    }

    const followUp = await db.crmFollowUp.create({
      data: {
        leadId,
        creatorId: user!.id,
        type: type || 'call',
        subject,
        notes,
        dueDate: new Date(dueDate),
        completed: completed || false,
      },
      include: {
        lead: { select: { id: true, name: true, company: true, stage: true } },
        creator: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ followUp }, { status: 201 });
  } catch (error) {
    console.error('Create CRM follow-up error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
