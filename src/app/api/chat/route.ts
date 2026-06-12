import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

const SYSTEM_PROMPT = `You are the BCGSP Strategic Intelligence Engine — an AI-powered strategic advisor for small and medium enterprises (SMEs). Your role is to provide expert, actionable business strategy advice based on diagnostic data, market conditions, and proven frameworks.

Your expertise includes:
- Business model analysis and innovation
- Market positioning and competitive strategy
- Financial analysis and restructuring
- Operational excellence and process optimization
- Growth strategy and scaling
- Investment readiness and fundraising
- Team building and leadership development
- Customer acquisition and retention
- Product strategy and innovation

Guidelines:
1. Be specific and actionable — avoid generic advice
2. Reference relevant business frameworks (Porter's Five Forces, SWOT, BCG Matrix, etc.)
3. Quantify recommendations when possible (e.g., "target 20% improvement in 90 days")
4. Consider the company's stage, industry, and current performance metrics
5. Prioritize recommendations by impact and feasibility
6. Acknowledge trade-offs and risks
7. Use clear, professional language accessible to business owners
8. If diagnostic data is available, reference specific scores and dimensions
9. Always end with concrete next steps

When users share diagnostic results, analyze the scores to identify:
- Critical gaps (score < 50) requiring immediate attention
- Weak areas (score 50-64) needing improvement
- Strengths (score 65+) to leverage and build upon
- Interconnections between dimensions
- Priority order for improvement`;

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const [sessions, total] = await Promise.all([
      db.chatSession.findMany({
        where: { userId: user!.id },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          _count: {
            select: { messages: true },
          },
        },
      }),
      db.chatSession.count({ where: { userId: user!.id } }),
    ]);

    return NextResponse.json({
      sessions,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('List chat sessions error:', error);
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
    const { message, sessionId, diagnosticId } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get or create session
    let session;
    if (sessionId) {
      session = await db.chatSession.findFirst({
        where: { id: sessionId, userId: user!.id },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });
      if (!session) {
        return NextResponse.json(
          { error: 'Chat session not found' },
          { status: 404 }
        );
      }
    } else {
      // Create new session
      const title = message.length > 50 ? message.substring(0, 50) + '...' : message;
      session = await db.chatSession.create({
        data: {
          userId: user!.id,
          title,
        },
        include: { messages: true },
      });
    }

    // Save user message
    await db.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'user',
        content: message,
      },
    });

    // Build context for AI
    let contextMessages: Array<{ role: string; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    // Add diagnostic context if provided
    if (diagnosticId) {
      const diagnostic = await db.diagnostic.findFirst({
        where: { id: diagnosticId, userId: user!.id },
      });
      if (diagnostic) {
        contextMessages.push({
          role: 'system',
          content: `Current diagnostic results for this conversation:
Overall Score: ${diagnostic.overallScore}/100
Business Model: ${diagnostic.businessModel}/100
Market: ${diagnostic.market}/100
Product: ${diagnostic.product}/100
Customers: ${diagnostic.customers}/100
Marketing: ${diagnostic.marketing}/100
Sales: ${diagnostic.sales}/100
Operations: ${diagnostic.operations}/100
Financial: ${diagnostic.financial}/100
Team: ${diagnostic.team}/100
Growth: ${diagnostic.growth}/100
Risk Score: ${diagnostic.riskScore}/100
Growth Potential: ${diagnostic.growthPotential}/100
Investment Readiness: ${diagnostic.investmentReady}/100`,
        });
      }
    }

    // Add company context
    const company = await db.company.findUnique({
      where: { userId: user!.id },
    });
    if (company) {
      contextMessages.push({
        role: 'system',
        content: `Company: ${company.name}
Industry: ${company.industry || 'Not specified'}
Stage: ${company.stage || 'Not specified'}
Business Model: ${company.businessModel || 'Not specified'}`,
      });
    }

    // Add conversation history (last 20 messages)
    const recentMessages = session.messages.slice(-20);
    for (const msg of recentMessages) {
      contextMessages.push({
        role: msg.role,
        content: msg.content,
      });
    }

    // Add current message
    contextMessages.push({
      role: 'user',
      content: message,
    });

    // Call AI using z-ai-web-dev-sdk
    let aiResponse: string;
    try {
      const ZAI = (await import('z-ai-web-dev-sdk')).default;
      const zai = await ZAI.create();
      const completion = await zai.chat.completions.create({
        messages: contextMessages.map((m) => ({
          role: m.role as 'system' | 'user' | 'assistant',
          content: m.content,
        })),
      });
      aiResponse = completion.choices?.[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.';
    } catch (aiError) {
      console.error('AI completion error:', aiError);
      // Fallback response
      aiResponse = generateFallbackResponse(message, diagnosticId ? {
        overallScore: 0,
      } : null);
    }

    // Save assistant message
    const assistantMessage = await db.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'assistant',
        content: aiResponse,
      },
    });

    // Update session title if it's the first message
    if (session.messages.length === 0) {
      await db.chatSession.update({
        where: { id: session.id },
        data: {
          title: message.length > 50 ? message.substring(0, 50) + '...' : message,
          updatedAt: new Date(),
        },
      });
    } else {
      await db.chatSession.update({
        where: { id: session.id },
        data: { updatedAt: new Date() },
      });
    }

    return NextResponse.json({
      message: assistantMessage,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Chat message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateFallbackResponse(message: string, _diagnostic: { overallScore: number } | null): string {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('business model') || lowerMsg.includes('revenue')) {
    return `**Business Model Strategy**

Based on your question about business models, here are key considerations:

1. **Diversify Revenue Streams** — Don't rely on a single revenue source. Consider subscription, transaction, and service-based models.

2. **Value-Based Pricing** — Align pricing with the value you deliver, not just costs. This can improve margins by 20-40%.

3. **Platform Thinking** — If applicable, consider building platform dynamics that create network effects.

**Next Steps:**
- Map your current revenue streams and their contribution
- Identify 2-3 potential new revenue models
- Test pricing sensitivity with your best customers

Would you like me to dive deeper into any of these areas?`;
  }

  if (lowerMsg.includes('market') || lowerMsg.includes('competitor') || lowerMsg.includes('competition')) {
    return `**Market Strategy Analysis**

Here's a structured approach to market positioning:

1. **Market Segmentation** — Identify your most profitable customer segments and focus resources there.

2. **Competitive Differentiation** — Define what makes you uniquely valuable. Use the "Jobs to Be Done" framework.

3. **Market Entry Strategy** — For new markets, consider partnerships before direct entry to reduce risk.

**Framework:** Use Porter's Five Forces to assess:
- Threat of new entrants
- Bargaining power of suppliers
- Bargaining power of buyers
- Threat of substitutes
- Competitive rivalry

**Next Steps:**
- Complete a competitive landscape analysis
- Survey top 20 customers about alternatives they considered
- Define your unique value proposition clearly

What specific aspect of market strategy would you like to explore further?`;
  }

  if (lowerMsg.includes('financial') || lowerMsg.includes('cash') || lowerMsg.includes('funding')) {
    return `**Financial Strategy Guidance**

Key financial priorities for SMEs:

1. **Cash Flow Management** — Implement 13-week rolling cash flow forecasts. Cash is king for SMEs.

2. **Unit Economics** — Ensure your CAC:LTV ratio is at least 1:3. If not, optimize before scaling.

3. **Working Capital** — Negotiate payment terms with suppliers and customers to optimize working capital cycle.

4. **Funding Readiness** — Prepare:
   - Clean financial statements (3 years)
   - Clear growth narrative with data
   - Detailed use of funds plan

**Quick Win:** Review your pricing — a 1% price increase typically yields 8-11% profit increase.

Would you like specific guidance on any financial topic?`;
  }

  return `**Strategic Advice**

Thank you for your question. Here's my strategic perspective:

**Key Considerations:**
1. **Focus on Fundamentals** — Ensure your core business metrics are strong before pursuing growth
2. **Data-Driven Decisions** — Use your diagnostic scores to prioritize improvement areas
3. **Iterative Approach** — Test strategies on a small scale before full implementation

**Recommended Framework:**
- Identify the #1 constraint limiting your growth
- Focus all resources on relieving that constraint
- Measure the impact and move to the next constraint

**Next Steps:**
- Review your latest diagnostic scores
- Identify your weakest dimension
- Focus improvement efforts there first

Would you like me to provide more specific advice on any strategic area? I can analyze business models, market positioning, financial strategy, operations, team building, or growth strategies.`;
}
