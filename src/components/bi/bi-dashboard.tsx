'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,

  Minus,
  BarChart2,
  Target,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,

  AlertTriangle,
  CheckCircle2,
  Brain,
  RefreshCw,
  Download,
  Sparkles,
  Eye,
  Shield,
  Lightbulb,
  Clock,
  Gauge,

  CircleDot,
  Flame,
  Waves,
  ArrowRight,
  Info,
} from 'lucide-react';

// ─── Persian Helpers ────────────────────────────────────────────────
const toPersianNum = (n: number | string): string =>
  String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);

const persianMonths = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
];

// ─── Time Range Types ───────────────────────────────────────────────
type TimeRange = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

const timeRangeLabels: Record<TimeRange, string> = {
  daily: 'روزانه',
  weekly: 'هفتگی',
  monthly: 'ماهانه',
  quarterly: 'فصلی',
  yearly: 'سالانه',
};

// ─── Mock KPI Data ──────────────────────────────────────────────────
interface KPI {
  title: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  colorKey: string;
  target: number;
  sparkline: number[];
}

const kpiData: KPI[] = [
  {
    title: 'درآمد کل',
    value: 4.7,
    unit: 'میلیارد تومان',
    change: 12.5,
    trend: 'up',
    icon: DollarSign,
    colorKey: 'emerald',
    target: 5.2,
    sparkline: [2.8, 3.1, 3.4, 3.6, 3.9, 4.2, 4.5, 4.7],
  },
  {
    title: 'نرخ تبدیل',
    value: 24.5,
    unit: 'درصد',
    change: 3.2,
    trend: 'up',
    icon: Target,
    colorKey: 'teal',
    target: 28,
    sparkline: [18, 20, 19, 22, 21, 24, 24.5],
  },
  {
    title: 'CAC',
    value: 1.8,
    unit: 'میلیون تومان',
    change: -8.3,
    trend: 'down',
    icon: Users,
    colorKey: 'orange',
    target: 1.5,
    sparkline: [2.5, 2.3, 2.1, 2.0, 1.9, 1.85, 1.8],
  },
  {
    title: 'LTV',
    value: 12.4,
    unit: 'میلیون تومان',
    change: 6.2,
    trend: 'up',
    icon: Zap,
    colorKey: 'cyan',
    target: 15,
    sparkline: [9, 10, 10.5, 11, 11.2, 12, 12.4],
  },
  {
    title: 'نرخ ریزش',
    value: 8.2,
    unit: 'درصد',
    change: -12.1,
    trend: 'down',
    icon: Activity,
    colorKey: 'rose',
    target: 5,
    sparkline: [14, 12, 11, 10.5, 9.8, 9, 8.2],
  },
  {
    title: 'تعداد مشتریان فعال',
    value: 342,
    unit: 'نفر',
    change: 15.2,
    trend: 'up',
    icon: Users,
    colorKey: 'violet',
    target: 400,
    sparkline: [180, 210, 240, 260, 290, 320, 342],
  },
];

// ─── Revenue Trend Data ─────────────────────────────────────────────
const revenueData = [
  { month: 'فروردین', actual: 320, predicted: null as number | null },
  { month: 'اردیبهشت', actual: 380, predicted: null },
  { month: 'خرداد', actual: 410, predicted: null },
  { month: 'تیر', actual: 390, predicted: null },
  { month: 'مرداد', actual: 450, predicted: null },
  { month: 'شهریور', actual: 480, predicted: null },
  { month: 'مهر', actual: 520, predicted: null },
  { month: 'آبان', actual: 490, predicted: null },
  { month: 'آذر', actual: 560, predicted: null },
  { month: 'دی', actual: null, predicted: 580 },
  { month: 'بهمن', actual: null, predicted: 620 },
  { month: 'اسفند', actual: null, predicted: 670 },
];

// ─── Revenue Sources ────────────────────────────────────────────────
const revenueSourceData = [
  { name: 'مشاوره استراتژیک', value: 35, color: '#059669' },
  { name: 'اشتراک پلتفرم', value: 25, color: '#0d9488' },
  { name: 'ارزیابی تشخیصی', value: 20, color: '#0891b2' },
  { name: 'آموزش و دوره‌ها', value: 12, color: '#7c3aed' },
  { name: 'سایر خدمات', value: 8, color: '#f59e0b' },
];

// ─── MoM Growth ─────────────────────────────────────────────────────
const momGrowthData = [
  { month: 'فروردین', growth: 0 },
  { month: 'اردیبهشت', growth: 18.75 },
  { month: 'خرداد', growth: 7.89 },
  { month: 'تیر', growth: -4.88 },
  { month: 'مرداد', growth: 15.38 },
  { month: 'شهریور', growth: 6.67 },
  { month: 'مهر', growth: 8.33 },
  { month: 'آبان', growth: -5.77 },
  { month: 'آذر', growth: 14.29 },
];

// ─── Revenue by Category ────────────────────────────────────────────
const revenueCategoryData = [
  { category: 'استراتژی', q1: 120, q2: 150, q3: 180 },
  { category: 'فروش', q1: 90, q2: 110, q3: 95 },
  { category: 'بازاریابی', q1: 60, q2: 85, q3: 100 },
  { category: 'عملیات', q1: 45, q2: 55, q3: 70 },
  { category: 'منابع انسانی', q1: 30, q2: 40, q3: 50 },
];

// ─── Funnel Data ────────────────────────────────────────────────────
const funnelData = [
  { stage: 'لید جدید', count: 1000, rate: 100, color: '#059669' },
  { stage: 'تماس‌شده', count: 650, rate: 65, color: '#0d9488' },
  { stage: 'واجد شرایط', count: 380, rate: 38, color: '#0891b2' },
  { stage: 'ارائه پیشنهاد', count: 220, rate: 22, color: '#0ea5e9' },
  { stage: 'مذاکره', count: 140, rate: 14, color: '#6366f1' },
  { stage: 'قرارداد موفق', count: 85, rate: 8.5, color: '#8b5cf6' },
];

// ─── Stage Conversion Rates ─────────────────────────────────────────
const stageConversionData = [
  { from: 'لید → تماس', rate: 65 },
  { from: 'تماس → واجد', rate: 58.5 },
  { from: 'واجد → پیشنهاد', rate: 57.9 },
  { from: 'پیشنهاد → مذاکره', rate: 63.6 },
  { from: 'مذاکره → قرارداد', rate: 60.7 },
];

// ─── Pipeline Velocity ──────────────────────────────────────────────
const velocityData = [
  { stage: 'لید جدید', avgDays: 2, deals: 1000 },
  { stage: 'تماس‌شده', avgDays: 5, deals: 650 },
  { stage: 'واجد شرایط', avgDays: 8, deals: 380 },
  { stage: 'پیشنهاد', avgDays: 12, deals: 220 },
  { stage: 'مذاکره', avgDays: 18, deals: 140 },
  { stage: 'موفق', avgDays: 25, deals: 85 },
];

// ─── Deal Size Distribution ─────────────────────────────────────────
const dealSizeData = [
  { range: '<۵۰ م', count: 35, avgDays: 15 },
  { range: '۵۰-۱۰۰ م', count: 28, avgDays: 22 },
  { range: '۱۰۰-۲۰۰ م', count: 18, avgDays: 30 },
  { range: '۲۰۰-۵۰۰ م', count: 12, avgDays: 40 },
  { range: '>۵۰۰ م', count: 7, avgDays: 55 },
];

// ─── Growth Prediction (3 Scenarios) ────────────────────────────────
const growthPredictionData = [
  { month: 'فروردین', optimistic: 320, likely: 320, pessimistic: 320, actual: 320 },
  { month: 'اردیبهشت', optimistic: 380, likely: 380, pessimistic: 380, actual: 380 },
  { month: 'خرداد', optimistic: 410, likely: 410, pessimistic: 410, actual: 410 },
  { month: 'تیر', optimistic: 390, likely: 390, pessimistic: 390, actual: 390 },
  { month: 'مرداد', optimistic: 450, likely: 450, pessimistic: 450, actual: 450 },
  { month: 'شهریور', optimistic: 480, likely: 480, pessimistic: 480, actual: 480 },
  { month: 'مهر', optimistic: 520, likely: 520, pessimistic: 520, actual: 520 },
  { month: 'آبان', optimistic: 490, likely: 490, pessimistic: 490, actual: 490 },
  { month: 'آذر', optimistic: 560, likely: 560, pessimistic: 560, actual: 560 },
  { month: 'دی', optimistic: 640, likely: 580, pessimistic: 530, actual: null },
  { month: 'بهمن', optimistic: 720, likely: 620, pessimistic: 540, actual: null },
  { month: 'اسفند', optimistic: 820, likely: 670, pessimistic: 550, actual: null },
];

// ─── AI Insights ────────────────────────────────────────────────────
const aiInsights = [
  {
    id: 1,
    title: 'فرصت رشد درآمد ۲۳٪',
    description:
      'بر اساس تحلیل الگوی مشتریان فعلی، افزایش سرمایه‌گذاری در بازاریابی دیجیتال می‌تواند نرخ تبدیل را تا ۲۳٪ افزایش دهد. توصیه می‌شود بودجه بازاریابی آنلاین ۱۵٪ افزایش یابد.',
    icon: Lightbulb,
    color: 'emerald',
    confidence: 87,
  },
  {
    id: 2,
    title: 'ریسک ریزش مشتریان VIP',
    description:
      '۳۲٪ از مشتریان VIP در ۹۰ روز گذشته فعالیت کاهشی داشته‌اند. الگوریتم پیش‌بینی نشان می‌دهد ۸ مشتری کلیدی در معرض ریزش هستند. اقدام فوری توصیه می‌شود.',
    icon: AlertTriangle,
    color: 'amber',
    confidence: 92,
  },
  {
    id: 3,
    title: 'بهینه‌سازی قیف فروش',
    description:
      'مرحله واجد شرایط → پیشنهاد با نرخ تبدیل ۵۷.۹٪ پایین‌ترین عملکرد را دارد. مقایسه با بهترین رکورد صنعت (۷۲٪) نشان‌دهنده فرصت بهبود ۱۴.۱٪ است.',
    icon: Target,
    color: 'cyan',
    confidence: 78,
  },
];

// ─── Anomaly Alerts ─────────────────────────────────────────────────
const anomalyAlerts = [
  {
    id: 1,
    title: 'افت ناگهانی درآمد آبان',
    severity: 'high',
    description: 'درآمد آبان ۵.۸٪ کمتر از روند پیش‌بینی‌شده بود',
    detectedAt: '۲ روز پیش',
    metric: 'درآمد',
    deviation: -5.8,
  },
  {
    id: 2,
    title: 'افزایش غیرعادی CAC تیر',
    severity: 'medium',
    description: 'هزینه جذب مشتری ۱۲٪ بالاتر از میانگین سه‌ماهه',
    detectedAt: '۵ روز پیش',
    metric: 'CAC',
    deviation: 12,
  },
  {
    id: 3,
    title: 'نرخ تبدیل بالاتر از حد انتظار مهر',
    severity: 'low',
    description: 'نرخ تبدیل ۸.۳٪ بالاتر از پیش‌بینی مدل بود',
    detectedAt: '۱ هفته پیش',
    metric: 'نرخ تبدیل',
    deviation: 8.3,
  },
];

// ─── Predictive Risk Indicators ─────────────────────────────────────
const riskIndicators = [
  { name: 'ریسک درآمد', score: 35, level: 'پایین' as const, trend: 'down' as const },
  { name: 'ریسک نقدینگی', score: 52, level: 'متوسط' as const, trend: 'up' as const },
  { name: 'ریسک ریزش مشتری', score: 68, level: 'بالا' as const, trend: 'up' as const },
  { name: 'ریسک رقابتی', score: 41, level: 'پایین' as const, trend: 'stable' as const },
  { name: 'ریسک عملیاتی', score: 28, level: 'پایین' as const, trend: 'down' as const },
];

// ─── Strategic Health Radar ─────────────────────────────────────────
const strategicHealthData = [
  { dimension: 'مدل کسب‌وکار', score: 72, industry: 65 },
  { dimension: 'بازار', score: 68, industry: 70 },
  { dimension: 'محصول', score: 85, industry: 60 },
  { dimension: 'مشتری', score: 60, industry: 68 },
  { dimension: 'بازاریابی', score: 55, industry: 72 },
  { dimension: 'فروش', score: 62, industry: 65 },
  { dimension: 'عملیات', score: 78, industry: 70 },
  { dimension: 'مالی', score: 70, industry: 66 },
];

// ─── Dimension Details ──────────────────────────────────────────────
const dimensionDetails = [
  { name: 'محصول', score: 85, industry: 60, gap: 25, priority: 'low' },
  { name: 'عملیات', score: 78, industry: 70, gap: 8, priority: 'low' },
  { name: 'مدل کسب‌وکار', score: 72, industry: 65, gap: 7, priority: 'medium' },
  { name: 'مالی', score: 70, industry: 66, gap: 4, priority: 'medium' },
  { name: 'بازار', score: 68, industry: 70, gap: -2, priority: 'high' },
  { name: 'فروش', score: 62, industry: 65, gap: -3, priority: 'high' },
  { name: 'مشتری', score: 60, industry: 68, gap: -8, priority: 'critical' },
  { name: 'بازاریابی', score: 55, industry: 72, gap: -17, priority: 'critical' },
];

// ─── Improvement Priority Matrix ────────────────────────────────────
const priorityMatrixData = [
  { name: 'بازاریابی', impact: 9, effort: 6, priority: 'critical' },
  { name: 'مشتری', impact: 8, effort: 7, priority: 'critical' },
  { name: 'فروش', impact: 7, effort: 5, priority: 'high' },
  { name: 'بازار', impact: 6, effort: 4, priority: 'high' },
  { name: 'مالی', impact: 5, effort: 3, priority: 'medium' },
  { name: 'مدل کسب‌وکار', impact: 7, effort: 8, priority: 'medium' },
  { name: 'عملیات', impact: 4, effort: 5, priority: 'low' },
  { name: 'محصول', impact: 3, effort: 6, priority: 'low' },
];

// ─── Color Maps ─────────────────────────────────────────────────────
const colorMap: Record<string, { bg: string; border: string; text: string; spark: string; light: string }> = {
  emerald: { bg: 'bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-600', spark: '#059669', light: 'bg-emerald-50' },
  teal: { bg: 'bg-teal-100', border: 'border-teal-200', text: 'text-teal-600', spark: '#0d9488', light: 'bg-teal-50' },
  orange: { bg: 'bg-orange-100', border: 'border-orange-200', text: 'text-orange-600', spark: '#ea580c', light: 'bg-orange-50' },
  cyan: { bg: 'bg-cyan-100', border: 'border-cyan-200', text: 'text-cyan-600', spark: '#0891b2', light: 'bg-cyan-50' },
  rose: { bg: 'bg-rose-100', border: 'border-rose-200', text: 'text-rose-600', spark: '#e11d48', light: 'bg-rose-50' },
  violet: { bg: 'bg-violet-100', border: 'border-violet-200', text: 'text-violet-600', spark: '#7c3aed', light: 'bg-violet-50' },
};

const insightColorMap: Record<string, { bg: string; border: string; iconBg: string; title: string; desc: string }> = {
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', iconBg: 'bg-emerald-100', title: 'text-emerald-900', desc: 'text-emerald-700' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', iconBg: 'bg-amber-100', title: 'text-amber-900', desc: 'text-amber-700' },
  cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', iconBg: 'bg-cyan-100', title: 'text-cyan-900', desc: 'text-cyan-700' },
};

// ─── Sparkline Component ────────────────────────────────────────────
function Sparkline({
  data,
  color,
  width = 80,
  height = 32,
}: {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 4) - 2}`)
    .join(' ');
  const fillPoints = `0,${height} ${points} ${width},${height}`;
  return (
    <svg width={width} height={height} className="inline-block">
      <defs>
        <linearGradient id={`spark-grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon fill={`url(#spark-grad-${color.replace('#', '')})`} points={fillPoints} />
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
      <circle cx={(data.length - 1) / (data.length - 1) * width} cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2} r="2.5" fill={color} />
    </svg>
  );
}

// ─── Trend Icon ─────────────────────────────────────────────────────
function TrendIcon({ trend, change }: { trend: 'up' | 'down' | 'stable'; change: number }) {
  if (trend === 'up') return <ArrowUpRight className="w-4 h-4 text-emerald-500" />;
  if (trend === 'down') return <ArrowDownRight className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-slate-400" />;
}

// ─── Severity Badge ─────────────────────────────────────────────────
function SeverityBadge({ severity }: { severity: 'high' | 'medium' | 'low' }) {
  const map = {
    high: { bg: 'bg-red-100', text: 'text-red-700', label: 'بالا' },
    medium: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'متوسط' },
    low: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'پایین' },
  };
  const s = map[severity];
  return (
    <Badge className={`${s.bg} ${s.text} text-[10px] border-0`}>{s.label}</Badge>
  );
}

// ─── Risk Level Color ───────────────────────────────────────────────
function riskColor(score: number): string {
  if (score >= 60) return 'text-red-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-emerald-600';
}

function riskBg(score: number): string {
  if (score >= 60) return 'bg-red-500';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-emerald-500';
}

// ─── Priority Color ─────────────────────────────────────────────────
function priorityColor(priority: string): { bg: string; text: string; dot: string } {
  switch (priority) {
    case 'critical':
      return { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' };
    case 'high':
      return { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' };
    case 'medium':
      return { bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-500' };
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' };
  }
}

// ─── Custom Tooltip for Charts ──────────────────────────────────────
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg p-3 text-xs" dir="rtl">
      <p className="font-medium text-slate-700 mb-1">{label}</p>
      {payload.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-slate-500">{item.name}:</span>
          <span className="font-medium text-slate-800">{toPersianNum(item.value.toLocaleString())}</span>
        </div>
      ))}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════
export default function BiDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAIInsight, setShowAIInsight] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  }, []);

  const handleExport = useCallback(() => {
    const data = JSON.stringify({ kpiData, revenueData }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bi-report.json';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // ─── KPI Progress toward target ────────────────────────────────
  const getKPIProgress = (kpi: KPI) => {
    const isInverse = kpi.title === 'نرخ ریزش' || kpi.title === 'CAC';
    if (isInverse) {
      return Math.min(100, (kpi.target / kpi.value) * 100);
    }
    return Math.min(100, (kpi.value / kpi.target) * 100);
  };

  const isPositiveTrend = (kpi: KPI) => {
    const isInverse = kpi.title === 'نرخ ریزش' || kpi.title === 'CAC';
    return isInverse ? kpi.change < 0 : kpi.change > 0;
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* ═══ HEADER ═══ */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-emerald-600" />
              هوش تجاری پیشرفته (BI)
            </h2>
            <p className="text-slate-500 mt-1 text-sm">داشبورد KPI، تحلیل‌های مدیریتی و پیش‌بینی هوشمند</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Time Range Selector */}
            <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
              <SelectTrigger className="w-[130px] h-9 text-sm">
                <Clock className="w-3.5 h-3.5 ms-1 text-slate-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(timeRangeLabels) as TimeRange[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {timeRangeLabels[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* AI Insight Button */}
            <Button
              variant="outline"
              size="sm"
              className={`gap-1.5 ${showAIInsight ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : ''}`}
              onClick={() => setShowAIInsight(!showAIInsight)}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">بینش AI</span>
            </Button>

            {/* Refresh Button */}
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">به‌روزرسانی</span>
            </Button>

            {/* Export Button */}
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5" size="sm" onClick={handleExport}>
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروجی</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ═══ AI INSIGHT BANNER ═══ */}
      <AnimatePresence>
        {showAIInsight && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-emerald-200 bg-gradient-to-l from-emerald-50 to-teal-50 overflow-hidden">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Brain className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-emerald-900">بینش هوش مصنوعی</p>
                  <p className="text-xs text-emerald-700 mt-1 leading-6">
                    بر اساس تحلیل داده‌های ۹ ماهه، روند درآمدی شما مثبت ارزیابی می‌شود. با این حال، شکاف ۱۷ امتیازی
                    در بُعد بازاریابی نسبت به میانگین صنعت نیاز به اقدام فوری دارد. پیشنهاد می‌شود تمرکز استراتژیک
                    روی بهبود نرخ تبدیل مرحله «واجد شرایط → پیشنهاد» باشد که کم‌ترین نرخ تبدیل قیف فروش شماست.
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowAIInsight(false)} className="shrink-0">
                  ✕
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ KPI CARDS ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi, index) => {
          const colors = colorMap[kpi.colorKey];
          const progress = getKPIProgress(kpi);
          const isPositive = isPositiveTrend(kpi);
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
            >
              <Card className={`hover:shadow-lg transition-all duration-300 cursor-default ${colors.border}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors.bg}`}>
                      <kpi.icon className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <TrendIcon trend={kpi.trend} change={kpi.change} />
                  </div>
                  <p className="text-xs text-slate-500 mb-1">{kpi.title}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-bold text-slate-900">{toPersianNum(kpi.value)}</span>
                      <span className="text-[10px] text-slate-400 ms-1">{kpi.unit}</span>
                    </div>
                    <Sparkline data={kpi.sparkline} color={colors.spark} />
                  </div>
                  {/* Target Progress */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-slate-400">هدف: {toPersianNum(kpi.target)}</span>
                      <span className="text-[10px] text-slate-500">{toPersianNum(Math.round(progress))}٪</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-red-400'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, delay: 0.1 * index }}
                      />
                    </div>
                  </div>
                  {/* Change Badge */}
                  <div className="mt-2 flex items-center gap-1">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] border-0 ${
                        isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {kpi.change > 0 ? '+' : ''}{toPersianNum(kpi.change)}٪
                    </Badge>
                    <span className="text-[10px] text-slate-400">نسبت به دوره قبل</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* ═══ TABS ═══ */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 flex-wrap h-auto p-1 gap-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            <Eye className="w-3.5 h-3.5 ms-1" />
            نمای کلی
          </TabsTrigger>
          <TabsTrigger value="revenue" className="text-xs sm:text-sm">
            <DollarSign className="w-3.5 h-3.5 ms-1" />
            تحلیل درآمد
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="text-xs sm:text-sm">
            <Target className="w-3.5 h-3.5 ms-1" />
            قیف فروش
          </TabsTrigger>
          <TabsTrigger value="prediction" className="text-xs sm:text-sm">
            <Brain className="w-3.5 h-3.5 ms-1" />
            پیش‌بینی و AI
          </TabsTrigger>
          <TabsTrigger value="strategic" className="text-xs sm:text-sm">
            <Shield className="w-3.5 h-3.5 ms-1" />
            سلامت استراتژیک
          </TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* OVERVIEW TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <TabsContent value="overview" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend with Prediction */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    روند درآمد (میلیون تومان)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area type="monotone" dataKey="actual" stroke="#059669" strokeWidth={2} fill="url(#actualGrad)" name="واقعی" />
                        <Area type="monotone" dataKey="predicted" stroke="#0d9488" strokeWidth={2} strokeDasharray="8 4" fill="url(#predictedGrad)" name="پیش‌بینی" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Strategic Health Radar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-600" />
                    سلامت استراتژیک در برابر صنعت
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={strategicHealthData} cx="50%" cy="50%" outerRadius="65%">
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 9, fill: '#64748b' }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 8 }} />
                        <Radar name="شرکت شما" dataKey="score" stroke="#059669" fill="#059669" fillOpacity={0.2} strokeWidth={2} />
                        <Radar name="میانگین صنعت" dataKey="industry" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={1} strokeDasharray="5 5" />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="border-emerald-200 bg-emerald-50/50 hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">بهترین عملکرد</p>
                    <p className="text-xs text-emerald-700 mt-1 leading-5">
                      بُعد محصول با امتیاز ۸۵، بالاتر از میانگین صنعت (۶۰) عمل کرده و مزیت رقابتی محسوب می‌شود
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <Card className="border-sky-200 bg-sky-50/50 hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-sky-900">فرصت رشد</p>
                    <p className="text-xs text-sky-700 mt-1 leading-5">
                      بُعد بازاریابی با ۵۵ امتیاز و شکاف ۱۷ واحدی نسبت به صنعت، بیشترین پتانسیل بهبود را دارد
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="border-amber-200 bg-amber-50/50 hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">هشدار</p>
                    <p className="text-xs text-amber-700 mt-1 leading-5">
                      بودجه عملیات ۸.۶٪ بیشتر از برنامه مصرف شده و نرخ تبدیل قیف فروش در مرحله پیشنهاد افت دارد
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* REVENUE TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <TabsContent value="revenue" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend with Prediction - Full */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    روند درآمد با پیش‌بینی
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[320px]" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="revFullGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="revPredGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area type="monotone" dataKey="actual" stroke="#059669" strokeWidth={3} fill="url(#revFullGrad)" name="درآمد واقعی" />
                        <Area type="monotone" dataKey="predicted" stroke="#0d9488" strokeWidth={2} strokeDasharray="8 4" fill="url(#revPredGrad)" name="پیش‌بینی" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Revenue Sources Donut */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CircleDot className="w-5 h-5 text-teal-600" />
                    منابع درآمد
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[320px]" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={revenueSourceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={100}
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, value }) => `${name} ${value}%`}
                        >
                          {revenueSourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${value}%`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Month-over-Month Growth */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Waves className="w-5 h-5 text-emerald-600" />
                    نرخ رشد ماهانه (درصد)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={momGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="growth" name="رشد ماهانه" radius={[4, 4, 0, 0]}>
                          {momGrowthData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.growth >= 0 ? '#059669' : '#ef4444'}
                            />
                          ))}
                        </Bar>
                        <ReferenceLine y={0} stroke="#94a3b8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Revenue Breakdown by Category */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-teal-600" />
                    درآمد تفکیک حوزه (میلیون تومان)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueCategoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#64748b' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="q1" fill="#059669" name="سه‌ماهه اول" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="q2" fill="#0d9488" name="سه‌ماهه دوم" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="q3" fill="#0891b2" name="سه‌ماهه سوم" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* PIPELINE TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <TabsContent value="pipeline" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Funnel */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-600" />
                    قیف فروش و نرخ تبدیل
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {funnelData.map((stage, i) => (
                      <motion.div
                        key={stage.stage}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-slate-700 w-24 text-start shrink-0">{stage.stage}</span>
                          <div className="flex-1 bg-slate-100 rounded-full h-7 relative overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: `linear-gradient(to left, ${stage.color}, ${stage.color}dd)` }}
                              initial={{ width: 0 }}
                              animate={{ width: `${stage.rate}%` }}
                              transition={{ duration: 0.8, delay: 0.1 * i }}
                            />
                            <div className="absolute inset-0 flex items-center justify-between px-3">
                              <span className="text-[10px] font-medium text-slate-700">{toPersianNum(stage.count.toLocaleString())}</span>
                              <span className="text-[10px] font-medium text-white">{toPersianNum(stage.rate)}٪</span>
                            </div>
                          </div>
                          {i > 0 && (
                            <Badge variant="secondary" className="text-[9px] bg-red-50 text-red-600 border-0 shrink-0">
                              -{toPersianNum((funnelData[i - 1].rate - stage.rate).toFixed(1))}٪
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stage Conversion Rates */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-teal-600" />
                    نرخ تبدیل بین مراحل (درصد)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stageConversionData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 100]} />
                        <YAxis type="category" dataKey="from" tick={{ fontSize: 9, fill: '#64748b' }} width={85} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="rate" name="نرخ تبدیل" radius={[0, 4, 4, 0]}>
                          {stageConversionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.rate >= 60 ? '#059669' : entry.rate >= 50 ? '#f59e0b' : '#ef4444'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pipeline Velocity */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Flame className="w-5 h-5 text-emerald-600" />
                    سرعت حرکت در قیف فروش (روز)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={velocityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="stage" tick={{ fontSize: 9, fill: '#64748b' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="avgDays" stroke="#059669" strokeWidth={2} name="میانگین روز" dot={{ r: 4, fill: '#059669' }} />
                        <Line type="monotone" dataKey="deals" stroke="#0d9488" strokeWidth={2} strokeDasharray="5 5" name="تعداد معاملات" dot={{ r: 3, fill: '#0d9488' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Deal Size Distribution */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-teal-600" />
                    توزیع اندازه معاملات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="count" name="تعداد" tick={{ fontSize: 10, fill: '#64748b' }} label={{ value: 'تعداد', position: 'insideBottom', offset: -5, fontSize: 10 }} />
                        <YAxis dataKey="avgDays" name="روز" tick={{ fontSize: 10, fill: '#64748b' }} label={{ value: 'میانگین روز', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                        <ZAxis dataKey="count" range={[60, 400]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Scatter data={dealSizeData} fill="#059669" name="توزیع معاملات" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* PREDICTION & AI TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <TabsContent value="prediction" className="space-y-6 mt-4">
          {/* Growth Prediction Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Brain className="w-5 h-5 text-emerald-600" />
                    پیش‌بینی رشد - سه سناریو (میلیون تومان)
                  </CardTitle>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-500 inline-block" /> خوش‌بینانه</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-sky-500 inline-block" /> محتمل</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-orange-500 inline-block" /> بدبینانه</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthPredictionData}>
                      <defs>
                        <linearGradient id="optimisticGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="likelyGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="pessimisticGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area type="monotone" dataKey="optimistic" stroke="#059669" strokeWidth={2} fill="url(#optimisticGrad)" name="خوش‌بینانه" />
                      <Area type="monotone" dataKey="likely" stroke="#0ea5e9" strokeWidth={2} fill="url(#likelyGrad)" name="محتمل" />
                      <Area type="monotone" dataKey="pessimistic" stroke="#f97316" strokeWidth={2} strokeDasharray="5 3" fill="url(#pessimisticGrad)" name="بدبینانه" />
                      <Line type="monotone" dataKey="actual" stroke="#0f172a" strokeWidth={2.5} dot={{ r: 3, fill: '#0f172a' }} name="واقعی" connectNulls={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Insight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((insight, index) => {
              const colors = insightColorMap[insight.color];
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + 0.1 * index }}
                >
                  <Card className={`${colors.border} ${colors.bg} hover:shadow-md transition-shadow h-full`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-8 h-8 rounded-lg ${colors.iconBg} flex items-center justify-center`}>
                          <insight.icon className={`w-4 h-4 ${insight.color === 'emerald' ? 'text-emerald-600' : insight.color === 'amber' ? 'text-amber-600' : 'text-cyan-600'}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${colors.title}`}>{insight.title}</p>
                        </div>
                      </div>
                      <p className={`text-xs ${colors.desc} leading-5`}>{insight.description}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-slate-400" />
                          <span className="text-[10px] text-slate-500">اطمینان: {toPersianNum(insight.confidence)}٪</span>
                        </div>
                        <div className="h-1.5 flex-1 mx-3 bg-white/50 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-current"
                            style={{ color: insight.color === 'emerald' ? '#059669' : insight.color === 'amber' ? '#f59e0b' : '#0891b2' }}
                            initial={{ width: 0 }}
                            animate={{ width: `${insight.confidence}%` }}
                            transition={{ duration: 1, delay: 0.3 + 0.1 * index }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Anomaly Detection */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    تشخیص ناهنجاری
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar">
                    {anomalyAlerts.map((alert, index) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className={`p-3 rounded-lg border ${
                          alert.severity === 'high'
                            ? 'border-red-200 bg-red-50/50'
                            : alert.severity === 'medium'
                            ? 'border-amber-200 bg-amber-50/50'
                            : 'border-emerald-200 bg-emerald-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <SeverityBadge severity={alert.severity} />
                            <span className="text-xs font-medium text-slate-800">{alert.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{alert.detectedAt}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-[10px]">
                          <span className="text-slate-500">معیار: {alert.metric}</span>
                          <span className={alert.deviation < 0 ? 'text-red-600 font-medium' : 'text-emerald-600 font-medium'}>
                            انحراف: {alert.deviation > 0 ? '+' : ''}{toPersianNum(alert.deviation)}٪
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Predictive Risk Indicators */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    شاخص‌های ریسک پیش‌بینانه
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {riskIndicators.map((risk, index) => (
                      <motion.div
                        key={risk.name}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-700">{risk.name}</span>
                            <Badge
                              className={`text-[9px] border-0 ${
                                risk.level === 'بالا'
                                  ? 'bg-red-100 text-red-700'
                                  : risk.level === 'متوسط'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {risk.level}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            {risk.trend === 'up' && <ArrowUpRight className="w-3 h-3 text-red-500" />}
                            {risk.trend === 'down' && <ArrowDownRight className="w-3 h-3 text-emerald-500" />}
                            {risk.trend === 'stable' && <Minus className="w-3 h-3 text-slate-400" />}
                            <span className={`text-sm font-bold ${riskColor(risk.score)}`}>{toPersianNum(risk.score)}</span>
                            <span className="text-[10px] text-slate-400">/۱۰۰</span>
                          </div>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${riskBg(risk.score)}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${risk.score}%` }}
                            transition={{ duration: 0.8, delay: 0.1 * index }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Info className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs font-medium text-slate-600">خلاصه ریسک</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-5">
                      ریسک ریزش مشتری در سطح بالاست و روند افزایشی دارد. توصیه می‌شود برنامه حفظ مشتریان VIP فوراً اجرا شود.
                      سایر شاخص‌ها در وضعیت قابل قبول قرار دارند.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STRATEGIC HEALTH TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <TabsContent value="strategic" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-600" />
                    مقایسه شرکت با میانگین صنعت
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[340px]" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={strategicHealthData} cx="50%" cy="50%" outerRadius="65%">
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: '#64748b' }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 8 }} />
                        <Radar name="شرکت شما" dataKey="score" stroke="#059669" fill="#059669" fillOpacity={0.2} strokeWidth={2} />
                        <Radar name="میانگین صنعت" dataKey="industry" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="5 5" />
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Dimension Scores with Progress Bars */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-teal-600" />
                    امتیاز ابعاد و شکاف با صنعت
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[340px] overflow-y-auto custom-scrollbar">
                    {dimensionDetails
                      .sort((a, b) => b.score - a.score)
                      .map((dim, index) => {
                        const pColor = priorityColor(dim.priority);
                        return (
                          <motion.div
                            key={dim.name}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * index }}
                            className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dim.score >= 70 ? '#059669' : dim.score >= 60 ? '#f59e0b' : '#ef4444' }} />
                                <span className="text-sm font-medium text-slate-700">{dim.name}</span>
                                <Badge className={`text-[9px] border-0 ${pColor.bg} ${pColor.text}`}>
                                  {dim.priority === 'critical' ? 'بحرانی' : dim.priority === 'high' ? 'بالا' : dim.priority === 'medium' ? 'متوسط' : 'پایین'}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-800">{toPersianNum(dim.score)}</span>
                                <span className="text-[10px] text-slate-400">/۱۰۰</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: dim.score >= 70 ? '#059669' : dim.score >= 60 ? '#f59e0b' : '#ef4444' }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${dim.score}%` }}
                                    transition={{ duration: 0.6, delay: 0.05 * index }}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0 w-20 justify-end">
                                <span className="text-[10px] text-slate-400">صنعت:</span>
                                <span className="text-[10px] font-medium text-slate-600">{toPersianNum(dim.industry)}</span>
                                <span className={`text-[10px] font-bold ${dim.gap >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                  ({dim.gap >= 0 ? '+' : ''}{toPersianNum(dim.gap)})
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gap Analysis */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-emerald-600" />
                    تحلیل شکاف با معیار صنعت
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dimensionDetails} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} domain={[-20, 30]} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} width={80} />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={1} />
                        <Bar dataKey="gap" name="شکاف" radius={[0, 4, 4, 0]}>
                          {dimensionDetails.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.gap >= 0 ? '#059669' : '#ef4444'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Improvement Priority Matrix */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-teal-600" />
                    ماتریس اولویت بهبود (تأثیر vs تلاش)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="number" dataKey="effort" name="تلاش" tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 10]} label={{ value: 'تلاش موردنیاز', position: 'insideBottom', offset: -5, fontSize: 10 }} />
                        <YAxis type="number" dataKey="impact" name="تأثیر" tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 10]} label={{ value: 'تأثیر', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                        <ZAxis range={[150, 400]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Scatter data={priorityMatrixData} name="اولویت‌ها">
                          {priorityMatrixData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.priority === 'critical'
                                  ? '#ef4444'
                                  : entry.priority === 'high'
                                  ? '#f59e0b'
                                  : entry.priority === 'medium'
                                  ? '#0ea5e9'
                                  : '#94a3b8'
                              }
                            />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Legend */}
                  <div className="flex items-center justify-center gap-4 mt-2 text-[10px]">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> بحرانی</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> بالا</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500" /> متوسط</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400" /> پایین</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
