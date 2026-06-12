import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

// Phase templates based on score tiers
interface PhaseTemplate {
  title: string;
  description: string;
  duration: string;
  order: number;
  milestoneTemplates: Record<string, string[]>;
  taskTemplates: Record<string, Array<{ title: string; priority: string; description: string }>>;
}

const PHASE_TEMPLATES: PhaseTemplate[] = [
  {
    title: 'Foundation',
    description: 'Address critical gaps and establish the foundation for growth. Focus on stabilizing weak areas and building core capabilities.',
    duration: '0-30 days',
    order: 1,
    milestoneTemplates: {
      financial: ['Complete financial health audit', 'Establish emergency cash reserve plan', 'Implement basic financial controls'],
      market: ['Complete market research and validation', 'Define target customer personas', 'Map competitive landscape'],
      operations: ['Document core processes', 'Identify operational bottlenecks', 'Create standard operating procedures'],
      businessModel: ['Validate current business model', 'Identify model weaknesses', 'Define innovation opportunities'],
      product: ['Conduct product audit', 'Gather customer feedback', 'Define MVP improvements'],
      customers: ['Analyze customer churn reasons', 'Segment customer base', 'Create customer journey map'],
      marketing: ['Audit current marketing channels', 'Define brand positioning', 'Set marketing KPIs'],
      sales: ['Analyze sales funnel metrics', 'Define ideal customer profile', 'Create sales playbook draft'],
      team: ['Assess team capabilities and gaps', 'Define key roles needed', 'Create hiring plan'],
      growth: ['Analyze growth metrics baseline', 'Identify growth bottlenecks', 'Set realistic growth targets'],
    },
    taskTemplates: {
      financial: [
        { title: 'Conduct financial health assessment', priority: 'critical', description: 'Review P&L, cash flow, and balance sheet to identify immediate risks.' },
        { title: 'Set up financial tracking dashboard', priority: 'high', description: 'Implement real-time tracking of key financial metrics.' },
        { title: 'Create 13-week cash flow forecast', priority: 'critical', description: 'Project cash needs and identify potential shortfalls.' },
      ],
      market: [
        { title: 'Run customer discovery interviews', priority: 'critical', description: 'Interview 10-20 customers to validate market assumptions.' },
        { title: 'Competitive analysis report', priority: 'high', description: 'Document competitors, their strategies, and market positioning.' },
        { title: 'Define target market segments', priority: 'high', description: 'Prioritize market segments based on opportunity and fit.' },
      ],
      operations: [
        { title: 'Process audit and documentation', priority: 'high', description: 'Document all core operational processes and identify inefficiencies.' },
        { title: 'Implement basic quality controls', priority: 'medium', description: 'Set up quality checkpoints in key operational workflows.' },
      ],
      businessModel: [
        { title: 'Business model canvas review', priority: 'critical', description: 'Map current business model and identify structural weaknesses.' },
        { title: 'Revenue stream diversification analysis', priority: 'high', description: 'Evaluate potential new revenue streams and their feasibility.' },
      ],
      product: [
        { title: 'Product feedback synthesis', priority: 'high', description: 'Aggregate and analyze all customer feedback on current product.' },
        { title: 'Feature prioritization matrix', priority: 'medium', description: 'Create RICE or similar prioritization framework for product roadmap.' },
      ],
      customers: [
        { title: 'Customer health scoring setup', priority: 'high', description: 'Implement scoring system to identify at-risk customers.' },
        { title: 'Churn analysis deep dive', priority: 'critical', description: 'Analyze churned customers to identify root causes.' },
      ],
      marketing: [
        { title: 'Marketing channel ROI audit', priority: 'high', description: 'Evaluate performance of all current marketing channels.' },
        { title: 'Brand positioning workshop', priority: 'medium', description: 'Define clear brand positioning and messaging framework.' },
      ],
      sales: [
        { title: 'Sales pipeline analysis', priority: 'high', description: 'Analyze conversion rates at each stage of the sales funnel.' },
        { title: 'Create ideal customer profile', priority: 'high', description: 'Define characteristics of highest-value customers.' },
      ],
      team: [
        { title: 'Skills gap assessment', priority: 'high', description: 'Evaluate current team capabilities against strategic needs.' },
        { title: 'Key role job descriptions', priority: 'medium', description: 'Create detailed job descriptions for critical hires.' },
      ],
      growth: [
        { title: 'Growth metrics baseline report', priority: 'high', description: 'Document current growth metrics and trends.' },
        { title: 'Growth constraint identification', priority: 'high', description: 'Identify top 3 constraints limiting growth rate.' },
      ],
    },
  },
  {
    title: 'Growth',
    description: 'Build on the foundation by implementing key improvements and scaling what works. Focus on high-impact strategies and measurable progress.',
    duration: '30-90 days',
    order: 2,
    milestoneTemplates: {
      financial: ['Implement improved pricing strategy', 'Achieve positive unit economics', 'Secure funding line if needed'],
      market: ['Launch in one new market segment', 'Achieve market validation metrics', 'Build strategic partnerships'],
      operations: ['Automate key operational processes', 'Reduce operational costs by 15%', 'Scale operations capacity'],
      businessModel: ['Pilot new revenue stream', 'Validate business model pivot if needed', 'Optimize unit economics'],
      product: ['Launch improved product version', 'Achieve product-market fit metrics', 'Expand product features'],
      customers: ['Implement customer success program', 'Reduce churn by 25%', 'Increase NPS by 10 points'],
      marketing: ['Launch data-driven marketing campaigns', 'Achieve positive marketing ROI', 'Build content marketing engine'],
      sales: ['Implement structured sales process', 'Improve conversion rate by 20%', 'Build sales team capability'],
      team: ['Hire key roles identified', 'Implement performance management', 'Build leadership pipeline'],
      growth: ['Achieve 20% month-over-month growth', 'Implement growth loops', 'Optimize viral coefficients'],
    },
    taskTemplates: {
      financial: [
        { title: 'Implement pricing optimization', priority: 'critical', description: 'Roll out optimized pricing based on value metrics and elasticity analysis.' },
        { title: 'Revenue diversification pilot', priority: 'high', description: 'Launch pilot for new revenue stream identified in foundation phase.' },
        { title: 'Financial controls implementation', priority: 'high', description: 'Put budget controls and approval processes in place.' },
      ],
      market: [
        { title: 'New market segment entry', priority: 'high', description: 'Launch targeted campaign in prioritized new market segment.' },
        { title: 'Strategic partnership outreach', priority: 'medium', description: 'Initiate conversations with 5-10 potential strategic partners.' },
      ],
      operations: [
        { title: 'Process automation implementation', priority: 'high', description: 'Automate top 3 repetitive operational processes.' },
        { title: 'Vendor negotiation and optimization', priority: 'medium', description: 'Renegotiate contracts with key vendors for better terms.' },
      ],
      businessModel: [
        { title: 'New revenue stream pilot launch', priority: 'high', description: 'Launch and measure pilot for new revenue model.' },
        { title: 'Unit economics optimization', priority: 'high', description: 'Implement changes to improve CAC:LTV ratio.' },
      ],
      product: [
        { title: 'Product improvement sprint', priority: 'high', description: 'Execute 2-week sprint on highest priority product improvements.' },
        { title: 'Product-market fit survey', priority: 'medium', description: 'Run Sean Ellis test to measure product-market fit.' },
      ],
      customers: [
        { title: 'Customer success program launch', priority: 'high', description: 'Implement proactive customer outreach and health monitoring.' },
        { title: 'Loyalty program design', priority: 'medium', description: 'Design and pilot customer loyalty program.' },
      ],
      marketing: [
        { title: 'Performance marketing campaign', priority: 'high', description: 'Launch data-driven campaigns on highest-ROI channels.' },
        { title: 'Content marketing engine setup', priority: 'medium', description: 'Create content calendar and publish first batch.' },
      ],
      sales: [
        { title: 'Sales process standardization', priority: 'high', description: 'Implement structured sales methodology across team.' },
        { title: 'Sales enablement toolkit', priority: 'medium', description: 'Create sales decks, case studies, and objection handling guides.' },
      ],
      team: [
        { title: 'Critical hires execution', priority: 'high', description: 'Recruit and onboard top-priority hires.' },
        { title: 'Team performance framework', priority: 'medium', description: 'Implement OKRs or similar goal-setting framework.' },
      ],
      growth: [
        { title: 'Growth experiment program', priority: 'high', description: 'Launch weekly growth experiments across acquisition channels.' },
        { title: 'Referral program implementation', priority: 'medium', description: 'Design and launch customer referral program.' },
      ],
    },
  },
  {
    title: 'Scale',
    description: 'Optimize and scale proven strategies for sustainable growth. Focus on building systems that support long-term scaling and market leadership.',
    duration: '90-180 days',
    order: 3,
    milestoneTemplates: {
      financial: ['Achieve financial sustainability', 'Build investment-ready financials', 'Scale revenue channels'],
      market: ['Establish market leadership position', 'Expand to multiple markets', 'Build brand as category leader'],
      operations: ['Achieve operational excellence metrics', 'Scale team and processes', 'Implement advanced technology'],
      businessModel: ['Scale proven business model', 'Build competitive moats', 'Create platform effects'],
      product: ['Achieve product leadership', 'Build product ecosystem', 'Scale product development velocity'],
      customers: ['Achieve industry-leading retention', 'Build customer advocacy program', 'Maximize customer lifetime value'],
      marketing: ['Scale marketing engine', 'Build thought leadership', 'Achieve dominant brand awareness'],
      sales: ['Scale sales organization', 'Build predictable revenue engine', 'Expand to enterprise segment'],
      team: ['Build high-performance culture', 'Develop leadership depth', 'Achieve organizational scale'],
      growth: ['Achieve sustainable high growth', 'Build growth engine', 'Prepare for next stage of growth'],
    },
    taskTemplates: {
      financial: [
        { title: 'Financial reporting system upgrade', priority: 'high', description: 'Implement investor-grade financial reporting and analytics.' },
        { title: 'Capital strategy execution', priority: 'high', description: 'Execute funding or investment strategy based on goals.' },
        { title: 'Revenue scaling playbook', priority: 'medium', description: 'Document and replicate successful revenue strategies.' },
      ],
      market: [
        { title: 'Market leadership strategy execution', priority: 'high', description: 'Implement strategies to establish market leadership position.' },
        { title: 'Geographic expansion plan', priority: 'medium', description: 'Execute plan for geographic or vertical expansion.' },
      ],
      operations: [
        { title: 'Technology platform upgrade', priority: 'high', description: 'Implement scalable technology infrastructure.' },
        { title: 'Operational metrics dashboard', priority: 'medium', description: 'Build comprehensive operational KPI dashboard.' },
      ],
      businessModel: [
        { title: 'Platform strategy execution', priority: 'high', description: 'Build network effects and platform dynamics into business model.' },
        { title: 'Competitive moat reinforcement', priority: 'medium', description: 'Strengthen barriers to entry and competitive advantages.' },
      ],
      product: [
        { title: 'Product ecosystem development', priority: 'high', description: 'Build complementary products and integrations.' },
        { title: 'Product-led growth implementation', priority: 'medium', description: 'Implement PLG strategies for self-serve expansion.' },
      ],
      customers: [
        { title: 'Customer advocacy program launch', priority: 'high', description: 'Build formal customer advocacy and reference program.' },
        { title: 'Enterprise customer success scaling', priority: 'medium', description: 'Scale CS team and processes for enterprise accounts.' },
      ],
      marketing: [
        { title: 'Thought leadership program', priority: 'high', description: 'Launch executive thought leadership and industry presence.' },
        { title: 'Marketing automation scaling', priority: 'medium', description: 'Scale marketing automation across all channels and segments.' },
      ],
      sales: [
        { title: 'Sales organization scaling', priority: 'high', description: 'Build multi-layer sales organization with specialized roles.' },
        { title: 'Enterprise sales playbook', priority: 'medium', description: 'Create and implement enterprise sales methodology.' },
      ],
      team: [
        { title: 'Organizational design optimization', priority: 'high', description: 'Restructure organization for scale and efficiency.' },
        { title: 'Leadership development program', priority: 'medium', description: 'Launch formal leadership development initiative.' },
      ],
      growth: [
        { title: 'Growth engine optimization', priority: 'high', description: 'Optimize all growth channels for maximum efficiency.' },
        { title: 'International expansion assessment', priority: 'medium', description: 'Evaluate and plan for international growth opportunities.' },
      ],
    },
  },
];

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

    const roadmap = await db.roadmap.findUnique({
      where: { diagnosticId: id },
      include: {
        phases: {
          orderBy: { order: 'asc' },
          include: {
            milestones: true,
            tasks: true,
          },
        },
      },
    });

    if (!roadmap) {
      return NextResponse.json(
        { error: 'No roadmap found. Generate one first.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ roadmap });
  } catch (error) {
    console.error('Get roadmap error:', error);
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

    // Verify diagnostic belongs to user and is completed
    const diagnostic = await db.diagnostic.findFirst({
      where: { id, userId: user!.id },
    });

    if (!diagnostic) {
      return NextResponse.json(
        { error: 'Diagnostic not found' },
        { status: 404 }
      );
    }

    if (diagnostic.status !== 'completed') {
      return NextResponse.json(
        { error: 'Diagnostic must be completed before generating a roadmap' },
        { status: 400 }
      );
    }

    // Check if roadmap already exists
    const existingRoadmap = await db.roadmap.findUnique({
      where: { diagnosticId: id },
    });

    if (existingRoadmap) {
      // Delete existing roadmap and recreate
      await db.roadmap.delete({ where: { id: existingRoadmap.id } });
    }

    // Determine weak dimensions (score < 60)
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

    // Sort dimensions by score (lowest first) to prioritize weakest areas
    const sortedDimensions = Object.entries(dimensionScores)
      .sort(([, a], [, b]) => a - b);

    // Identify critical dimensions (score < 50) and weak dimensions (50-60)
    const criticalDimensions = sortedDimensions.filter(([, s]) => s < 50).map(([d]) => d);
    const weakDimensions = sortedDimensions.filter(([, s]) => s >= 50 && s < 60).map(([d]) => d);
    const focusDimensions = [...criticalDimensions, ...weakDimensions];

    // If no weak dimensions, use the lowest 3 scoring ones
    const targetDimensions = focusDimensions.length > 0
      ? focusDimensions
      : sortedDimensions.slice(0, 3).map(([d]) => d);

    // Create roadmap
    const roadmap = await db.roadmap.create({
      data: {
        diagnosticId: id,
        title: `Strategic Roadmap - ${new Date().toLocaleDateString()}`,
        description: `Personalized roadmap focusing on improving ${targetDimensions.join(', ')} dimensions based on diagnostic results.`,
      },
    });

    const now = new Date();

    // Create phases
    for (const phaseTemplate of PHASE_TEMPLATES) {
      const phase = await db.roadmapPhase.create({
        data: {
          roadmapId: roadmap.id,
          title: phaseTemplate.title,
          description: phaseTemplate.description,
          order: phaseTemplate.order,
          duration: phaseTemplate.duration,
          startDate: phaseTemplate.order === 1 ? now : null,
          endDate: phaseTemplate.order === 1 ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) : null,
          status: phaseTemplate.order === 1 ? 'pending' : 'pending',
        },
      });

      // Create milestones for target dimensions
      const phaseMilestones = phaseTemplate.milestoneTemplates;
      for (const dimension of targetDimensions) {
        const milestones = phaseMilestones[dimension] || [];
        for (const milestoneTitle of milestones) {
          await db.milestone.create({
            data: {
              phaseId: phase.id,
              title: milestoneTitle,
              description: `${phaseTemplate.title} milestone for ${dimension} dimension improvement.`,
              targetDate: phaseTemplate.order === 1
                ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
                : phaseTemplate.order === 2
                  ? new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
                  : new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000),
              completed: false,
            },
          });
        }
      }

      // Create tasks for target dimensions
      const phaseTasks = phaseTemplate.taskTemplates;
      for (const dimension of targetDimensions) {
        const tasks = phaseTasks[dimension] || [];
        for (const task of tasks) {
          await db.executionTask.create({
            data: {
              phaseId: phase.id,
              userId: user!.id,
              title: task.title,
              description: task.description,
              priority: task.priority as 'low' | 'medium' | 'high' | 'critical',
              status: 'todo',
              dueDate: phaseTemplate.order === 1
                ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
                : phaseTemplate.order === 2
                  ? new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
                  : new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000),
            },
          });
        }
      }
    }

    // Fetch complete roadmap with all nested data
    const fullRoadmap = await db.roadmap.findUnique({
      where: { id: roadmap.id },
      include: {
        phases: {
          orderBy: { order: 'asc' },
          include: {
            milestones: true,
            tasks: true,
          },
        },
      },
    });

    return NextResponse.json({ roadmap: fullRoadmap }, { status: 201 });
  } catch (error) {
    console.error('Generate roadmap error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
