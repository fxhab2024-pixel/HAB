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
    const stage = searchParams.get('stage');
    const source = searchParams.get('source');
    const companyId = searchParams.get('companyId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = {};
    if (stage) where.stage = stage;
    if (source) where.source = source;
    if (companyId) where.companyId = companyId;

    const [leads, total] = await Promise.all([
      db.crmLead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          companyRel: { select: { id: true, name: true, industry: true } },
          creator: { select: { id: true, name: true, email: true } },
          followUps: { orderBy: { dueDate: 'desc' }, take: 5 },
          _count: { select: { interactions: true, followUps: true } },
        },
      }),
      db.crmLead.count({ where }),
    ]);

    return NextResponse.json({ leads, total, limit, offset });
  } catch (error) {
    console.error('List CRM leads error:', error);
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
    const {
      companyId,
      name,
      email,
      phone,
      company,
      industry,
      source,
      stage,
      value,
      probability,
      notes,
      tags,
      nextFollowUp,
    } = body;

    if (!name || !companyId) {
      return NextResponse.json(
        { error: 'Lead name and companyId are required' },
        { status: 400 }
      );
    }

    const lead = await db.crmLead.create({
      data: {
        companyId,
        creatorId: user!.id,
        name,
        email,
        phone,
        company,
        industry,
        source: source || 'website',
        stage: stage || 'new',
        value: value || 0,
        probability: probability || 0.2,
        notes,
        tags,
        nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : undefined,
      },
      include: {
        companyRel: { select: { id: true, name: true, industry: true } },
        creator: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    console.error('Create CRM lead error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
