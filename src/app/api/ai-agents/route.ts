import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

const AGENT_SYSTEM_PROMPTS: Record<string, string> = {
  strategist:
    'تو یک تحلیلگر استراتژیک حرفه‌ای هستی. وظیفه تو تحلیل وضعیت کسب‌وکار، شناسایی نقاط قوت و ضعف، ارزیابی فرصت‌ها و تهدیدها، و ارائه توصیه‌های استراتژیک عملی و قابل اجرا برای کسب‌وکارهای کوچک و متوسط است. از چارچوب‌های تحلیلی مانند SWOT، پورتر، و BCG Matrix استفاده کن و پاسخ‌های خود را با داده و شواهد پشتیبانی کن.',
  financial:
    'تو یک مشاور مالی متخصص هستی. وظیفه تو تحلیل سلامت مالی، مدیریت جریان نقدی، بهینه‌سازی هزینه‌ها، برنامه‌ریزی بودجه، و آماده‌سازی برای جذب سرمایه است. نسبت‌های مالی کلیدی را تحلیل کن و توصیه‌های عملی برای بهبود عملکرد مالی ارائه بده.',
  market:
    'تو یک بازارشناس حرفه‌ای هستی. وظیفه تو تحلیل بازار، شناسایی بخش‌های هدف، ارزیابی رقبا، تحلیل رفتار مشتریان، و طراحی استراتژی ورود به بازار است. از روش‌های تحقیقات بازار و چارچوب‌های_segmentation استفاده کن.',
  reporter:
    'تو یک گزارش‌ساز مدیریتی هستی. وظیفه تو تولید گزارش‌های تحلیلی و اجرایی خوانا برای مدیران ارشد است. داده‌ها را تجمیع کن، روندها را شناسایی کن، و بینش‌های کلیدی را به صورت مختصر و مفید ارائه بده.',
  execution:
    'تو یک پشتیبان اجرای استراتژی هستی. وظیفه تو کمک به پیاده‌سازی استراتژی‌ها، ردیابی پیشرفت، شناسایی موانع اجرایی، و ارائه راه‌حل‌های عملی برای غلبه بر چالش‌های اجرایی است. فازهای اجرایی را تعریف کن و KPIهای قابل اندازه‌گیری پیشنهاد بده.',
  investor:
    'تو یک ارزیاب آمادگی سرمایه‌گذاری هستی. وظیفه تو ارزیابی میزان آمادگی کسب‌وکار برای جذب سرمایه، شناسایی شکاف‌ها، و ارائه نقشه راه برای رسیدن به آمادگی سرمایه‌گذاری است. معیارهای سرمایه‌گذاران را تحلیل کن و راهکارهای عملی ارائه بده.',
  benchmark:
    'تو یک متخصص بنچمارک صنعتی هستی. وظیفه تو مقایسه عملکرد کسب‌وکار با استانداردهای صنعت، شناسایی شکاف‌ها، و ارائه توصیه‌هایی برای رسیدن به عملکرد برتر صنعت است. از داده‌های صنعتی و بهترین شیوه‌ها استفاده کن.',
  predictor:
    'تو یک متخصص پیش‌بینی رشد کسب‌وکار هستی. وظیفه تو تحلیل روندها، پیش‌بینی رشد آتی، شناسایی فرصت‌های رشد، و ارزیابی ریسک‌های مرتبط با رشد است. از مدل‌های پیش‌بینی و تحلیل سناریو استفاده کن و نتایج را به صورت کمی ارائه بده.',
};

const VALID_AGENT_TYPES = [
  'strategist',
  'financial',
  'market',
  'reporter',
  'execution',
  'investor',
  'benchmark',
  'predictor',
];

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const agentType = searchParams.get('agentType');
    const sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // If sessionId is provided, return full session with all messages
    if (sessionId) {
      const session = await db.aIAgentSession.findFirst({
        where: { id: sessionId, userId: user!.id },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
          _count: { select: { messages: true } },
        },
      });

      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      return NextResponse.json({ session });
    }

    const where: Record<string, unknown> = { userId: user!.id };
    if (agentType) where.agentType = agentType;

    const [sessions, total] = await Promise.all([
      db.aIAgentSession.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          _count: { select: { messages: true } },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      }),
      db.aIAgentSession.count({ where }),
    ]);

    return NextResponse.json({ sessions, total, limit, offset });
  } catch (error) {
    console.error('List AI agent sessions error:', error);
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
    const { agentType, message, sessionId, title, context } = body;

    // If no message, create a new session
    if (!message) {
      if (!agentType || !VALID_AGENT_TYPES.includes(agentType)) {
        return NextResponse.json(
          { error: `agentType is required and must be one of: ${VALID_AGENT_TYPES.join(', ')}` },
          { status: 400 }
        );
      }

      const session = await db.aIAgentSession.create({
        data: {
          userId: user!.id,
          agentType,
          title: title || 'گفتگوی جدید',
          context: context ? JSON.stringify(context) : undefined,
        },
      });

      return NextResponse.json({ session }, { status: 201 });
    }

    // Send a message to an agent session
    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required when sending a message' },
        { status: 400 }
      );
    }

    // Get or verify session
    const session = await db.aIAgentSession.findFirst({
      where: { id: sessionId, userId: user!.id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Agent session not found' },
        { status: 404 }
      );
    }

    // Save user message
    await db.aIAgentMessage.create({
      data: {
        sessionId: session.id,
        role: 'user',
        content: message,
      },
    });

    // Build messages for AI
    const systemPrompt =
      AGENT_SYSTEM_PROMPTS[session.agentType] || AGENT_SYSTEM_PROMPTS.strategist;

    const contextMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ];

    // Add session context if available
    if (session.context) {
      try {
        const contextData = JSON.parse(session.context);
        contextMessages.push({
          role: 'system',
          content: `اطلاعات زمینه گفتگو: ${JSON.stringify(contextData)}`,
        });
      } catch {
        // ignore parse error
      }
    }

    // Add company context
    const company = await db.company.findUnique({
      where: { userId: user!.id },
    });
    if (company) {
      contextMessages.push({
        role: 'system',
        content: `شرکت: ${company.name}
صنعت: ${company.industry || 'نامشخص'}
مرحله: ${company.stage || 'نامشخص'}
مدل کسب‌وکار: ${company.businessModel || 'نامشخص'}`,
      });
    }

    // Add conversation history (last 20 messages)
    const recentMessages = session.messages.slice(-20);
    for (const msg of recentMessages) {
      contextMessages.push({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      });
    }

    // Add current message
    contextMessages.push({ role: 'user', content: message });

    // Call AI using z-ai-web-dev-sdk
    let aiResponse: string;
    try {
      const ZAI = (await import('z-ai-web-dev-sdk')).default;
      const zai = await ZAI.create();
      const completion = await zai.chat.completions.create({
        messages: contextMessages,
      });
      aiResponse =
        completion.choices?.[0]?.message?.content ||
        'متأسفانه نتوانستم پاسخی تولید کنم. لطفاً دوباره تلاش کنید.';
    } catch (aiError) {
      console.error('AI agent completion error:', aiError);
      aiResponse = generateAgentFallbackResponse(session.agentType, message);
    }

    // Save assistant message
    const assistantMessage = await db.aIAgentMessage.create({
      data: {
        sessionId: session.id,
        role: 'assistant',
        content: aiResponse,
      },
    });

    // Update session
    await db.aIAgentSession.update({
      where: { id: session.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      message: assistantMessage,
      sessionId: session.id,
      agentType: session.agentType,
    });
  } catch (error) {
    console.error('AI agent message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateAgentFallbackResponse(agentType: string, _message: string): string {
  const responses: Record<string, string> = {
    strategist:
      'تحلیل استراتژیک نشان می‌دهد که تمرکز بر نقاط قوت و بهبود نواحیه ضعف، کلید رشد پایدار است. لطفاً اطلاعات بیشتری در مورد چالش فعلی خود ارائه دهید تا بتوانم تحلیل دقیق‌تری ارائه دهم.',
    financial:
      'از نظر مالی، مدیریت جریان نقدی و بهینه‌سازی هزینه‌ها باید در اولویت قرار گیرد. لطفاً جزئیات بیشتری از وضعیت مالی فعلی خود را به اشتراک بگذارید.',
    market:
      'تحلیل بازار نیازمند اطلاعات بیشتری است. لطفاً صنعت، بازار هدف و چالش‌های فعلی خود را توضیح دهید تا بتوانم تحلیل دقیق‌تری ارائه دهم.',
    reporter:
      'برای تهیه گزارش مدیریتی جامع، نیاز به دسترسی به داده‌های عملکردی دارم. لطفاً معیارهای کلیدی که می‌خواهید در گزارش بررسی شوند را مشخص کنید.',
    execution:
      'برای اجرای موفق استراتژی، تعریف فازهای اجرایی و KPIهای قابل اندازه‌گیری ضروری است. لطفاً استراتژی مورد نظر خود را شرح دهید.',
    investor:
      'آمادگی سرمایه‌گذاری نیازمند ارزیابی چند بعدی است. لطفاً اطلاعات مالی و عملکردی خود را به اشتراک بگذارید تا ارزیابی دقیق‌تری انجام دهم.',
    benchmark:
      'برای مقایسه بنچمارک، نیاز به اطلاعات صنعت و عملکرد فعلی دارم. لطفاً صنعت و معیارهای کلیدی خود را مشخص کنید.',
    predictor:
      'پیش‌بینی رشد نیازمند داده‌های تاریخی و روند فعلی است. لطفاً اطلاعات رشد گذشته و اهداف آینده خود را به اشتراک بگذارید.',
  };

  return responses[agentType] || responses.strategist;
}
