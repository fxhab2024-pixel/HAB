import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

// Strategy library with default impact/feasibility/cost/risk/time values
const STRATEGY_LIBRARY = [
  {
    strategyName: 'Business Model Innovation',
    strategyDesc: 'Redesign your core business model to create new value propositions, revenue streams, and competitive advantages through innovative approaches to value creation and capture.',
    category: 'businessModel',
    impact: 9, feasibility: 5, cost: 7, risk: 8, timeToImplement: '6-12 months',
    rationale: 'A strong business model is the foundation of sustainable competitive advantage. Innovating your model can unlock new markets and revenue streams.',
  },
  {
    strategyName: 'Market Expansion Strategy',
    strategyDesc: 'Identify and enter new markets through geographic expansion, demographic targeting, or vertical integration to drive growth and diversification.',
    category: 'market',
    impact: 8, feasibility: 6, cost: 7, risk: 6, timeToImplement: '6-9 months',
    rationale: 'Market expansion reduces dependency on a single market and creates multiple revenue channels for sustainable growth.',
  },
  {
    strategyName: 'Product Diversification',
    strategyDesc: 'Develop new products or services that complement your existing offerings, reducing market risk and increasing customer lifetime value.',
    category: 'product',
    impact: 8, feasibility: 5, cost: 8, risk: 7, timeToImplement: '9-18 months',
    rationale: 'Product diversification spreads risk and creates cross-selling opportunities while addressing unmet customer needs.',
  },
  {
    strategyName: 'Customer Segmentation Optimization',
    strategyDesc: 'Refine your customer segmentation to identify high-value segments, tailor your value proposition, and optimize resource allocation for maximum ROI.',
    category: 'customers',
    impact: 7, feasibility: 8, cost: 3, risk: 2, timeToImplement: '2-4 months',
    rationale: 'Better customer understanding leads to more effective acquisition, higher retention, and improved unit economics.',
  },
  {
    strategyName: 'Digital Marketing Transformation',
    strategyDesc: 'Leverage data-driven digital marketing strategies, automation tools, and performance analytics to dramatically improve marketing ROI and reach.',
    category: 'marketing',
    impact: 7, feasibility: 7, cost: 4, risk: 3, timeToImplement: '3-6 months',
    rationale: 'Digital marketing transformation enables precise targeting, real-time optimization, and measurable results at scale.',
  },
  {
    strategyName: 'Sales Funnel Optimization',
    strategyDesc: 'Streamline and optimize your sales funnel from lead generation to conversion, improving win rates and reducing customer acquisition costs.',
    category: 'sales',
    impact: 7, feasibility: 7, cost: 3, risk: 2, timeToImplement: '2-4 months',
    rationale: 'An optimized sales funnel converts more leads with less effort, directly impacting revenue and growth metrics.',
  },
  {
    strategyName: 'Operational Excellence Program',
    strategyDesc: 'Implement systematic process improvements, lean methodologies, and automation to reduce costs, improve quality, and increase operational efficiency.',
    category: 'operations',
    impact: 8, feasibility: 7, cost: 5, risk: 3, timeToImplement: '4-8 months',
    rationale: 'Operational excellence reduces waste, improves margins, and creates the operational foundation needed for scaling.',
  },
  {
    strategyName: 'Financial Restructuring',
    strategyDesc: 'Optimize your capital structure, improve cash flow management, and implement financial controls to strengthen your financial position and resilience.',
    category: 'financial',
    impact: 9, feasibility: 6, cost: 5, risk: 5, timeToImplement: '3-6 months',
    rationale: 'Strong financial health is essential for survival and growth. Restructuring can unlock capital and reduce financial risk.',
  },
  {
    strategyName: 'Leadership Development',
    strategyDesc: 'Build leadership capabilities at all levels through targeted development programs, coaching, and succession planning to drive organizational effectiveness.',
    category: 'team',
    impact: 7, feasibility: 6, cost: 4, risk: 2, timeToImplement: '6-12 months',
    rationale: 'Strong leadership cascades throughout the organization, improving decision-making, culture, and execution at every level.',
  },
  {
    strategyName: 'Growth Acceleration',
    strategyDesc: 'Implement rapid growth strategies including viral loops, referral programs, and strategic partnerships to exponentially increase your growth rate.',
    category: 'growth',
    impact: 8, feasibility: 5, cost: 6, risk: 6, timeToImplement: '3-6 months',
    rationale: 'Accelerating growth creates market momentum, attracts talent and investment, and builds competitive moats.',
  },
  {
    strategyName: 'Strategic Partnership Development',
    strategyDesc: 'Form strategic alliances and partnerships to access new markets, technologies, and capabilities without heavy capital investment.',
    category: 'market',
    impact: 7, feasibility: 6, cost: 4, risk: 4, timeToImplement: '3-6 months',
    rationale: 'Partnerships multiply capabilities and market reach while sharing risk and reducing time-to-market.',
  },
  {
    strategyName: 'Customer Retention Program',
    strategyDesc: 'Implement systematic customer success programs, loyalty incentives, and feedback loops to reduce churn and increase customer lifetime value.',
    category: 'customers',
    impact: 8, feasibility: 8, cost: 3, risk: 2, timeToImplement: '2-4 months',
    rationale: 'Retaining customers is 5-7x cheaper than acquiring new ones. High retention drives sustainable revenue growth.',
  },
  {
    strategyName: 'Product-Market Fit Refinement',
    strategyDesc: 'Conduct deep customer research, iterate on your value proposition, and refine product features to achieve stronger product-market fit.',
    category: 'product',
    impact: 9, feasibility: 6, cost: 4, risk: 3, timeToImplement: '2-4 months',
    rationale: 'Strong product-market fit is the single most important factor in startup success. Even small improvements yield outsized results.',
  },
  {
    strategyName: 'Pricing Strategy Optimization',
    strategyDesc: 'Analyze and optimize your pricing model, implement value-based pricing, and test price elasticity to maximize revenue and margins.',
    category: 'financial',
    impact: 8, feasibility: 7, cost: 2, risk: 3, timeToImplement: '1-3 months',
    rationale: 'Pricing is the most powerful lever for profitability. Small pricing improvements have outsized impact on the bottom line.',
  },
  {
    strategyName: 'Supply Chain Optimization',
    strategyDesc: 'Redesign your supply chain for resilience, efficiency, and cost reduction through strategic sourcing, inventory optimization, and vendor management.',
    category: 'operations',
    impact: 7, feasibility: 6, cost: 5, risk: 4, timeToImplement: '4-8 months',
    rationale: 'An optimized supply chain reduces costs, improves delivery times, and builds resilience against disruptions.',
  },
  {
    strategyName: 'Brand Positioning Strategy',
    strategyDesc: 'Define and communicate a differentiated brand position that resonates with your target audience and creates lasting competitive advantage.',
    category: 'marketing',
    impact: 6, feasibility: 6, cost: 5, risk: 3, timeToImplement: '3-6 months',
    rationale: 'Strong brand positioning creates premium pricing power, customer loyalty, and a sustainable competitive moat.',
  },
  {
    strategyName: 'Talent Acquisition Strategy',
    strategyDesc: 'Build a systematic approach to attracting, evaluating, and onboarding top talent to create a high-performance organization.',
    category: 'team',
    impact: 7, feasibility: 5, cost: 5, risk: 3, timeToImplement: '3-6 months',
    rationale: 'Great talent is the engine of growth. A strategic approach to hiring ensures you get the right people in the right roles.',
  },
  {
    strategyName: 'M&A Strategy',
    strategyDesc: 'Pursue strategic mergers and acquisitions to accelerate growth, acquire capabilities, eliminate competitors, or enter new markets.',
    category: 'growth',
    impact: 9, feasibility: 3, cost: 9, risk: 8, timeToImplement: '6-18 months',
    rationale: 'M&A can provide step-change growth, but requires careful due diligence, integration planning, and risk management.',
  },
  {
    strategyName: 'Technology Adoption',
    strategyDesc: 'Leverage emerging technologies such as AI, automation, and cloud platforms to transform operations, enhance products, and create new value.',
    category: 'operations',
    impact: 8, feasibility: 6, cost: 6, risk: 5, timeToImplement: '3-9 months',
    rationale: 'Technology adoption drives efficiency, enables new capabilities, and creates competitive advantages in the digital economy.',
  },
  {
    strategyName: 'Investment Readiness Program',
    strategyDesc: 'Prepare your business for external investment by strengthening governance, financial reporting, growth metrics, and investor materials.',
    category: 'financial',
    impact: 7, feasibility: 7, cost: 3, risk: 2, timeToImplement: '2-4 months',
    rationale: 'Investment readiness opens doors to capital that fuels growth. Proper preparation increases valuation and investor confidence.',
  },
];

// Calculate priority: (Impact × Feasibility) / (Cost × Risk × Time)
function calculatePriority(strategy: typeof STRATEGY_LIBRARY[0]): number {
  const timeMultiplier = parseTimeToNumber(strategy.timeToImplement);
  const numerator = strategy.impact * strategy.feasibility;
  const denominator = strategy.cost * strategy.risk * timeMultiplier;
  return Math.round((numerator / denominator) * 100) / 100;
}

function parseTimeToNumber(timeStr: string): number {
  const months = timeStr.match(/(\d+)-?(\d+)?\s*months?/);
  if (months) {
    if (months[2]) return (parseInt(months[1]) + parseInt(months[2])) / 2;
    return parseInt(months[1]);
  }
  return 6; // default
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

    // Check if recommendations already exist
    const existingRecs = await db.strategyRecommendation.findMany({
      where: { diagnosticId: id },
      orderBy: { priority: 'desc' },
    });

    if (existingRecs.length > 0) {
      return NextResponse.json({ recommendations: existingRecs });
    }

    // Generate recommendations for dimensions scoring < 60
    const dimensionScores: Record<string, number> = {
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

    const weakDimensions = Object.entries(dimensionScores)
      .filter(([, score]) => score < 60)
      .map(([dim]) => dim);

    if (weakDimensions.length === 0) {
      // All dimensions are strong, still provide top improvement suggestions
      const allRecs = STRATEGY_LIBRARY
        .map((s) => ({
          ...s,
          priority: calculatePriority(s),
        }))
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 5);

      const created = await db.strategyRecommendation.createMany({
        data: allRecs.map((rec) => ({
          diagnosticId: id,
          strategyName: rec.strategyName,
          strategyDesc: rec.strategyDesc,
          category: rec.category,
          priority: rec.priority,
          impact: rec.impact,
          feasibility: rec.feasibility,
          cost: rec.cost,
          risk: rec.risk,
          timeToImplement: rec.timeToImplement,
          rationale: rec.rationale,
          status: 'suggested',
        })),
      });

      const recs = await db.strategyRecommendation.findMany({
        where: { diagnosticId: id },
        orderBy: { priority: 'desc' },
      });

      return NextResponse.json({ recommendations: recs });
    }

    // Filter strategies for weak dimensions
    const relevantStrategies = STRATEGY_LIBRARY.filter(
      (s) => weakDimensions.includes(s.category)
    );

    // Calculate priority for each and sort
    const scoredStrategies = relevantStrategies.map((s) => ({
      ...s,
      priority: calculatePriority(s),
    }));

    // Boost priority for dimensions with lowest scores
    scoredStrategies.sort((a, b) => {
      const aScore = dimensionScores[a.category] || 0;
      const bScore = dimensionScores[b.category] || 0;
      // Lower score = higher priority
      if (aScore !== bScore) return aScore - bScore;
      return b.priority - a.priority;
    });

    // Create recommendations
    const recommendations = await db.strategyRecommendation.createMany({
      data: scoredStrategies.map((rec) => ({
        diagnosticId: id,
        strategyName: rec.strategyName,
        strategyDesc: rec.strategyDesc,
        category: rec.category,
        priority: rec.priority,
        impact: rec.impact,
        feasibility: rec.feasibility,
        cost: rec.cost,
        risk: rec.risk,
        timeToImplement: rec.timeToImplement,
        rationale: rec.rationale,
        status: 'suggested',
      })),
    });

    const recs = await db.strategyRecommendation.findMany({
      where: { diagnosticId: id },
      orderBy: { priority: 'desc' },
    });

    return NextResponse.json({
      recommendations: recs,
      weakDimensions,
      generated: true,
      count: recommendations.count,
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
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
    });

    if (!diagnostic) {
      return NextResponse.json(
        { error: 'Diagnostic not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { recommendationId, status } = body;

    if (!recommendationId || !status) {
      return NextResponse.json(
        { error: 'recommendationId and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['suggested', 'accepted', 'rejected', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Verify recommendation belongs to this diagnostic
    const rec = await db.strategyRecommendation.findFirst({
      where: { id: recommendationId, diagnosticId: id },
    });

    if (!rec) {
      return NextResponse.json(
        { error: 'Recommendation not found' },
        { status: 404 }
      );
    }

    const updatedRec = await db.strategyRecommendation.update({
      where: { id: recommendationId },
      data: { status },
    });

    return NextResponse.json({ recommendation: updatedRec });
  } catch (error) {
    console.error('Update recommendation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
