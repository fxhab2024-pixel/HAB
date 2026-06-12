import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

// Dimension weights
const DIMENSION_WEIGHTS: Record<string, number> = {
  businessModel: 0.15,
  market: 0.12,
  product: 0.10,
  customers: 0.10,
  marketing: 0.08,
  sales: 0.08,
  operations: 0.10,
  financial: 0.15,
  team: 0.07,
  growth: 0.05,
};

function getPerformanceTier(score: number): string {
  if (score >= 80) return 'Strong';
  if (score >= 65) return 'Stable';
  if (score >= 50) return 'Weak';
  return 'Critical';
}

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
      include: { answers: true },
    });

    if (!diagnostic) {
      return NextResponse.json(
        { error: 'Diagnostic not found' },
        { status: 404 }
      );
    }

    if (diagnostic.answers.length === 0) {
      return NextResponse.json(
        { error: 'No answers found for this diagnostic. Please submit answers first.' },
        { status: 400 }
      );
    }

    // Group answers by dimension and calculate scores
    const dimensionScores: Record<string, number[]> = {};
    for (const answer of diagnostic.answers) {
      if (!dimensionScores[answer.dimension]) {
        dimensionScores[answer.dimension] = [];
      }
      dimensionScores[answer.dimension].push(answer.answer);
    }

    // Calculate normalized score per dimension (0-100)
    // Each dimension has 10 questions scored 0-5
    // Max raw score per dimension = 10 * 5 = 50
    // Normalize: (raw / 50) * 100
    const normalizedScores: Record<string, number> = {};
    const dimensionDetails: Record<string, { raw: number; max: number; normalized: number; tier: string; questionCount: number }> = {};

    for (const [dimension, scores] of Object.entries(dimensionScores)) {
      const rawSum = scores.reduce((sum, s) => sum + s, 0);
      const maxPossible = scores.length * 5;
      const normalized = Math.round((rawSum / maxPossible) * 100 * 100) / 100;
      normalizedScores[dimension] = normalized;
      dimensionDetails[dimension] = {
        raw: rawSum,
        max: maxPossible,
        normalized,
        tier: getPerformanceTier(normalized),
        questionCount: scores.length,
      };
    }

    // Fill in missing dimensions with 0
    for (const dim of Object.keys(DIMENSION_WEIGHTS)) {
      if (!(dim in normalizedScores)) {
        normalizedScores[dim] = 0;
        dimensionDetails[dim] = {
          raw: 0,
          max: 50,
          normalized: 0,
          tier: getPerformanceTier(0),
          questionCount: 0,
        };
      }
    }

    // Calculate overall score (weighted sum)
    const overallScore = Math.round(
      Object.entries(DIMENSION_WEIGHTS).reduce(
        (sum, [dim, weight]) => sum + (normalizedScores[dim] || 0) * weight,
        0
      ) * 100
    ) / 100;

    // Calculate risk score
    // riskScore = ((1-financial/100)*0.4 + (1-market/100)*0.3 + (1-operations/100)*0.2 + (1-growth/100)*0.1) * 100
    const riskScore = Math.round(
      ((1 - (normalizedScores.financial || 0) / 100) * 0.4 +
        (1 - (normalizedScores.market || 0) / 100) * 0.3 +
        (1 - (normalizedScores.operations || 0) / 100) * 0.2 +
        (1 - (normalizedScores.growth || 0) / 100) * 0.1) *
        100 * 100
    ) / 100;

    // Calculate growth potential
    // growthPotential = 0.35*market + 0.25*product + 0.25*growth + 0.15*sales
    const growthPotential = Math.round(
      (0.35 * (normalizedScores.market || 0) +
        0.25 * (normalizedScores.product || 0) +
        0.25 * (normalizedScores.growth || 0) +
        0.15 * (normalizedScores.sales || 0)) * 100
    ) / 100;

    // Calculate investment readiness
    // investmentReady = 0.30*market + 0.25*financial + 0.20*growthPotential + 0.15*team + 0.10*businessModel
    const investmentReady = Math.round(
      (0.30 * (normalizedScores.market || 0) +
        0.25 * (normalizedScores.financial || 0) +
        0.20 * growthPotential +
        0.15 * (normalizedScores.team || 0) +
        0.10 * (normalizedScores.businessModel || 0)) * 100
    ) / 100;

    // Update diagnostic with calculated scores
    const updatedDiagnostic = await db.diagnostic.update({
      where: { id },
      data: {
        businessModel: normalizedScores.businessModel || 0,
        market: normalizedScores.market || 0,
        product: normalizedScores.product || 0,
        customers: normalizedScores.customers || 0,
        marketing: normalizedScores.marketing || 0,
        sales: normalizedScores.sales || 0,
        operations: normalizedScores.operations || 0,
        financial: normalizedScores.financial || 0,
        team: normalizedScores.team || 0,
        growth: normalizedScores.growth || 0,
        overallScore,
        riskScore,
        growthPotential,
        investmentReady,
        status: 'completed',
      },
    });

    return NextResponse.json({
      diagnostic: updatedDiagnostic,
      dimensionDetails,
      performanceTier: getPerformanceTier(overallScore),
      riskLevel: riskScore > 60 ? 'High' : riskScore > 40 ? 'Medium' : 'Low',
      growthPotentialLevel: growthPotential > 70 ? 'High' : growthPotential > 50 ? 'Medium' : 'Low',
      investmentReadiness: investmentReady > 70 ? 'Ready' : investmentReady > 50 ? 'Nearly Ready' : 'Not Ready',
    });
  } catch (error) {
    console.error('Calculate diagnostic scores error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
