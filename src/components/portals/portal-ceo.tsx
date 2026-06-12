'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/lib/store';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Crown,
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Brain,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Shield,
  Calendar,
  Bell,
  X,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  BarChart3,
  Briefcase,
  Target,
  Activity,
  Lightbulb,
  ChevronLeft,
  PieChart,
  Globe,
  Settings,
  HelpCircle,
  Building2,
  GitBranch,
  Database,
  Presentation,
  UserCheck,
  Sparkles,
  Eye,
  Wallet,
  CreditCard,
  HandCoins,
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
    return '۱۴۰۴/۰۳/۲۱';
  }
}

// ─── Mock Data ─────────────────────────────────────────────────────

const revenueTrendData = [
  { month: 'تیر', revenue: 420, expense: 310 },
  { month: 'مرداد', revenue: 480, expense: 340 },
  { month: 'شهریور', revenue: 510, expense: 360 },
  { month: 'مهر', revenue: 560, expense: 380 },
  { month: 'آبان', revenue: 620, expense: 410 },
  { month: 'آذر', revenue: 680, expense: 430 },
  { month: 'دی', revenue: 710, expense: 450 },
  { month: 'بهمن', revenue: 750, expense: 460 },
  { month: 'اسفند', revenue: 820, expense: 480 },
  { month: 'فروردین', revenue: 860, expense: 500 },
  { month: 'اردیبهشت', revenue: 910, expense: 520 },
  { month: 'خرداد', revenue: 970, expense: 540 },
];

const expenseVsRevenueData = [
  { month: 'فروردین', revenue: 860, expense: 500, profit: 360 },
  { month: 'اردیبهشت', revenue: 910, expense: 520, profit: 390 },
  { month: 'خرداد', revenue: 970, expense: 540, profit: 430 },
  { month: 'تیر', revenue: 1020, expense: 560, profit: 460 },
  { month: 'مرداد', revenue: 1080, expense: 590, profit: 490 },
  { month: 'شهریور', revenue: 1150, expense: 620, profit: 530 },
];

const cashFlowPredictionData = [
  { month: 'فروردین', optimistic: 920, likely: 860, pessimistic: 780 },
  { month: 'اردیبهشت', optimistic: 980, likely: 910, pessimistic: 800 },
  { month: 'خرداد', optimistic: 1050, likely: 970, pessimistic: 830 },
  { month: 'تیر', optimistic: 1120, likely: 1020, pessimistic: 860 },
  { month: 'مرداد', optimistic: 1200, likely: 1080, pessimistic: 890 },
  { month: 'شهریور', optimistic: 1290, likely: 1150, pessimistic: 920 },
];

const riskRadarData = [
  { dimension: 'مالی', value: 72 },
  { dimension: 'عملیاتی', value: 58 },
  { dimension: 'بازاریابی', value: 65 },
  { dimension: 'منابع انسانی', value: 80 },
  { dimension: 'فناوری', value: 45 },
];

const activeStrategies = [
  { id: '1', name: 'توسعه بازار آنلاین', progress: 78, owner: 'تیم بازاریابی', priority: 'high' as const },
  { id: '2', name: 'بهبود حاشیه سود', progress: 62, owner: 'تیم مالی', priority: 'high' as const },
  { id: '3', name: 'دیجیتال مارکتینگ پیشرفته', progress: 45, owner: 'تیم دیجیتال', priority: 'medium' as const },
  { id: '4', name: 'توسعه تیم فروش', progress: 33, owner: 'تیم منابع انسانی', priority: 'medium' as const },
];

const pendingApprovals = [
  {
    id: 'pa1',
    title: 'تأیید بودجه بازاریابی سه ماهه سوم',
    type: 'budget' as const,
    requestedBy: 'علی محمدی',
    date: '۱۴۰۴/۰۳/۱۸',
    amount: '۲,۴۰۰ میلیون تومان',
    description: 'بودجه مورد نیاز برای کمپین‌های بازاریابی سه ماهه سوم سال',
  },
  {
    id: 'pa2',
    title: 'تأیید استراتژی ورود به بازار خاورمیانه',
    type: 'strategy' as const,
    requestedBy: 'سارا احمدی',
    date: '۱۴۰۴/۰۳/۱۵',
    amount: undefined,
    description: 'استراتژی توسعه بازار به کشورهای امارات، عمان و قطر',
  },
  {
    id: 'pa3',
    title: 'تمدید قرارداد تأمین‌کننده اصلی',
    type: 'contract' as const,
    requestedBy: 'رضا کریمی',
    date: '۱۴۰۴/۰۳/۱۲',
    amount: '۱,۸۰۰ میلیون تومان',
    description: 'تمدید قرارداد سالانه با تأمین‌کننده مواد اولیه',
  },
  {
    id: 'pa4',
    title: 'هزینه تجهیزات دفتر جدید',
    type: 'expense' as const,
    requestedBy: 'مریم حسینی',
    date: '۱۴۰۴/۰۳/۱۰',
    amount: '۴۵۰ میلیون تومان',
    description: 'تأمین مبلمان و تجهیزات فناوری دفتر شعبه شمال',
  },
  {
    id: 'pa5',
    title: 'تأیید بودجه تحقیق و توسعه',
    type: 'budget' as const,
    requestedBy: 'امیر نوری',
    date: '۱۴۰۴/۰۳/۰۸',
    amount: '۳,۲۰۰ میلیون تومان',
    description: 'سرمایه‌گذاری در پروژه‌های نوآوری و توسعه محصول جدید',
  },
];

const teamMembers = [
  {
    id: 'tm1',
    name: 'علی محمدی',
    role: 'مدیر بازاریابی',
    score: 88,
    activeTasks: 7,
    completedTasks: 24,
    trend: [65, 70, 72, 78, 82, 88],
  },
  {
    id: 'tm2',
    name: 'سارا احمدی',
    role: 'مدیر استراتژی',
    score: 92,
    activeTasks: 5,
    completedTasks: 31,
    trend: [75, 78, 82, 85, 89, 92],
  },
  {
    id: 'tm3',
    name: 'رضا کریمی',
    role: 'مدیر عملیات',
    score: 75,
    activeTasks: 9,
    completedTasks: 18,
    trend: [80, 78, 74, 72, 73, 75],
  },
  {
    id: 'tm4',
    name: 'مریم حسینی',
    role: 'مدیر مالی',
    score: 85,
    activeTasks: 4,
    completedTasks: 28,
    trend: [70, 74, 78, 80, 83, 85],
  },
  {
    id: 'tm5',
    name: 'امیر نوری',
    role: 'مدیر تحقیق و توسعه',
    score: 79,
    activeTasks: 6,
    completedTasks: 22,
    trend: [68, 72, 74, 76, 78, 79],
  },
  {
    id: 'tm6',
    name: 'فاطمه رضایی',
    role: 'مدیر منابع انسانی',
    score: 82,
    activeTasks: 3,
    completedTasks: 26,
    trend: [73, 76, 78, 80, 81, 82],
  },
];

const aiInsights = [
  {
    id: 'ai1',
    icon: Shield,
    title: 'بینش استراتژیک',
    description: 'تحلیل الگوهای بازار نشان می‌دهد که فرصت ورود به بازار کشورهای همسایه در سه ماهه آینده بهینه‌ترین زمان است. رقبای اصلی در حال تغییر استراتژی هستند و مزیت رقابتی اولویت دارد.',
    confidence: 87,
    actionLabel: 'مشاهده تحلیل',
    color: 'emerald' as const,
  },
  {
    id: 'ai2',
    icon: DollarSign,
    title: 'بینش مالی',
    description: 'بر اساس مدل‌های پیش‌بینی، حاشیه سود در صورت کاهش هزینه‌های عملیاتی ۸٪، می‌تواند تا ۱۵٪ افزایش یابد. پیشنهاد: بازنگری در قراردادهای تأمین‌کنندگان و مذاکره مجدد.',
    confidence: 92,
    actionLabel: 'جزئیات مالی',
    color: 'amber' as const,
  },
  {
    id: 'ai3',
    icon: Globe,
    title: 'بینش بازار',
    description: 'روند رو به رشد تقاضا در بخش خدمات دیجیتال ادامه دارد. نرخ رشد بازار ۲۳٪ پیش‌بینی می‌شود. توصیه: افزایش سرمایه‌گذاری در زیرساخت‌های دیجیتال و توسعه محصول.',
    confidence: 78,
    actionLabel: 'گزارش بازار',
    color: 'teal' as const,
  },
];

const criticalAlerts = [
  { id: 'al1', title: 'سررسید پرداخت وام بانکی - ۲ روز مانده', priority: 'urgent' as const, time: 'فوری', icon: CreditCard },
  { id: 'al2', title: 'کاهش ۱۵٪ نرخ تبدیل مشتری در هفته گذشته', priority: 'high' as const, time: 'امروز', icon: TrendingUp },
  { id: 'al3', title: 'خروج سه عضو کلیدی تیم فروش', priority: 'high' as const, time: 'دیروز', icon: Users },
  { id: 'al4', title: 'جلسه هیئت مدیره فردا ساعت ۱۰ صبح', priority: 'medium' as const, time: 'فردا', icon: Calendar },
  { id: 'al5', title: 'گزارش عملکرد ماهانه آماده بررسی است', priority: 'low' as const, time: '۲ ساعت پیش', icon: FileText },
  { id: 'al6', title: 'به‌روزرسانی سیستم حسابداری انجام شد', priority: 'low' as const, time: '۵ ساعت پیش', icon: CheckCircle2 },
];

const quickLinks = [
  { title: 'داشبورد BI', icon: BarChart3, view: 'bi-dashboard' as const, color: 'emerald' },
  { title: 'مدیریت استراتژی', icon: Briefcase, view: 'strategy' as const, color: 'amber' },
  { title: 'گزارش مدیریتی', icon: FileText, view: 'reports' as const, color: 'teal' },
  { title: 'CRM مشتریان', icon: Users, view: 'crm' as const, color: 'emerald' },
  { title: 'هوش مصنوعی', icon: Brain, view: 'ai-agents' as const, color: 'amber' },
  { title: 'فرآیندهای کسب‌وکار', icon: GitBranch, view: 'bpm' as const, color: 'teal' },
  { title: 'مشاور استراتژیک', icon: Lightbulb, view: 'advisor' as const, color: 'emerald' },
  { title: 'نقشه راه', icon: Target, view: 'roadmap' as const, color: 'amber' },
  { title: 'تحلیل مالی', icon: DollarSign, view: 'financial' as const, color: 'teal' },
];

// ─── Priority Badge Colors ─────────────────────────────────────────
const priorityConfig = {
  urgent: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', label: 'فوری' },
  high: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', label: 'بالا' },
  medium: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', label: 'متوسط' },
  low: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', label: 'پایین' },
};

const approvalTypeConfig = {
  budget: { icon: Wallet, label: 'بودجه', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  strategy: { icon: Shield, label: 'استراتژی', color: 'text-amber-600', bg: 'bg-amber-50' },
  contract: { icon: FileText, label: 'قرارداد', color: 'text-teal-600', bg: 'bg-teal-50' },
  expense: { icon: HandCoins, label: 'هزینه', color: 'text-orange-600', bg: 'bg-orange-50' },
};

const insightColorMap = {
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700', btn: 'bg-emerald-600 hover:bg-emerald-700' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', badge: 'bg-amber-100 text-amber-700', btn: 'bg-amber-600 hover:bg-amber-700' },
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', icon: 'text-teal-600', badge: 'bg-teal-100 text-teal-700', btn: 'bg-teal-600 hover:bg-teal-700' },
};

const quickLinkColorMap = {
  emerald: 'hover:bg-emerald-50 hover:border-emerald-300',
  amber: 'hover:bg-amber-50 hover:border-amber-300',
  teal: 'hover:bg-teal-50 hover:border-teal-300',
};

// ─── Animation Variants ────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' },
  }),
};

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

// ─── Mini Sparkline Component ──────────────────────────────────────
function MiniSparkline({ data, color = '#059669' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 28;
  const padding = 2;

  const points = data
    .map((v, i) => {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((v - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="inline-block">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

// ─── Strategic Health Gauge ────────────────────────────────────────
function StrategicHealthGauge({ score }: { score: number }) {
  const radius = 60;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return '#059669';
    if (s >= 60) return '#d97706';
    return '#dc2626';
  };

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="90" viewBox="0 0 160 90" dir="ltr">
        <path
          d="M 20 80 A 60 60 0 0 1 140 80"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 20 80 A 60 60 0 0 1 140 80"
          fill="none"
          stroke={getColor(score)}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
        />
        <text x="80" y="72" textAnchor="middle" fontSize="28" fontWeight="bold" fill={getColor(score)}>
          {score}
        </text>
        <text x="80" y="88" textAnchor="middle" fontSize="10" fill="#64748b">
          از ۱۰۰
        </text>
      </svg>
      <p className="text-sm font-medium text-slate-700 mt-1">سلامت استراتژیک</p>
      <Badge className={`mt-1 ${score >= 80 ? 'bg-emerald-100 text-emerald-700' : score >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
        {score >= 80 ? 'مطلوب' : score >= 60 ? 'متوسط' : 'نیاز به توجه'}
      </Badge>
    </div>
  );
}

// ─── Custom Tooltip Component ──────────────────────────────────────
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg p-3 text-sm" dir="rtl">
      <p className="font-medium text-slate-800 mb-1">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-600">{entry.name}:</span>
          <span className="font-medium text-slate-900">{entry.value} میلیون</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────
export default function PortalCeo() {
  const { user, setView } = useAppStore();
  const [approvalComments, setApprovalComments] = useState<Record<string, string>>({});
  const [approvedItems, setApprovedItems] = useState<Record<string, 'approved' | 'rejected'>>({});
  const [activeApprovalTab, setActiveApprovalTab] = useState('all');

  const userName = user?.name || 'مدیرعامل محترم';
  const persianDate = getPersianDate();
  const strategicScore = 76;

  const filteredApprovals = pendingApprovals.filter((item) => {
    if (activeApprovalTab === 'all') return true;
    return item.type === activeApprovalTab;
  });

  const handleApprove = (id: string) => {
    setApprovedItems((prev) => ({ ...prev, [id]: 'approved' }));
  };

  const handleReject = (id: string) => {
    setApprovedItems((prev) => ({ ...prev, [id]: 'rejected' }));
  };

  return (
    <div className="space-y-6 pb-8" dir="rtl">
      {/* ═══════════════════════════════════════════════════════════════
          1. HEADER
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-gradient-to-l from-emerald-900 via-emerald-800 to-teal-900 border-0 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-8 w-32 h-32 rounded-full bg-yellow-400 blur-3xl" />
            <div className="absolute bottom-0 right-16 w-48 h-48 rounded-full bg-emerald-400 blur-3xl" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">پورتال مدیرعامل</h1>
                  <p className="text-emerald-200 mt-0.5">
                    خوش آمدید، {userName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-300" />
                    <span className="text-xs text-emerald-300">{persianDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/15 hover:bg-white/25 text-white border-white/20 backdrop-blur-sm gap-2"
                  onClick={() => setView('reports')}
                >
                  <FileText className="w-4 h-4" />
                  گزارش اجرایی
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/15 hover:bg-white/25 text-white border-white/20 backdrop-blur-sm gap-2"
                  onClick={() => setView('bpm')}
                >
                  <Calendar className="w-4 h-4" />
                  جلسه جدید
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-yellow-500/90 hover:bg-yellow-500 text-white border-0 backdrop-blur-sm gap-2"
                  onClick={() => setActiveApprovalTab('all')}
                >
                  <Bell className="w-4 h-4" />
                  تأییدهای معلق
                  <Badge className="bg-white/30 text-white text-xs px-1.5">{pendingApprovals.length}</Badge>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          2. EXECUTIVE KPI ROW
      ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'درآمد کل',
            value: '۹۷۰ میلیون',
            change: '+۱۲.۸٪',
            trend: 'up' as const,
            icon: DollarSign,
            accent: 'from-emerald-500 to-emerald-600',
            lightBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
          },
          {
            title: 'سود خالص',
            value: '۴۳۰ میلیون',
            change: '+۸.۵٪',
            trend: 'up' as const,
            icon: TrendingUp,
            accent: 'from-teal-500 to-teal-600',
            lightBg: 'bg-teal-50',
            iconColor: 'text-teal-600',
          },
          {
            title: 'نرخ رشد',
            value: '۲۳.۴٪',
            change: '+۳.۲٪',
            trend: 'up' as const,
            icon: Activity,
            accent: 'from-amber-500 to-amber-600',
            lightBg: 'bg-amber-50',
            iconColor: 'text-amber-600',
          },
          {
            title: 'رضایت مشتریان',
            value: '۸۷٪',
            change: '-۲.۱٪',
            trend: 'down' as const,
            icon: Users,
            accent: 'from-orange-500 to-orange-600',
            lightBg: 'bg-orange-50',
            iconColor: 'text-orange-600',
          },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.title}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
              <div className={`h-1 bg-gradient-to-l ${kpi.accent}`} />
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${kpi.lightBg}`}>
                    <kpi.icon className={`w-5.5 h-5.5 ${kpi.iconColor}`} />
                  </div>
                  <Badge
                    className={`text-xs font-medium ${
                      kpi.trend === 'up'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-600 border-red-200'
                    }`}
                  >
                    {kpi.trend === 'up' ? (
                      <ArrowUpRight className="w-3 h-3 ms-1" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 ms-1" />
                    )}
                    {kpi.change}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500 mb-1">{kpi.title}</p>
                <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          3. STRATEGIC OVERVIEW SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategic Health Gauge */}
        <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                سلامت استراتژیک
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-4">
              <StrategicHealthGauge score={strategicScore} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Strategies */}
        <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-600" />
                استراتژی‌های فعال
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeStrategies.map((strategy, i) => (
                <div key={strategy.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 shrink-0 ${
                          strategy.priority === 'high'
                            ? 'border-red-200 text-red-600'
                            : 'border-amber-200 text-amber-600'
                        }`}
                      >
                        {strategy.priority === 'high' ? 'اولویت بالا' : 'اولویت متوسط'}
                      </Badge>
                      <span className="text-sm font-medium text-slate-800 truncate">{strategy.name}</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 shrink-0">{strategy.progress}٪</span>
                  </div>
                  <Progress value={strategy.progress} className="h-2" />
                  <p className="text-xs text-slate-500 mt-1">{strategy.owner}</p>
                  {i < activeStrategies.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Risk Radar Chart */}
        <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                نقشه ریسک
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={riskRadarData} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                    <Radar
                      name="سطح ریسک"
                      dataKey="value"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          4. FINANCIAL DASHBOARD
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-emerald-600" />
              داشبورد مالی
            </CardTitle>
            <CardDescription>نمای جامع عملکرد مالی و پیش‌بینی‌ها</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="revenue" dir="rtl" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="revenue">روند درآمد</TabsTrigger>
                <TabsTrigger value="comparison">مقایسه درآمد و هزینه</TabsTrigger>
                <TabsTrigger value="cashflow">پیش‌بینی جریان نقدی</TabsTrigger>
              </TabsList>

              {/* Revenue Trend - AreaChart */}
              <TabsContent value="revenue">
                <div className="h-[320px]" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueTrendData}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        name="درآمد"
                        stroke="#059669"
                        strokeWidth={2.5}
                        fill="url(#revenueGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              {/* Expense vs Revenue - BarChart */}
              <TabsContent value="comparison">
                <div className="h-[320px]" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expenseVsRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="revenue" name="درآمد" fill="#059669" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expense" name="هزینه" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="profit" name="سود" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              {/* Cash Flow Prediction - LineChart with 3 scenarios */}
              <TabsContent value="cashflow">
                <div className="h-[320px]" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={cashFlowPredictionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="optimistic"
                        name="خوش‌بینانه"
                        stroke="#059669"
                        strokeWidth={2.5}
                        strokeDasharray="8 4"
                        dot={{ r: 4, fill: '#059669' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="likely"
                        name="محتمل"
                        stroke="#0d9488"
                        strokeWidth={3}
                        dot={{ r: 5, fill: '#0d9488' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="pessimistic"
                        name="بدبینانه"
                        stroke="#dc2626"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={{ r: 4, fill: '#dc2626' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          5. APPROVAL QUEUE (Phase 2)
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-amber-600" />
                  صف تأیید
                </CardTitle>
                <CardDescription className="mt-1">
                  {pendingApprovals.length} مورد در انتظار بررسی و تأیید
                </CardDescription>
              </div>
              <Badge className="bg-amber-100 text-amber-700 text-sm px-3">
                {pendingApprovals.length} معلق
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeApprovalTab} onValueChange={setActiveApprovalTab} dir="rtl" className="w-full">
              <TabsList className="mb-4 flex-wrap h-auto gap-1">
                <TabsTrigger value="all">همه</TabsTrigger>
                <TabsTrigger value="budget">بودجه</TabsTrigger>
                <TabsTrigger value="strategy">استراتژی</TabsTrigger>
                <TabsTrigger value="contract">قرارداد</TabsTrigger>
                <TabsTrigger value="expense">هزینه</TabsTrigger>
              </TabsList>

              <TabsContent value={activeApprovalTab}>
                <ScrollArea className="max-h-[520px]">
                  <div className="space-y-3">
                    <AnimatePresence>
                      {filteredApprovals.map((item, i) => {
                        const typeConfig = approvalTypeConfig[item.type];
                        const status = approvedItems[item.id];
                        const IconComp = typeConfig.icon;

                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <Card
                              className={`transition-all duration-300 ${
                                status === 'approved'
                                  ? 'border-emerald-300 bg-emerald-50/50'
                                  : status === 'rejected'
                                  ? 'border-red-300 bg-red-50/50'
                                  : 'hover:shadow-md border-slate-200'
                              }`}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${typeConfig.bg}`}>
                                    <IconComp className={`w-5 h-5 ${typeConfig.color}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <h4 className="text-sm font-semibold text-slate-900 truncate">{item.title}</h4>
                                          <Badge variant="outline" className={`text-[10px] shrink-0 ${typeConfig.color} border-current/20`}>
                                            {typeConfig.label}
                                          </Badge>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-2">{item.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                          <span className="flex items-center gap-1">
                                            <UserCheck className="w-3.5 h-3.5" />
                                            {item.requestedBy}
                                          </span>
                                          <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {item.date}
                                          </span>
                                          {item.amount && (
                                            <span className="flex items-center gap-1 font-medium text-slate-700">
                                              <DollarSign className="w-3.5 h-3.5" />
                                              {item.amount}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {status ? (
                                      <div className="mt-3 flex items-center gap-2">
                                        {status === 'approved' ? (
                                          <Badge className="bg-emerald-100 text-emerald-700 gap-1">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            تأیید شد
                                          </Badge>
                                        ) : (
                                          <Badge className="bg-red-100 text-red-700 gap-1">
                                            <X className="w-3.5 h-3.5" />
                                            رد شد
                                          </Badge>
                                        )}
                                        {approvalComments[item.id] && (
                                          <span className="text-xs text-slate-500 truncate max-w-[200px]">
                                            {approvalComments[item.id]}
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="mt-3 space-y-2">
                                        <div className="flex items-center gap-2">
                                          <Input
                                            placeholder="نظر شما (اختیاری)..."
                                            className="h-8 text-xs"
                                            value={approvalComments[item.id] || ''}
                                            onChange={(e) =>
                                              setApprovalComments((prev) => ({
                                                ...prev,
                                                [item.id]: e.target.value,
                                              }))
                                            }
                                          />
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Button
                                            size="sm"
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 h-8"
                                            onClick={() => handleApprove(item.id)}
                                          >
                                            <ThumbsUp className="w-3.5 h-3.5" />
                                            تأیید
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-red-200 text-red-600 hover:bg-red-50 gap-1 h-8"
                                            onClick={() => handleReject(item.id)}
                                          >
                                            <ThumbsDown className="w-3.5 h-3.5" />
                                            رد
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="gap-1 h-8 text-slate-500"
                                            onClick={() =>
                                              setApprovalComments((prev) => ({
                                                ...prev,
                                                [item.id]: prev[item.id] ? '' : 'نیاز به بررسی بیشتر',
                                              }))
                                            }
                                          >
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            یادداشت
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          6. TEAM PERFORMANCE
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div custom={5} variants={cardVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="w-6 h-6 text-teal-600" />
              عملکرد اعضای تیم
            </CardTitle>
            <CardDescription>ارزیابی عملکرد و پیشرفت اعضای کلیدی تیم</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map((member, i) => (
                <motion.div
                  key={member.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Card className="hover:shadow-md transition-shadow border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {member.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900">{member.name}</h4>
                          <p className="text-xs text-slate-500">{member.role}</p>
                        </div>
                        <div className="text-left shrink-0">
                          <div className="flex items-center gap-1">
                            <span className="text-lg font-bold text-slate-900">{member.score}</span>
                            <span className="text-[10px] text-slate-400">/۱۰۰</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Progress
                          value={member.score}
                          className={`h-1.5 ${
                            member.score >= 85
                              ? '[&>div]:bg-emerald-500'
                              : member.score >= 70
                              ? '[&>div]:bg-amber-500'
                              : '[&>div]:bg-orange-500'
                          }`}
                        />
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Activity className="w-3 h-3 text-amber-500" />
                            {member.activeTasks} فعال
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            {member.completedTasks} تکمیل
                          </span>
                        </div>
                        <MiniSparkline
                          data={member.trend}
                          color={member.score >= 85 ? '#059669' : member.score >= 70 ? '#d97706' : '#ea580c'}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          7. AI INSIGHTS PANEL (Phase 2)
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div custom={6} variants={cardVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-600" />
              بینش‌های هوش مصنوعی
            </CardTitle>
            <CardDescription>تحلیل‌های خودکار و پیشنهادات مبتنی بر داده</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {aiInsights.map((insight, i) => {
                const colors = insightColorMap[insight.color];
                const IconComp = insight.icon;
                return (
                  <motion.div
                    key={insight.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Card className={`border ${colors.border} ${colors.bg} h-full`}>
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm`}>
                            <IconComp className={`w-5 h-5 ${colors.icon}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-slate-900">{insight.title}</h4>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Sparkles className="w-3 h-3 text-purple-500" />
                              <span className="text-[10px] text-purple-600 font-medium">تحلیل AI</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 leading-5 mb-4">{insight.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500">سطح اطمینان:</span>
                            <div className="flex items-center gap-1">
                              <Progress value={insight.confidence} className="h-1.5 w-16" />
                              <span className="text-xs font-bold text-slate-700">{insight.confidence}٪</span>
                            </div>
                          </div>
                          <Button size="sm" className={`h-7 text-xs text-white ${colors.btn}`}>
                            <Eye className="w-3 h-3 ms-1" />
                            {insight.actionLabel}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          8. ALERTS & NOTIFICATIONS
      ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Alerts */}
        <motion.div custom={7} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  هشدارهای حیاتی
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs gap-1"
                  onClick={() => setView('notifications')}
                >
                  مشاهده همه
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-72">
                <div className="space-y-2">
                  {criticalAlerts.map((alert) => {
                    const pConfig = priorityConfig[alert.priority];
                    const AlertIcon = alert.icon;
                    return (
                      <div
                        key={alert.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${pConfig.bg}`}>
                          <AlertIcon className={`w-4 h-4 ${pConfig.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm text-slate-800 font-medium truncate">{alert.title}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-[10px] px-1.5 ${pConfig.bg} ${pConfig.text} border ${pConfig.border}`}>
                              {pConfig.label}
                            </Badge>
                            <span className="text-[10px] text-slate-400">{alert.time}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Links */}
        <motion.div custom={8} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-600" />
                دسترسی سریع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {quickLinks.map((link, i) => {
                  const IconComp = link.icon;
                  const hoverClass = quickLinkColorMap[link.color as keyof typeof quickLinkColorMap];
                  return (
                    <motion.div
                      key={link.title}
                      custom={i}
                      variants={scaleVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: i * 0.04 }}
                    >
                      <Button
                        variant="outline"
                        className={`w-full h-auto py-3 flex flex-col items-center gap-1.5 text-xs transition-all duration-200 border-slate-200 ${hoverClass}`}
                        onClick={() => setView(link.view)}
                      >
                        <IconComp className="w-5 h-5" />
                        <span className="truncate w-full text-center">{link.title}</span>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER BANNER
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Card className="bg-gradient-to-l from-slate-800 to-slate-900 border-0 text-white">
          <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-slate-300">پورتال مدیرعامل BCGSP — نسخه ۲.۰</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                ارتباط امن
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                آخرین به‌روزرسانی: همین الان
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
