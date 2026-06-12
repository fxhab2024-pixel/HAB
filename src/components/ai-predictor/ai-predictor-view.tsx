'use client';

import { useState, useMemo } from 'react';
import { useAppStore, type PredictionResult } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Target,
  Wand2,
  Shield,
  Activity,
  Lightbulb,
  BarChart3,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  CheckCircle2,
  Info,
  ChevronLeft,
  Gauge,
  Layers,
  FlaskConical,
  ScanSearch,
  FileWarning,
  CircleDot,
  ArrowUp,
  ArrowDown,
  Minus,
  Play,
} from 'lucide-react';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const revenueData = [
  { month: 'فروردین', actual: 320, optimistic: 340, likely: 325, pessimistic: 310 },
  { month: 'اردیبهشت', actual: 345, optimistic: 365, likely: 350, pessimistic: 330 },
  { month: 'خرداد', actual: 380, optimistic: 400, likely: 385, pessimistic: 360 },
  { month: 'تیر', actual: 410, optimistic: 430, likely: 415, pessimistic: 390 },
  { month: 'مرداد', actual: 395, optimistic: 420, likely: 400, pessimistic: 370 },
  { month: 'شهریور', actual: 430, optimistic: 460, likely: 440, pessimistic: 405 },
  { month: 'مهر', actual: 465, optimistic: 495, likely: 470, pessimistic: 435 },
  { month: 'آبان', actual: 490, optimistic: 520, likely: 495, pessimistic: 460 },
  { month: 'آذر', actual: 510, optimistic: 545, likely: 520, pessimistic: 475 },
  { month: 'دی', actual: 530, optimistic: 570, likely: 545, pessimistic: 495 },
  { month: 'بهمن', actual: 555, optimistic: 600, likely: 565, pessimistic: 515 },
  { month: 'اسفند', actual: 580, optimistic: 630, likely: 590, pessimistic: 535 },
  { month: 'فروردین ۲', actual: undefined, optimistic: 660, likely: 615, pessimistic: 555 },
  { month: 'اردیبهشت ۲', actual: undefined, optimistic: 700, likely: 645, pessimistic: 575 },
  { month: 'خرداد ۲', actual: undefined, optimistic: 740, likely: 680, pessimistic: 600 },
  { month: 'تیر ۲', actual: undefined, optimistic: 785, likely: 715, pessimistic: 625 },
  { month: 'مرداد ۲', actual: undefined, optimistic: 830, likely: 750, pessimistic: 650 },
  { month: 'شهریور ۲', actual: undefined, optimistic: 880, likely: 790, pessimistic: 680 },
];

const revenueTableData = [
  { month: 'فروردین', actual: 320, predicted: 325, growth: null },
  { month: 'اردیبهشت', actual: 345, predicted: 350, growth: 7.8 },
  { month: 'خرداد', actual: 380, predicted: 385, growth: 10.1 },
  { month: 'تیر', actual: 410, predicted: 415, growth: 7.9 },
  { month: 'مرداد', actual: 395, predicted: 400, growth: -3.7 },
  { month: 'شهریور', actual: 430, predicted: 440, growth: 8.9 },
  { month: 'مهر', actual: 465, predicted: 470, growth: 8.1 },
  { month: 'آبان', actual: 490, predicted: 495, growth: 5.4 },
  { month: 'آذر', actual: 510, predicted: 520, growth: 4.1 },
  { month: 'دی', actual: 530, predicted: 545, growth: 3.9 },
  { month: 'بهمن', actual: 555, predicted: 565, growth: 4.7 },
  { month: 'اسفند', actual: 580, predicted: 590, growth: 4.5 },
];

const riskRadarData = [
  { dimension: 'مالی', value: 72 },
  { dimension: 'عملیاتی', value: 55 },
  { dimension: 'بازاریابی', value: 48 },
  { dimension: 'تکنولوژی', value: 35 },
  { dimension: 'قانونی', value: 28 },
  { dimension: 'منابع انسانی', value: 42 },
];

const riskMatrixData = [
  { name: 'نقدینگی', probability: 0.7, impact: 85, severity: 'بالا' },
  { name: 'رقابت', probability: 0.5, impact: 70, severity: 'متوسط' },
  { name: 'تکنولوژی', probability: 0.3, impact: 60, severity: 'پایین' },
  { name: 'قوانین', probability: 0.2, impact: 55, severity: 'پایین' },
  { name: 'نیروی کار', probability: 0.4, impact: 45, severity: 'متوسط' },
  { name: 'زنجیره تأمین', probability: 0.6, impact: 75, severity: 'بالا' },
  { name: 'ارز', probability: 0.8, impact: 65, severity: 'بالا' },
  { name: 'داده', probability: 0.25, impact: 50, severity: 'پایین' },
];

const topRisks = [
  {
    id: 1, title: 'کاهش نقدینگی', severity: 'بحرانی', probability: 70, impact: 85,
    mitigation: 'افزایش ذخایر نقدی و تنظیم شرایط پرداخت با تأمین‌کنندگان',
  },
  {
    id: 2, title: 'تلاطم نرخ ارز', severity: 'بالا', probability: 80, impact: 65,
    mitigation: 'پوشش ارزی و قراردادهای آتی',
  },
  {
    id: 3, title: 'ورود رقیب جدید', severity: 'بالا', probability: 50, impact: 70,
    mitigation: 'تقویت مزیت رقابتی و وفاداری مشتریان',
  },
  {
    id: 4, title: 'اختلال زنجیره تأمین', severity: 'متوسط', probability: 60, impact: 75,
    mitigation: 'تنوع‌بخشی تأمین‌کنندگان و ایجاد ذخیره اضطراری',
  },
  {
    id: 5, title: 'ترک نیروی کلیدی', severity: 'متوسط', probability: 40, impact: 45,
    mitigation: 'برنامه حفظ استعداد و مزایای رقابتی شغلی',
  },
];

const riskTrendData = [
  { month: 'فروردین', score: 62 },
  { month: 'اردیبهشت', score: 58 },
  { month: 'خرداد', score: 65 },
  { month: 'تیر', score: 60 },
  { month: 'مرداد', score: 55 },
  { month: 'شهریور', score: 52 },
  { month: 'مهر', score: 57 },
  { month: 'آبان', score: 54 },
  { month: 'آذر', score: 50 },
  { month: 'دی', score: 48 },
  { month: 'بهمن', score: 45 },
  { month: 'اسفند', score: 47 },
];

const scenarioCards = [
  {
    type: 'خوش‌بینانه' as const, probability: 25, revenue: 880,
    growth: 51.7, color: 'emerald',
    assumptions: ['رشد بازار ۲۰٪', 'موفقیت محصول جدید', 'ثبات ارزی', 'جذب سرمایه سری A'],
    keyMetrics: { margin: 35, cac: 120, ltv: 2400, churn: 2.1 },
  },
  {
    type: 'محتمل' as const, probability: 55, revenue: 790,
    growth: 36.2, color: 'teal',
    assumptions: ['رشد بازار ۱۲٪', 'پذیرش متوسط محصول', 'نوسان ارز محدود', 'تأمین مالی داخلی'],
    keyMetrics: { margin: 28, cac: 150, ltv: 1800, churn: 3.5 },
  },
  {
    type: 'بدبینانه' as const, probability: 20, revenue: 680,
    growth: 17.2, color: 'red',
    assumptions: ['رشد بازار ۵٪', 'تأخیر محصول جدید', 'افزایش شدید ارز', 'کاهش سرمایه'],
    keyMetrics: { margin: 18, cac: 200, ltv: 1200, churn: 6.2 },
  },
];

const scenarioCompareData = [
  { metric: 'درآمد (میلیارد)', optimistic: 880, likely: 790, pessimistic: 680 },
  { metric: 'حاشیه سود (%)', optimistic: 35, likely: 28, pessimistic: 18 },
  { metric: 'مشتریان جدید', optimistic: 2400, likely: 1600, pessimistic: 800 },
  { metric: 'بازار (%)', optimistic: 12, likely: 8, pessimistic: 4 },
];

const anomalyData = [
  { time: 'فروردین', value: 320, expected: 310, isAnomaly: false },
  { time: 'اردیبهشت', value: 345, expected: 335, isAnomaly: false },
  { time: 'خرداد', value: 380, expected: 360, isAnomaly: true },
  { time: 'تیر', value: 410, expected: 400, isAnomaly: false },
  { time: 'مرداد', value: 350, expected: 390, isAnomaly: true },
  { time: 'شهریور', value: 430, expected: 420, isAnomaly: false },
  { time: 'مهر', value: 465, expected: 450, isAnomaly: false },
  { time: 'آبان', value: 520, expected: 480, isAnomaly: true },
  { time: 'آذر', value: 510, expected: 510, isAnomaly: false },
  { time: 'دی', value: 530, expected: 535, isAnomaly: false },
  { time: 'بهمن', value: 555, expected: 550, isAnomaly: false },
  { time: 'اسفند', value: 540, expected: 575, isAnomaly: true },
];

const anomalyList = [
  { id: 1, severity: 'بالا', metric: 'درآمد خرداد', value: '۳۸۰', expected: '۳۶۰', date: '۱۴۰۴/۰۳/۳۰', deviation: '+۵.۶٪' },
  { id: 2, severity: 'بحرانی', metric: 'درآمد مرداد', value: '۳۵۰', expected: '۳۹۰', date: '۱۴۰۴/۰۵/۳۰', deviation: '-۱۰.۳٪' },
  { id: 3, severity: 'متوسط', metric: 'درآمد آبان', value: '۵۲۰', expected: '۴۸۰', date: '۱۴۰۴/۰۸/۳۰', deviation: '+۸.۳٪' },
  { id: 4, severity: 'بالا', metric: 'درآمد اسفند', value: '۵۴۰', expected: '۵۷۵', date: '۱۴۰۴/۱۲/۲۹', deviation: '-۶.۱٪' },
  { id: 5, severity: 'کم', metric: 'هزینه خرداد', value: '۲۸۰', expected: '۲۵۰', date: '۱۴۰۴/۰۳/۳۰', deviation: '+۱۲٪' },
];

const patternCards = [
  { title: 'الگوی فصلی', description: 'درآمد در فصل بهار و تابستان به‌طور مداوم بالاتر از میانگین است. این الگو در ۳ سال اخیر تکرار شده.', confidence: 92 },
  { title: 'همبستگی ارز-درآمد', description: 'نوسانات شدید نرخ ارز با تأخیر ۲ ماهه بر درآمد تأثیر منفی می‌گذارد.', confidence: 78 },
  { title: 'رشد شتابی مشتریان', description: 'نرخ رشد مشتریان جدید از ماه هفتم شتاب گرفته و روند صعودی دارد.', confidence: 85 },
];

const recommendations = [
  {
    id: 1, title: 'بهینه‌سازی قیف فروش', description: 'با بهبود نرخ تبدیل مراحل قیف فروش از ۱۲٪ به ۱۸٪، درآمد ۳ ماه آتی تا ۲۵٪ افزایش می‌یابد.',
    confidence: 89, impact: 'بالا', effort: 'متوسط', priority: 'بحرانی', category: 'درآمد',
  },
  {
    id: 2, title: 'کاهش نرخ ریزش مشتریان', description: 'اجرای برنامه وفاداری و بهبود پشتیبانی می‌تواند نرخ ریزش را از ۶.۲٪ به ۳.۵٪ کاهش دهد.',
    confidence: 82, impact: 'بالا', effort: 'کم', priority: 'بالا', category: 'درآمد',
  },
  {
    id: 3, title: 'تنوع‌بخشی بازار هدف', description: 'ورود به صنعت خرده‌فروشی آنلاین فرصت رشد ۴۰٪ را در ۶ ماه آینده ایجاد می‌کند.',
    confidence: 75, impact: 'بالا', effort: 'بالا', priority: 'بالا', category: 'رشد',
  },
  {
    id: 4, title: 'اتوماسیون فرآیندهای مالی', description: 'خودکارسازی صورتحساب و پرداخت می‌تواند هزینه عملیاتی را ۱۵٪ کاهش دهد.',
    confidence: 91, impact: 'متوسط', effort: 'کم', priority: 'متوسط', category: 'هزینه',
  },
  {
    id: 5, title: 'پوشش ریسک ارزی', description: 'خرید قراردادهای آتی ارز برای ۶ ماه آینده ریسک نوسان ارز را تا ۶۰٪ کاهش می‌دهد.',
    confidence: 87, impact: 'بالا', effort: 'متوسط', priority: 'بحرانی', category: 'ریسک',
  },
  {
    id: 6, title: 'توسعه تیم فنی', description: 'افزودن ۳ مهندس ارشد، سرعت توسعه محصول را ۴۰٪ افزایش و زمان تحویل را ۲ ماه کاهش می‌دهد.',
    confidence: 78, impact: 'متوسط', effort: 'متوسط', priority: 'متوسط', category: 'بهره‌وری',
  },
];

const featureImportanceData = [
  { feature: 'تاریخچه درآمد', importance: 92 },
  { feature: 'نرخ ارز', importance: 85 },
  { feature: 'رشد بازار', importance: 78 },
  { feature: 'نرخ ریزش', importance: 71 },
  { feature: 'تعداد مشتریان', importance: 65 },
  { feature: 'هزینه‌های عملیاتی', importance: 58 },
  { feature: 'نرخ تبدیل', importance: 52 },
  { feature: 'رضایت مشتری', importance: 45 },
];

// ─── Animation Variants ──────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

// ─── Helper Components ───────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    'بحرانی': { bg: 'bg-red-100', text: 'text-red-700' },
    'بالا': { bg: 'bg-orange-100', text: 'text-orange-700' },
    'متوسط': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    'کم': { bg: 'bg-green-100', text: 'text-green-700' },
    'پایین': { bg: 'bg-green-100', text: 'text-green-700' },
  };
  const s = map[severity] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  return <Badge className={`${s.bg} ${s.text} border-0 text-[11px] font-medium`}>{severity}</Badge>;
}

function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    'بحرانی': { bg: 'bg-red-500', text: 'text-white' },
    'بالا': { bg: 'bg-orange-500', text: 'text-white' },
    'متوسط': { bg: 'bg-yellow-500', text: 'text-white' },
    'کم': { bg: 'bg-green-500', text: 'text-white' },
  };
  const s = map[priority] || { bg: 'bg-gray-500', text: 'text-white' };
  return <Badge className={`${s.bg} ${s.text} border-0 text-[11px] font-medium`}>{priority}</Badge>;
}

function GrowthIndicator({ value }: { value: number | null }) {
  if (value === null) return <span className="text-slate-400 text-xs">—</span>;
  const isUp = value > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
      {isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      {Math.abs(value).toFixed(1)}٪
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AiPredictorView() {
  const { predictions, setPredictions } = useAppStore();
  const [activeTab, setActiveTab] = useState('revenue');
  const [recFilter, setRecFilter] = useState('all');
  const [investmentSlider, setInvestmentSlider] = useState([500]);
  const [marketGrowthSlider, setMarketGrowthSlider] = useState([12]);
  const [teamSizeSlider, setTeamSizeSlider] = useState([15]);

  // What-if impact calculations
  const whatIfImpact = useMemo(() => {
    const invDiff = (investmentSlider[0] - 500) / 500;
    const mktDiff = (marketGrowthSlider[0] - 12) / 12;
    const teamDiff = (teamSizeSlider[0] - 15) / 15;
    return {
      revenue: Math.round(790 * (1 + invDiff * 0.3 + mktDiff * 0.5 + teamDiff * 0.15)),
      margin: Math.round(28 + invDiff * 5 + teamDiff * 3 - mktDiff * 2),
      risk: Math.round(47 - invDiff * 8 + mktDiff * 3 - teamDiff * 2),
    };
  }, [investmentSlider, marketGrowthSlider, teamSizeSlider]);

  // Filtered recommendations
  const filteredRecs = useMemo(() => {
    if (recFilter === 'all') return recommendations;
    const catMap: Record<string, string> = {
      revenue: 'درآمد', cost: 'هزینه', growth: 'رشد', risk: 'ریسک', efficiency: 'بهره‌وری',
    };
    return recommendations.filter((r) => r.category === catMap[recFilter]);
  }, [recFilter]);

  // KPI Data
  const kpis = [
    { label: 'دقت پیش‌بینی', value: '۸۷.۳٪', icon: Target, color: 'from-emerald-500 to-teal-500', trend: '+2.1٪', trendUp: true },
    { label: 'تعداد مدل‌ها', value: '۱۲', icon: Layers, color: 'from-teal-500 to-cyan-500', trend: '+۲', trendUp: true },
    { label: 'سیگنال‌های مثبت', value: '۸', icon: TrendingUp, color: 'from-emerald-400 to-green-500', trend: '+۳', trendUp: true },
    { label: 'ریسک‌های شناسایی', value: '۳', icon: AlertTriangle, color: 'from-amber-500 to-orange-500', trend: '-۱', trendUp: false },
  ];

  return (
    <motion.div
      dir="rtl"
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">موتور پیش‌بینی هوشمند</h1>
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 text-[11px] font-bold px-2.5">فاز ۳</Badge>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">تحلیل و پیش‌بینی هوشمند کسب‌وکار با استفاده از الگوریتم‌های یادگیری ماشین</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 gap-2">
            <Wand2 className="w-4 h-4" />
            پیش‌بینی جدید
          </Button>
          <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 gap-2">
            <FlaskConical className="w-4 h-4" />
            تحلیل سناریو
          </Button>
        </div>
      </motion.div>

      {/* ─── KPI Row ──────────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
            <div className={`absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b ${kpi.color}`} />
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">{kpi.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
                  <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium mt-1 ${kpi.trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
                    {kpi.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {kpi.trend} نسبت به ماه قبل
                  </span>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center opacity-80`}>
                  <kpi.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* ─── Main Tabs ───────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-slate-100 p-1 h-auto flex-wrap gap-1">
            <TabsTrigger value="revenue" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm">
              <TrendingUp className="w-4 h-4" /> پیش‌بینی درآمد
            </TabsTrigger>
            <TabsTrigger value="risk" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm">
              <Shield className="w-4 h-4" /> تحلیل ریسک
            </TabsTrigger>
            <TabsTrigger value="scenario" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm">
              <FlaskConical className="w-4 h-4" /> سناریوسازی
            </TabsTrigger>
            <TabsTrigger value="anomaly" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm">
              <ScanSearch className="w-4 h-4" /> تشخیص ناهنجاری
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm">
              <Lightbulb className="w-4 h-4" /> توصیه‌های هوشمند
            </TabsTrigger>
          </TabsList>

          {/* ─── Tab 1: Revenue Forecast ────────────────────────────────── */}
          <TabsContent value="revenue" className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-600" />
                    پیش‌بینی درآمد ۱۸ ماهه
                  </CardTitle>
                  <Badge className="bg-emerald-50 text-emerald-700 border-0 text-[11px]">دقت: ۸۷.۳٪</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="pessGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#0d9488" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={50} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}`} />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, direction: 'rtl' }}
                        formatter={(value: number, name: string) => {
                          const labels: Record<string, string> = { actual: 'واقعی', optimistic: 'خوش‌بینانه', likely: 'محتمل', pessimistic: 'بدبینانه' };
                          return [`${value} میلیارد`, labels[name] || name];
                        }}
                      />
                      <Legend formatter={(value: string) => {
                        const labels: Record<string, string> = { actual: 'واقعی', optimistic: 'خوش‌بینانه', likely: 'محتمل', pessimistic: 'بدبینانه' };
                        return labels[value] || value;
                      }} />
                      {/* Confidence band */}
                      <ReferenceArea x1="فروردین ۲" x2="شهریور ۲" fill="#f0fdf4" fillOpacity={0.5} />
                      <ReferenceLine x="فروردین ۲" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1} label={{ value: 'شروع پیش‌بینی', position: 'insideTopRight', fontSize: 10, fill: '#64748b' }} />
                      <Area type="monotone" dataKey="optimistic" stroke="#10b981" fill="url(#optGrad)" strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
                      <Area type="monotone" dataKey="pessimistic" stroke="#ef4444" fill="url(#pessGrad)" strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
                      <Area type="monotone" dataKey="actual" stroke="#0d9488" fill="url(#actualGrad)" strokeWidth={2.5} dot={{ r: 3, fill: '#0d9488' }} />
                      <Line type="monotone" dataKey="likely" stroke="#6366f1" strokeWidth={2} strokeDasharray="8 4" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Table */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-teal-600" />
                  جدول مقایسه درآمد واقعی و پیش‌بینی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-right py-2 px-3 text-slate-500 font-medium text-xs">ماه</th>
                        <th className="text-right py-2 px-3 text-slate-500 font-medium text-xs">واقعی (میلیارد)</th>
                        <th className="text-right py-2 px-3 text-slate-500 font-medium text-xs">پیش‌بینی (میلیارد)</th>
                        <th className="text-right py-2 px-3 text-slate-500 font-medium text-xs">انحراف</th>
                        <th className="text-right py-2 px-3 text-slate-500 font-medium text-xs">رشد ماهانه</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueTableData.map((row, i) => {
                        const deviation = ((row.actual - row.predicted) / row.predicted * 100).toFixed(1);
                        const devNum = parseFloat(deviation);
                        return (
                          <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                            <td className="py-2.5 px-3 font-medium text-slate-700">{row.month}</td>
                            <td className="py-2.5 px-3 text-slate-800">{row.actual}</td>
                            <td className="py-2.5 px-3 text-slate-600">{row.predicted}</td>
                            <td className="py-2.5 px-3">
                              <span className={`text-xs font-medium ${devNum > 0 ? 'text-emerald-600' : devNum < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                                {deviation}٪
                              </span>
                            </td>
                            <td className="py-2.5 px-3"><GrowthIndicator value={row.growth} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Tab 2: Risk Analysis ───────────────────────────────────── */}
          <TabsContent value="risk" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Risk Radar */}
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-600" />
                    رادار ریسک (۶ بعدی)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={riskRadarData} cx="50%" cy="50%" outerRadius="70%">
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12, fill: '#475569' }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Radar name="امتیاز ریسک" dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Score Gauge */}
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-orange-600" />
                    امتیاز کلی ریسک
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      <circle cx="100" cy="100" r="85" fill="none" stroke="#e2e8f0" strokeWidth="16" />
                      <circle
                        cx="100" cy="100" r="85" fill="none"
                        stroke="url(#riskGaugeGrad)" strokeWidth="16"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 85 * 0.47} ${2 * Math.PI * 85}`}
                        transform="rotate(-90 100 100)"
                      />
                      <defs>
                        <linearGradient id="riskGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="50%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#ef4444" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-slate-900">۴۷</span>
                      <span className="text-xs text-slate-500 mt-1">از ۱۰۰</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-6 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> پایین (۰-۳۰)</div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> متوسط (۳۰-۶۰)</div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> بالا (۶۰-۱۰۰)</div>
                  </div>
                  <p className="text-sm text-amber-600 font-medium mt-3">سطح ریسک: متوسط</p>
                </CardContent>
              </Card>

              {/* Risk Matrix Scatter */}
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <CircleDot className="w-5 h-5 text-red-600" />
                    ماتریس ریسک (احتمال × تأثیر)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="number" dataKey="probability" name="احتمال" domain={[0, 1]} tick={{ fontSize: 11 }} label={{ value: 'احتمال', position: 'insideBottom', offset: -5, fontSize: 11 }} />
                        <YAxis type="number" dataKey="impact" name="تأثیر" domain={[0, 100]} tick={{ fontSize: 11 }} label={{ value: 'تأثیر', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, direction: 'rtl' }}
                          formatter={(value: number, name: string) => [name === 'probability' ? `${(value * 100).toFixed(0)}٪` : value, name === 'probability' ? 'احتمال' : 'تأثیر']}
                          labelFormatter={(_, payload) => {
                            if (payload && payload[0]) {
                              const d = payload[0].payload as typeof riskMatrixData[number];
                              return d.name;
                            }
                            return '';
                          }}
                        />
                        <ReferenceLine x={0.5} stroke="#f59e0b" strokeDasharray="4 4" />
                        <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="4 4" />
                        <Scatter data={riskMatrixData} fill="#6366f1" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Trend */}
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-amber-600" />
                    روند امتیاز ریسک
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={riskTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={50} />
                        <YAxis domain={[30, 80]} tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, direction: 'rtl' }} />
                        <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'آستانه', position: 'insideTopLeft', fontSize: 10, fill: '#f59e0b' }} />
                        <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3, fill: '#f59e0b' }} activeDot={{ r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top 5 Risks */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <FileWarning className="w-5 h-5 text-red-600" />
                  ۵ ریسک برتر
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {topRisks.map((risk, i) => (
                    <motion.div
                      key={risk.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-sm text-slate-800">{risk.title}</h4>
                        <SeverityBadge severity={risk.severity} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                          <p className="text-[10px] text-slate-400 mb-0.5">احتمال</p>
                          <Progress value={risk.probability} className="h-1.5" />
                          <p className="text-[11px] text-slate-600 mt-0.5">{risk.probability}٪</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 mb-0.5">تأثیر</p>
                          <Progress value={risk.impact} className="h-1.5" />
                          <p className="text-[11px] text-slate-600 mt-0.5">{risk.impact}٪</p>
                        </div>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <p className="text-[11px] text-slate-500 mb-0.5">اقال کاهشی:</p>
                        <p className="text-xs text-slate-700 leading-relaxed">{risk.mitigation}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Tab 3: Scenario Planning ───────────────────────────────── */}
          <TabsContent value="scenario" className="space-y-4">
            {/* Scenario Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenarioCards.map((sc, i) => {
                const borderColor = sc.color === 'emerald' ? 'border-emerald-400' : sc.color === 'teal' ? 'border-teal-400' : 'border-red-400';
                const bgAccent = sc.color === 'emerald' ? 'bg-emerald-50' : sc.color === 'teal' ? 'bg-teal-50' : 'bg-red-50';
                const textAccent = sc.color === 'emerald' ? 'text-emerald-700' : sc.color === 'teal' ? 'text-teal-700' : 'text-red-700';
                const gradientBg = sc.color === 'emerald' ? 'from-emerald-500 to-green-600' : sc.color === 'teal' ? 'from-teal-500 to-cyan-600' : 'from-red-500 to-orange-600';
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}>
                    <Card className={`border-t-4 ${borderColor} border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden`}>
                      <div className={`h-1.5 bg-gradient-to-r ${gradientBg}`} />
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className={`text-base font-bold ${textAccent}`}>{sc.type}</CardTitle>
                          <Badge className={`${bgAccent} ${textAccent} border-0 text-[11px]`}>{sc.probability}٪ احتمال</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-slate-900">{sc.revenue}</span>
                          <span className="text-sm text-slate-500">میلیارد تومان</span>
                        </div>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${sc.growth > 30 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {sc.growth > 30 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                          رشد {sc.growth}٪
                        </span>
                        <div>
                          <p className="text-[11px] text-slate-400 mb-1.5">فرضیات کلیدی:</p>
                          <ul className="space-y-1">
                            {sc.assumptions.map((a, j) => (
                              <li key={j} className="flex items-start gap-1.5 text-xs text-slate-600">
                                <ChevronLeft className="w-3 h-3 mt-0.5 text-slate-400 shrink-0" />
                                {a}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                          <div><p className="text-[10px] text-slate-400">حاشیه سود</p><p className="text-sm font-bold text-slate-800">{sc.keyMetrics.margin}٪</p></div>
                          <div><p className="text-[10px] text-slate-400">CAC</p><p className="text-sm font-bold text-slate-800">{sc.keyMetrics.cac}$</p></div>
                          <div><p className="text-[10px] text-slate-400">LTV</p><p className="text-sm font-bold text-slate-800">{sc.keyMetrics.ltv}$</p></div>
                          <div><p className="text-[10px] text-slate-400">ریزش</p><p className="text-sm font-bold text-slate-800">{sc.keyMetrics.churn}٪</p></div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Scenario Comparison Chart */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  مقایسه سناریوها
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scenarioCompareData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, direction: 'rtl' }} />
                      <Legend formatter={(value: string) => {
                        const m: Record<string, string> = { optimistic: 'خوش‌بینانه', likely: 'محتمل', pessimistic: 'بدبینانه' };
                        return m[value] || value;
                      }} />
                      <Bar dataKey="optimistic" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="likely" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="pessimistic" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* What-If Analysis */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-violet-600" />
                  تحلیل What-If
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">مبلغ سرمایه‌گذاری</label>
                      <Badge variant="outline" className="text-emerald-700 border-emerald-200">{investmentSlider[0]} میلیون $</Badge>
                    </div>
                    <Slider value={investmentSlider} onValueChange={setInvestmentSlider} min={100} max={2000} step={50} className="w-full" />
                    <div className="flex justify-between text-[10px] text-slate-400"><span>۱۰۰</span><span>۲,۰۰۰</span></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">نرخ رشد بازار</label>
                      <Badge variant="outline" className="text-teal-700 border-teal-200">{marketGrowthSlider[0]}٪</Badge>
                    </div>
                    <Slider value={marketGrowthSlider} onValueChange={setMarketGrowthSlider} min={0} max={40} step={1} className="w-full" />
                    <div className="flex justify-between text-[10px] text-slate-400"><span>۰٪</span><span>۴۰٪</span></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">اندازه تیم</label>
                      <Badge variant="outline" className="text-indigo-700 border-indigo-200">{teamSizeSlider[0]} نفر</Badge>
                    </div>
                    <Slider value={teamSizeSlider} onValueChange={setTeamSizeSlider} min={5} max={50} step={1} className="w-full" />
                    <div className="flex justify-between text-[10px] text-slate-400"><span>۵</span><span>۵۰</span></div>
                  </div>
                </div>
                {/* Impact Summary */}
                <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                  <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    خلاصه تأثیر تغییرات
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <p className="text-[11px] text-slate-400 mb-1">درآمد پیش‌بینی شده</p>
                      <p className="text-xl font-bold text-emerald-600">{whatIfImpact.revenue} میلیارد</p>
                      <p className={`text-[11px] font-medium mt-1 ${whatIfImpact.revenue > 790 ? 'text-emerald-600' : whatIfImpact.revenue < 790 ? 'text-red-500' : 'text-slate-400'}`}>
                        {whatIfImpact.revenue > 790 ? '↑' : whatIfImpact.revenue < 790 ? '↓' : '—'} {Math.abs(whatIfImpact.revenue - 790)} میلیارد نسبت به سناریوی محتمل
                      </p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <p className="text-[11px] text-slate-400 mb-1">حاشیه سود</p>
                      <p className="text-xl font-bold text-teal-600">{whatIfImpact.margin}٪</p>
                      <p className={`text-[11px] font-medium mt-1 ${whatIfImpact.margin > 28 ? 'text-emerald-600' : whatIfImpact.margin < 28 ? 'text-red-500' : 'text-slate-400'}`}>
                        {whatIfImpact.margin > 28 ? '↑' : whatIfImpact.margin < 28 ? '↓' : '—'} {Math.abs(whatIfImpact.margin - 28)}٪ نسبت به سناریوی محتمل
                      </p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <p className="text-[11px] text-slate-400 mb-1">امتیاز ریسک</p>
                      <p className="text-xl font-bold text-amber-600">{whatIfImpact.risk}</p>
                      <p className={`text-[11px] font-medium mt-1 ${whatIfImpact.risk < 47 ? 'text-emerald-600' : whatIfImpact.risk > 47 ? 'text-red-500' : 'text-slate-400'}`}>
                        {whatIfImpact.risk < 47 ? '↓' : whatIfImpact.risk > 47 ? '↑' : '—'} {Math.abs(whatIfImpact.risk - 47)} نسبت به وضع فعلی
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Tab 4: Anomaly Detection ───────────────────────────────── */}
          <TabsContent value="anomaly" className="space-y-4">
            {/* Anomaly Timeline */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <ScanSearch className="w-5 h-5 text-red-600" />
                    خط زمانی ناهنجاری‌ها
                  </CardTitle>
                  <Badge className="bg-red-50 text-red-700 border-0 text-[11px]">۴ ناهنجاری شناسایی شده</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={anomalyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="time" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={50} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, direction: 'rtl' }}
                        formatter={(value: number, name: string) => {
                          const m: Record<string, string> = { value: 'مقدار واقعی', expected: 'مقدار مورد انتظار' };
                          return [`${value} میلیارد`, m[name] || name];
                        }}
                      />
                      <Legend formatter={(value: string) => {
                        const m: Record<string, string> = { value: 'مقدار واقعی', expected: 'مقدار مورد انتظار' };
                        return m[value] || value;
                      }} />
                      <Line type="monotone" dataKey="expected" stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 3" dot={false} />
                      <Line
                        type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={2.5}
                        dot={(props: Record<string, unknown>) => {
                          const { cx, cy, payload } = props as { cx: number; cy: number; payload: typeof anomalyData[number] };
                          if (payload.isAnomaly) {
                            return (
                              <circle key={`dot-${payload.time}`} cx={cx} cy={cy} r={6} fill="#ef4444" stroke="#fff" strokeWidth={2} />
                            );
                          }
                          return (
                            <circle key={`dot-${payload.time}`} cx={cx} cy={cy} r={3} fill="#0d9488" />
                          );
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> نقطه ناهنجاری</div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal-600" /> مقدار عادی</div>
                  <div className="flex items-center gap-1.5"><span className="w-5 border-t-2 border-dashed border-slate-400" /> مقدار مورد انتظار</div>
                </div>
              </CardContent>
            </Card>

            {/* Anomaly List */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  لیست ناهنجاری‌های شناسایی شده
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-right py-2 px-3 text-slate-500 font-medium text-xs">شدت</th>
                        <th className="text-right py-2 px-3 text-slate-500 font-medium text-xs">معیار</th>
                        <th className="text-right py-2 px-3 text-slate-500 font-medium text-xs">مقدار</th>
                        <th className="text-right py-2 px-3 text-slate-500 font-medium text-xs">مورد انتظار</th>
                        <th className="text-right py-2 px-3 text-slate-500 font-medium text-xs">انحراف</th>
                        <th className="text-right py-2 px-3 text-slate-500 font-medium text-xs">تاریخ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {anomalyList.map((a) => (
                        <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="py-2.5 px-3"><SeverityBadge severity={a.severity} /></td>
                          <td className="py-2.5 px-3 font-medium text-slate-700">{a.metric}</td>
                          <td className="py-2.5 px-3 text-slate-800">{a.value}</td>
                          <td className="py-2.5 px-3 text-slate-500">{a.expected}</td>
                          <td className="py-2.5 px-3">
                            <span className={`text-xs font-medium ${a.deviation.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                              {a.deviation}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 text-xs">{a.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pattern Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {patternCards.map((p, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-bold text-slate-800">{p.title}</CardTitle>
                        <Badge className="bg-indigo-50 text-indigo-700 border-0 text-[10px]">{p.confidence}٪ اطمینان</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Auto-generated Alerts */}
            <Card className="border-0 shadow-md border-r-4 border-r-amber-400">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  هشدارهای خودکار
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800">افت شدید درآمد مرداد</p>
                    <p className="text-xs text-red-600 mt-0.5">درآمد مرداد ۱۰.۳٪ کمتر از مقدار مورد انتظار بوده است. بررسی عوامل داخلی و خارجی توصیه می‌شود.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <Info className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">رشد غیرعادی آبان</p>
                    <p className="text-xs text-amber-600 mt-0.5">درآمد آبان ۸.۳٪ بیشتر از پیش‌بینی بود. بررسی عامل محرک برای تکرار الگو پیشنهاد می‌شود.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">انحراف اسفند</p>
                    <p className="text-xs text-orange-600 mt-0.5">درآمد اسفند ۶.۱٪ کمتر از مقدار مورد انتظار است. اقدام پیشگیرانه برای جبران توصیه می‌شود.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Tab 5: Smart Recommendations ────────────────────────────── */}
          <TabsContent value="recommendations" className="space-y-4">
            {/* Category Filter */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-slate-600 ml-2">فیلتر دسته‌بندی:</span>
                  {[
                    { key: 'all', label: 'همه' },
                    { key: 'revenue', label: 'درآمد' },
                    { key: 'cost', label: 'هزینه' },
                    { key: 'growth', label: 'رشد' },
                    { key: 'risk', label: 'ریسک' },
                    { key: 'efficiency', label: 'بهره‌وری' },
                  ].map((f) => (
                    <Button
                      key={f.key}
                      variant={recFilter === f.key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setRecFilter(f.key)}
                      className={recFilter === f.key ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}
                    >
                      {f.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecs.map((rec, i) => {
                const impactColor = rec.impact === 'بالا' ? 'text-emerald-700 bg-emerald-50' : rec.impact === 'متوسط' ? 'text-amber-700 bg-amber-50' : 'text-slate-700 bg-slate-50';
                const effortColor = rec.effort === 'بالا' ? 'text-red-700 bg-red-50' : rec.effort === 'متوسط' ? 'text-amber-700 bg-amber-50' : 'text-emerald-700 bg-emerald-50';
                return (
                  <motion.div key={rec.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-sm font-bold text-slate-800 leading-relaxed">{rec.title}</CardTitle>
                          <PriorityBadge priority={rec.priority} />
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col">
                        <p className="text-xs text-slate-600 leading-relaxed mb-3 flex-1">{rec.description}</p>

                        {/* Confidence */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-slate-400">سطح اطمینان</span>
                            <span className="text-[11px] font-bold text-indigo-600">{rec.confidence}٪</span>
                          </div>
                          <Progress value={rec.confidence} className="h-1.5" />
                        </div>

                        {/* Impact / Effort / Category */}
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <Badge className={`${impactColor} border-0 text-[10px]`}>تأثیر: {rec.impact}</Badge>
                          <Badge className={`${effortColor} border-0 text-[10px]`}>تلاش: {rec.effort}</Badge>
                          <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-500">{rec.category}</Badge>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <Button size="sm" className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs gap-1.5 h-8">
                            <Play className="w-3 h-3" />
                            اجرا کن
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 border-slate-200 text-slate-600 text-xs gap-1.5 h-8">
                            <Eye className="w-3 h-3" />
                            بیشتر بدان
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {filteredRecs.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm">توصیه‌ای در این دسته‌بندی یافت نشد</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* ─── Prediction Model Info Panel ──────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md border-t-4 border-t-indigo-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              اطلاعات مدل پیش‌بینی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Model Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">دقت مدل</span>
                  <div className="flex items-center gap-2">
                    <Progress value={87.3} className="w-20 h-2" />
                    <span className="text-sm font-bold text-emerald-600">۸۷.۳٪</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">آخرین آموزش</span>
                  <span className="text-sm font-medium text-slate-800">۱۴۰۴/۱۲/۲۵</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">نقاط داده استفاده شده</span>
                  <span className="text-sm font-bold text-indigo-600">۲۴,۵۶۰</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">نوع مدل</span>
                  <span className="text-sm font-medium text-slate-800">Ensemble (LSTM + XGBoost)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">فرکانس بازآموزی</span>
                  <span className="text-sm font-medium text-slate-800">هفتگی</span>
                </div>
              </div>

              {/* Feature Importance Chart */}
              <div className="lg:col-span-2">
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  اهمیت ویژگی‌ها
                </h4>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={featureImportanceData} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="feature" tick={{ fontSize: 11 }} width={75} />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, direction: 'rtl' }}
                        formatter={(value: number) => [`${value}٪`, 'اهمیت']}
                      />
                      <Bar dataKey="importance" fill="url(#featGrad)" radius={[0, 6, 6, 0]} barSize={18} />
                      <defs>
                        <linearGradient id="featGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
