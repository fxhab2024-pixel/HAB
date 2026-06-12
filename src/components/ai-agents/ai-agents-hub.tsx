'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAppStore, type AgentType, type ChatMessage } from '@/lib/store';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Lightbulb,
  Brain,
  DollarSign,
  BarChart3,
  FileText,
  Zap,
  Building2,
  TrendingUp,
  Wand2,
  ArrowLeft,
  MessageSquare,
  Plus,
  History,
  RotateCcw,
  Clock,
  Tag,
  Star,
  ChevronLeft,
  X,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Agent Definitions ───────────────────────────────────────────────
interface AgentDef {
  type: AgentType;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  emoji: string;
  description: string;
  colorKey: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  hoverBg: string;
  gradientFrom: string;
  gradientTo: string;
  capabilities: string[];
  suggestedQuestions: string[];
  followUpQuestions: string[];
}

const agents: AgentDef[] = [
  {
    type: 'strategist',
    name: 'تحلیلگر استراتژیک',
    icon: Brain,
    emoji: '🧠',
    description: 'تحلیل عمیق استراتژیک و شناسایی فرصت‌ها و تهدیدهای کسب‌وکار',
    colorKey: 'emerald',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    hoverBg: 'hover:bg-emerald-100',
    gradientFrom: 'from-emerald-500',
    gradientTo: 'to-emerald-600',
    capabilities: ['SWOT', 'PESTEL', 'پورتر', 'BCG Matrix'],
    suggestedQuestions: [
      'بزرگ‌ترین ریسک استراتژیک کسب‌وکار من چیست؟',
      'چگونه می‌توانم مزیت رقابتی ایجاد کنم؟',
      'بهترین استراتژی ورود به بازار جدید چیست؟',
      'نقاط کور استراتژیک کسب‌وکار من کدامند؟',
    ],
    followUpQuestions: [
      'چه عواملی می‌توانند این ریسک را تشدید کنند؟',
      'چگونه نقاط قوت را به مزیت رقابتی تبدیل کنم؟',
    ],
  },
  {
    type: 'financial',
    name: 'مشاور مالی',
    icon: DollarSign,
    emoji: '💰',
    description: 'مشاوره تخصصی در مدیریت مالی، بودجه‌بندی و بهینه‌سازی هزینه‌ها',
    colorKey: 'teal',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    borderColor: 'border-teal-200',
    hoverBg: 'hover:bg-teal-100',
    gradientFrom: 'from-teal-500',
    gradientTo: 'to-teal-600',
    capabilities: ['جریان نقد', 'بودجه‌بندی', 'نسبت‌ها', 'قیمت‌گذاری'],
    suggestedQuestions: [
      'چگونه جریان نقدینگی را بهبود ببخشم؟',
      'بهترین راه کاهش هزینه‌های عملیاتی چیست؟',
      'نسبت‌های مالی کلیدی کسب‌وکار من چگونه است؟',
      'استراتژی بهینه قیمت‌گذاری برای من چیست؟',
    ],
    followUpQuestions: [
      'نسبت ایده‌ال بدهی به حقوق صاحبان چقدر است؟',
      'چگونه حاشیه سود را افزایش دهم؟',
    ],
  },
  {
    type: 'market',
    name: 'بازارشناس',
    icon: BarChart3,
    emoji: '📊',
    description: 'تحلیل بازار، رقبا و شناسایی فرصت‌های رشد در صنعت',
    colorKey: 'purple',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    hoverBg: 'hover:bg-purple-100',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-purple-600',
    capabilities: ['تحلیل رقبا', 'STP', 'روندها', 'بخش‌بندی'],
    suggestedQuestions: [
      'روندهای کلیدی بازار هدف من چیست؟',
      'چگونه سهم بازار خود را افزایش دهم؟',
      'تحلیل رقبا در صنعت من چگونه است؟',
      'فرصت‌های نوین بازار کدامند؟',
    ],
    followUpQuestions: [
      'کدام بخش بازار بیشترین پتانسیل رشد را دارد؟',
      'استراتژی خروج از بازارهای اشباع چیست؟',
    ],
  },
  {
    type: 'reporter',
    name: 'گزارش‌ساز',
    icon: FileText,
    emoji: '📝',
    description: 'تولید گزارش‌های تحلیلی و اجرایی حرفه‌ای برای تصمیم‌گیری',
    colorKey: 'orange',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    hoverBg: 'hover:bg-orange-100',
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-orange-600',
    capabilities: ['اجرایی', 'تحلیلی', 'داشبورد', 'خلاصه مدیریتی'],
    suggestedQuestions: [
      'یک گزارش اجرایی از وضعیت فعلی تهیه کن',
      'خلاصه عملکرد سه ماهه اخیر را بنویس',
      'گزارش تحلیل شکاف استراتژیک را آماده کن',
      'داشبورد شاخص‌های کلیدی عملکرد را طراحی کن',
    ],
    followUpQuestions: [
      'گزارش را با نمودارهای بصری تکمیل کن',
      'خلاصه مدیریتی یک صفحه‌ای تهیه کن',
    ],
  },
  {
    type: 'execution',
    name: 'پشتیبان اجرا',
    icon: Zap,
    emoji: '⚡',
    description: 'پشتیبانی از اجرای استراتژی‌ها و ردیابی پیشرفت عملیاتی',
    colorKey: 'cyan',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    borderColor: 'border-cyan-200',
    hoverBg: 'hover:bg-cyan-100',
    gradientFrom: 'from-cyan-500',
    gradientTo: 'to-cyan-600',
    capabilities: ['KPI', 'پروژه', 'مانع‌شناسی', 'پیگیری'],
    suggestedQuestions: [
      'چگونه استراتژی‌ها را به پروژه اجرایی تبدیل کنم؟',
      'بهترین روش ردیابی پیشرفت اجرا چیست؟',
      'چگونه موانع اجرایی را شناسایی و رفع کنم؟',
      'شاخص‌های کلیدی اجرا (KPI) کدامند؟',
    ],
    followUpQuestions: [
      'چگونه ماتریس RACI برای پروژه تعریف کنم؟',
      'فرآیند گزارش‌دهی هفتگی اجرا چگونه باشد؟',
    ],
  },
  {
    type: 'investor',
    name: 'ارزیاب سرمایه‌گذاری',
    icon: Building2,
    emoji: '🏦',
    description: 'ارزیابی آمادگی سرمایه‌گذاری و جذب سرمایه‌گذار',
    colorKey: 'rose',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
    hoverBg: 'hover:bg-rose-100',
    gradientFrom: 'from-rose-500',
    gradientTo: 'to-rose-600',
    capabilities: ['Pitch Deck', 'ارزش‌گذاری', 'Due Diligence', 'مذاکره'],
    suggestedQuestions: [
      'آمادگی سرمایه‌گذاری کسب‌وکار من چگونه است؟',
      'چگونه پچ دک جذب سرمایه‌گذار تهیه کنم؟',
      'ارزش‌گذاری شرکت من چگونه انجام شود؟',
      'نکات کلیدی مذاکره با سرمایه‌گذار چیست؟',
    ],
    followUpQuestions: [
      'چگونه آمادگی Due Diligence را افزایش دهم؟',
      'مدل ارزش‌گذاری مناسب برای صنعت من کدام است؟',
    ],
  },
  {
    type: 'benchmark',
    name: 'بنچمارک صنعتی',
    icon: TrendingUp,
    emoji: '📈',
    description: 'مقایسه عملکرد با استانداردهای صنعتی و بهترین شیوه‌ها',
    colorKey: 'pink',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700',
    borderColor: 'border-pink-200',
    hoverBg: 'hover:bg-pink-100',
    gradientFrom: 'from-pink-500',
    gradientTo: 'to-pink-600',
    capabilities: ['صنعتی', 'شکاف‌سنجی', 'بهترین شیوه', 'استاندارد'],
    suggestedQuestions: [
      'عملکرد من نسبت به میانگین صنعت چگونه است؟',
      'بهترین شیوه‌های صنعتی در حوزه من چیست؟',
      'شاخص‌های کلیدی عملکرد صنعتی کدامند؟',
      'چگونه شکاف عملکردی با رهبران صنعت را ببندم؟',
    ],
    followUpQuestions: [
      'شاخص‌های تمایز بین شرکت‌های برتر صنعت چیست؟',
      'نقشه راه رسیدن به سطح برتر صنعت چگونه است؟',
    ],
  },
  {
    type: 'predictor',
    name: 'پیش‌بینی رشد',
    icon: Wand2,
    emoji: '🔮',
    description: 'پیش‌بینی روندهای رشد و سناریوهای آینده کسب‌وکار',
    colorKey: 'amber',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    hoverBg: 'hover:bg-amber-100',
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-amber-600',
    capabilities: ['سناریوسازی', 'روندسنجی', 'ریسک', 'آینده‌پژوهی'],
    suggestedQuestions: [
      'پیش‌بینی رشد صنعت من در ۳ سال آینده چیست؟',
      'سناریوهای ممکن برای کسب‌وکار من کدامند؟',
      'روندهای فناوری تأثیرگذار بر صنعت من چیست؟',
      'بهترین استراتژی برای مقابله با رکود چیست؟',
    ],
    followUpQuestions: [
      'احتمال هر سناریو چقدر تخمین زده می‌شود؟',
      'شاخص‌های هشدار زودهنگام برای هر سناریو چیست؟',
    ],
  },
];

// ─── Session Types ────────────────────────────────────────────────────
interface AgentSession {
  id: string;
  userId: string;
  agentType: string;
  title: string;
  context?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { messages: number };
  messages?: Array<{ id: string; role: string; content: string; createdAt: string }>;
}

// ─── Markdown-like Renderer ───────────────────────────────────────────
function renderMessageContent(content: string): React.ReactNode[] {
  const lines = content.split('\n');
  const nodes: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block toggle
    if (line.trimStart().startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        nodes.push(
          <pre
            key={`code-${i}`}
            className="bg-slate-900 text-slate-100 rounded-lg p-3 my-2 text-xs overflow-x-auto font-mono leading-relaxed direction-ltr"
            dir="ltr"
          >
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        codeLines = [];
      } else {
        inCodeBlock = true;
        codeLines = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Inline code
    const inlineProcessed = processInlineElements(line);

    // Heading
    if (line.startsWith('### ')) {
      nodes.push(
        <h4 key={`h3-${i}`} className="font-bold text-sm mt-3 mb-1">
          {processInlineElements(line.slice(4))}
        </h4>
      );
    } else if (line.startsWith('## ')) {
      nodes.push(
        <h3 key={`h2-${i}`} className="font-bold text-base mt-3 mb-1">
          {processInlineElements(line.slice(3))}
        </h3>
      );
    } else if (line.startsWith('# ')) {
      nodes.push(
        <h2 key={`h1-${i}`} className="font-bold text-base mt-3 mb-1">
          {processInlineElements(line.slice(2))}
        </h2>
      );
    }
    // Horizontal rule
    else if (/^─{3,}$/.test(line.trim()) || /^━{3,}$/.test(line.trim())) {
      nodes.push(<hr key={`hr-${i}`} className="border-slate-300 my-2" />);
    }
    // Bullet list
    else if (/^[•●▪\-]\s/.test(line.trimStart()) || /^\d+[.)]\s/.test(line.trimStart())) {
      const isNumbered = /^\d+[.)]\s/.test(line.trimStart());
      const text = line.trimStart().replace(/^[•●▪\-]\s/, '').replace(/^\d+[.)]\s/, '');
      nodes.push(
        <div key={`li-${i}`} className="flex gap-2 my-0.5">
          <span className="shrink-0 mt-0.5">
            {isNumbered ? (
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-[10px] flex items-center justify-center font-bold">
                {line.trimStart().match(/^\d+/)?.[0]}
              </span>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 inline-block" />
            )}
          </span>
          <span className="flex-1">{processInlineElements(text)}</span>
        </div>
      );
    }
    // Empty line
    else if (line.trim() === '') {
      nodes.push(<div key={`br-${i}`} className="h-1" />);
    }
    // Regular paragraph
    else {
      nodes.push(
        <p key={`p-${i}`} className="my-0.5">
          {inlineProcessed}
        </p>
      );
    }
  }

  return nodes;
}

function processInlineElements(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // Bold
      parts.push(
        <strong key={`b-${match.index}`} className="font-bold">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // Italic
      parts.push(
        <em key={`i-${match.index}`} className="italic">
          {match[4]}
        </em>
      );
    } else if (match[5]) {
      // Inline code
      parts.push(
        <code
          key={`c-${match.index}`}
          className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-xs font-mono"
          dir="ltr"
        >
          {match[6]}
        </code>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

// ─── Relative Time ────────────────────────────────────────────────────
function relativeTime(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'همین الان';
  if (minutes < 60) return `${minutes} دقیقه پیش`;
  if (hours < 24) return `${hours} ساعت پیش`;
  if (days < 7) return `${days} روز پیش`;
  return new Date(dateStr).toLocaleDateString('fa-IR');
}

// ─── Main Component ───────────────────────────────────────────────────
export default function AiAgentsHub() {
  const {
    activeAgentType,
    setActiveAgentType,
    agentMessages,
    setAgentMessages,
    addAgentMessage,
    agentLoading,
    setAgentLoading,
    token,
  } = useAppStore();

  // View state
  const [showChat, setShowChat] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [input, setInput] = useState('');

  // Session state
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<AgentSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);

  // Per-agent session count cache
  const [agentSessionCounts, setAgentSessionCounts] = useState<Record<AgentType, number>>({
    strategist: 0, financial: 0, market: 0, reporter: 0,
    execution: 0, investor: 0, benchmark: 0, predictor: 0,
  });

  // Per-agent last session indicator
  const [agentLastSession, setAgentLastSession] = useState<Record<AgentType, string | null>>({
    strategist: null, financial: null, market: null, reporter: null,
    execution: null, investor: null, benchmark: null, predictor: null,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeAgent = agents.find((a) => a.type === activeAgentType)!;

  // ─── Load sessions for an agent ────────────────────────────────────
  const loadSessions = useCallback(async (agentType: AgentType) => {
    if (!token) return;
    setSessionsLoading(true);
    try {
      const res = await fetch(`/api/ai-agents?agentType=${agentType}&limit=50`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load sessions');
      const data = await res.json();
      const sessionList: AgentSession[] = data.sessions || [];
      setSessions(sessionList);

      // Update session count
      setAgentSessionCounts((prev) => ({ ...prev, [agentType]: sessionList.length }));

      // Update last session indicator
      if (sessionList.length > 0) {
        setAgentLastSession((prev) => ({ ...prev, [agentType]: sessionList[0].id }));
      } else {
        setAgentLastSession((prev) => ({ ...prev, [agentType]: null }));
      }
    } catch (err) {
      console.error('Load sessions error:', err);
    } finally {
      setSessionsLoading(false);
    }
  }, [token]);

  // ─── Load all agent session counts on mount ────────────────────────
  useEffect(() => {
    if (!token) return;
    const loadAllCounts = async () => {
      for (const agent of agents) {
        try {
          const res = await fetch(`/api/ai-agents?agentType=${agent.type}&limit=1`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            const count = data.total || 0;
            setAgentSessionCounts((prev) => ({ ...prev, [agent.type]: count }));
            if (data.sessions?.length > 0) {
              setAgentLastSession((prev) => ({ ...prev, [agent.type]: data.sessions[0].id }));
            }
          }
        } catch {
          // silently continue
        }
      }
    };
    loadAllCounts();
  }, [token]);

  // ─── Load messages for a specific session ──────────────────────────
  const loadSessionMessages = useCallback(async (sessionId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/ai-agents?sessionId=${sessionId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load session messages');
      const data = await res.json();
      const session: AgentSession = data.session;

      const messages: ChatMessage[] = (session.messages || []).map((m) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        timestamp: m.createdAt,
      }));

      setCurrentMessages(messages);
      setActiveSessionId(sessionId);
      setAgentMessages(messages);
    } catch (err) {
      console.error('Load session messages error:', err);
      toast.error('خطا در بارگذاری پیام‌ها');
    }
  }, [token, setAgentMessages]);

  // ─── Create a new session ──────────────────────────────────────────
  const createSession = useCallback(async (agentType: AgentType, title?: string): Promise<string | null> => {
    if (!token) return null;
    try {
      const res = await fetch('/api/ai-agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ agentType, title: title || 'گفتگوی جدید' }),
      });
      if (!res.ok) throw new Error('Failed to create session');
      const data = await res.json();
      return data.session.id;
    } catch (err) {
      console.error('Create session error:', err);
      toast.error('خطا در ایجاد گفتگوی جدید');
      return null;
    }
  }, [token]);

  // ─── Send message to API ───────────────────────────────────────────
  const sendMessage = useCallback(async (messageText: string, sessionId: string): Promise<{ success: boolean; assistantMessage?: ChatMessage }> => {
    if (!token) return { success: false };

    try {
      const res = await fetch('/api/ai-agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId, message: messageText }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'خطا در ارسال پیام');
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: data.message.id,
        role: 'assistant',
        content: data.message.content,
        timestamp: data.message.createdAt || new Date().toISOString(),
      };

      return { success: true, assistantMessage: assistantMsg };
    } catch (err) {
      console.error('Send message error:', err);
      return { success: false };
    }
  }, [token]);

  // ─── Handle selecting an agent ─────────────────────────────────────
  const handleSelectAgent = useCallback(async (type: AgentType) => {
    setActiveAgentType(type);
    setShowChat(true);
    setShowHistory(false);
    setActiveSessionId(null);
    setCurrentMessages([]);
    setAgentMessages([]);
    await loadSessions(type);
  }, [setActiveAgentType, setAgentMessages, loadSessions]);

  // ─── Handle starting a new chat ────────────────────────────────────
  const handleNewChat = useCallback(async () => {
    setActiveSessionId(null);
    setCurrentMessages([]);
    setAgentMessages([]);
    setShowHistory(false);
    if (inputRef.current) inputRef.current.focus();
  }, [setAgentMessages]);

  // ─── Handle resuming a session ─────────────────────────────────────
  const handleResumeSession = useCallback(async (sessionId: string) => {
    await loadSessionMessages(sessionId);
    setShowHistory(false);
    if (inputRef.current) inputRef.current.focus();
  }, [loadSessionMessages]);

  // ─── Handle sending a message ──────────────────────────────────────
  const handleSend = useCallback(async (message?: string) => {
    const text = message || input.trim();
    if (!text || agentLoading) return;

    const userMsg: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setCurrentMessages((prev) => [...prev, userMsg]);
    addAgentMessage(userMsg);
    setInput('');
    setLastFailedMessage(null);
    setAgentLoading(true);

    try {
      // Create session if needed
      let sessionId = activeSessionId;
      if (!sessionId) {
        const newSessionId = await createSession(activeAgentType, text.slice(0, 60));
        if (!newSessionId) {
          throw new Error('failed_to_create_session');
        }
        sessionId = newSessionId;
        setActiveSessionId(sessionId);

        // Refresh sessions list
        loadSessions(activeAgentType);
      }

      // Send message
      const result = await sendMessage(text, sessionId);

      if (result.success && result.assistantMessage) {
        setCurrentMessages((prev) => [...prev, result.assistantMessage!]);
        addAgentMessage(result.assistantMessage);

        // Refresh session counts
        loadSessions(activeAgentType);
      } else {
        throw new Error('failed_to_send');
      }
    } catch (err) {
      // Remove the user message from display and show error
      setCurrentMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      setLastFailedMessage(text);
      toast.error('خطا در ارتباط با عامل هوشمند. لطفاً دوباره تلاش کنید.', {
        action: {
          label: 'تلاش مجدد',
          onClick: () => handleSend(text),
        },
      });
    } finally {
      setAgentLoading(false);
    }
  }, [
    input, agentLoading, activeSessionId, activeAgentType,
    addAgentMessage, setAgentLoading, createSession, sendMessage, loadSessions,
  ]);

  // ─── Handle retry ──────────────────────────────────────────────────
  const handleRetry = useCallback(() => {
    if (lastFailedMessage) {
      setLastFailedMessage(null);
      handleSend(lastFailedMessage);
    }
  }, [lastFailedMessage, handleSend]);

  // ─── Scroll to bottom on new messages ──────────────────────────────
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages, agentLoading]);

  // ─── Focus input on chat open ──────────────────────────────────────
  useEffect(() => {
    if (showChat && !showHistory && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showChat, showHistory]);

  // ─── Keyboard handler ──────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ─── Back to grid ──────────────────────────────────────────────────
  const handleBackToGrid = () => {
    setShowChat(false);
    setShowHistory(false);
    setActiveSessionId(null);
    setCurrentMessages([]);
  };

  // ─── Get suggested questions based on conversation state ───────────
  const getSuggestedQuestions = (): string[] => {
    const messageCount = currentMessages.filter((m) => m.role === 'assistant').length;
    if (messageCount === 0) {
      return activeAgent.suggestedQuestions;
    }
    return activeAgent.followUpQuestions;
  };

  const IconComponent = activeAgent.icon;

  return (
    <div className="space-y-4 h-[calc(100vh-10rem)] flex flex-col">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">مرکز عامل‌های هوشمند</h2>
            <p className="text-slate-500 mt-1">با ۸ عامل تخصصی AI در حوزه‌های مختلف گفتگو کنید</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-100 text-emerald-700">
              <Sparkles className="w-4 h-4 ms-1" />
              ۸ عامل فعال
            </Badge>
            <Badge variant="outline" className="text-slate-600">
              فاز ۲
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 flex flex-col">
        <AnimatePresence mode="wait">
          {!showChat ? (
            /* ─── Agent Grid View ─────────────────────────────────── */
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-y-auto"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {agents.map((agent, index) => {
                  const AgentIcon = agent.icon;
                  const isActive = activeAgentType === agent.type;
                  const sessionCount = agentSessionCounts[agent.type];
                  const hasLastSession = agentLastSession[agent.type] !== null;

                  return (
                    <motion.div
                      key={agent.type}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-200 border-2 h-full ${
                          isActive ? agent.borderColor + ' shadow-lg' : 'border-transparent hover:border-slate-200'
                        } ${sessionCount > 0 ? 'ring-1 ring-emerald-200' : ''}`}
                        onClick={() => handleSelectAgent(agent.type)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            {/* Agent Icon */}
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${agent.gradientFrom} ${agent.gradientTo} shadow-sm`}
                            >
                              <AgentIcon className="w-6 h-6 text-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="text-sm font-bold text-slate-900 truncate">
                                  {agent.emoji} {agent.name}
                                </h3>
                                {sessionCount > 0 && (
                                  <Badge className="text-[10px] px-1.5 py-0 h-5 bg-emerald-100 text-emerald-700 shrink-0">
                                    {sessionCount}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                                {agent.description}
                              </p>
                            </div>
                          </div>

                          {/* Capabilities Tags */}
                          <div className="flex flex-wrap gap-1 mt-3">
                            {agent.capabilities.map((cap) => (
                              <span
                                key={cap}
                                className={`text-[10px] px-2 py-0.5 rounded-full ${agent.bgColor} ${agent.textColor} font-medium`}
                              >
                                {cap}
                              </span>
                            ))}
                          </div>

                          {/* Status & Rating */}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-1">
                              {hasLastSession ? (
                                <Badge className="text-[10px] px-1.5 py-0 h-5 bg-emerald-100 text-emerald-700">
                                  <MessageSquare className="w-3 h-3 ms-0.5" />
                                  ادامه گفتگو
                                </Badge>
                              ) : (
                                <Badge className="text-[10px] px-1.5 py-0 h-5 bg-slate-100 text-slate-600">
                                  آماده
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span className="text-[10px] text-slate-500">
                                {(4.2 + Math.random() * 0.7).toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="mt-6"
              >
                <Card className="bg-gradient-to-l from-emerald-50 to-teal-50 border-emerald-200">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shrink-0">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-emerald-800">مرکز عامل‌های هوشمند - فاز ۲</h3>
                        <p className="text-xs text-emerald-600 mt-1 leading-relaxed">
                          هر عامل هوشمند با هوش مصنوعی واقعی پشتیبانی می‌شود. گفتگوهای شما ذخیره شده و هر زمان
                          می‌توانید به آن‌ها بازگردید. عامل مورد نظر خود را انتخاب کنید و سؤالات تخصصی خود را بپرسید.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ) : (
            /* ─── Chat Interface ──────────────────────────────────── */
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <Card className="flex-1 flex flex-col min-h-0">
                {/* Chat Header */}
                <div className={`p-3 border-b flex items-center gap-3 ${activeAgent.bgColor}`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-8 w-8"
                    onClick={handleBackToGrid}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${activeAgent.gradientFrom} ${activeAgent.gradientTo} shadow-sm`}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        {activeAgent.emoji} {activeAgent.name}
                      </h3>
                      {activeSessionId && (
                        <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                          {currentMessages.length} پیام
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{activeAgent.description}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleNewChat}
                      title="گفتگوی جدید"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${showHistory ? 'bg-slate-200' : ''}`}
                      onClick={() => setShowHistory(!showHistory)}
                      title="تاریخچه گفتگوها"
                    >
                      <History className="h-4 w-4" />
                    </Button>
                    <Badge className={`${activeAgent.bgColor} ${activeAgent.textColor} text-[11px]`}>
                      آنلاین
                    </Badge>
                  </div>
                </div>

                <div className="flex-1 flex min-h-0">
                  {/* Session History Panel */}
                  <AnimatePresence>
                    {showHistory && (
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-s border-slate-200 overflow-hidden shrink-0"
                      >
                        <div className="h-full flex flex-col w-[280px]">
                          <div className="p-3 border-b border-slate-200 flex items-center justify-between">
                            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                              <History className="w-4 h-4" />
                              تاریخچه گفتگوها
                            </h4>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => setShowHistory(false)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>

                          <ScrollArea className="flex-1">
                            {sessionsLoading ? (
                              <div className="p-4 flex items-center justify-center">
                                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                              </div>
                            ) : sessions.length === 0 ? (
                              <div className="p-4 text-center">
                                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-xs text-slate-400">گفتگویی یافت نشد</p>
                              </div>
                            ) : (
                              <div className="p-2 space-y-1">
                                {sessions.map((session) => {
                                  const lastMsg = session.messages?.[0];
                                  const isActive = activeSessionId === session.id;
                                  return (
                                    <button
                                      key={session.id}
                                      className={`w-full text-start p-2.5 rounded-lg transition-colors ${
                                        isActive
                                          ? `${activeAgent.bgColor} ${activeAgent.textColor}`
                                          : 'hover:bg-slate-50'
                                      }`}
                                      onClick={() => handleResumeSession(session.id)}
                                    >
                                      <div className="flex items-start gap-2">
                                        <MessageSquare className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-medium text-slate-800 truncate">
                                            {session.title}
                                          </p>
                                          {lastMsg && (
                                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                              {lastMsg.content.slice(0, 50)}...
                                            </p>
                                          )}
                                          <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                              <Clock className="w-2.5 h-2.5" />
                                              {relativeTime(session.updatedAt)}
                                            </span>
                                            {session._count && (
                                              <span className="text-[10px] text-slate-400">
                                                {session._count.messages} پیام
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </ScrollArea>

                          <div className="p-2 border-t border-slate-200">
                            <Button
                              variant="outline"
                              className="w-full h-8 text-xs"
                              onClick={handleNewChat}
                            >
                              <Plus className="w-3 h-3 ms-1" />
                              گفتگوی جدید
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Chat Messages Area */}
                  <div className="flex-1 flex flex-col min-h-0 min-w-0">
                    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                      {currentMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-6">
                          <div
                            className={`w-16 h-16 bg-gradient-to-br ${activeAgent.gradientFrom} ${activeAgent.gradientTo} rounded-2xl flex items-center justify-center shadow-lg`}
                          >
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-center">
                            <h3 className="text-lg font-bold text-slate-700 mb-2">
                              {activeAgent.emoji} {activeAgent.name}
                            </h3>
                            <p className="text-sm text-slate-500 max-w-md">
                              {activeAgent.description}. سؤال خود را بپرسید یا از پیشنهادات زیر استفاده کنید.
                            </p>
                          </div>

                          {/* Suggested Questions */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                            {activeAgent.suggestedQuestions.map((q) => (
                              <Button
                                key={q}
                                variant="outline"
                                className={`h-auto py-3 px-4 text-sm text-start justify-start whitespace-normal ${activeAgent.hoverBg}`}
                                onClick={() => handleSend(q)}
                                disabled={agentLoading}
                              >
                                <Lightbulb className={`w-4 h-4 shrink-0 ms-2 ${activeAgent.textColor}`} />
                                {q}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {currentMessages.map((msg, msgIdx) => (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className={`flex gap-3 ${
                                msg.role === 'user' ? 'flex-row-reverse' : ''
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                  msg.role === 'assistant'
                                    ? activeAgent.bgColor
                                    : 'bg-slate-200'
                                }`}
                              >
                                {msg.role === 'assistant' ? (
                                  <IconComponent className={`w-4 h-4 ${activeAgent.textColor}`} />
                                ) : (
                                  <User className="w-4 h-4 text-slate-600" />
                                )}
                              </div>
                              <div
                                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                                  msg.role === 'assistant'
                                    ? `bg-slate-100 text-slate-800 rounded-se-none`
                                    : `bg-gradient-to-l ${activeAgent.gradientFrom} ${activeAgent.gradientTo} text-white rounded-ss-none`
                                }`}
                              >
                                {msg.role === 'assistant' ? (
                                  <div className="text-sm leading-relaxed">
                                    {renderMessageContent(msg.content)}
                                  </div>
                                ) : (
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                )}
                              </div>
                            </motion.div>
                          ))}

                          {/* Typing indicator */}
                          {agentLoading && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex gap-3"
                            >
                              <div className={`w-8 h-8 rounded-full ${activeAgent.bgColor} flex items-center justify-center shrink-0`}>
                                <IconComponent className={`w-4 h-4 ${activeAgent.textColor}`} />
                              </div>
                              <div className="bg-slate-100 rounded-2xl rounded-se-none px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex gap-1.5">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                  </div>
                                  <span className="text-xs text-slate-400">در حال تحلیل...</span>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* Retry indicator */}
                          {lastFailedMessage && !agentLoading && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-2 justify-center"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                                onClick={handleRetry}
                              >
                                <RotateCcw className="w-3 h-3 ms-1" />
                                تلاش مجدد
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </ScrollArea>

                    {/* Suggested questions in chat (after messages) */}
                    {currentMessages.length > 0 && !agentLoading && (
                      <div className="px-4 pb-2">
                        <div className="flex flex-wrap gap-1.5">
                          {getSuggestedQuestions().map((q) => (
                            <Button
                              key={q}
                              variant="outline"
                              size="sm"
                              className={`text-xs h-7 ${activeAgent.hoverBg}`}
                              onClick={() => handleSend(q)}
                              disabled={agentLoading}
                            >
                              <Lightbulb className={`w-3 h-3 ms-1 ${activeAgent.textColor}`} />
                              {q.length > 40 ? q.slice(0, 40) + '...' : q}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Input */}
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Input
                          ref={inputRef}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={`سؤال خود را از ${activeAgent.name} بپرسید...`}
                          className="flex-1"
                          disabled={agentLoading}
                        />
                        <Button
                          onClick={() => handleSend()}
                          disabled={!input.trim() || agentLoading}
                          className={`bg-gradient-to-l ${activeAgent.gradientFrom} ${activeAgent.gradientTo} text-white shrink-0 hover:opacity-90`}
                        >
                          {agentLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
