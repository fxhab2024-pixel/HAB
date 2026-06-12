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
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = { userId: user!.id };
    if (type) {
      where.type = type;
    }

    const [reports, total] = await Promise.all([
      db.report.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.report.count({ where }),
    ]);

    return NextResponse.json({
      reports,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('List reports error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const body = await request.json();
    const { diagnosticId, type } = body;

    if (!diagnosticId || !type) {
      return NextResponse.json(
        { error: 'diagnosticId and type are required' },
        { status: 400 }
      );
    }

    const validTypes = ['strategic', 'growth', 'risk', 'market', 'investor'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid report type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Verify diagnostic belongs to user
    const diagnostic = await db.diagnostic.findFirst({
      where: { id: diagnosticId, userId: user!.id },
    });

    if (!diagnostic) {
      return NextResponse.json(
        { error: 'Diagnostic not found' },
        { status: 404 }
      );
    }

    if (diagnostic.status !== 'completed') {
      return NextResponse.json(
        { error: 'Diagnostic must be completed before generating a report' },
        { status: 400 }
      );
    }

    // Get company info if available
    const company = await db.company.findUnique({
      where: { userId: user!.id },
    });

    // Get recommendations for this diagnostic
    const recommendations = await db.strategyRecommendation.findMany({
      where: { diagnosticId },
    });

    // Generate report content based on type
    const reportContent = generateReportContent(type, diagnostic, company, recommendations);

    const report = await db.report.create({
      data: {
        userId: user!.id,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${new Date().toLocaleDateString()}`,
        type,
        content: JSON.stringify(reportContent),
      },
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    console.error('Generate report error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getPerformanceTier(score: number): string {
  if (score >= 80) return 'Strong';
  if (score >= 65) return 'Stable';
  if (score >= 50) return 'Weak';
  return 'Critical';
}

function generateReportContent(
  type: string,
  diagnostic: {
    businessModel: number;
    market: number;
    product: number;
    customers: number;
    marketing: number;
    sales: number;
    operations: number;
    financial: number;
    team: number;
    growth: number;
    overallScore: number;
    riskScore: number;
    growthPotential: number;
    investmentReady: number;
  },
  company: { name: string; industry: string | null; stage: string | null } | null,
  recommendations: Array<{ strategyName: string; category: string; priority: number; status: string }>
) {
  const companyName = company?.name || 'Your Company';
  const industry = company?.industry || 'General';

  const dimensionScores = {
    businessModel: diagnostic.businessModel,
    market: diagnostic.market,
    product: diagnostic.product,
    customers: diagnostic.customers,
    marketing: diagnostic.marketing,
    sales: diagnostic.sales,
    operations: diagnostic.operations,
    financial: diagnostic.financial,
    team: diagnostic.team,
    growth: diagnostic.growth,
  };

  const overallTier = getPerformanceTier(diagnostic.overallScore);

  switch (type) {
    case 'strategic':
      return {
        executiveSummary: `Strategic assessment for ${companyName} in the ${industry} industry. Overall performance tier: ${overallTier} (${diagnostic.overallScore}/100). The company shows ${diagnostic.growthPotential > 60 ? 'promising' : 'limited'} growth potential and ${diagnostic.investmentReady > 60 ? 'good' : 'needs improvement for'} investment readiness.`,
        overallScore: diagnostic.overallScore,
        overallTier,
        dimensionAnalysis: Object.entries(dimensionScores).map(([dim, score]) => ({
          dimension: dim,
          score,
          tier: getPerformanceTier(score),
          status: score >= 60 ? 'On Track' : 'Needs Improvement',
        })),
        keyStrengths: Object.entries(dimensionScores)
          .filter(([, s]) => s >= 65)
          .map(([d, s]) => ({ dimension: d, score: s })),
        criticalGaps: Object.entries(dimensionScores)
          .filter(([, s]) => s < 50)
          .map(([d, s]) => ({ dimension: d, score: s })),
        topRecommendations: recommendations.slice(0, 5).map((r) => ({
          name: r.strategyName,
          category: r.category,
          priority: r.priority,
        })),
      };

    case 'growth':
      return {
        executiveSummary: `Growth potential analysis for ${companyName}. Growth potential score: ${diagnostic.growthPotential}/100. Market positioning: ${getPerformanceTier(diagnostic.market)}. Product strength: ${getPerformanceTier(diagnostic.product)}.`,
        growthPotential: diagnostic.growthPotential,
        growthTier: getPerformanceTier(diagnostic.growthPotential),
        marketAnalysis: {
          marketScore: diagnostic.market,
          marketTier: getPerformanceTier(diagnostic.market),
          productScore: diagnostic.product,
          growthScore: diagnostic.growth,
          salesScore: diagnostic.sales,
        },
        growthDrivers: Object.entries(dimensionScores)
          .filter(([, s]) => s >= 65)
          .map(([d, s]) => ({ dimension: d, score: s, potential: 'High' })),
        growthBarriers: Object.entries(dimensionScores)
          .filter(([, s]) => s < 50)
          .map(([d, s]) => ({ dimension: d, score: s, impact: 'Critical' })),
        recommendedGrowthStrategies: recommendations
          .filter((r) => ['market', 'product', 'growth', 'sales'].includes(r.category))
          .slice(0, 5)
          .map((r) => ({ name: r.strategyName, priority: r.priority })),
      };

    case 'risk':
      return {
        executiveSummary: `Risk assessment for ${companyName}. Overall risk score: ${diagnostic.riskScore}/100. Financial risk is the primary factor at ${getPerformanceTier(100 - diagnostic.financial)} level. Market risk: ${getPerformanceTier(100 - diagnostic.market)}.`,
        riskScore: diagnostic.riskScore,
        riskLevel: diagnostic.riskScore > 60 ? 'High' : diagnostic.riskScore > 40 ? 'Medium' : 'Low',
        riskFactors: {
          financial: { score: diagnostic.financial, risk: Math.round((1 - diagnostic.financial / 100) * 100), weight: '40%' },
          market: { score: diagnostic.market, risk: Math.round((1 - diagnostic.market / 100) * 100), weight: '30%' },
          operations: { score: diagnostic.operations, risk: Math.round((1 - diagnostic.operations / 100) * 100), weight: '20%' },
          growth: { score: diagnostic.growth, risk: Math.round((1 - diagnostic.growth / 100) * 100), weight: '10%' },
        },
        criticalRisks: Object.entries(dimensionScores)
          .filter(([, s]) => s < 50)
          .map(([d, s]) => ({
            dimension: d,
            score: s,
            riskLevel: 'Critical',
            mitigation: `Focus on ${d} improvement strategies to reduce associated risk.`,
          })),
        riskMitigationStrategies: recommendations
          .filter((r) => ['financial', 'operations'].includes(r.category))
          .slice(0, 5)
          .map((r) => ({ name: r.strategyName, category: r.category, priority: r.priority })),
      };

    case 'market':
      return {
        executiveSummary: `Market position analysis for ${companyName} in ${industry}. Market score: ${diagnostic.market}/100 (${getPerformanceTier(diagnostic.market)}). Customer strength: ${diagnostic.customers}/100.`,
        marketScore: diagnostic.market,
        marketTier: getPerformanceTier(diagnostic.market),
        competitivePosition: {
          market: diagnostic.market,
          customers: diagnostic.customers,
          marketing: diagnostic.marketing,
          sales: diagnostic.sales,
          product: diagnostic.product,
        },
        marketOpportunities: recommendations
          .filter((r) => ['market', 'customers', 'marketing'].includes(r.category))
          .slice(0, 5)
          .map((r) => ({ name: r.strategyName, category: r.category, priority: r.priority })),
        customerInsights: {
          customerScore: diagnostic.customers,
          salesEffectiveness: diagnostic.sales,
          marketingReach: diagnostic.marketing,
          retentionRisk: diagnostic.customers < 50 ? 'High' : diagnostic.customers < 65 ? 'Medium' : 'Low',
        },
      };

    case 'investor':
      return {
        executiveSummary: `Investment readiness assessment for ${companyName}. Investment readiness score: ${diagnostic.investmentReady}/100. Overall performance: ${diagnostic.overallScore}/100 (${overallTier}).`,
        investmentReadiness: diagnostic.investmentReady,
        readinessLevel: diagnostic.investmentReady > 70 ? 'Ready' : diagnostic.investmentReady > 50 ? 'Nearly Ready' : 'Not Ready',
        keyMetrics: {
          overallScore: diagnostic.overallScore,
          marketPosition: diagnostic.market,
          financialHealth: diagnostic.financial,
          growthPotential: diagnostic.growthPotential,
          teamStrength: diagnostic.team,
          businessModelStrength: diagnostic.businessModel,
        },
        investorRedFlags: Object.entries(dimensionScores)
          .filter(([, s]) => s < 50)
          .map(([d, s]) => ({ dimension: d, score: s, concern: `${d} score of ${s} may concern investors.` })),
        investmentThesis: {
          strengths: Object.entries(dimensionScores)
            .filter(([, s]) => s >= 70)
            .map(([d, s]) => `Strong ${d} performance (${s}/100)`),
          opportunities: [
            diagnostic.growthPotential > 60 ? 'Strong growth potential' : 'Growth potential needs development',
            diagnostic.market > 60 ? 'Solid market position' : 'Market position needs strengthening',
            diagnostic.financial > 60 ? 'Healthy financial metrics' : 'Financial metrics need improvement',
          ],
          nextSteps: recommendations
            .filter((r) => ['financial', 'market', 'team', 'businessModel'].includes(r.category))
            .slice(0, 3)
            .map((r) => r.strategyName),
        },
      };

    default:
      return { message: 'Report generated', overallScore: diagnostic.overallScore };
  }
}
