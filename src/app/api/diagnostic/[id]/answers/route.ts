import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { id } = await params;

    // Verify diagnostic belongs to user
    const diagnostic = await db.diagnostic.findFirst({
      where: { id, userId: user!.id },
    });

    if (!diagnostic) {
      return NextResponse.json(
        { error: 'Diagnostic not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { answers } = body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: 'Answers array is required' },
        { status: 400 }
      );
    }

    // Validate each answer
    const validDimensions = [
      'businessModel', 'market', 'product', 'customers', 'marketing',
      'sales', 'operations', 'financial', 'team', 'growth',
    ];

    for (const answer of answers) {
      if (!validDimensions.includes(answer.dimension)) {
        return NextResponse.json(
          { error: `Invalid dimension: ${answer.dimension}` },
          { status: 400 }
        );
      }
      if (typeof answer.questionIndex !== 'number' || answer.questionIndex < 0 || answer.questionIndex > 9) {
        return NextResponse.json(
          { error: `Invalid questionIndex: ${answer.questionIndex}. Must be 0-9` },
          { status: 400 }
        );
      }
      if (typeof answer.answer !== 'number' || answer.answer < 0 || answer.answer > 5) {
        return NextResponse.json(
          { error: `Invalid answer value: ${answer.answer}. Must be 0-5` },
          { status: 400 }
        );
      }
    }

    // Upsert answers - delete existing and recreate
    // First delete existing answers for this diagnostic
    await db.diagnosticAnswer.deleteMany({
      where: { diagnosticId: id },
    });

    // Create all answers
    const createdAnswers = await db.diagnosticAnswer.createMany({
      data: answers.map((a: { dimension: string; questionIndex: number; questionText: string; answer: number }) => ({
        diagnosticId: id,
        dimension: a.dimension,
        questionIndex: a.questionIndex,
        questionText: a.questionText || `Question ${a.questionIndex + 1} for ${a.dimension}`,
        answer: a.answer,
      })),
    });

    return NextResponse.json({
      message: 'Answers saved successfully',
      count: createdAnswers.count,
    });
  } catch (error) {
    console.error('Save diagnostic answers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { id } = await params;

    // Verify diagnostic belongs to user
    const diagnostic = await db.diagnostic.findFirst({
      where: { id, userId: user!.id },
    });

    if (!diagnostic) {
      return NextResponse.json(
        { error: 'Diagnostic not found' },
        { status: 404 }
      );
    }

    const answers = await db.diagnosticAnswer.findMany({
      where: { diagnosticId: id },
      orderBy: [{ dimension: 'asc' }, { questionIndex: 'asc' }],
    });

    // Group answers by dimension
    const grouped: Record<string, typeof answers> = {};
    for (const answer of answers) {
      if (!grouped[answer.dimension]) {
        grouped[answer.dimension] = [];
      }
      grouped[answer.dimension].push(answer);
    }

    return NextResponse.json({
      answers,
      grouped,
      total: answers.length,
    });
  } catch (error) {
    console.error('Get diagnostic answers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
