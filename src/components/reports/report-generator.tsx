'use client';

import { useState, useMemo } from 'react';
import { useAppStore, type ReportTemplate } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Share2,
  Plus,
  Calendar,
  BarChart3,
  TrendingUp,
  Shield,
  Brain,
  Target,
  Building2,
  Zap,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Eye,
  Trash2,
  RefreshCw,
  Mail,
  Settings,
  ChevronLeft,
  ChevronRight,
  PieChart,
  Activity,
  Layers,
  AlertTriangle,
  Users,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Types ───────────────────────────────────────────────────────────────────

type ReportType = 'strategic' | 'financial' | 'growth' | 'risk' | 'market' | 'investor' | 'executive' | 'performance';
type ReportFormat = 'pdf' | 'excel' | 'csv';
type ReportStatus = 'completed' | 'generating' | 'failed';

interface ReportTemplateData extends ReportTemplate {
  icon: React.ComponentType<{ className?: string }>;
  sectionsCount: number;
  color: string;
  bgColor: string;
}

interface GeneratedReport {
  id: string;
  title: string;
  type: ReportType;
  format: ReportFormat;
  generatedAt: string;
  size: string;
  status: ReportStatus;
}

interface AutoAnalysisConfig {
  schedule: 'daily' | 'weekly' | 'monthly';
  metrics: string[];
  alertThresholds: Record<string, number>;
  recipients: string[];
  isEnabled: boolean;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const reportTemplates: ReportTemplateData[] = [
  {
    id: 'tpl-1',
    name: 'گزارش استراتژیک',
    type: 'strategic',
    description: 'تحلیل جامع موقعیت استراتژیک سازمان شامل SWOT، اهداف و برنامه‌های راهبردی',
    sections: ['خلاصه مدیریتی', 'تحلیل SWOT', 'اهداف استراتژیک', 'نقشه راه', 'توصیه‌ها'],
    format: 'pdf',
    icon: Target,
    sectionsCount: 5,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    id: 'tpl-2',
    name: 'گزارش مالی',
    type: 'financial',
    description: 'بررسی سلامت مالی، جریان نقدی، نسبت‌های مالی و پیش‌بینی درآمد',
    sections: ['صورت‌های مالی', 'نسبت‌های مالی', 'جریان نقدی', 'پیش‌بینی درآمد', 'هزینه‌ها'],
    format: 'pdf',
    icon: BarChart3,
    sectionsCount: 5,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    id: 'tpl-3',
    name: 'گزارش رشد',
    type: 'growth',
    description: 'تحلیل روندهای رشد، فرصت‌های توسعه و شاخص‌های کلیدی عملکرد رشد',
    sections: ['شاخص‌های رشد', 'روندها', 'فرصت‌ها', 'چالش‌ها', 'برنامه رشد'],
    format: 'pdf',
    icon: TrendingUp,
    sectionsCount: 5,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
  },
  {
    id: 'tpl-4',
    name: 'گزارش ریسک',
    type: 'risk',
    description: 'شناسایی، ارزیابی و مدیریت ریسک‌های سازمانی و استراتژیک',
    sections: ['شناسایی ریسک', 'ارزیابی ریسک', 'ماتریس ریسک', 'برنامه پاسخ', 'پایش'],
    format: 'pdf',
    icon: Shield,
    sectionsCount: 5,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    id: 'tpl-5',
    name: 'گزارش بازار',
    type: 'market',
    description: 'تحلیل بازار، رقبا، سهم بازار و روندهای صنعت',
    sections: ['اندازه بازار', 'تحلیل رقبا', 'سهم بازار', 'روندهای صنعت', 'فرصت‌ها'],
    format: 'pdf',
    icon: PieChart,
    sectionsCount: 5,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    id: 'tpl-6',
    name: 'گزارش سرمایه‌گذار',
    type: 'investor',
    description: 'گزارش تخصصی برای سرمایه‌گذاران شامل ارزش‌گذاری و فرصت‌های سرمایه‌گذاری',
    sections: ['ارزش‌گذاری', 'معیارهای سرمایه‌گذاری', 'بازدهی', 'پیش‌بینی', 'فرصت‌ها'],
    format: 'pdf',
    icon: Building2,
    sectionsCount: 5,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'tpl-7',
    name: 'گزارش اجرایی',
    type: 'executive',
    description: 'خلاصه مدیریتی عملکرد سازمان برای مدیران ارشد',
    sections: ['خلاصه مدیریتی', 'عملکرد کلیدی', 'وضعیت پروژه‌ها', 'بودجه', 'توصیه‌ها'],
    format: 'pdf',
    icon: Layers,
    sectionsCount: 5,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    id: 'tpl-8',
    name: 'گزارش عملکرد',
    type: 'performance',
    description: 'ارزیابی عملکرد سازمانی شامل KPI‌ها، بهره‌وری و شاخص‌های کیفی',
    sections: ['KPI‌ها', 'بهره‌وری', 'کیفیت', 'رضایت مشتری', 'بهبود'],
    format: 'pdf',
    icon: Activity,
    sectionsCount: 5,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

const mockRecentReports: GeneratedReport[] = [
  { id: 'rep-1', title: 'گزارش استراتژیک سه‌ماهه سوم ۱۴۰۴', type: 'strategic', format: 'pdf', generatedAt: '۱۴۰۴/۱۲/۱۵', size: '۲.۴ مگابایت', status: 'completed' },
  { id: 'rep-2', title: 'گزارش مالی آبان ۱۴۰۴', type: 'financial', format: 'pdf', generatedAt: '۱۴۰۴/۱۲/۱۴', size: '۱.۸ مگابایت', status: 'completed' },
  { id: 'rep-3', title: 'گزارش رشد سالانه ۱۴۰۴', type: 'growth', format: 'excel', generatedAt: '۱۴۰۴/۱۲/۱۳', size: '۳.۱ مگابایت', status: 'completed' },
  { id: 'rep-4', title: 'ارزیابی ریسک Q4', type: 'risk', format: 'pdf', generatedAt: '۱۴۰۴/۱۲/۱۲', size: '۱.۵ مگابایت', status: 'completed' },
  { id: 'rep-5', title: 'تحلیل بازار فناوری ۱۴۰۴', type: 'market', format: 'pdf', generatedAt: '۱۴۰۴/۱۲/۱۰', size: '۴.۲ مگابایت', status: 'completed' },
  { id: 'rep-6', title: 'گزارش سرمایه‌گذار دوره زمستانی', type: 'investor', format: 'pdf', generatedAt: '۱۴۰۴/۱۲/۰۸', size: '۲.۷ مگابایت', status: 'completed' },
  { id: 'rep-7', title: 'خلاصه اجرایی آذر ۱۴۰۴', type: 'executive', format: 'csv', generatedAt: '۱۴۰۴/۱۲/۰۵', size: '۰.۸ مگابایت', status: 'completed' },
  { id: 'rep-8', title: 'عملکرد تیم فروش Q3', type: 'performance', format: 'pdf', generatedAt: '۱۴۰۴/۱۲/۰۳', size: '۱.۹ مگابایت', status: 'completed' },
  { id: 'rep-9', title: 'گزارش مالی آذر ۱۴۰۴', type: 'financial', format: 'pdf', generatedAt: '۱۴۰۴/۱۲/۰۱', size: 'در حال تولید...', status: 'generating' },
  { id: 'rep-10', title: 'گزارش ریسک فصلی', type: 'risk', format: 'pdf', generatedAt: '۱۴۰۴/۱۱/۲۸', size: '۲.۱ مگابایت', status: 'completed' },
];

const reportTypeLabels: Record<ReportType, string> = {
  strategic: 'استراتژیک',
  financial: 'مالی',
  growth: 'رشد',
  risk: 'ریسک',
  market: 'بازار',
  investor: 'سرمایه‌گذار',
  executive: 'اجراتی',
  performance: 'عملکرد',
};

const formatLabels: Record<ReportFormat, string> = {
  pdf: 'PDF',
  excel: 'Excel',
  csv: 'CSV',
};

const availableSections: Record<ReportType, string[]> = {
  strategic: ['خلاصه مدیریتی', 'تحلیل SWOT', 'اهداف استراتژیک', 'نقشه راه', 'توصیه‌ها', 'تحلیل رقبا', 'ماتریس BCG', 'تحلیل PESTEL'],
  financial: ['صورت‌های مالی', 'نسبت‌های مالی', 'جریان نقدی', 'پیش‌بینی درآمد', 'هزینه‌ها', 'سرمایه‌گذاری‌ها', 'بودجه', 'تحلیل سودآوری'],
  growth: ['شاخص‌های رشد', 'روندها', 'فرصت‌ها', 'چالش‌ها', 'برنامه رشد', 'تحلیل بازار', 'استراتژی ورود', 'توسعه محصول'],
  risk: ['شناسایی ریسک', 'ارزیابی ریسک', 'ماتریس ریسک', 'برنامه پاسخ', 'پایش', 'ریسک‌های عملیاتی', 'ریسک مالی', 'ریسک استراتژیک'],
  market: ['اندازه بازار', 'تحلیل رقبا', 'سهم بازار', 'روندهای صنعت', 'فرصت‌ها', 'تحلیل مشتری', 'کانال‌های فروش', 'پیش‌بینی بازار'],
  investor: ['ارزش‌گذاری', 'معیارهای سرمایه‌گذاری', 'بازدهی', 'پیش‌بینی', 'فرصت‌ها', 'تحلیل مالی', 'اعتبار سنجی', 'خروج سرمایه'],
  executive: ['خلاصه مدیریتی', 'عملکرد کلیدی', 'وضعیت پروژه‌ها', 'بودجه', 'توصیه‌ها', 'منابع انسانی', 'فناوری', 'چالش‌های پیش‌رو'],
  performance: ['KPI‌ها', 'بهره‌وری', 'کیفیت', 'رضایت مشتری', 'بهبود', 'عملکرد تیم', 'شاخص‌های مالی', 'تحلیل شکاف'],
};

const availableMetrics = [
  'درآمد کل', 'سود خالص', 'حاشیه سود', 'نرخ رشد', 'سهم بازار',
  'رضایت مشتری', 'نرخ حفظ مشتری', 'بهره‌وری نیروی کار', 'ROI', 'NPV',
  'نسبت بدهی', 'جریان نقدی آزاد', 'نرخ تبدیل', 'میانگین ارزش سفارش', 'NPS',
];

// ─── Animation Variants ──────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const cardHoverVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function ReportGenerator() {
  const { reportTemplates: storeTemplates, setReportTemplates } = useAppStore();

  // Tab state
  const [activeTab, setActiveTab] = useState('templates');

  // Wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedReportType, setSelectedReportType] = useState<ReportType | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('quarterly');
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Recent reports state
  const [recentReports, setRecentReports] = useState<GeneratedReport[]>(mockRecentReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Auto analysis state
  const [autoConfig, setAutoConfig] = useState<AutoAnalysisConfig>({
    schedule: 'weekly',
    metrics: ['درآمد کل', 'سود خالص', 'نرخ رشد', 'سهم بازار'],
    alertThresholds: {
      'درآمد کل': 10,
      'سود خالص': 5,
      'نرخ رشد': 15,
      'سهم بازار': 3,
    },
    recipients: ['ceo@company.ir', 'cfo@company.ir'],
    isEnabled: true,
  });
  const [newRecipient, setNewRecipient] = useState('');

  // Preview dialog state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewReport, setPreviewReport] = useState<GeneratedReport | null>(null);
  const [generating, setGenerating] = useState(false);

  // Stats
  const stats = useMemo(() => ({
    generated: recentReports.filter((r) => r.status === 'completed').length,
    templates: reportTemplates.length,
    pdfExports: recentReports.filter((r) => r.format === 'pdf' && r.status === 'completed').length,
    shared: 7,
  }), [recentReports]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleUseTemplate = (template: ReportTemplateData) => {
    setSelectedReportType(template.type as ReportType);
    setSelectedSections(template.sections);
    setActiveTab('create');
    setWizardStep(2);
    toast.success(`قالب "${template.name}" انتخاب شد`);
  };

  const handleNextStep = () => {
    if (wizardStep === 1 && !selectedReportType) {
      toast.error('لطفاً نوع گزارش را انتخاب کنید');
      return;
    }
    if (wizardStep === 3 && selectedSections.length === 0) {
      toast.error('لطفاً حداقل یک بخش را انتخاب کنید');
      return;
    }
    setWizardStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    setWizardStep((prev) => Math.max(prev - 1, 1));
  };

  const handleToggleSection = (section: string) => {
    setSelectedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const handleToggleMetric = (metric: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]
    );
  };

  const handleToggleDimension = (dim: string) => {
    setSelectedDimensions((prev) =>
      prev.includes(dim) ? prev.filter((d) => d !== dim) : [...prev, dim]
    );
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    const typeLabel = reportTypeLabels[selectedReportType!];
    const newReport: GeneratedReport = {
      id: `rep-${Date.now()}`,
      title: `گزارش ${typeLabel} - ${new Date().toLocaleDateString('fa-IR')}`,
      type: selectedReportType!,
      format: selectedFormat,
      generatedAt: new Date().toLocaleDateString('fa-IR'),
      size: 'در حال تولید...',
      status: 'generating',
    };
    setRecentReports((prev) => [newReport, ...prev]);
    setPreviewReport(newReport);
    setPreviewOpen(true);

    await new Promise((r) => setTimeout(r, 3000));

    setRecentReports((prev) =>
      prev.map((r) =>
        r.id === newReport.id
          ? { ...r, status: 'completed' as ReportStatus, size: '۲.۲ مگابایت' }
          : r
      )
    );
    setPreviewReport((prev) =>
      prev?.id === newReport.id
        ? { ...prev, status: 'completed', size: '۲.۲ مگابایت' }
        : prev
    );
    setGenerating(false);
    toast.success('گزارش با موفقیت تولید شد');
  };

  const handleDeleteReport = (id: string) => {
    setRecentReports((prev) => prev.filter((r) => r.id !== id));
    toast.success('گزارش حذف شد');
  };

  const handleRegenerateReport = async (report: GeneratedReport) => {
    setRecentReports((prev) =>
      prev.map((r) =>
        r.id === report.id ? { ...r, status: 'generating' as ReportStatus, size: 'در حال تولید...' } : r
      )
    );
    toast.info('در حال تولید مجدد گزارش...');
    await new Promise((r) => setTimeout(r, 2500));
    setRecentReports((prev) =>
      prev.map((r) =>
        r.id === report.id ? { ...r, status: 'completed' as ReportStatus, size: '۲.۵ مگابایت' } : r
      )
    );
    toast.success('گزارش مجدداً تولید شد');
  };

  const handleShareReport = (report: GeneratedReport) => {
    toast.success(`لینک اشتراک‌گذاری گزارش "${report.title}" کپی شد`);
  };

  const handleDownloadReport = (report: GeneratedReport) => {
    toast.success(`دانلود گزارش "${report.title}" با فرمت ${formatLabels[report.format]} شروع شد`);
  };

  const handleViewReport = (report: GeneratedReport) => {
    setPreviewReport(report);
    setPreviewOpen(true);
  };

  const handleAddRecipient = () => {
    if (!newRecipient || !newRecipient.includes('@')) {
      toast.error('لطفاً ایمیل معتبر وارد کنید');
      return;
    }
    if (autoConfig.recipients.includes(newRecipient)) {
      toast.error('این ایمیل قبلاً اضافه شده است');
      return;
    }
    setAutoConfig((prev) => ({
      ...prev,
      recipients: [...prev.recipients, newRecipient],
    }));
    setNewRecipient('');
    toast.success('گیرنده اضافه شد');
  };

  const handleRemoveRecipient = (email: string) => {
    setAutoConfig((prev) => ({
      ...prev,
      recipients: prev.recipients.filter((r) => r !== email),
    }));
  };

  const handleToggleAutoMetric = (metric: string) => {
    setAutoConfig((prev) => ({
      ...prev,
      metrics: prev.metrics.includes(metric)
        ? prev.metrics.filter((m) => m !== metric)
        : [...prev.metrics, metric],
    }));
  };

  const handleSaveAutoConfig = () => {
    toast.success('تنظیمات تحلیل خودکار ذخیره شد');
  };

  // Filtered reports
  const filteredReports = useMemo(() => {
    return recentReports.filter((r) => {
      const matchesSearch = r.title.includes(searchQuery);
      const matchesType = filterType === 'all' || r.type === filterType;
      const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [recentReports, searchQuery, filterType, filterStatus]);

  // Step labels
  const stepLabels = ['انتخاب نوع', 'فیلتر و بازه', 'بخش‌ها', 'فرمت و تنظیمات', 'پیش‌نمایش'];

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6" dir="rtl">
      {/* ── Header Section ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">گزارش‌ساز حرفه‌ای</h2>
            <Badge className="bg-emerald-600 text-white text-xs px-2.5 py-0.5">فاز ۳</Badge>
          </div>
          <p className="text-slate-500 mt-1 text-sm">
            ایجاد گزارش‌های سفارشی با قالب‌های متنوع و تحلیل خودکار هوشمند
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setActiveTab('create');
              setWizardStep(1);
              setSelectedReportType(null);
              setSelectedSections([]);
              setSelectedMetrics([]);
              setSelectedDimensions([]);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            گزارش جدید
          </Button>
          <Button variant="outline" className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
            <Layers className="w-4 h-4" />
            قالب‌های آماده
          </Button>
        </div>
      </motion.div>

      {/* ── Stats Row ────────────────────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            label: 'گزارش‌های تولیدشده',
            value: stats.generated,
            icon: FileText,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
            change: '+۳',
            up: true,
          },
          {
            label: 'قالب‌های فعال',
            value: stats.templates,
            icon: Layers,
            color: 'text-teal-600',
            bg: 'bg-teal-50',
            border: 'border-teal-100',
            change: '+۱',
            up: true,
          },
          {
            label: 'خروجی PDF',
            value: stats.pdfExports,
            icon: Download,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            change: '+۲',
            up: true,
          },
          {
            label: 'اشتراک‌گذاری',
            value: stats.shared,
            icon: Share2,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            border: 'border-purple-100',
            change: '+۱',
            up: true,
          },
        ].map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card className={`border ${stat.border} hover:shadow-md transition-shadow`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {stat.up ? (
                        <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-red-500" />
                      )}
                      <span className={`text-xs ${stat.up ? 'text-emerald-600' : 'text-red-600'}`}>
                        {stat.change} این ماه
                      </span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Main Tabs ────────────────────────────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-slate-100 p-1 h-auto">
          <TabsTrigger value="templates" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm">
            <Layers className="w-4 h-4" />
            قالب‌های گزارش
          </TabsTrigger>
          <TabsTrigger value="create" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm">
            <Plus className="w-4 h-4" />
            ساخت گزارش
          </TabsTrigger>
          <TabsTrigger value="recent" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm">
            <Clock className="w-4 h-4" />
            گزارش‌های اخیر
          </TabsTrigger>
          <TabsTrigger value="auto" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm">
            <Brain className="w-4 h-4" />
            تحلیل خودکار
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Report Templates ──────────────────────────────────────── */}
        <TabsContent value="templates">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {reportTemplates.map((template) => (
              <motion.div key={template.id} variants={itemVariants}>
                <motion.div
                  variants={cardHoverVariants}
                  initial="rest"
                  whileHover="hover"
                >
                  <Card className="h-full border hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-10 h-10 rounded-xl ${template.bgColor} flex items-center justify-center`}>
                          <template.icon className={`w-5 h-5 ${template.color}`} />
                        </div>
                        <Badge variant="outline" className="text-[10px] px-2">
                          {formatLabels[template.format]}
                        </Badge>
                      </div>
                      <CardTitle className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                        {template.name}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="text-[10px] bg-slate-100">
                          {template.sectionsCount} بخش
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs"
                        onClick={() => handleUseTemplate(template)}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        استفاده از قالب
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        {/* ── Tab 2: Create Report ─────────────────────────────────────────── */}
        <TabsContent value="create">
          <Card className="border-slate-200">
            <CardHeader className="border-b bg-slate-50/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Plus className="w-5 h-5 text-emerald-600" />
                    ساخت گزارش جدید
                  </CardTitle>
                  <p className="text-xs text-slate-500 mt-1">
                    مرحله {wizardStep} از ۵ — {stepLabels[wizardStep - 1]}
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevStep}
                    disabled={wizardStep === 1}
                    className="gap-1"
                  >
                    <ChevronRight className="w-4 h-4" />
                    قبلی
                  </Button>
                  {wizardStep < 5 ? (
                    <Button
                      size="sm"
                      onClick={handleNextStep}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                    >
                      بعدی
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleGenerateReport}
                      disabled={generating}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                    >
                      {generating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          در حال تولید...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4" />
                          تولید گزارش
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-4">
                <Progress value={(wizardStep / 5) * 100} className="h-2" />
                <div className="flex justify-between mt-2">
                  {stepLabels.map((label, idx) => (
                    <span
                      key={label}
                      className={`text-[10px] transition-colors ${
                        idx + 1 <= wizardStep ? 'text-emerald-600 font-medium' : 'text-slate-400'
                      }`}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Report Type Selection */}
                {wizardStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <Label className="text-sm font-medium text-slate-700">نوع گزارش را انتخاب کنید</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {reportTemplates.map((template) => {
                        const isSelected = selectedReportType === template.type;
                        return (
                          <motion.button
                            key={template.type}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setSelectedReportType(template.type as ReportType);
                              setSelectedSections(template.sections);
                            }}
                            className={`p-4 rounded-xl border-2 text-center transition-all ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-50 shadow-md'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div
                              className={`w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center ${
                                isSelected ? 'bg-emerald-100' : template.bgColor
                              }`}
                            >
                              <template.icon
                                className={`w-6 h-6 ${isSelected ? 'text-emerald-600' : template.color}`}
                              />
                            </div>
                            <p
                              className={`text-xs font-medium ${
                                isSelected ? 'text-emerald-700' : 'text-slate-700'
                              }`}
                            >
                              {template.name}
                            </p>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="mt-2"
                              >
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Date Range & Filters */}
                {wizardStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Date Range */}
                      <div className="space-y-4">
                        <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          بازه زمانی
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs text-slate-500 mb-1">از تاریخ</Label>
                            <Input
                              type="date"
                              value={dateFrom}
                              onChange={(e) => setDateFrom(e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-slate-500 mb-1">تا تاریخ</Label>
                            <Input
                              type="date"
                              value={dateTo}
                              onChange={(e) => setDateTo(e.target.value)}
                              className="text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-slate-500 mb-1">دوره گزارش</Label>
                          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">روزانه</SelectItem>
                              <SelectItem value="weekly">هفتگی</SelectItem>
                              <SelectItem value="monthly">ماهانه</SelectItem>
                              <SelectItem value="quarterly">فصلی</SelectItem>
                              <SelectItem value="yearly">سالانه</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Dimensions */}
                      <div className="space-y-4">
                        <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <Filter className="w-4 h-4 text-emerald-600" />
                          ابعاد تحلیل
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          {['مالی', 'بازاریابی', 'عملیاتی', 'منابع انسانی', 'فناوری', 'استراتژیک'].map(
                            (dim) => (
                              <label
                                key={dim}
                                className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all text-xs ${
                                  selectedDimensions.includes(dim)
                                    ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                }`}
                              >
                                <Checkbox
                                  checked={selectedDimensions.includes(dim)}
                                  onCheckedChange={() => handleToggleDimension(dim)}
                                />
                                {dim}
                              </label>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-emerald-600" />
                        شاخص‌های کلیدی
                      </Label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {availableMetrics.map((metric) => (
                          <label
                            key={metric}
                            className={`flex items-center gap-1.5 p-2 rounded-lg border cursor-pointer transition-all text-xs ${
                              selectedMetrics.includes(metric)
                                ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                                : 'border-slate-200 hover:border-slate-300 text-slate-600'
                            }`}
                          >
                            <Checkbox
                              checked={selectedMetrics.includes(metric)}
                              onCheckedChange={() => handleToggleMetric(metric)}
                            />
                            {metric}
                          </label>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Section Selection */}
                {wizardStep === 3 && selectedReportType && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <Label className="text-sm font-medium text-slate-700">
                      بخش‌های مورد نظر را برای ورود در گزارش انتخاب کنید
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {availableSections[selectedReportType].map((section) => (
                        <label
                          key={section}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedSections.includes(section)
                              ? 'border-emerald-400 bg-emerald-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <Checkbox
                            checked={selectedSections.includes(section)}
                            onCheckedChange={() => handleToggleSection(section)}
                          />
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium ${
                                selectedSections.includes(section)
                                  ? 'text-emerald-700'
                                  : 'text-slate-700'
                              }`}
                            >
                              {section}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              شامل نمودارها و جداول تحلیلی
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSections(availableSections[selectedReportType])}
                        className="text-xs"
                      >
                        انتخاب همه
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSections([])}
                        className="text-xs"
                      >
                        حذف انتخاب‌ها
                      </Button>
                      <span className="text-xs text-slate-500">
                        {selectedSections.length} بخش انتخاب شده
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Format & Options */}
                {wizardStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    {/* Format Selection */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Download className="w-4 h-4 text-emerald-600" />
                        فرمت خروجی
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                        {([
                          { format: 'pdf' as ReportFormat, label: 'PDF', desc: 'قابل چاپ و اشتراک‌گذاری', icon: FileText },
                          { format: 'excel' as ReportFormat, label: 'Excel', desc: 'قابل ویرایش و تحلیل', icon: BarChart3 },
                          { format: 'csv' as ReportFormat, label: 'CSV', desc: 'داده‌های خام', icon: Layers },
                        ]).map(({ format, label, desc, icon: FmtIcon }) => {
                          const isSelected = selectedFormat === format;
                          return (
                            <motion.button
                              key={format}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedFormat(format)}
                              className={`p-4 rounded-xl border-2 text-center transition-all ${
                                isSelected
                                  ? 'border-emerald-500 bg-emerald-50 shadow-md'
                                  : 'border-slate-200 hover:border-slate-300 bg-white'
                              }`}
                            >
                              <FmtIcon
                                className={`w-8 h-8 mx-auto mb-2 ${
                                  isSelected ? 'text-emerald-600' : 'text-slate-400'
                                }`}
                              />
                              <p
                                className={`text-sm font-bold ${
                                  isSelected ? 'text-emerald-700' : 'text-slate-700'
                                }`}
                              >
                                {label}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-1">{desc}</p>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    <Separator />

                    {/* Options */}
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-emerald-600" />
                        تنظیمات گزارش
                      </Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                          <div className="flex items-center gap-3">
                            <BarChart3 className="w-4 h-4 text-slate-500" />
                            <div>
                              <p className="text-sm font-medium text-slate-700">شامل نمودارها</p>
                              <p className="text-xs text-slate-400">
                                افزودن نمودارهای بصری به گزارش
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={includeCharts}
                            onCheckedChange={setIncludeCharts}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                          <div className="flex items-center gap-3">
                            <Lightbulb className="w-4 h-4 text-slate-500" />
                            <div>
                              <p className="text-sm font-medium text-slate-700">شامل توصیه‌ها</p>
                              <p className="text-xs text-slate-400">
                                افزودن توصیه‌های هوشمند به گزارش
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={includeRecommendations}
                            onCheckedChange={setIncludeRecommendations}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Preview & Generate */}
                {wizardStep === 5 && selectedReportType && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-5"
                  >
                    <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-emerald-600" />
                      پیش‌نمایش گزارش
                    </Label>

                    {/* Preview card */}
                    <div className="border-2 border-slate-200 rounded-xl overflow-hidden">
                      {/* Report Header */}
                      <div className="bg-gradient-to-l from-emerald-600 to-teal-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold">
                              گزارش {reportTypeLabels[selectedReportType]}
                            </h3>
                            <p className="text-emerald-100 text-sm mt-1">
                              BCGSP — پلتفرم رشد استراتژیک کسب‌وکار
                            </p>
                          </div>
                          <Badge className="bg-white/20 text-white border-0">
                            {formatLabels[selectedFormat]}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-6 space-y-5 bg-white">
                        {/* Table of Contents */}
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-emerald-600" />
                            فهرست مطالب
                          </h4>
                          <div className="space-y-2">
                            {selectedSections.map((section, idx) => (
                              <div
                                key={section}
                                className="flex items-center gap-3 text-sm text-slate-600 py-1 border-b border-dashed border-slate-100"
                              >
                                <span className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 text-xs flex items-center justify-center font-medium">
                                  {idx + 1}
                                </span>
                                {section}
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Key Findings Preview */}
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4 text-amber-600" />
                            یافته‌های کلیدی
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { label: 'امتیاز کلی', value: '۷۸ از ۱۰۰', color: 'text-emerald-600' },
                              { label: 'پتانسیل رشد', value: 'بالا', color: 'text-teal-600' },
                              { label: 'ریسک شناسایی‌شده', value: '۳ مورد', color: 'text-amber-600' },
                              { label: 'فرصت‌ها', value: '۵ مورد', color: 'text-purple-600' },
                            ].map((finding) => (
                              <div
                                key={finding.label}
                                className="p-3 rounded-lg bg-slate-50 border border-slate-100"
                              >
                                <p className="text-xs text-slate-500">{finding.label}</p>
                                <p className={`text-sm font-bold ${finding.color} mt-0.5`}>
                                  {finding.value}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {includeCharts && (
                          <>
                            <Separator />
                            {/* Charts Preview */}
                            <div>
                              <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-teal-600" />
                                نمودارها
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="h-32 rounded-lg bg-gradient-to-t from-emerald-50 to-white border border-emerald-100 flex items-end justify-center p-3 gap-1.5">
                                  {[60, 80, 45, 90, 70, 85, 55].map((h, i) => (
                                    <div
                                      key={i}
                                      className="w-4 bg-emerald-400 rounded-t"
                                      style={{ height: `${h}%` }}
                                    />
                                  ))}
                                </div>
                                <div className="h-32 rounded-lg bg-gradient-to-t from-amber-50 to-white border border-amber-100 flex items-end justify-center p-3 gap-1.5">
                                  {[40, 65, 80, 55, 75, 50, 90].map((h, i) => (
                                    <div
                                      key={i}
                                      className="w-4 bg-amber-400 rounded-t"
                                      style={{ height: `${h}%` }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {includeRecommendations && (
                          <>
                            <Separator />
                            {/* Recommendations */}
                            <div>
                              <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-600" />
                                توصیه‌ها
                              </h4>
                              <div className="space-y-2">
                                {[
                                  'تقویت позиция رقابتی در بازار از طریق نوآوری محصول',
                                  'بهبود فرآیندهای داخلی برای افزایش بهره‌وری ۲۰ درصدی',
                                  'سرمایه‌گذاری در زیرساخت‌های فناوری اطلاعات',
                                ].map((rec, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100"
                                  >
                                    <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                                    <p className="text-xs text-slate-700">{rec}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Summary row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
                        <p className="text-xs text-slate-500">نوع</p>
                        <p className="text-sm font-bold text-emerald-700 mt-0.5">
                          {reportTypeLabels[selectedReportType]}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
                        <p className="text-xs text-slate-500">فرمت</p>
                        <p className="text-sm font-bold text-teal-700 mt-0.5">
                          {formatLabels[selectedFormat]}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
                        <p className="text-xs text-slate-500">بخش‌ها</p>
                        <p className="text-sm font-bold text-amber-700 mt-0.5">
                          {selectedSections.length} بخش
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
                        <p className="text-xs text-slate-500">دوره</p>
                        <p className="text-sm font-bold text-purple-700 mt-0.5">
                          {selectedPeriod === 'daily' ? 'روزانه' : selectedPeriod === 'weekly' ? 'هفتگی' : selectedPeriod === 'monthly' ? 'ماهانه' : selectedPeriod === 'quarterly' ? 'فصلی' : 'سالانه'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab 3: Recent Reports ─────────────────────────────────────────── */}
        <TabsContent value="recent">
          <Card className="border-slate-200">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                گزارش‌های اخیر
              </CardTitle>
              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-3">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="جستجو در گزارش‌ها..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-9 text-sm"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-40 text-sm">
                    <SelectValue placeholder="نوع گزارش" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه انواع</SelectItem>
                    {Object.entries(reportTypeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-36 text-sm">
                    <SelectValue placeholder="وضعیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه</SelectItem>
                    <SelectItem value="completed">تکمیل‌شده</SelectItem>
                    <SelectItem value="generating">در حال تولید</SelectItem>
                    <SelectItem value="failed">ناموفق</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="max-h-[520px]">
                <div className="divide-y">
                  {filteredReports.length === 0 ? (
                    <div className="py-12 text-center">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm text-slate-500">گزارشی یافت نشد</p>
                    </div>
                  ) : (
                    filteredReports.map((report, idx) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="flex items-center gap-4 p-4 hover:bg-slate-50/80 transition-colors group"
                      >
                        {/* Icon */}
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            report.status === 'completed'
                              ? 'bg-emerald-50'
                              : report.status === 'generating'
                              ? 'bg-amber-50'
                              : 'bg-red-50'
                          }`}
                        >
                          {report.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : report.status === 'generating' ? (
                            <RefreshCw className="w-5 h-5 text-amber-600 animate-spin" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-slate-800 truncate">
                            {report.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="outline" className="text-[10px] px-1.5">
                              {reportTypeLabels[report.type]}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] px-1.5 bg-slate-100">
                              {formatLabels[report.format]}
                            </Badge>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {report.generatedAt}
                            </span>
                            <span className="text-xs text-slate-400">{report.size}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {report.status === 'completed' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-500 hover:text-emerald-600"
                                onClick={() => handleViewReport(report)}
                                title="مشاهده"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-500 hover:text-emerald-600"
                                onClick={() => handleDownloadReport(report)}
                                title="دانلود"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-500 hover:text-teal-600"
                                onClick={() => handleShareReport(report)}
                                title="اشتراک‌گذاری"
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-amber-600"
                            onClick={() => handleRegenerateReport(report)}
                            title="تولید مجدد"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-red-600"
                            onClick={() => handleDeleteReport(report.id)}
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab 4: Auto Analysis ──────────────────────────────────────────── */}
        <TabsContent value="auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Schedule & Metrics */}
            <Card className="border-slate-200">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-emerald-600" />
                  پیکربندی تحلیل خودکار
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  تنظیم زمان‌بندی و شاخص‌های تحلیل خودکار هوشمند
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Enable/Disable */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-emerald-800">تحلیل خودکار</p>
                      <p className="text-xs text-emerald-600">فعال‌سازی تحلیل خودکار هوشمند</p>
                    </div>
                  </div>
                  <Switch
                    checked={autoConfig.isEnabled}
                    onCheckedChange={(checked) =>
                      setAutoConfig((prev) => ({ ...prev, isEnabled: checked }))
                    }
                  />
                </div>

                {/* Schedule */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    زمان‌بندی
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'daily' as const, label: 'روزانه', desc: 'هر روز' },
                      { value: 'weekly' as const, label: 'هفتگی', desc: 'هر هفته' },
                      { value: 'monthly' as const, label: 'ماهانه', desc: 'هر ماه' },
                    ].map(({ value, label, desc }) => {
                      const isSelected = autoConfig.schedule === value;
                      return (
                        <motion.button
                          key={value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            setAutoConfig((prev) => ({ ...prev, schedule: value }))
                          }
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <p
                            className={`text-sm font-medium ${
                              isSelected ? 'text-emerald-700' : 'text-slate-700'
                            }`}
                          >
                            {label}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Metrics to Track */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-600" />
                    شاخص‌های پایش
                  </Label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {availableMetrics.map((metric) => (
                      <label
                        key={metric}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all text-xs ${
                          autoConfig.metrics.includes(metric)
                            ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        <Checkbox
                          checked={autoConfig.metrics.includes(metric)}
                          onCheckedChange={() => handleToggleAutoMetric(metric)}
                        />
                        {metric}
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alert Thresholds & Recipients */}
            <div className="space-y-6">
              {/* Alert Thresholds */}
              <Card className="border-slate-200">
                <CardHeader className="border-b bg-slate-50/50">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    آستانه هشدار
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    تعیین آستانه تغییر برای ارسال هشدار (درصد)
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  {autoConfig.metrics.slice(0, 6).map((metric) => (
                    <div key={metric} className="flex items-center gap-3">
                      <Label className="text-xs text-slate-600 w-28 shrink-0">{metric}</Label>
                      <Input
                        type="number"
                        value={autoConfig.alertThresholds[metric] || 10}
                        onChange={(e) =>
                          setAutoConfig((prev) => ({
                            ...prev,
                            alertThresholds: {
                              ...prev.alertThresholds,
                              [metric]: Number(e.target.value),
                            },
                          }))
                        }
                        className="text-sm w-24"
                        min={1}
                        max={100}
                      />
                      <span className="text-xs text-slate-400">درصد</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recipients */}
              <Card className="border-slate-200">
                <CardHeader className="border-b bg-slate-50/50">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Mail className="w-5 h-5 text-teal-600" />
                    گیرندگان گزارش
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    افزودن ایمیل گیرندگان گزارش خودکار
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="email@example.com"
                      value={newRecipient}
                      onChange={(e) => setNewRecipient(e.target.value)}
                      className="text-sm flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddRecipient()}
                    />
                    <Button
                      onClick={handleAddRecipient}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      افزودن
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {autoConfig.recipients.map((email) => (
                      <div
                        key={email}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50"
                      >
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-700">{email}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-400 hover:text-red-500"
                          onClick={() => handleRemoveRecipient(email)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <Button
                onClick={handleSaveAutoConfig}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-11"
              >
                <Settings className="w-4 h-4" />
                ذخیره تنظیمات
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Report Preview Dialog ──────────────────────────────────────────── */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] p-0" dir="rtl">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Eye className="w-5 h-5 text-emerald-600" />
              پیش‌نمایش گزارش
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              {previewReport?.title}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] px-6">
            <div className="pb-6 space-y-5">
              {/* Report Header */}
              <div className="bg-gradient-to-l from-emerald-600 to-teal-600 rounded-xl p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold">
                      {previewReport?.title || 'پیش‌نمایش گزارش'}
                    </h3>
                    <p className="text-emerald-100 text-sm mt-1">
                      BCGSP — پلتفرم رشد استراتژیک کسب‌وکار
                    </p>
                  </div>
                  <div className="text-left">
                    <Badge className="bg-white/20 text-white border-0 mb-1">
                      {previewReport?.format ? formatLabels[previewReport.format] : 'PDF'}
                    </Badge>
                    <p className="text-xs text-emerald-100 mt-1">
                      {previewReport?.generatedAt}
                    </p>
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
                  <p className="text-xs text-slate-500">شرکت</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">نمونه شرکت</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
                  <p className="text-xs text-slate-500">صنعت</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">فناوری</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
                  <p className="text-xs text-slate-500">دوره</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">فصلی</p>
                </div>
              </div>

              {/* Table of Contents */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  فهرست مطالب
                </h4>
                <div className="space-y-1.5">
                  {(selectedReportType ? availableSections[selectedReportType] : reportTemplates[0]?.sections || []).slice(0, 5).map(
                    (section, idx) => (
                      <div
                        key={section}
                        className="flex items-center gap-3 text-sm text-slate-600 py-1.5 px-2 rounded hover:bg-slate-50"
                      >
                        <span className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 text-xs flex items-center justify-center font-medium">
                          {idx + 1}
                        </span>
                        {section}
                      </div>
                    )
                  )}
                </div>
              </div>

              <Separator />

              {/* Key Findings */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-600" />
                  یافته‌های کلیدی
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'امتیاز کلی', value: '۷۸ از ۱۰۰', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'پتانسیل رشد', value: 'بالا', color: 'text-teal-600', bg: 'bg-teal-50' },
                    { label: 'ریسک شناسایی‌شده', value: '۳ مورد', color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'فرصت‌ها', value: '۵ مورد', color: 'text-purple-600', bg: 'bg-purple-50' },
                  ].map((finding) => (
                    <div
                      key={finding.label}
                      className={`p-3 rounded-lg ${finding.bg} border border-slate-100`}
                    >
                      <p className="text-xs text-slate-500">{finding.label}</p>
                      <p className={`text-sm font-bold ${finding.color} mt-0.5`}>
                        {finding.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Charts Preview */}
              {includeCharts && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-teal-600" />
                      نمودارها
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-28 rounded-lg bg-gradient-to-t from-emerald-50 to-white border border-emerald-100 flex items-end justify-center p-3 gap-1.5">
                        {[55, 75, 40, 85, 65, 80, 50].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: i * 0.05, duration: 0.4 }}
                            className="w-3 bg-emerald-400 rounded-t"
                          />
                        ))}
                      </div>
                      <div className="h-28 rounded-lg bg-gradient-to-t from-amber-50 to-white border border-amber-100 flex items-end justify-center p-3 gap-1.5">
                        {[35, 60, 75, 50, 70, 45, 85].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: i * 0.05, duration: 0.4 }}
                            className="w-3 bg-amber-400 rounded-t"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Recommendations */}
              {includeRecommendations && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-600" />
                      توصیه‌ها
                    </h4>
                    <div className="space-y-2">
                      {[
                        'تقویت موقعیت رقابتی در بازار از طریق نوآوری محصول',
                        'بهبود فرآیندهای داخلی برای افزایش بهره‌وری ۲۰ درصدی',
                        'سرمایه‌گذاری در زیرساخت‌های فناوری اطلاعات',
                        'توسعه بازارهای جدید و متنوع‌سازی سبد محصولات',
                      ].map((rec, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100"
                        >
                          <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                          <p className="text-xs text-slate-700">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          {/* Dialog Footer */}
          <div className="p-4 border-t bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {previewReport?.status === 'completed' && (
                <>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                    onClick={() => previewReport && handleDownloadReport(previewReport)}
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => {
                      if (previewReport) {
                        const updated = { ...previewReport, format: 'excel' as ReportFormat };
                        handleDownloadReport(updated);
                      }
                    }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Excel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => {
                      if (previewReport) {
                        const updated = { ...previewReport, format: 'csv' as ReportFormat };
                        handleDownloadReport(updated);
                      }
                    }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    CSV
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {previewReport?.status === 'completed' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 border-teal-200 text-teal-700 hover:bg-teal-50"
                  onClick={() => previewReport && handleShareReport(previewReport)}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  اشتراک‌گذاری
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewOpen(false)}
              >
                بستن
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
