'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/lib/store';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Headphones,
  Users,
  DollarSign,
  Target,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Calendar,
  ArrowUpRight,
  MessageSquare,
  ClipboardCheck,
  Zap,
  ArrowDownRight,
  Star,
  Building2,
  Activity,
  Plus,
  ChevronLeft,
  Eye,
  CalendarDays,
  Timer,
  Sparkles,
  Shield,
  FileText,
  BarChart3,
  GitBranch,
  Phone,
  Search,
} from 'lucide-react';

// ─── Persian Date Helper ───────────────────────────────────────────
function getPersianDate(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    calendar: 'persian',
  };
  try {
    return new Intl.DateTimeFormat('fa-IR', options).format(now);
  } catch {
    return '۱۴۰۴/۰۴/۱۵';
  }
}

function getPersianTime(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    calendar: 'persian',
  };
  try {
    return new Intl.DateTimeFormat('fa-IR', options).format(now);
  } catch {
    return '۱۰:۳۰';
  }
}

// ─── Stage Configuration ───────────────────────────────────────────
const stageConfigMap: Record<string, { label: string; color: string; bg: string; border: string; icon: typeof ClipboardCheck }> = {
  assessment: { label: 'ارزیابی اولیه', color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200', icon: ClipboardCheck },
  diagnostic: { label: 'تشخیص در حال انجام', color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200', icon: Search },
  execution: { label: 'اجرای استراتژی', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: Target },
  completion: { label: 'تکمیل و پیگیری', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: CheckCircle2 },
};

// ─── Priority Configuration ────────────────────────────────────────
const priorityConfig: Record<string, { label: string; dotColor: string; badgeColor: string }> = {
  high: { label: 'اولویت بالا', dotColor: 'bg-red-500', badgeColor: 'bg-red-100 text-red-700' },
  medium: { label: 'اولویت متوسط', dotColor: 'bg-amber-500', badgeColor: 'bg-amber-100 text-amber-700' },
  low: { label: 'اولویت پایین', dotColor: 'bg-emerald-500', badgeColor: 'bg-emerald-100 text-emerald-700' },
};

// ─── Client Status Configuration ───────────────────────────────────
const clientStatusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'فعال', color: 'bg-emerald-100 text-emerald-700' },
  review: { label: 'بازبینی', color: 'bg-amber-100 text-amber-700' },
  completed: { label: 'تکمیل‌شده', color: 'bg-teal-100 text-teal-700' },
};

// ─── Activity Type Configuration ───────────────────────────────────
const activityTypeConfig: Record<string, { icon: typeof ClipboardCheck; color: string; bg: string }> = {
  diagnostic: { icon: ClipboardCheck, color: 'text-teal-600', bg: 'bg-teal-50' },
  strategy: { icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  interaction: { icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
  milestone: { icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
};

// ─── Recommendation Category Configuration ─────────────────────────
const recommendationCategoryConfig: Record<string, { icon: typeof Brain; color: string; bg: string; border: string }> = {
  prioritization: { icon: Target, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  reminder: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  optimization: { icon: Zap, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
  opportunity: { icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
};

// ─── Quick Link Color Map ──────────────────────────────────────────
const quickLinkColorMap: Record<string, string> = {
  emerald: 'hover:bg-emerald-50 hover:border-emerald-300',
  amber: 'hover:bg-amber-50 hover:border-amber-300',
  teal: 'hover:bg-teal-50 hover:border-teal-300',
};

// ─── Mock Data ─────────────────────────────────────────────────────

const pipelineClients = [
  { id: 'p1', name: 'شرکت فناوری نوین', company: 'فناوری نوین', stage: 'assessment', progress: 20, nextAction: 'بررسی مدارک اولیه', priority: 'high' as const },
  { id: 'p2', name: 'صنایع غذایی پارس', company: 'پارس', stage: 'assessment', progress: 35, nextAction: 'تماس اولیه', priority: 'medium' as const },
  { id: 'p3', name: 'استارتاپ پرداخت نو', company: 'پرداخت نو', stage: 'assessment', progress: 45, nextAction: 'ارسال پرسشنامه', priority: 'low' as const },
  { id: 'p4', name: 'گروه ساختمانی آریا', company: 'آریا', stage: 'diagnostic', progress: 55, nextAction: 'تکمیل ارزیابی میدانی', priority: 'high' as const },
  { id: 'p5', name: 'فروشگاه آنلاین دیجی‌مارکت', company: 'دیجی‌مارکت', stage: 'diagnostic', progress: 60, nextAction: 'جلسه تشخیص', priority: 'high' as const },
  { id: 'p6', name: 'شرکت تحول دیجیتال', company: 'تحول دیجیتال', stage: 'diagnostic', progress: 70, nextAction: 'تحلیل نتایج', priority: 'medium' as const },
  { id: 'p7', name: 'شرکت لجستیک هوشمند', company: 'لجستیک هوشمند', stage: 'execution', progress: 75, nextAction: 'پیگیری اجرای فاز ۲', priority: 'high' as const },
  { id: 'p8', name: 'آکادمی آموزش پیشرو', company: 'پیشرو', stage: 'execution', progress: 82, nextAction: 'بازبینی شاخص‌ها', priority: 'medium' as const },
  { id: 'p9', name: 'گروه سرمایه‌گذاری سپهر', company: 'سپهر', stage: 'completion', progress: 90, nextAction: 'ارائه گزارش نهایی', priority: 'low' as const },
  { id: 'p10', name: 'شرکت پخش آرمان', company: 'آرمان', stage: 'completion', progress: 95, nextAction: 'جلسه جمع‌بندی', priority: 'low' as const },
];

const assignedClients = [
  { id: 'ac1', name: 'شرکت فناوری نوین', company: 'فناوری نوین', industry: 'فناوری اطلاعات', diagnosticScore: 72, strategyProgress: 45, lastInteraction: '۱۴۰۴/۰۴/۱۲', nextFollowUp: '۱۴۰۴/۰۴/۱۸', status: 'active' },
  { id: 'ac2', name: 'صنایع غذایی پارس', company: 'پارس', industry: 'غذایی', diagnosticScore: 58, strategyProgress: 20, lastInteraction: '۱۴۰۴/۰۴/۱۰', nextFollowUp: '۱۴۰۴/۰۴/۱۶', status: 'active' },
  { id: 'ac3', name: 'گروه ساختمانی آریا', company: 'آریا', industry: 'ساختمان', diagnosticScore: 81, strategyProgress: 68, lastInteraction: '۱۴۰۴/۰۴/۱۳', nextFollowUp: '۱۴۰۴/۰۴/۱۹', status: 'review' },
  { id: 'ac4', name: 'فروشگاه آنلاین دیجی‌مارکت', company: 'دیجی‌مارکت', industry: 'خرده‌فروشی', diagnosticScore: 45, strategyProgress: 10, lastInteraction: '۱۴۰۴/۰۴/۰۸', nextFollowUp: '۱۴۰۴/۰۴/۱۵', status: 'active' },
  { id: 'ac5', name: 'شرکت تحول دیجیتال', company: 'تحول دیجیتال', industry: 'مشاوره', diagnosticScore: 88, strategyProgress: 92, lastInteraction: '۱۴۰۴/۰۴/۱۴', nextFollowUp: '۱۴۰۴/۰۴/۲۲', status: 'completed' },
  { id: 'ac6', name: 'شرکت لجستیک هوشمند', company: 'لجستیک هوشمند', industry: 'حمل‌ونقل', diagnosticScore: 64, strategyProgress: 55, lastInteraction: '۱۴۰۴/۰۴/۱۱', nextFollowUp: '۱۴۰۴/۰۴/۱۷', status: 'active' },
  { id: 'ac7', name: 'آکادمی آموزش پیشرو', company: 'پیشرو', industry: 'آموزش', diagnosticScore: 53, strategyProgress: 35, lastInteraction: '۱۴۰۴/۰۴/۰۹', nextFollowUp: '۱۴۰۴/۰۴/۲۰', status: 'active' },
];

const diagnosticTierData = [
  { name: 'پرپتانسیل (۸۰+)', value: 2, color: '#059669' },
  { name: 'متوسط (۵۰-۷۹)', value: 3, color: '#0d9488' },
  { name: 'نیاز به توجه (<۵۰)', value: 2, color: '#d97706' },
];

const followUpsToday = [
  { id: 'ft1', clientName: 'شرکت فناوری نوین', type: 'جلسه تشخیص', time: '۱۰:۰۰', status: 'upcoming' as const },
  { id: 'ft2', clientName: 'صنایع غذایی پارس', type: 'بازبینی نتایج', time: '۱۴:۰۰', status: 'upcoming' as const },
  { id: 'ft3', clientName: 'گروه ساختمانی آریا', type: 'تماس تلفنی پیگیری', time: '۱۶:۳۰', status: 'upcoming' as const },
];

const followUpsWeek = [
  { id: 'fw1', clientName: 'فروشگاه آنلاین دیجی‌مارکت', type: 'پیگیری اولیه', time: '۱۴۰۴/۰۴/۱۷ - ۱۱:۰۰', status: 'scheduled' as const },
  { id: 'fw2', clientName: 'شرکت لجستیک هوشمند', type: 'ارائه طرح پیشنهادی', time: '۱۴۰۴/۰۴/۱۸ - ۰۹:۰۰', status: 'scheduled' as const },
  { id: 'fw3', clientName: 'آکادمی آموزش پیشرو', type: 'جلسه مشاوره', time: '۱۴۰۴/۰۴/۱۹ - ۱۵:۰۰', status: 'scheduled' as const },
  { id: 'fw4', clientName: 'شرکت تحول دیجیتال', type: 'جلسه جمع‌بندی', time: '۱۴۰۴/۰۴/۲۲ - ۱۰:۳۰', status: 'scheduled' as const },
];

const followUpsOverdue = [
  { id: 'fo1', clientName: 'صنایع غذایی پارس', type: 'ارسال گزارش تشخیصی', time: '۱۴۰۴/۰۴/۰۸', status: 'overdue' as const },
  { id: 'fo2', clientName: 'فروشگاه آنلاین دیجی‌مارکت', type: 'تماس پیگیری ارزیابی', time: '۱۴۰۴/۰۴/۰۵', status: 'overdue' as const },
];

const recentActivities = [
  { id: 'ra1', action: 'تکمیل ارزیابی تشخیصی', client: 'گروه ساختمانی آریا', time: '۲ ساعت پیش', type: 'diagnostic' as const },
  { id: 'ra2', action: 'تأیید استراتژی رشد', client: 'شرکت تحول دیجیتال', time: '۴ ساعت پیش', type: 'strategy' as const },
  { id: 'ra3', action: 'جلسه مشاوره فصلی', client: 'صنایع غذایی پارس', time: 'دیروز', type: 'interaction' as const },
  { id: 'ra4', action: 'دستیابی به نقطه عطف فاز ۲', client: 'شرکت لجستیک هوشمند', time: 'دیروز', type: 'milestone' as const },
  { id: 'ra5', action: 'ارسال گزارش تحلیلی', client: 'شرکت فناوری نوین', time: '۲ روز پیش', type: 'diagnostic' as const },
  { id: 'ra6', action: 'بازنگری استراتژی بازاریابی', client: 'فروشگاه آنلاین دیجی‌مارکت', time: '۲ روز پیش', type: 'strategy' as const },
  { id: 'ra7', action: 'تماس پیگیری اجرایی', client: 'آکادمی آموزش پیشرو', time: '۳ روز پیش', type: 'interaction' as const },
  { id: 'ra8', action: 'تکمیل مرحله ارزیابی', client: 'شرکت فناوری نوین', time: '۳ روز پیش', type: 'milestone' as const },
  { id: 'ra9', action: 'ارائه پیشنهاد استراتژیک', client: 'گروه ساختمانی آریا', time: '۴ روز پیش', type: 'strategy' as const },
  { id: 'ra10', action: 'جلسه بررسی عملکرد', client: 'شرکت تحول دیجیتال', time: '۵ روز پیش', type: 'interaction' as const },
];

const aiRecommendations = [
  {
    id: 'ar1',
    title: 'اولویت‌بندی مشتریان',
    description: 'پیشنهاد می‌شود پیگیری فروشگاه آنلاین دیجی‌مارکت و صنایع غذایی پارس در اولویت قرار گیرد. امتیاز تشخیصی پایین‌تر از میانگین و نیاز فوری به مداخله استراتژیک دارند.',
    confidence: 92,
    category: 'prioritization',
    actionLabel: 'مشاهده جزئیات',
  },
  {
    id: 'ar2',
    title: 'یادآوری پیگیری سررسید شده',
    description: 'دو پیگیری سررسید شده وجود دارد. ارسال گزارش تشخیصی برای صنایع غذایی پارس و تماس پیگیری برای دیجی‌مارکت. لطفاً در اسرع وقت اقدام کنید.',
    confidence: 98,
    category: 'reminder',
    actionLabel: 'اقدام فوری',
  },
  {
    id: 'ar3',
    title: 'بهینه‌سازی استراتژی',
    description: 'بر اساس تحلیل الگوهای موفقیت، مشتریان مرحله اجرا به بازنگری در شاخص‌های کلیدی نیاز دارند. پیشنهاد: جلسه بازبینی هفتگی برای لجستیک هوشمند و پیشرو.',
    confidence: 85,
    category: 'optimization',
    actionLabel: 'اعمال پیشنهاد',
  },
  {
    id: 'ar4',
    title: 'فرصت ارتقای خدمات',
    description: 'شرکت تحول دیجیتال در مرحله تکمیل نهایی قرار دارد و رضایت بالایی دارد. فرصت ارجاع و معرفی خدمات به شبکه کسب‌وکار آن‌ها وجود دارد.',
    confidence: 78,
    category: 'opportunity',
    actionLabel: 'بررسی فرصت',
  },
];

const quickLinks = [
  { title: 'تشخیص کسب‌وکار', icon: ClipboardCheck, view: 'diagnostic' as const, color: 'emerald' },
  { title: 'CRM مشتریان', icon: Users, view: 'crm' as const, color: 'teal' },
  { title: 'استراتژی‌ها', icon: Target, view: 'strategy' as const, color: 'amber' },
  { title: 'مشاور هوشمند', icon: Brain, view: 'advisor' as const, color: 'emerald' },
  { title: 'نقشه راه', icon: CalendarDays, view: 'roadmap' as const, color: 'teal' },
  { title: 'داشبورد BI', icon: BarChart3, view: 'bi-dashboard' as const, color: 'amber' },
  { title: 'فرآیندها', icon: GitBranch, view: 'bpm' as const, color: 'emerald' },
  { title: 'گزارش‌ها', icon: FileText, view: 'reports' as const, color: 'teal' },
];

const clientsNeedingAttention = [
  { name: 'فروشگاه آنلاین دیجی‌مارکت', score: 45, issue: 'امتیاز تشخیصی پایین' },
  { name: 'صنایع غذایی پارس', score: 58, issue: 'پیگیری سررسید شده' },
];

// ─── Animation Variants ────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' },
  }),
};

// ─── Performance Gauge Component ───────────────────────────────────
function PerformanceGauge({ score }: { score: number }) {
  const radius = 50;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return '#059669';
    if (s >= 60) return '#0d9488';
    if (s >= 40) return '#d97706';
    return '#dc2626';
  };

  const getLabel = (s: number) => {
    if (s >= 80) return 'عالی';
    if (s >= 60) return 'خوب';
    if (s >= 40) return 'متوسط';
    return 'نیاز به بهبود';
  };

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="80" viewBox="0 0 140 80" dir="ltr">
        <path
          d="M 15 72 A 50 50 0 0 1 125 72"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 15 72 A 50 50 0 0 1 125 72"
          fill="none"
          stroke={getColor(score)}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
        />
        <text x="70" y="62" textAnchor="middle" fontSize="24" fontWeight="bold" fill={getColor(score)}>
          {score}
        </text>
        <text x="70" y="78" textAnchor="middle" fontSize="9" fill="#64748b">
          از ۱۰۰
        </text>
      </svg>
      <Badge className={`mt-1 text-[10px] ${score >= 80 ? 'bg-emerald-100 text-emerald-700' : score >= 60 ? 'bg-teal-100 text-teal-700' : score >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
        {getLabel(score)}
      </Badge>
    </div>
  );
}

// ─── Custom Tooltip ────────────────────────────────────────────────
function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }> }) {
  if (!active || !payload) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg p-3 text-sm" dir="rtl">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-600">{entry.name}:</span>
          <span className="font-medium text-slate-900">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Pipeline Column Component ─────────────────────────────────────
function PipelineColumn({ stage, clients }: { stage: string; clients: typeof pipelineClients }) {
  const config = stageConfigMap[stage];
  const StageIcon = config.icon;
  const stageClients = clients.filter((c) => c.stage === stage);

  return (
    <div className="flex-1 min-w-[200px]">
      <div className={`${config.bg} rounded-t-xl p-3 border-b-2 ${config.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StageIcon className={`w-4 h-4 ${config.color}`} />
            <span className={`text-sm font-bold ${config.color}`}>{config.label}</span>
          </div>
          <Badge variant="outline" className="text-xs bg-white/60">{stageClients.length}</Badge>
        </div>
      </div>
      <div className={`${config.bg} rounded-b-xl p-2 min-h-[160px] space-y-2`}>
        {stageClients.map((client) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-3 shadow-sm border border-white/50 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-800 truncate">{client.name}</span>
              <div className={`w-2 h-2 rounded-full shrink-0 ${priorityConfig[client.priority].dotColor}`} />
            </div>
            <p className="text-[10px] text-slate-500 mb-2">{client.nextAction}</p>
            <div className="flex items-center gap-2">
              <Progress value={client.progress} className="h-1.5 flex-1" />
              <span className="text-[10px] font-bold text-slate-600">{client.progress}٪</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Follow-up Item Renderer ───────────────────────────────────────
type FollowUpItem = {
  id: string;
  clientName: string;
  type: string;
  time: string;
  status: 'upcoming' | 'scheduled' | 'overdue';
};

function FollowUpItem({ item }: { item: FollowUpItem }) {
  const isOverdue = item.status === 'overdue';
  const isUpcoming = item.status === 'upcoming';

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
        isOverdue
          ? 'border-red-200 bg-red-50/50 hover:bg-red-50'
          : 'border-slate-200 hover:bg-slate-50'
      }`}
    >
      <div className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${
        isOverdue ? 'bg-red-500' : isUpcoming ? 'bg-emerald-500' : 'bg-amber-500'
      }`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-slate-900 truncate">{item.type}</p>
          {isOverdue && (
            <Badge className="text-[10px] bg-red-100 text-red-700 shrink-0">سررسید شده</Badge>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{item.clientName}</p>
        <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
          <Clock className="w-3 h-3" />
          {item.time}
        </div>
      </div>
      <Button variant="ghost" size="sm" className="shrink-0 h-8 w-8 p-0">
        <Phone className="w-3.5 h-3.5 text-slate-400" />
      </Button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────
export default function PortalConsultant() {
  const { user, setView } = useAppStore();
  const [activeFollowUpTab, setActiveFollowUpTab] = useState('today');
  const [expandedRecommendation, setExpandedRecommendation] = useState<string | null>(null);

  const consultantName = user?.name || 'مشاور محترم';
  const persianDate = getPersianDate();
  const persianTime = getPersianTime();

  const quickStats = [
    { label: 'مشتریان فعال', value: '۷', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'تشخیص‌های معلق', value: '۳', icon: ClipboardCheck, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'پیگیری‌های امروز', value: '۳', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const performanceMetrics = [
    {
      title: 'تعداد مشتریان فعال',
      value: '۷',
      change: '+۲',
      trend: 'up' as const,
      icon: Users,
      accent: 'from-emerald-500 to-emerald-600',
      lightBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'درآمد مشاوره',
      value: '۴۸۰ میلیون',
      change: '+۱۵٪',
      trend: 'up' as const,
      icon: DollarSign,
      accent: 'from-teal-500 to-teal-600',
      lightBg: 'bg-teal-50',
      iconColor: 'text-teal-600',
    },
    {
      title: 'نرخ موفقیت استراتژی',
      value: '۸۲٪',
      change: '+۵٪',
      trend: 'up' as const,
      icon: Target,
      accent: 'from-amber-500 to-amber-600',
      lightBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      title: 'امتیاز عملکرد',
      value: '۸۲',
      change: '+۴',
      trend: 'up' as const,
      icon: Star,
      accent: 'from-emerald-500 to-teal-600',
      lightBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      isGauge: true,
    },
  ];

  return (
    <div className="space-y-6 pb-8" dir="rtl">
      {/* ═══════════════════════════════════════════════════════════════
          1. HEADER SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="bg-gradient-to-l from-emerald-900 via-teal-900 to-emerald-800 border-0 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-8 w-32 h-32 rounded-full bg-emerald-400 blur-3xl" />
            <div className="absolute bottom-0 right-16 w-48 h-48 rounded-full bg-teal-400 blur-3xl" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">پورتال مشاور</h1>
                  <p className="text-emerald-200 mt-0.5">خوش آمدید، {consultantName}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1.5 text-xs text-emerald-300">
                      <Calendar className="w-3.5 h-3.5" />
                      {persianDate}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-emerald-300">
                      <Clock className="w-3.5 h-3.5" />
                      {persianTime}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <div className="flex gap-2 sm:gap-3">
                  {quickStats.map((stat) => (
                    <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-center min-w-[80px]">
                      <stat.icon className={`w-4 h-4 mx-auto mb-1 ${stat.color}`} />
                      <p className="text-lg font-bold text-white">{stat.value}</p>
                      <p className="text-[10px] text-emerald-200">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <Separator orientation="vertical" className="hidden sm:block h-12 bg-white/20" />
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/15 hover:bg-white/25 text-white border-white/20 backdrop-blur-sm gap-2"
                    onClick={() => setView('diagnostic')}
                  >
                    <Plus className="w-4 h-4" />
                    ارزیابی جدید
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/15 hover:bg-white/25 text-white border-white/20 backdrop-blur-sm gap-2"
                    onClick={() => setView('advisor')}
                  >
                    <Brain className="w-4 h-4" />
                    مشاور هوشمند
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          2. PERFORMANCE METRICS ROW (4 cards)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, i) => (
          <motion.div
            key={metric.title}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden group">
              <div className={`h-1 bg-gradient-to-l ${metric.accent}`} />
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${metric.lightBg}`}>
                    <metric.icon className={`w-5.5 h-5.5 ${metric.iconColor}`} />
                  </div>
                  <Badge
                    className={`text-xs font-medium ${
                      metric.trend === 'up'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-600 border-red-200'
                    }`}
                  >
                    {metric.trend === 'up' ? (
                      <ArrowUpRight className="w-3 h-3 ms-1" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 ms-1" />
                    )}
                    {metric.change}
                  </Badge>
                </div>
                {metric.isGauge ? (
                  <PerformanceGauge score={82} />
                ) : (
                  <>
                    <p className="text-sm text-slate-500 mb-1">{metric.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          3. CLIENT PIPELINE (Kanban-style)
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                خط لوله مشتریان
              </CardTitle>
              <Badge className="bg-emerald-100 text-emerald-700">{pipelineClients.length} مشتری</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {['assessment', 'diagnostic', 'execution', 'completion'].map((stage) => (
                <PipelineColumn key={stage} stage={stage} clients={pipelineClients} />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          4. ASSIGNED CLIENTS SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-600" />
                مشتریان اختصاصی
              </CardTitle>
              <Badge variant="outline" className="text-xs">{assignedClients.length} مشتری</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-96">
              <div className="space-y-3">
                {assignedClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center gap-4 p-4 border rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-slate-900 truncate">{client.name}</p>
                        <Badge className={`text-[10px] ${clientStatusConfig[client.status].color}`}>
                          {clientStatusConfig[client.status].label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{client.industry}</span>
                        <span className="text-slate-300">|</span>
                        <span>آخرین تعامل: {client.lastInteraction}</span>
                        <span className="text-slate-300">|</span>
                        <span>پیگیری بعدی: {client.nextFollowUp}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500">امتیاز تشخیص</span>
                        <span className={`text-sm font-bold ${
                          client.diagnosticScore >= 70 ? 'text-emerald-600' : client.diagnosticScore >= 50 ? 'text-amber-600' : 'text-red-500'
                        }`}>
                          {client.diagnosticScore}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 w-32">
                        <Progress value={client.strategyProgress} className="h-1.5 flex-1" />
                        <span className="text-[10px] text-slate-500">پیشرفت {client.strategyProgress}٪</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setView('diagnostic')} title="مشاهده تشخیص">
                        <Eye className="w-4 h-4 text-slate-500" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setView('advisor')} title="چت مشاوره">
                        <MessageSquare className="w-4 h-4 text-slate-500" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="زمان‌بندی">
                        <Calendar className="w-4 h-4 text-slate-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          5. DIAGNOSTIC SUMMARY
      ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart - Distribution by tier */}
        <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-teal-600" />
                توزیع سطوح تشخیصی
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={diagnosticTierData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {diagnosticTierData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value: string) => <span className="text-xs text-slate-600">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Average Scores */}
        <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                میانگین امتیازات تشخیصی
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'مالی و اقتصادی', score: 68 },
                  { label: 'بازاریابی و فروش', score: 72 },
                  { label: 'عملیات و فرآیندها', score: 61 },
                  { label: 'منابع انسانی', score: 55 },
                  { label: 'فناوری و نوآوری', score: 74 },
                  { label: 'استراتژی و رهبری', score: 66 },
                ].map((dim) => (
                  <div key={dim.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-600">{dim.label}</span>
                      <span className={`text-xs font-bold ${
                        dim.score >= 70 ? 'text-emerald-600' : dim.score >= 55 ? 'text-amber-600' : 'text-red-500'
                      }`}>
                        {dim.score}
                      </span>
                    </div>
                    <Progress value={dim.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Clients Needing Attention */}
        <motion.div custom={5} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                نیاز به توجه فوری
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientsNeedingAttention.map((client) => (
                  <div key={client.name} className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-slate-900">{client.name}</span>
                      <Badge className="bg-red-100 text-red-700 text-[10px]">
                        امتیاز: {client.score}
                      </Badge>
                    </div>
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {client.issue}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => setView('diagnostic')}>
                        <Eye className="w-3 h-3" />
                        مشاهده
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => setView('advisor')}>
                        <MessageSquare className="w-3 h-3" />
                        مشاوره
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Timer className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-semibold text-slate-900">یادآوری مهم</span>
                  </div>
                  <p className="text-xs text-amber-700">
                    {followUpsOverdue.length} پیگیری سررسید شده و {followUpsToday.length} پیگیری امروز برنامه‌ریزی شده است.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          6. FOLLOW-UPS & SCHEDULE (Phase 2)
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div custom={6} variants={cardVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-amber-600" />
                پیگیری‌ها و زمان‌بندی
              </CardTitle>
              <div className="flex items-center gap-2">
                {followUpsOverdue.length > 0 && (
                  <Badge className="bg-red-100 text-red-700 gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {followUpsOverdue.length} سررسید شده
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeFollowUpTab} onValueChange={setActiveFollowUpTab} dir="rtl" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="today" className="gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  امروز ({followUpsToday.length})
                </TabsTrigger>
                <TabsTrigger value="week" className="gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  این هفته ({followUpsWeek.length})
                </TabsTrigger>
                <TabsTrigger value="overdue" className="gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  سررسید شده ({followUpsOverdue.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="today">
                <div className="space-y-2">
                  {followUpsToday.map((item) => (
                    <FollowUpItem key={item.id} item={item} />
                  ))}
                  {followUpsToday.length === 0 && (
                    <p className="text-center text-sm text-slate-400 py-6">پیگیری امروز وجود ندارد</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="week">
                <div className="space-y-2">
                  {followUpsWeek.map((item) => (
                    <FollowUpItem key={item.id} item={item} />
                  ))}
                  {followUpsWeek.length === 0 && (
                    <p className="text-center text-sm text-slate-400 py-6">پیگیری این هفته وجود ندارد</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="overdue">
                <div className="space-y-2">
                  {followUpsOverdue.map((item) => (
                    <FollowUpItem key={item.id} item={item} />
                  ))}
                  {followUpsOverdue.length === 0 && (
                    <p className="text-center text-sm text-slate-400 py-6">همه پیگیری‌ها به‌موقع انجام شده‌اند</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          7. ACTIVITY FEED
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div custom={7} variants={cardVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              فعالیت‌های اخیر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[420px]">
              <div className="relative pr-6">
                {/* Timeline line */}
                <div className="absolute right-2 top-1 bottom-1 w-0.5 bg-slate-200" />
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const config = activityTypeConfig[activity.type];
                    const ActivityIcon = config.icon;

                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className="relative flex items-start gap-4"
                      >
                        {/* Timeline dot */}
                        <div className={`absolute right-[-18px] top-1 w-4 h-4 rounded-full border-2 border-white ${config.bg} flex items-center justify-center z-10`}>
                          <ActivityIcon className={`w-2 h-2 ${config.color}`} />
                        </div>
                        <div className="flex-1 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm text-slate-800">
                                <span className="font-semibold">{activity.action}</span>
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">{activity.client}</p>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0 whitespace-nowrap">{activity.time}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          8. AI RECOMMENDATIONS (Phase 2)
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div custom={8} variants={cardVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-emerald-600" />
                  توصیه‌های هوش مصنوعی
                </CardTitle>
                <CardDescription className="mt-1">پیشنهادهای هوشمند بر اساس تحلیل عملکرد و الگوهای داده</CardDescription>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 gap-1">
                <Sparkles className="w-3 h-3" />
                هوشمند
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {aiRecommendations.map((rec, index) => {
                  const catConfig = recommendationCategoryConfig[rec.category];
                  const CatIcon = catConfig.icon;
                  const isExpanded = expandedRecommendation === rec.id;

                  return (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <Card className={`transition-all duration-300 hover:shadow-md ${catConfig.border} border`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${catConfig.bg}`}>
                              <CatIcon className={`w-5 h-5 ${catConfig.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-bold text-slate-900">{rec.title}</h4>
                                <Badge
                                  className={`text-[10px] shrink-0 ${
                                    rec.confidence >= 90
                                      ? 'bg-emerald-100 text-emerald-700'
                                      : rec.confidence >= 80
                                      ? 'bg-teal-100 text-teal-700'
                                      : 'bg-amber-100 text-amber-700'
                                  }`}
                                >
                                  اطمینان: {rec.confidence}٪
                                </Badge>
                              </div>
                              <p className={`text-xs text-slate-600 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                                {rec.description}
                              </p>
                              <div className="flex items-center gap-2 mt-3">
                                <Button
                                  size="sm"
                                  className="h-7 text-[10px] gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                  {rec.actionLabel}
                                  <ChevronLeft className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-[10px]"
                                  onClick={() => setExpandedRecommendation(isExpanded ? null : rec.id)}
                                >
                                  {isExpanded ? 'بستن' : 'بیشتر'}
                                </Button>
                              </div>
                            </div>
                          </div>
                          {/* Confidence Bar */}
                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">میزان اطمینان</span>
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${rec.confidence}%` }}
                                transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                                className={`h-full rounded-full ${
                                  rec.confidence >= 90
                                    ? 'bg-emerald-500'
                                    : rec.confidence >= 80
                                    ? 'bg-teal-500'
                                    : 'bg-amber-500'
                                }`}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          9. QUICK LINKS
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div custom={9} variants={cardVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              دسترسی سریع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickLinks.map((link, index) => (
                <motion.button
                  key={link.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => setView(link.view)}
                  className={`flex items-center gap-3 p-4 rounded-xl border border-slate-200 ${quickLinkColorMap[link.color]} transition-all duration-200 text-right group`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    link.color === 'emerald' ? 'bg-emerald-50 group-hover:bg-emerald-100' :
                    link.color === 'teal' ? 'bg-teal-50 group-hover:bg-teal-100' :
                    'bg-amber-50 group-hover:bg-amber-100'
                  } transition-colors`}>
                    <link.icon className={`w-5 h-5 ${
                      link.color === 'emerald' ? 'text-emerald-600' :
                      link.color === 'teal' ? 'text-teal-600' :
                      'text-amber-600'
                    }`} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{link.title}</span>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
