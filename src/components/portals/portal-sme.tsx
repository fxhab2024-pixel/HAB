'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/lib/store';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Building2,
  Heart,
  Target,
  Map,
  DollarSign,
  ListTodo,
  Brain,
  Headphones,
  Bell,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Lightbulb,
  Send,
  MessageSquare,
  BookOpen,
  AlertTriangle,
  Sparkles,
  X,
  Play,
  ChevronLeft,
  CalendarDays,
  Wallet,
  PieChart,
  Zap,
  Shield,
  BarChart3,
  Phone,
  Video,
  FileQuestion,
  ArrowDownRight,
  Activity,
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
const healthScore = 64;

const dimensionScores = [
  { key: 'business_model', name: 'مدل کسب‌وکار', score: 72, industryAvg: 65, gap: 7 },
  { key: 'market', name: 'بازار', score: 58, industryAvg: 62, gap: -4 },
  { key: 'product', name: 'محصول', score: 81, industryAvg: 68, gap: 13 },
  { key: 'customer', name: 'مشتری', score: 55, industryAvg: 60, gap: -5 },
  { key: 'marketing', name: 'بازاریابی', score: 42, industryAvg: 58, gap: -16 },
  { key: 'sales', name: 'فروش', score: 48, industryAvg: 55, gap: -7 },
  { key: 'operations', name: 'عملیات', score: 70, industryAvg: 64, gap: 6 },
  { key: 'finance', name: 'مالی', score: 62, industryAvg: 60, gap: 2 },
];

const radarData = dimensionScores.map((d) => ({
  dimension: d.name,
  score: d.score,
  industry: d.industryAvg,
  fullMark: 100,
}));

type StrategyStatus = 'suggested' | 'accepted' | 'in_progress' | 'completed';
type StrategyPriority = 'high' | 'medium' | 'low';

interface StrategicRecommendation {
  id: string;
  name: string;
  category: string;
  priority: StrategyPriority;
  impact: number;
  status: StrategyStatus;
  progress: number;
  description: string;
}

const strategicRecommendations: StrategicRecommendation[] = [
  {
    id: 'sr1',
    name: 'توسعه کانال‌های بازاریابی دیجیتال',
    category: 'بازاریابی',
    priority: 'high',
    impact: 92,
    status: 'suggested',
    progress: 0,
    description: 'ورود به بازاریابی محتوایی و شبکه‌های اجتماعی برای افزایش آگاهی از برند و جذب مشتری',
  },
  {
    id: 'sr2',
    name: 'بهینه‌سازی فرآیند فروش',
    category: 'فروش',
    priority: 'high',
    impact: 88,
    status: 'accepted',
    progress: 15,
    description: 'بازطراحی قیف فروش و آموزش تیم فروش برای افزایش نرخ تبدیل',
  },
  {
    id: 'sr3',
    name: 'توسعه محصول جدید',
    category: 'محصول',
    priority: 'medium',
    impact: 75,
    status: 'in_progress',
    progress: 45,
    description: 'طراحی و عرضه خط محصول جدید بر اساس نیازهای شناسایی‌شده بازار',
  },
  {
    id: 'sr4',
    name: 'سیستم مدیریت ارتباط با مشتری',
    category: 'مشتری',
    priority: 'medium',
    impact: 70,
    status: 'in_progress',
    progress: 60,
    description: 'پیاده‌سازی CRM برای بهبود حفظ مشتری و افزایش ارزش طول عمر مشتری',
  },
  {
    id: 'sr5',
    name: 'بهبود حاشیه سود عملیاتی',
    category: 'مالی',
    priority: 'high',
    impact: 85,
    status: 'suggested',
    progress: 0,
    description: 'کاهش هزینه‌های عملیاتی و مذاکره مجدد با تأمین‌کنندگان',
  },
  {
    id: 'sr6',
    name: 'توسعه بازار صادراتی',
    category: 'بازار',
    priority: 'low',
    impact: 60,
    status: 'suggested',
    progress: 0,
    description: 'بررسی فرصت‌های صادرات به کشورهای منطقه و همسایگان',
  },
  {
    id: 'sr7',
    name: 'اتوماسیون فرآیندهای عملیاتی',
    category: 'عملیات',
    priority: 'medium',
    impact: 72,
    status: 'completed',
    progress: 100,
    description: 'پیاده‌سازی سیستم‌های اتوماسیون برای کاهش خطای انسانی و افزایش بهره‌وری',
  },
];

interface RoadmapPhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  progress: number;
  milestones: { name: string; done: boolean }[];
}

const roadmapPhases: RoadmapPhase[] = [
  {
    id: 'rp1',
    name: 'تشخیص و تحلیل',
    startDate: '۱۴۰۴/۰۱/۱۵',
    endDate: '۱۴۰۴/۰۲/۳۰',
    status: 'completed',
    progress: 100,
    milestones: [
      { name: 'تکمیل پرسشنامه', done: true },
      { name: 'تحلیل ابعاد', done: true },
      { name: 'گزارش تشخیص', done: true },
    ],
  },
  {
    id: 'rp2',
    name: 'طراحی استراتژی',
    startDate: '۱۴۰۴/۰۳/۰۱',
    endDate: '۱۴۰۴/۰۴/۱۵',
    status: 'in_progress',
    progress: 55,
    milestones: [
      { name: 'اولویت‌بندی استراتژی‌ها', done: true },
      { name: 'طراحی نقشه راه', done: true },
      { name: 'تخصیص منابع', done: false },
      { name: 'بازبینی نهایی', done: false },
    ],
  },
  {
    id: 'rp3',
    name: 'اجرا و پیاده‌سازی',
    startDate: '۱۴۰۴/۰۴/۱۶',
    endDate: '۱۴۰۴/۰۷/۳۱',
    status: 'upcoming',
    progress: 0,
    milestones: [
      { name: 'شروع پروژه‌های اولویت‌دار', done: false },
      { name: 'نظارت و پایش', done: false },
      { name: 'بازبینی میان‌دوره', done: false },
    ],
  },
  {
    id: 'rp4',
    name: 'ارزیابی و بهبود',
    startDate: '۱۴۰۴/۰۸/۰۱',
    endDate: '۱۴۰۴/۰۹/۳۰',
    status: 'upcoming',
    progress: 0,
    milestones: [
      { name: 'ارزیابی نتایج', done: false },
      { name: 'تنظیم استراتژی', done: false },
      { name: 'برنامه‌ریزی دور بعد', done: false },
    ],
  },
];

const revenueTrendData = [
  { month: 'بهمن', revenue: 380 },
  { month: 'اسفند', revenue: 410 },
  { month: 'فروردین', revenue: 450 },
  { month: 'اردیبهشت', revenue: 485 },
  { month: 'خرداد', revenue: 520 },
  { month: 'تیر', revenue: 560 },
];

const financialMetrics = [
  { label: 'درآمد ماهانه', value: '۵۶۰ میلیون', change: '+۷.۷٪', trend: 'up' as const, icon: DollarSign },
  { label: 'هزینه‌های عملیاتی', value: '۳۸۰ میلیون', change: '+۳.۲٪', trend: 'up' as const, icon: BarChart3 },
  { label: 'حاشیه سود', value: '۳۲٪', change: '+۲.۱٪', trend: 'up' as const, icon: TrendingUp },
  { label: 'جریان نقدی خالص', value: '۱۸۰ میلیون', change: '+۱۲٪', trend: 'up' as const, icon: Wallet },
];

const budgetItems = [
  { name: 'بودجه بازاریابی', allocated: 200, spent: 120, color: '#059669' },
  { name: 'بودجه تحقیق و توسعه', allocated: 150, spent: 90, color: '#0d9488' },
  { name: 'بودجه عملیاتی', allocated: 300, spent: 245, color: '#d97706' },
  { name: 'بودجه آموزش', allocated: 80, spent: 55, color: '#7c3aed' },
];

const cashFlowStatus = {
  status: 'positive' as const,
  label: 'مثبت',
  description: 'جریان نقدی عملیاتی مثبت و رو به رشد',
  daysRunway: 45,
};

interface TaskItem {
  id: string;
  title: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'todo' | 'in_progress' | 'done';
  category: string;
}

const activeTasks: TaskItem[] = [
  { id: 'at1', title: 'تکمیل پرسشنامه تشخیص فاز ۲', priority: 'critical', dueDate: '۱۴۰۴/۰۳/۲۵', status: 'in_progress', category: 'تشخیص' },
  { id: 'at2', title: 'جلسه بررسی استراتژی‌های پیشنهادی', priority: 'high', dueDate: '۱۴۰۴/۰۳/۲۸', status: 'todo', category: 'استراتژی' },
  { id: 'at3', title: 'بررسی گزارش مالی ماهانه', priority: 'high', dueDate: '۱۴۰۴/۰۴/۰۱', status: 'todo', category: 'مالی' },
  { id: 'at4', title: 'به‌روزرسانی پروفایل شرکت', priority: 'medium', dueDate: '۱۴۰۴/۰۴/۰۵', status: 'todo', category: 'عمومی' },
  { id: 'at5', title: 'ارائه بازخورد به مشاور استراتژیک', priority: 'medium', dueDate: '۱۴۰۴/۰۴/۰۸', status: 'in_progress', category: 'استراتژی' },
  { id: 'at6', title: 'بررسی و تأیید نقشه راه', priority: 'high', dueDate: '۱۴۰۴/۰۴/۱۰', status: 'todo', category: 'نقشه راه' },
];

const upcomingMilestones = [
  { name: 'تکمیل فاز طراحی استراتژی', date: '۱۴۰۴/۰۴/۱۵', daysLeft: 18 },
  { name: 'شروع فاز اجرا', date: '۱۴۰۴/۰۴/۱۶', daysLeft: 19 },
  { name: 'بازبینی میان‌دوره مالی', date: '۱۴۰۴/۰۴/۳۰', daysLeft: 33 },
];

const suggestedAiQuestions = [
  'چگونه می‌توانم نرخ تبدیل مشتری را افزایش دهم؟',
  'بهترین استراتژی ورود به بازار جدید چیست؟',
  'چگونه هزینه‌های عملیاتی را کاهش دهم؟',
  'اولویت‌بندی استراتژی‌ها چگونه انجام شود؟',
];

const recentAiConversations = [
  { id: 'rc1', title: 'تحلیل بازار رقابتی', date: '۱۴۰۴/۰۳/۱۸', messages: 8 },
  { id: 'rc2', title: 'بهبود فرآیند فروش', date: '۱۴۰۴/۰۳/۱۵', messages: 12 },
  { id: 'rc3', title: 'استراتژی قیمت‌گذاری', date: '۱۴۰۴/۰۳/۱۰', messages: 6 },
];

const faqItems = [
  { q: 'چگونه پرسشنامه تشخیص را شروع کنم؟', a: 'از منوی تشخیص استراتژیک، روی "شروع تشخیص" کلیک کنید و پرسشنامه را مرحله به مرحله تکمیل نمایید.' },
  { q: 'نتایج تشخیص چقدر طول می‌کشد؟', a: 'پس از تکمیل پرسشنامه، نتایج بلافاصله تولید و نمایش داده می‌شود.' },
  { q: 'آیا می‌توانم استراتژی‌های پیشنهادی را رد کنم؟', a: 'بله، هر استراتژی پیشنهادی را می‌توانید بپذیرید، رد کنید یا برای بررسی بیشتر نگه دارید.' },
  { q: 'چگونه با مشاور استراتژیک تماس بگیرم؟', a: 'از بخش مشاوره آنلاین یا ثبت تیکت پشتیبانی استفاده کنید.' },
  { q: 'نقشه راه چگونه به‌روز می‌شود؟', a: 'نقشه راه بر اساس پیشرفت واقعی پروژه‌ها و وظایف به‌طور خودکار به‌روزرسانی می‌شود.' },
];

const tutorialVideos = [
  { id: 'tv1', title: 'آموزش تکمیل پرسشنامه تشخیص', duration: '۱۲ دقیقه', category: 'تشخیص' },
  { id: 'tv2', title: 'نحوه استفاده از داشبورد', duration: '۸ دقیقه', category: 'داشبورد' },
  { id: 'tv3', title: 'مدیریت استراتژی‌ها', duration: '۱۰ دقیقه', category: 'استراتژی' },
  { id: 'tv4', title: 'گزارش‌گیری و تحلیل', duration: '۱۵ دقیقه', category: 'گزارش' },
];

interface NotificationItem {
  id: string;
  type: 'strategy' | 'financial' | 'task' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  priority: 'info' | 'warning' | 'success' | 'error';
}

const notifications: NotificationItem[] = [
  { id: 'n1', type: 'strategy', title: 'استراتژی جدید پیشنهاد شده', message: 'استراتژی "توسعه بازار صادراتی" بر اساس تحلیل بازار به شما پیشنهاد شده است.', time: '۱۰ دقیقه پیش', isRead: false, priority: 'info' },
  { id: 'n2', type: 'financial', title: 'هشدار بودجه', message: 'بودجه عملیاتی به ۸۱٪ رسیده است. لطفاً برنامه‌ریزی مجدد انجام دهید.', time: '۲ ساعت پیش', isRead: false, priority: 'warning' },
  { id: 'n3', type: 'task', title: 'سررسید نزدیک وظیفه', message: 'وظیفه "تکمیل پرسشنامه تشخیص فاز ۲" تا ۳ روز دیگر سررسید دارد.', time: '۳ ساعت پیش', isRead: false, priority: 'warning' },
  { id: 'n4', type: 'strategy', title: 'پیشرفت استراتژی', message: 'استراتژی "توسعه محصول جدید" به ۴۵٪ پیشرفت رسیده است.', time: 'دیروز', isRead: true, priority: 'success' },
  { id: 'n5', type: 'system', title: 'به‌روزرسانی سیستم', message: 'نسخه جدید داشبورد با قابلیت‌های بیشتر در دسترس است.', time: '۲ روز پیش', isRead: true, priority: 'info' },
  { id: 'n6', type: 'financial', title: 'گزارش مالی آماده', message: 'گزارش مالی ماهانه خرداد آماده بررسی است.', time: '۳ روز پیش', isRead: true, priority: 'success' },
];

// ─── Config Maps ───────────────────────────────────────────────────
const strategyPriorityConfig: Record<StrategyPriority, { label: string; color: string; icon: typeof AlertTriangle }> = {
  high: { label: 'اولویت بالا', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle },
  medium: { label: 'اولویت متوسط', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
  low: { label: 'اولویت پایین', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: CheckCircle2 },
};

const strategyStatusConfig: Record<StrategyStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  suggested: { label: 'پیشنهادی', color: 'bg-blue-100 text-blue-700', icon: Lightbulb },
  accepted: { label: 'پذیرفته‌شده', color: 'bg-teal-100 text-teal-700', icon: CheckCircle2 },
  in_progress: { label: 'در حال اجرا', color: 'bg-emerald-100 text-emerald-700', icon: Activity },
  completed: { label: 'تکمیل‌شده', color: 'bg-slate-100 text-slate-600', icon: CheckCircle2 },
};

const taskPriorityConfig: Record<string, { label: string; dotColor: string }> = {
  critical: { label: 'بحرانی', dotColor: 'bg-red-500' },
  high: { label: 'بالا', dotColor: 'bg-orange-500' },
  medium: { label: 'متوسط', dotColor: 'bg-amber-500' },
  low: { label: 'پایین', dotColor: 'bg-slate-400' },
};

const notificationTypeConfig: Record<string, { icon: typeof Bell; color: string }> = {
  strategy: { icon: Target, color: 'text-emerald-600 bg-emerald-50' },
  financial: { icon: DollarSign, color: 'text-amber-600 bg-amber-50' },
  task: { icon: ListTodo, color: 'text-orange-600 bg-orange-50' },
  system: { icon: Bell, color: 'text-slate-600 bg-slate-50' },
};

const notificationPriorityStyle: Record<string, string> = {
  info: 'border-s-4 border-s-blue-400',
  warning: 'border-s-4 border-s-amber-400',
  success: 'border-s-4 border-s-emerald-400',
  error: 'border-s-4 border-s-red-400',
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

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// ─── Health Gauge SVG Component ────────────────────────────────────
function HealthScoreGauge({ score }: { score: number }) {
  const radius = 70;
  const strokeWidth = 14;
  const center = 90;
  const startAngle = Math.PI;
  const endAngle = 0;
  const totalArc = startAngle - endAngle;
  const progressAngle = startAngle - (score / 100) * totalArc;

  const x1 = center + radius * Math.cos(startAngle);
  const y1 = center + radius * Math.sin(startAngle);
  const x2 = center + radius * Math.cos(endAngle);
  const y2 = center + radius * Math.sin(endAngle);
  const xp = center + radius * Math.cos(progressAngle);
  const yp = center + radius * Math.sin(progressAngle);

  const largeArc = score > 50 ? 1 : 0;

  const getColor = (s: number) => {
    if (s >= 80) return '#059669';
    if (s >= 65) return '#0d9488';
    if (s >= 50) return '#d97706';
    return '#dc2626';
  };

  const getLabel = (s: number) => {
    if (s >= 80) return 'عالی';
    if (s >= 65) return 'مطلوب';
    if (s >= 50) return 'متوسط';
    return 'نیاز به توجه';
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="105" viewBox="0 0 180 110" dir="ltr">
        {/* Background arc */}
        <path
          d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 0 ${x2} ${y2}`}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 0 ${xp} ${yp}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />
        {/* Score text */}
        <text x={center} y={center - 10} textAnchor="middle" fontSize="32" fontWeight="bold" fill={color}>
          {score}
        </text>
        <text x={center} y={center + 10} textAnchor="middle" fontSize="11" fill="#94a3b8">
          از ۱۰۰
        </text>
      </svg>
      <Badge
        className={`mt-2 text-xs ${
          score >= 80
            ? 'bg-emerald-100 text-emerald-700'
            : score >= 65
            ? 'bg-teal-100 text-teal-700'
            : score >= 50
            ? 'bg-amber-100 text-amber-700'
            : 'bg-red-100 text-red-700'
        }`}
      >
        {getLabel(score)}
      </Badge>
    </div>
  );
}

// ─── Custom Tooltip ────────────────────────────────────────────────
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
export default function PortalSme() {
  const { user, setView } = useAppStore();
  const [recommendations, setRecommendations] = useState<StrategicRecommendation[]>(strategicRecommendations);
  const [tasks, setTasks] = useState<TaskItem[]>(activeTasks);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'سلام! من مشاور هوشمند شما هستم. چگونه می‌توانم به رشد کسب‌وکار شما کمک کنم؟' },
  ]);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [notifReadState, setNotifReadState] = useState<Record<string, boolean>>({});

  const businessName = user?.companyName || 'فناوری نوین پارسیان';
  const persianDate = getPersianDate();
  const subscriptionPlan = 'حرفه‌ای';
  const unreadNotifs = notifications.filter((n) => !n.isRead && !notifReadState[n.id]).length;

  // Strategy handlers
  const handleStrategyAction = (id: string, action: 'accept' | 'reject' | 'start') => {
    setRecommendations((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        if (action === 'accept') return { ...s, status: 'accepted' as StrategyStatus };
        if (action === 'reject') return { ...s, status: 'suggested' as StrategyStatus }; // Revert - no reject field, just keep
        if (action === 'start') return { ...s, status: 'in_progress' as StrategyStatus, progress: 5 };
        return s;
      })
    );
  };

  // Task handlers
  const handleTaskComplete = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'done' as const } : t)));
  };

  // AI chat handler
  const handleAiSend = () => {
    if (!aiMessage.trim()) return;
    const userMsg = aiMessage.trim();
    setAiMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setAiMessage('');
    setTimeout(() => {
      setAiMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'بر اساس تحلیل وضعیت کسب‌وکار شما، پیشنهاد می‌کنم ابتدا روی بهبود فرآیندهای بازاریابی تمرکز کنید. این بخش با ۴۲ امتیاز، کمترین نمره را در تشخیص داشته و پتانسیل بالایی برای بهبود دارد.',
        },
      ]);
    }, 1200);
  };

  // Ticket handler
  const handleTicketSubmit = () => {
    if (ticketSubject.trim() && ticketDescription.trim()) {
      setTicketSubmitted(true);
      setTimeout(() => {
        setTicketSubmitted(false);
        setTicketSubject('');
        setTicketDescription('');
      }, 3000);
    }
  };

  // Notification read handler
  const handleNotifRead = (id: string) => {
    setNotifReadState((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="space-y-6 pb-8" dir="rtl">
      {/* ═══════════════════════════════════════════════════════════════
          1. HEADER SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="bg-gradient-to-l from-emerald-900 via-emerald-800 to-teal-900 border-0 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-8 w-32 h-32 rounded-full bg-teal-400 blur-3xl" />
            <div className="absolute bottom-0 right-16 w-48 h-48 rounded-full bg-emerald-400 blur-3xl" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">پورتال کسب‌وکار</h1>
                  <p className="text-emerald-200 mt-0.5">
                    خوش آمدید، {businessName}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge className="bg-emerald-400/20 text-emerald-100 border-emerald-400/30 text-xs">
                      <Zap className="w-3 h-3 ms-1" />
                      طرح {subscriptionPlan}
                    </Badge>
                    <span className="text-xs text-emerald-300 flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {persianDate}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/15 hover:bg-white/25 text-white border-white/20 backdrop-blur-sm gap-2"
                  onClick={() => setView('diagnostic')}
                >
                  <Target className="w-4 h-4" />
                  شروع تشخیص
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/15 hover:bg-white/25 text-white border-white/20 backdrop-blur-sm gap-2"
                  onClick={() => setView('advisor')}
                >
                  <MessageSquare className="w-4 h-4" />
                  مشاوره آنلاین
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-teal-500/90 hover:bg-teal-500 text-white border-0 backdrop-blur-sm gap-2"
                  onClick={() => setView('reports')}
                >
                  <BarChart3 className="w-4 h-4" />
                  گزارش عملکرد
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          2. BUSINESS HEALTH DASHBOARD
      ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Health Score Gauge */}
        <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-600" />
                سلامت کسب‌وکار
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-4">
              <HealthScoreGauge score={healthScore} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Radar Chart */}
        <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-600" />
                نمای ابعاد استراتژیک
              </CardTitle>
              <CardDescription>مقایسه امتیاز شما با میانگین صنعت</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 9, fill: '#64748b' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 8 }} />
                    <Radar name="امتیاز شما" dataKey="score" stroke="#059669" fill="#059669" fillOpacity={0.2} strokeWidth={2} />
                    <Radar name="میانگین صنعت" dataKey="industry" stroke="#d97706" fill="#d97706" fillOpacity={0.08} strokeWidth={1.5} strokeDasharray="5 5" />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dimension Scores List */}
        <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible" className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                امتیاز ابعاد
              </CardTitle>
              <CardDescription>امتیاز شما نسبت به میانگین صنعت</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-72">
                <div className="space-y-3">
                  {dimensionScores.map((dim) => {
                    const isAbove = dim.score >= dim.industryAvg;
                    return (
                      <div key={dim.key} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-800">{dim.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold" style={{ color: dim.score >= 65 ? '#059669' : dim.score >= 50 ? '#d97706' : '#dc2626' }}>
                              {dim.score}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 ${
                                isAbove
                                  ? 'border-emerald-200 text-emerald-600'
                                  : 'border-red-200 text-red-600'
                              }`}
                            >
                              {isAbove ? (
                                <ArrowUpRight className="w-3 h-3 ms-0.5" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3 ms-0.5" />
                              )}
                              {Math.abs(dim.gap)}
                            </Badge>
                          </div>
                        </div>
                        <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          {/* Industry avg indicator */}
                          <div
                            className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
                            style={{ right: `${100 - dim.industryAvg}%` }}
                          />
                          {/* Score bar */}
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${dim.score}%`,
                              backgroundColor: dim.score >= 65 ? '#059669' : dim.score >= 50 ? '#d97706' : '#dc2626',
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>میانگین صنعت: {dim.industryAvg}</span>
                          <span>شکاف: {dim.gap > 0 ? '+' : ''}{dim.gap}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          3. STRATEGIC RECOMMENDATIONS (Phase 2)
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                  توصیه‌های استراتژیک
                </CardTitle>
                <CardDescription className="mt-1">استراتژی‌های پیشنهادی بر اساس تحلیل هوشمند کسب‌وکار شما</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setView('strategy')}>
                مشاهده همه
                <ChevronLeft className="w-4 h-4 ms-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[480px]">
              <div className="space-y-3">
                <AnimatePresence>
                  {recommendations.map((rec, i) => {
                    const statusConfig = strategyStatusConfig[rec.status];
                    const priorityConfig = strategyPriorityConfig[rec.priority];
                    return (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Card className="hover:shadow-md transition-all duration-300 border-slate-200">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                rec.status === 'in_progress' ? 'bg-emerald-50' : rec.status === 'completed' ? 'bg-slate-50' : rec.status === 'accepted' ? 'bg-teal-50' : 'bg-amber-50'
                              }`}>
                                <statusConfig.icon className={`w-5 h-5 ${
                                  rec.status === 'in_progress' ? 'text-emerald-600' : rec.status === 'completed' ? 'text-slate-500' : rec.status === 'accepted' ? 'text-teal-600' : 'text-amber-600'
                                }`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <div className="min-w-0">
                                    <h4 className="text-sm font-semibold text-slate-900">{rec.name}</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">{rec.description}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                  <Badge variant="outline" className={`text-[10px] ${priorityConfig.color}`}>
                                    {priorityConfig.label}
                                  </Badge>
                                  <Badge className={`text-[10px] ${statusConfig.color}`}>
                                    {statusConfig.label}
                                  </Badge>
                                  <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-600">
                                    {rec.category}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                    <TrendingUp className="w-3 h-3" />
                                    تأثیر: {rec.impact}٪
                                  </div>
                                </div>
                                {rec.progress > 0 && (
                                  <div className="mt-2">
                                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                                      <span>پیشرفت</span>
                                      <span>{rec.progress}٪</span>
                                    </div>
                                    <Progress value={rec.progress} className="h-1.5" />
                                  </div>
                                )}
                                {/* Action buttons */}
                                <div className="flex items-center gap-2 mt-3">
                                  {rec.status === 'suggested' && (
                                    <>
                                      <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => handleStrategyAction(rec.id, 'accept')}>
                                        <CheckCircle2 className="w-3.5 h-3.5 ms-1" />
                                        بپذیر
                                      </Button>
                                      <Button size="sm" variant="outline" className="h-7 text-xs border-red-200 text-red-600 hover:bg-red-50">
                                        <X className="w-3.5 h-3.5 ms-1" />
                                        رد کن
                                      </Button>
                                    </>
                                  )}
                                  {rec.status === 'accepted' && (
                                    <Button size="sm" className="h-7 text-xs bg-teal-600 hover:bg-teal-700" onClick={() => handleStrategyAction(rec.id, 'start')}>
                                      <Play className="w-3.5 h-3.5 ms-1" />
                                      شروع اجرا
                                    </Button>
                                  )}
                                  {rec.status === 'in_progress' && (
                                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setView('execution')}>
                                      مشاهده جزئیات
                                      <ChevronLeft className="w-3.5 h-3.5 ms-1" />
                                    </Button>
                                  )}
                                </div>
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
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          4. ROADMAP PROGRESS (Phase 2)
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Map className="w-6 h-6 text-emerald-600" />
                  پیشرفت نقشه راه
                </CardTitle>
                <CardDescription className="mt-1">مراحل اجرای استراتژی و وضعیت هر فاز</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setView('roadmap')}>
                مشاهده کامل
                <ChevronLeft className="w-4 h-4 ms-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute top-6 right-6 left-6 h-0.5 bg-slate-200 hidden md:block" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {roadmapPhases.map((phase) => {
                  const isCurrent = phase.status === 'in_progress';
                  return (
                    <motion.div key={phase.id} variants={fadeInUp} initial="hidden" animate="visible" className="relative">
                      <Card className={`h-full transition-all duration-300 ${
                        isCurrent
                          ? 'border-emerald-300 bg-emerald-50/50 shadow-md ring-1 ring-emerald-200'
                          : phase.status === 'completed'
                          ? 'border-slate-200 bg-slate-50/50'
                          : 'border-slate-200'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                              phase.status === 'completed'
                                ? 'bg-emerald-500'
                                : isCurrent
                                ? 'bg-teal-500 animate-pulse'
                                : 'bg-slate-300'
                            }`}>
                              {phase.status === 'completed' ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                phase.id.replace('rp', '')
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-semibold text-slate-900 truncate">{phase.name}</h4>
                              {isCurrent && (
                                <Badge className="bg-emerald-100 text-emerald-700 text-[10px] mt-0.5">فاز فعلی</Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-slate-500 mb-2">
                            <span>{phase.startDate}</span>
                            <span className="mx-1">تا</span>
                            <span>{phase.endDate}</span>
                          </div>
                          <div className="mb-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-500">پیشرفت</span>
                              <span className="font-medium text-slate-700">{phase.progress}٪</span>
                            </div>
                            <Progress value={phase.progress} className="h-1.5" />
                          </div>
                          <div className="space-y-1">
                            {phase.milestones.map((ms, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-xs">
                                {ms.done ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                ) : (
                                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                )}
                                <span className={ms.done ? 'text-slate-700' : 'text-slate-400'}>{ms.name}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          5. FINANCIAL SUMMARY
      ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart + Key Metrics */}
        <motion.div custom={5} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                خلاصه مالی
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Revenue Trend Mini Chart */}
              <div className="h-[180px]" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrendData}>
                    <defs>
                      <linearGradient id="smeRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" name="درآمد" stroke="#059669" strokeWidth={2} fill="url(#smeRevenueGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <Separator />
              {/* Key Financial Metrics */}
              <div className="grid grid-cols-2 gap-3">
                {financialMetrics.map((metric) => (
                  <div key={metric.label} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <metric.icon className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs text-slate-500">{metric.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-slate-900">{metric.value}</p>
                      <Badge
                        className={`text-[10px] ${
                          metric.trend === 'up'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 text-red-600 border-red-200'
                        }`}
                        variant="outline"
                      >
                        {metric.trend === 'up' ? (
                          <ArrowUpRight className="w-3 h-3 ms-0.5" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 ms-0.5" />
                        )}
                        {metric.change}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Budget Utilization + Cash Flow */}
        <motion.div custom={6} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="w-5 h-5 text-teal-600" />
                بودجه و جریان نقدی
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Budget Utilization */}
              <div className="space-y-3">
                {budgetItems.map((budget) => {
                  const pct = Math.round((budget.spent / budget.allocated) * 100);
                  return (
                    <div key={budget.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-slate-700">{budget.name}</span>
                        <span className="text-xs text-slate-500">
                          {budget.spent} / {budget.allocated} میلیون
                          <span className={`ms-1 font-medium ${pct > 80 ? 'text-red-600' : 'text-slate-600'}`}>
                            ({pct}٪)
                          </span>
                        </span>
                      </div>
                      <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: pct > 80 ? '#dc2626' : budget.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <Separator />
              {/* Cash Flow Status */}
              <div className={`p-4 rounded-xl border ${
                cashFlowStatus.status === 'positive'
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    cashFlowStatus.status === 'positive' ? 'bg-emerald-100' : 'bg-red-100'
                  }`}>
                    {cashFlowStatus.status === 'positive' ? (
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900">وضعیت جریان نقدی</h4>
                      <Badge className={`text-[10px] ${
                        cashFlowStatus.status === 'positive'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {cashFlowStatus.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{cashFlowStatus.description}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      <Shield className="w-3 h-3 inline ms-1" />
                      حداقل {cashFlowStatus.daysRunway} روز پوشش هزینه
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          6. TASKS & ACTIONS
      ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Tasks */}
        <motion.div custom={7} variants={cardVariants} initial="hidden" animate="visible" className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-amber-600" />
                  وظایف فعال
                </CardTitle>
                <Badge className="bg-amber-100 text-amber-700 text-xs">
                  {tasks.filter((t) => t.status !== 'done').length} فعال
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-80">
                <div className="space-y-2">
                  {tasks.map((task) => {
                    const isDone = task.status === 'done';
                    const prioConfig = taskPriorityConfig[task.priority];
                    return (
                      <div
                        key={task.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          isDone
                            ? 'bg-slate-50 border-slate-100 opacity-60'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <button
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            isDone
                              ? 'bg-emerald-500 border-emerald-500'
                              : 'border-slate-300 hover:border-emerald-400'
                          }`}
                          onClick={() => handleTaskComplete(task.id)}
                          aria-label={isDone ? 'انجام‌شده' : 'علامت‌گذاری به‌عنوان انجام‌شده'}
                        >
                          {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${prioConfig.dotColor}`} />
                            <span className="text-[10px] text-slate-500">{prioConfig.label}</span>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {task.dueDate}
                            </span>
                            <Badge variant="outline" className="text-[10px] px-1 py-0 border-slate-200 text-slate-500">
                              {task.category}
                            </Badge>
                          </div>
                        </div>
                        {!isDone && task.status === 'in_progress' && (
                          <Badge className="bg-emerald-50 text-emerald-700 text-[10px] shrink-0">در حال انجام</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Milestones */}
        <motion.div custom={8} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-teal-600" />
                نقاط عطف پیش‌رو
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMilestones.map((ms) => (
                  <div key={ms.name} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                      <Target className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{ms.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{ms.date}</p>
                      <Badge variant="outline" className={`text-[10px] mt-1 ${
                        ms.daysLeft <= 7
                          ? 'border-red-200 text-red-600'
                          : ms.daysLeft <= 14
                          ? 'border-amber-200 text-amber-600'
                          : 'border-emerald-200 text-emerald-600'
                      }`}>
                        {ms.daysLeft} روز مانده
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          7. AI ADVISOR QUICK ACCESS (Phase 2)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Chat Interface */}
        <motion.div custom={9} variants={cardVariants} initial="hidden" animate="visible" className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 border-emerald-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="w-5 h-5 text-emerald-600" />
                مشاور هوشمند AI
              </CardTitle>
              <CardDescription>سؤالات استراتژیک خود را بپرسید و پاسخ هوشمند دریافت کنید</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Chat Messages */}
                <div className="bg-white rounded-xl border border-emerald-100 p-3 h-[180px] overflow-y-auto space-y-2">
                  {aiMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                        msg.role === 'user'
                          ? 'bg-emerald-100 text-slate-800 rounded-br-sm'
                          : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Input */}
                <div className="flex items-center gap-2">
                  <Input
                    value={aiMessage}
                    onChange={(e) => setAiMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAiSend()}
                    placeholder="سؤال خود را بنویسید..."
                    className="flex-1 border-emerald-200 focus:border-emerald-400"
                  />
                  <Button size="icon" className="bg-emerald-600 hover:bg-emerald-700 shrink-0" onClick={handleAiSend}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                {/* Suggested Questions */}
                <div>
                  <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" />
                    پرسش‌های پیشنهادی
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedAiQuestions.map((q) => (
                      <button
                        key={q}
                        className="text-xs px-2.5 py-1 rounded-full border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        onClick={() => {
                          setAiMessage(q);
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent AI Conversations */}
        <motion.div custom={10} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-600" />
                گفتگوهای اخیر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAiConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => setView('advisor')}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-slate-800">{conv.title}</h4>
                      <ChevronLeft className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <CalendarDays className="w-3 h-3" />
                      <span>{conv.date}</span>
                      <span className="text-slate-300">•</span>
                      <MessageSquare className="w-3 h-3" />
                      <span>{conv.messages} پیام</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => setView('advisor')}>
                <Brain className="w-4 h-4 ms-1.5" />
                رفتن به مشاور AI
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          8. SUPPORT & RESOURCES
      ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Support Ticket */}
        <motion.div custom={11} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Headphones className="w-5 h-5 text-amber-600" />
                پشتیبانی
              </CardTitle>
              <CardDescription>ثبت تیکت پشتیبانی برای دریافت کمک</CardDescription>
            </CardHeader>
            <CardContent>
              {ticketSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-4"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">تیکت ثبت شد</h4>
                  <p className="text-xs text-slate-500 mt-1">کارشناسان ما در اسرع وقت پاسخ خواهند داد</p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <Input
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="موضوع تیکت"
                    className="border-slate-200"
                  />
                  <textarea
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    placeholder="توضیحات مشکل خود را بنویسید..."
                    className="w-full h-20 px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                  />
                  <Button className="w-full bg-amber-600 hover:bg-amber-700" onClick={handleTicketSubmit}>
                    <Phone className="w-4 h-4 ms-1.5" />
                    ثبت تیکت
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Knowledge Base & Tutorials */}
        <motion.div custom={12} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                منابع آموزشی
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Tutorial Videos */}
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    ویدیوهای آموزشی
                  </p>
                  <div className="space-y-2">
                    {tutorialVideos.map((vid) => (
                      <div
                        key={vid.id}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => setView('knowledge')}
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                          <Play className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-slate-800 truncate">{vid.title}</p>
                          <p className="text-[10px] text-slate-400">{vid.duration} • {vid.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                {/* Quick Knowledge Link */}
                <Button variant="outline" className="w-full" onClick={() => setView('knowledge')}>
                  <BookOpen className="w-4 h-4 ms-1.5" />
                  پایگاه دانش
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ */}
        <motion.div custom={13} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-teal-600" />
                سؤالات متداول
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-72">
                <div className="space-y-2">
                  {faqItems.map((faq) => (
                    <div
                      key={faq.q}
                      className="border rounded-lg overflow-hidden"
                    >
                      <button
                        className="w-full flex items-center justify-between p-3 text-right hover:bg-slate-50 transition-colors"
                        onClick={() => setExpandedFaq(expandedFaq === faq.q ? null : faq.q)}
                      >
                        <span className="text-sm font-medium text-slate-800">{faq.q}</span>
                        <ChevronLeft className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${expandedFaq === faq.q ? '-rotate-90' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {expandedFaq === faq.q && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-3 text-xs text-slate-600 leading-relaxed">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          9. NOTIFICATIONS & ALERTS
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div custom={14} variants={cardVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Bell className="w-6 h-6 text-orange-600" />
                  اعلان‌ها و هشدارها
                </CardTitle>
                <CardDescription className="mt-1">اطلاع‌رسانی مهم مربوط به کسب‌وکار شما</CardDescription>
              </div>
              {unreadNotifs > 0 && (
                <Badge className="bg-red-100 text-red-700 text-xs">
                  {unreadNotifs} خوانده‌نشده
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[380px]">
              <div className="space-y-2">
                {notifications.map((notif) => {
                  const typeConfig = notificationTypeConfig[notif.type];
                  const isRead = notif.isRead || notifReadState[notif.id];
                  const IconComp = typeConfig.icon;
                  return (
                    <div
                      key={notif.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-slate-50 ${
                        notificationPriorityStyle[notif.priority]
                      } ${isRead ? 'opacity-60' : ''}`}
                      onClick={() => handleNotifRead(notif.id)}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${typeConfig.color}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-semibold text-slate-900 truncate">{notif.title}</h4>
                          <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={`text-[10px] ${
                            notif.priority === 'warning'
                              ? 'border-amber-200 text-amber-600'
                              : notif.priority === 'success'
                              ? 'border-emerald-200 text-emerald-600'
                              : notif.priority === 'error'
                              ? 'border-red-200 text-red-600'
                              : 'border-blue-200 text-blue-600'
                          }`}>
                            {notif.priority === 'warning' ? 'هشدار' : notif.priority === 'success' ? 'موفق' : notif.priority === 'error' ? 'خطا' : 'اطلاع'}
                          </Badge>
                          {!isRead && (
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <Button variant="outline" className="w-full mt-3" onClick={() => setView('notifications')}>
              مشاهده همه اعلان‌ها
              <ChevronLeft className="w-4 h-4 ms-1" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          FLOATING AI BUTTON
      ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {!aiChatOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center hover:shadow-xl transition-shadow"
            onClick={() => setAiChatOpen(true)}
            aria-label="پرسش از AI"
          >
            <Sparkles className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════
          FLOATING AI CHAT PANEL
      ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {aiChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-emerald-200 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-l from-emerald-600 to-teal-600 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Brain className="w-5 h-5" />
                <span className="text-sm font-bold">مشاور AI</span>
              </div>
              <button
                onClick={() => setAiChatOpen(false)}
                className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                aria-label="بستن"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Chat Body */}
            <div className="h-64 overflow-y-auto p-3 space-y-2 bg-slate-50">
              {aiMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-100 text-slate-800 rounded-br-sm'
                      : 'bg-white text-slate-800 rounded-bl-sm shadow-sm border border-slate-100'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            {/* Chat Input */}
            <div className="p-3 border-t border-slate-100 bg-white">
              <div className="flex items-center gap-2">
                <Input
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiSend()}
                  placeholder="سؤالتان را بپرسید..."
                  className="flex-1 text-xs border-slate-200 focus:border-emerald-400 h-8"
                />
                <Button size="icon" className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700 shrink-0" onClick={handleAiSend}>
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
              {/* Quick suggestions */}
              <div className="flex gap-1 mt-2 overflow-x-auto">
                {suggestedAiQuestions.slice(0, 2).map((q) => (
                  <button
                    key={q}
                    className="text-[10px] px-2 py-1 rounded-full border border-emerald-200 text-emerald-700 hover:bg-emerald-50 whitespace-nowrap transition-colors"
                    onClick={() => setAiMessage(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
