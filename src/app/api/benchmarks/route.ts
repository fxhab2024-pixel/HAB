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
    const industry = searchParams.get('industry');
    const year = searchParams.get('year');

    // Get user's company
    const company = await db.company.findUnique({
      where: { userId: user!.id },
    });

    let where: Record<string, unknown> = {};
    if (company) {
      where.companyId = company.id;
    }
    if (industry) {
      where.industry = industry;
    }
    if (year) {
      where.year = parseInt(year);
    }

    // If no company, get general benchmarks by industry
    if (!company && industry) {
      const benchmarks = await db.benchmark.findMany({
        where: { industry },
        orderBy: { metric: 'asc' },
      });
      return NextResponse.json({ benchmarks, industry });
    }

    const benchmarks = await db.benchmark.findMany({
      where,
      orderBy: { metric: 'asc' },
    });

    // Group by industry
    const grouped: Record<string, typeof benchmarks> = {};
    for (const benchmark of benchmarks) {
      if (!grouped[benchmark.industry]) {
        grouped[benchmark.industry] = [];
      }
      grouped[benchmark.industry].push(benchmark);
    }

    return NextResponse.json({
      benchmarks,
      grouped,
      total: benchmarks.length,
    });
  } catch (error) {
    console.error('Get benchmarks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
