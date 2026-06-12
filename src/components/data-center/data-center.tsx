'use client';

import { useState, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Download,
  Upload,
  HardDrive,
  FileText,
  BarChart3,
  Users,
  DollarSign,
  ClipboardCheck,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Trash2,
  Eye,
  Archive,
  RotateCcw,
  Plus,
  ArrowRight,
  CalendarDays,
  ShieldCheck,
  Zap,
  TrendingUp,
  FileSpreadsheet,
  FileDown,
  FileUp,
  Save,
  History,
  Activity,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ExportType {
  id: string;
  name: string;
  icon: React.ReactNode;
  recordCount: number;
  format: string;
  description: string;
}

interface ImportHistoryItem {
  id: string;
  date: string;
  type: string;
  records: number;
  status: 'success' | 'partial' | 'failed';
  fileName: string;
}

interface BackupItem {
  id: string;
  date: string;
  size: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'completed' | 'in_progress' | 'failed';
}

interface OperationHistoryItem {
  id: string;
  timestamp: string;
  operationType: 'import' | 'export' | 'backup' | 'restore';
  records: number;
  duration: string;
  status: 'completed' | 'failed' | 'in_progress';
  user: string;
  description: string;
}

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

const cardHover = {
  rest: { scale: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  hover: { scale: 1.02, boxShadow: '0 8px 25px rgba(16,185,129,0.15)' },
};

// ─── Mock Data ───────────────────────────────────────────────────────────────

const exportTypes: ExportType[] = [
  {
    id: 'strategic-report',
    name: 'گزارش استراتژیک',
    icon: <FileText className="h-6 w-6" />,
    recordCount: 1245,
    format: 'PDF',
    description: 'خروجی کامل گزارش‌های استراتژیک با نمودارها و تحلیل‌ها',
  },
  {
    id: 'crm-data',
    name: 'داده‌های CRM',
    icon: <Users className="h-6 w-6" />,
    recordCount: 3842,
    format: 'Excel',
    description: 'تمام اطلاعات مشتریان، سرنخ‌ها و تعاملات فروش',
  },
  {
    id: 'invoices',
    name: 'صورتحساب‌ها',
    icon: <DollarSign className="h-6 w-6" />,
    recordCount: 2189,
    format: 'Excel',
    description: 'صورتحساب‌ها، پرداخت‌ها و گزارش‌های مالی',
  },
  {
    id: 'kpi-data',
    name: 'شاخص‌های کلیدی',
    icon: <BarChart3 className="h-6 w-6" />,
    recordCount: 956,
    format: 'CSV',
    description: 'شاخص‌های عملکردی کلیدی و روند تغییرات',
  },
  {
    id: 'diagnostic-data',
    name: 'داده‌های تشخیصی',
    icon: <ClipboardCheck className="h-6 w-6" />,
    recordCount: 2734,
    format: 'Excel',
    description: 'نتایج ارزیابی‌ها، امتیازات و توصیه‌ها',
  },
  {
    id: 'financial-report',
    name: 'گزارش مالی',
    icon: <TrendingUp className="h-6 w-6" />,
    recordCount: 1582,
    format: 'PDF',
    description: 'گزارش جامع مالی با ترازنامه و سود و زیان',
  },
];

const importHistoryData: ImportHistoryItem[] = [
  { id: '1', date: '۱۴۰۴/۰۳/۱۵', type: 'CRM سرنخ‌ها', records: 245, status: 'success', fileName: 'crm-leads-1404.csv' },
  { id: '2', date: '۱۴۰۴/۰۳/۱۲', type: 'داده‌های مالی', records: 1200, status: 'success', fileName: 'financial-data.xlsx' },
  { id: '3', date: '۱۴۰۴/۰۳/۱۰', type: 'کاربران', records: 85, status: 'partial', fileName: 'users-import.csv' },
  { id: '4', date: '۱۴۰۴/۰۳/۰۸', type: 'معیارهای مقایسه‌ای', records: 340, status: 'success', fileName: 'benchmarks.json' },
  { id: '5', date: '۱۴۰۴/۰۳/۰۵', type: 'CRM سرنخ‌ها', records: 150, status: 'failed', fileName: 'crm-update.csv' },
  { id: '6', date: '۱۴۰۴/۰۳/۰۱', type: 'داده‌های مالی', records: 980, status: 'success', fileName: 'q1-financials.xlsx' },
];

const backupData: BackupItem[] = [
  { id: '1', date: '۱۴۰۴/۰۳/۱۵ - ۰۲:۳۰', size: '۵۸۰ MB', type: 'full', status: 'completed' },
  { id: '2', date: '۱۴۰۴/۰۳/۱۴ - ۰۲:۳۰', size: '۴۵ MB', type: 'incremental', status: 'completed' },
  { id: '3', date: '۱۴۰۴/۰۳/۱۳ - ۰۲:۳۰', size: '۵۲ MB', type: 'incremental', status: 'completed' },
  { id: '4', date: '۱۴۰۴/۰۳/۱۲ - ۰۲:۳۰', size: '۴۸ MB', type: 'incremental', status: 'completed' },
  { id: '5', date: '۱۴۰۴/۰۳/۱۱ - ۱۴:۱۵', size: '۵۷۵ MB', type: 'full', status: 'completed' },
];

const operationHistoryData: OperationHistoryItem[] = [
  { id: '1', timestamp: '۱۴۰۴/۰۳/۱۵ - ۱۴:۳۲', operationType: 'export', records: 1245, duration: '۳۵ ثانیه', status: 'completed', user: 'محمد احمدی', description: 'خروجی گزارش استراتژیک' },
  { id: '2', timestamp: '۱۴۰۴/۰۳/۱۵ - ۱۳:۱۵', operationType: 'import', records: 245, duration: '۱۸ ثانیه', status: 'completed', user: 'سارا محمدی', description: 'واردکردن سرنخ‌های CRM' },
  { id: '3', timestamp: '۱۴۰۴/۰۳/۱۵ - ۰۲:۳۰', operationType: 'backup', records: 12548, duration: '۸ دقیقه', status: 'completed', user: 'سیستم', description: 'پشتیبان‌گیری کامل خودکار' },
  { id: '4', timestamp: '۱۴۰۴/۰۳/۱۴ - ۱۶:۴۵', operationType: 'export', records: 3842, duration: '۱ دقیقه', status: 'completed', user: 'محمد احمدی', description: 'خروجی داده‌های CRM' },
  { id: '5', timestamp: '۱۴۰۴/۰۳/۱۴ - ۱۱:۲۰', operationType: 'import', records: 1200, duration: '۴۵ ثانیه', status: 'completed', user: 'فاطمه رضایی', description: 'واردکردن داده‌های مالی' },
  { id: '6', timestamp: '۱۴۰۴/۰۳/۱۴ - ۰۲:۳۰', operationType: 'backup', records: 12510, duration: '۲ دقیقه', status: 'completed', user: 'سیستم', description: 'پشتیبان‌گیری افزایشی' },
  { id: '7', timestamp: '۱۴۰۴/۰۳/۱۳ - ۱۵:۰۰', operationType: 'restore', records: 12500, duration: '۱۲ دقیقه', status: 'completed', user: 'مدیر سیستم', description: 'بازیابی از پشتیبان ۱۴۰۴/۰۳/۱۱' },
  { id: '8', timestamp: '۱۴۰۴/۰۳/۱۳ - ۱۰:۳۰', operationType: 'export', records: 2189, duration: '۵۵ ثانیه', status: 'completed', user: 'سارا محمدی', description: 'خروجی صورتحساب‌ها' },
  { id: '9', timestamp: '۱۴۰۴/۰۳/۱۲ - ۱۴:۱۵', operationType: 'backup', records: 12480, duration: '۸ دقیقه', status: 'completed', user: 'سیستم', description: 'پشتیبان‌گیری کامل' },
  { id: '10', timestamp: '۱۴۰۴/۰۳/۱۲ - ۰۹:۴۵', operationType: 'import', records: 85, duration: '۱۰ ثانیه', status: 'failed', user: 'فاطمه رضایی', description: 'واردکردن کاربران - خطای فرمت' },
  { id: '11', timestamp: '۱۴۰۴/۰۳/۱۱ - ۱۶:۳۰', operationType: 'export', records: 956, duration: '۲۰ ثانیه', status: 'completed', user: 'محمد احمدی', description: 'خروجی شاخص‌های کلیدی' },
  { id: '12', timestamp: '۱۴۰۴/۰۳/۱۱ - ۱۴:۱۵', operationType: 'backup', records: 12350, duration: '۷ دقیقه', status: 'completed', user: 'سیستم', description: 'پشتیبان‌گیری کامل دستی' },
  { id: '13', timestamp: '۱۴۰۴/۰۳/۱۰ - ۱۱:۰۰', operationType: 'import', records: 340, duration: '۱۵ ثانیه', status: 'completed', user: 'سارا محمدی', description: 'واردکردن معیارهای مقایسه‌ای' },
  { id: '14', timestamp: '۱۴۰۴/۰۳/۰۹ - ۱۵:۴۵', operationType: 'export', records: 2734, duration: '۱ دقیقه', status: 'completed', user: 'فاطمه رضایی', description: 'خروجی داده‌های تشخیصی' },
  { id: '15', timestamp: '۱۴۰۴/۰۳/۰۸ - ۱۰:۲۰', operationType: 'import', records: 150, duration: '۵ ثانیه', status: 'failed', user: 'محمد احمدی', description: 'واردکردن بروزرسانی CRM - ناموفق' },
];

const previewData = [
  { id: '۱', name: 'شرکت آلفا', industry: 'فناوری', revenue: '۱۲,۵۰۰,۰۰۰', score: '۸۵', status: 'فعال' },
  { id: '۲', name: 'گروه بتا', industry: 'تولیدی', revenue: '۸,۳۲۰,۰۰۰', score: '۷۲', status: 'فعال' },
  { id: '۳', name: 'صنایع گاما', industry: 'خدماتی', revenue: '۵,۱۸۰,۰۰۰', score: '۶۸', status: 'در بررسی' },
  { id: '۴', name: 'فناوری دلتا', industry: 'فناوری', revenue: '۱۵,۷۵۰,۰۰۰', score: '۹۱', status: 'فعال' },
  { id: '۵', name: 'هلدینگ اپسیلون', industry: 'مالی', revenue: '۲۲,۴۰۰,۰۰۰', score: '۷۸', status: 'فعال' },
];

// ─── Helper Functions ────────────────────────────────────────────────────────

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
    case 'success':
      return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    case 'in_progress':
    case 'partial':
      return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'failed':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
    case 'success':
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case 'in_progress':
    case 'partial':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

const getOperationTypeIcon = (type: string) => {
  switch (type) {
    case 'import':
      return <Upload className="h-4 w-4 text-blue-500" />;
    case 'export':
      return <Download className="h-4 w-4 text-emerald-500" />;
    case 'backup':
      return <Archive className="h-4 w-4 text-purple-500" />;
    case 'restore':
      return <RotateCcw className="h-4 w-4 text-orange-500" />;
    default:
      return <Activity className="h-4 w-4 text-gray-500" />;
  }
};

const getOperationTypeLabel = (type: string) => {
  switch (type) {
    case 'import':
      return 'واردکردن';
    case 'export':
      return 'خروجی';
    case 'backup':
      return 'پشتیبان‌گیری';
    case 'restore':
      return 'بازیابی';
    default:
      return type;
  }
};

const getOperationTypeBadgeColor = (type: string) => {
  switch (type) {
    case 'import':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'export':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'backup':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'restore':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const getBackupTypeLabel = (type: string) => {
  switch (type) {
    case 'full':
      return 'کامل';
    case 'incremental':
      return 'افزایشی';
    case 'differential':
      return 'تفاضلی';
    default:
      return type;
  }
};

const getFormatBadgeColor = (format: string) => {
  switch (format) {
    case 'PDF':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'Excel':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'CSV':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'JSON':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function DataCenter() {
  const { currentView } = useAppStore();

  // Export Tab State
  const [selectedExportTypes, setSelectedExportTypes] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [includeBenchmarks, setIncludeBenchmarks] = useState(false);

  // Import Tab State
  const [importType, setImportType] = useState('crm-leads');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');

  // Backup Tab State
  const [backupSchedule, setBackupSchedule] = useState('daily');
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [selectedBackupId, setSelectedBackupId] = useState<string | null>(null);

  // History Tab State
  const [historyFilter, setHistoryFilter] = useState('all');
  const [historySearch, setHistorySearch] = useState('');

  // Export handlers
  const toggleExportType = useCallback((id: string) => {
    setSelectedExportTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }, []);

  const selectAllExports = useCallback(() => {
    setSelectedExportTypes(exportTypes.map((t) => t.id));
  }, []);

  const clearExportSelection = useCallback(() => {
    setSelectedExportTypes([]);
  }, []);

  // Import handlers
  const simulateUpload = useCallback(() => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadComplete(false);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadComplete(true);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
      simulateUpload();
    }
  }, [simulateUpload]);

  const handleFileSelect = useCallback(() => {
    setFileName('import-data-1404.xlsx');
    simulateUpload();
  }, [simulateUpload]);

  // Filter history
  const filteredHistory = operationHistoryData.filter((item) => {
    const matchesFilter = historyFilter === 'all' || item.operationType === historyFilter;
    const matchesSearch =
      historySearch === '' ||
      item.description.includes(historySearch) ||
      item.user.includes(historySearch);
    return matchesFilter && matchesSearch;
  });

  // History summary stats
  const totalImports = operationHistoryData.filter((o) => o.operationType === 'import').length;
  const totalExports = operationHistoryData.filter((o) => o.operationType === 'export').length;
  const totalBackups = operationHistoryData.filter((o) => o.operationType === 'backup').length;
  const totalErrors = operationHistoryData.filter((o) => o.status === 'failed').length;

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto"
      >
        {/* ─── Header ─────────────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200">
              <Database className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">مرکز داده</h1>
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 text-xs px-3 py-1">
                  فاز ۳
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                مدیریت جامع واردکردن، خروجی‌گیری و پشتیبان‌گیری داده‌های پلتفرم
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 text-gray-600 border-gray-200">
              <RefreshCw className="h-4 w-4" />
              بروزرسانی
            </Button>
            <Button size="sm" className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md">
              <Zap className="h-4 w-4" />
              عملیات سریع
            </Button>
          </div>
        </motion.div>

        {/* ─── Stats Row ──────────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'رکوردهای کل', value: '۱۲,۵۴۸', icon: <Database className="h-5 w-5" />, color: 'from-emerald-500 to-emerald-600', bgLight: 'bg-emerald-50' },
            { label: 'خروجی‌های اخیر', value: '۲۳', icon: <Download className="h-5 w-5" />, color: 'from-teal-500 to-teal-600', bgLight: 'bg-teal-50' },
            { label: 'واردکردنی‌های موفق', value: '۱۵', icon: <Upload className="h-5 w-5" />, color: 'from-cyan-500 to-cyan-600', bgLight: 'bg-cyan-50' },
            { label: 'حجم داده‌ها', value: '۲.۴ GB', icon: <HardDrive className="h-5 w-5" />, color: 'from-green-500 to-green-600', bgLight: 'bg-green-50' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-sm`}>
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* ─── Main Tabs ──────────────────────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="export" className="space-y-6">
            <TabsList className="bg-white shadow-sm border border-gray-100 p-1 rounded-xl h-auto gap-1">
              <TabsTrigger
                value="export"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-all gap-2"
              >
                <Download className="h-4 w-4" />
                خروجی داده
              </TabsTrigger>
              <TabsTrigger
                value="import"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-all gap-2"
              >
                <Upload className="h-4 w-4" />
                واردکردن داده
              </TabsTrigger>
              <TabsTrigger
                value="backup"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-all gap-2"
              >
                <HardDrive className="h-4 w-4" />
                پشتیبان‌گیری
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-all gap-2"
              >
                <History className="h-4 w-4" />
                تاریخچه عملیات
              </TabsTrigger>
            </TabsList>

            {/* ─── Tab 1: Data Export ─────────────────────────────────── */}
            <TabsContent value="export">
              <div className="space-y-6">
                {/* Export Type Grid */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900">انتخاب نوع خروجی</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={selectAllExports} className="text-emerald-600 hover:text-emerald-700 text-xs">
                          انتخاب همه
                        </Button>
                        <Button variant="ghost" size="sm" onClick={clearExportSelection} className="text-gray-500 hover:text-gray-700 text-xs">
                          پاک کردن
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <AnimatePresence>
                        {exportTypes.map((exp, idx) => {
                          const isSelected = selectedExportTypes.includes(exp.id);
                          return (
                            <motion.div
                              key={exp.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              whileHover={{ y: -3 }}
                            >
                              <Card
                                className={`cursor-pointer transition-all duration-200 border-2 ${
                                  isSelected
                                    ? 'border-emerald-400 bg-emerald-50/50 shadow-md shadow-emerald-100'
                                    : 'border-gray-100 hover:border-emerald-200 hover:shadow-sm'
                                }`}
                                onClick={() => toggleExportType(exp.id)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'} transition-colors`}>
                                      {exp.icon}
                                    </div>
                                    <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${getFormatBadgeColor(exp.format)}`}>
                                      {exp.format}
                                    </Badge>
                                  </div>
                                  <h3 className="font-semibold text-gray-900 mb-1">{exp.name}</h3>
                                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">{exp.description}</p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">{exp.recordCount.toLocaleString('fa-IR')} رکورد</span>
                                    <Button
                                      size="sm"
                                      className={`text-xs px-3 py-1 h-7 ${
                                        isSelected
                                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                          : 'bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-700'
                                      }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleExportType(exp.id);
                                      }}
                                    >
                                      <Download className="h-3 w-3 ml-1" />
                                      خروجی
                                    </Button>
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

                {/* Export Options */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Date Range & Format */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-900">تنظیمات خروجی</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">از تاریخ</Label>
                          <Input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">تا تاریخ</Label>
                          <Input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-600">فرمت خروجی</Label>
                        <Select value={exportFormat} onValueChange={setExportFormat}>
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF - گزارش قابل چاپ</SelectItem>
                            <SelectItem value="excel">Excel - جدول داده</SelectItem>
                            <SelectItem value="csv">CSV - داده خام</SelectItem>
                            <SelectItem value="json">JSON - ساختاریافته</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Include Options */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-900">موارد قابل شمول</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <Checkbox
                          id="charts"
                          checked={includeCharts}
                          onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
                          className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                        <Label htmlFor="charts" className="text-sm text-gray-700 cursor-pointer flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-emerald-500" />
                          شامل نمودارها و گرافیک‌ها
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <Checkbox
                          id="recommendations"
                          checked={includeRecommendations}
                          onCheckedChange={(checked) => setIncludeRecommendations(checked as boolean)}
                          className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                        <Label htmlFor="recommendations" className="text-sm text-gray-700 cursor-pointer flex items-center gap-2">
                          <ClipboardCheck className="h-4 w-4 text-teal-500" />
                          شامل توصیه‌ها و پیشنهادها
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <Checkbox
                          id="benchmarks"
                          checked={includeBenchmarks}
                          onCheckedChange={(checked) => setIncludeBenchmarks(checked as boolean)}
                          className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                        <Label htmlFor="benchmarks" className="text-sm text-gray-700 cursor-pointer flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-cyan-500" />
                          شامل معیارهای مقایسه‌ای
                        </Label>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{selectedExportTypes.length} مورد انتخاب شده</span>
                        <span>
                          {exportTypes
                            .filter((t) => selectedExportTypes.includes(t.id))
                            .reduce((acc, t) => acc + t.recordCount, 0)
                            .toLocaleString('fa-IR')}{' '}
                          رکورد
                        </span>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md gap-2">
                        <FileDown className="h-4 w-4" />
                        دانلود همه ({selectedExportTypes.length || 0} مورد)
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* ─── Tab 2: Data Import ─────────────────────────────────── */}
            <TabsContent value="import">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Upload Area */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold text-gray-900">واردکردن فایل داده</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Import Type Selector */}
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">نوع داده واردکردنی</Label>
                          <Select value={importType} onValueChange={setImportType}>
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="crm-leads">سرنخ‌های CRM</SelectItem>
                              <SelectItem value="financial-data">داده‌های مالی</SelectItem>
                              <SelectItem value="users">کاربران</SelectItem>
                              <SelectItem value="benchmarks">معیارهای مقایسه‌ای</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Drag & Drop Zone */}
                        <motion.div
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                          onClick={handleFileSelect}
                          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                            dragActive
                              ? 'border-emerald-400 bg-emerald-50/50 scale-[1.02]'
                              : uploadComplete
                              ? 'border-emerald-300 bg-emerald-50/30'
                              : 'border-gray-200 bg-gray-50/50 hover:border-emerald-300 hover:bg-emerald-50/20'
                          }`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept=".csv,.xlsx,.xls,.json"
                            onChange={() => {
                              setFileName('import-data-1404.xlsx');
                              simulateUpload();
                            }}
                          />
                          <motion.div
                            animate={dragActive ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                            className="flex flex-col items-center gap-3"
                          >
                            {uploadComplete ? (
                              <>
                                <div className="p-4 rounded-full bg-emerald-100">
                                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                </div>
                                <p className="text-emerald-700 font-semibold">فایل با موفقیت بارگذاری شد!</p>
                                <p className="text-xs text-emerald-600">{fileName}</p>
                              </>
                            ) : (
                              <>
                                <div className="p-4 rounded-full bg-gray-100">
                                  <FileUp className="h-10 w-10 text-gray-400" />
                                </div>
                                <p className="text-gray-700 font-semibold">
                                  فایل را بکشید و رها کنید
                                </p>
                                <p className="text-xs text-gray-400">یا کلیک کنید برای انتخاب فایل</p>
                              </>
                            )}
                          </motion.div>
                        </motion.div>

                        {/* Supported Formats Info */}
                        <div className="flex items-center gap-4 justify-center">
                          {[
                            { label: 'CSV', icon: <FileText className="h-3.5 w-3.5" /> },
                            { label: 'Excel', icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
                            { label: 'JSON', icon: <FileText className="h-3.5 w-3.5" /> },
                          ].map((fmt) => (
                            <div key={fmt.label} className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                              {fmt.icon}
                              <span>{fmt.label}</span>
                            </div>
                          ))}
                        </div>

                        {/* Upload Progress */}
                        {isUploading && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-2"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">در حال بارگذاری...</span>
                              <span className="text-emerald-600 font-medium">{Math.round(uploadProgress)}٪</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Validation Results */}
                    {uploadComplete && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="border-0 shadow-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-gray-900">نتایج اعتبارسنجی</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                <div>
                                  <p className="text-xs text-gray-500">رکوردهای معتبر</p>
                                  <p className="text-lg font-bold text-emerald-700">۲۳۸</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                                <XCircle className="h-5 w-5 text-red-500" />
                                <div>
                                  <p className="text-xs text-gray-500">خطاها</p>
                                  <p className="text-lg font-bold text-red-700">۷</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                <div>
                                  <p className="text-xs text-gray-500">هشدارها</p>
                                  <p className="text-lg font-bold text-amber-700">۱۲</p>
                                </div>
                              </div>
                            </div>

                            {/* Preview Table */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-semibold text-gray-700">پیش‌نمایش داده‌های واردشده</h4>
                              <div className="overflow-x-auto rounded-xl border border-gray-100">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="bg-gray-50">
                                      <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500">ردیف</th>
                                      <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500">نام</th>
                                      <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500">صنعت</th>
                                      <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500">درآمد</th>
                                      <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500">امتیاز</th>
                                      <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500">وضعیت</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {previewData.map((row, idx) => (
                                      <tr key={idx} className="border-t border-gray-50 hover:bg-gray-50/50">
                                        <td className="px-4 py-2 text-gray-500 text-xs">{row.id}</td>
                                        <td className="px-4 py-2 font-medium text-gray-900">{row.name}</td>
                                        <td className="px-4 py-2 text-gray-600">{row.industry}</td>
                                        <td className="px-4 py-2 text-gray-600">{row.revenue}</td>
                                        <td className="px-4 py-2">
                                          <span className="text-emerald-600 font-semibold">{row.score}</span>
                                        </td>
                                        <td className="px-4 py-2">
                                          <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                                            {row.status}
                                          </Badge>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                تأیید و واردکردن
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </div>

                  {/* Import History */}
                  <Card className="border-0 shadow-sm h-fit">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-900">تاریخچه واردکردن</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="max-h-[500px]">
                        <div className="space-y-3">
                          {importHistoryData.map((item, idx) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="p-3 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(item.status)}
                                  <span className="text-sm font-medium text-gray-900">{item.type}</span>
                                </div>
                                <Badge variant="outline" className={`text-[10px] ${getStatusColor(item.status)}`}>
                                  {item.status === 'success' ? 'موفق' : item.status === 'partial' ? 'ناقص' : 'ناموفق'}
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-500 space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <CalendarDays className="h-3 w-3" />
                                  <span>{item.date}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-400">{item.fileName}</span>
                                  <span className="text-emerald-600 font-medium">{item.records} رکورد</span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* ─── Tab 3: Data Backup ─────────────────────────────────── */}
            <TabsContent value="backup">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Backup Status Card */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold text-gray-900">وضعیت پشتیبان‌گیری</CardTitle>
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                          <ShieldCheck className="h-3 w-3 ml-1" />
                          فعال
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-emerald-100">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-emerald-800">آخرین پشتیبان‌گیری موفق</p>
                            <p className="text-xs text-emerald-600">۱۴۰۴/۰۳/۱۵ - ۰۲:۳۰</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="p-2 bg-white/60 rounded-lg">
                            <p className="text-xs text-gray-500">نوع</p>
                            <p className="text-sm font-semibold text-gray-900">کامل</p>
                          </div>
                          <div className="p-2 bg-white/60 rounded-lg">
                            <p className="text-xs text-gray-500">حجم</p>
                            <p className="text-sm font-semibold text-gray-900">۵۸۰ MB</p>
                          </div>
                          <div className="p-2 bg-white/60 rounded-lg">
                            <p className="text-xs text-gray-500">مدت</p>
                            <p className="text-sm font-semibold text-gray-900">۸ دقیقه</p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Storage Usage */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700">مصرف فضای ذخیره‌سازی</h4>
                        {[
                          { label: 'CRM', value: 68, color: 'bg-emerald-500' },
                          { label: 'مالی', value: 52, color: 'bg-teal-500' },
                          { label: 'تشخیصی', value: 35, color: 'bg-cyan-500' },
                          { label: 'استراتژیک', value: 28, color: 'bg-green-500' },
                          { label: 'کاربران', value: 15, color: 'bg-emerald-400' },
                        ].map((cat, idx) => (
                          <div key={idx} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">{cat.label}</span>
                              <span className="text-gray-500 font-medium">{cat.value}٪</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${cat.value}%` }}
                                transition={{ duration: 0.8, delay: idx * 0.1 }}
                                className={`h-full rounded-full ${cat.color}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                        <span className="text-xs text-gray-600">فضای کل استفاده شده</span>
                        <span className="text-sm font-bold text-gray-900">۱.۸ GB / ۵ GB</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Backup Schedule & Instant Backup */}
                  <div className="space-y-6">
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-gray-900">تنظیمات زمان‌بندی</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">دوره پشتیبان‌گیری خودکار</Label>
                          <Select value={backupSchedule} onValueChange={setBackupSchedule}>
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">روزانه (هر شب ساعت ۰۲:۳۰)</SelectItem>
                              <SelectItem value="weekly">هفتگی (هر شنبه)</SelectItem>
                              <SelectItem value="monthly">ماهانه (اول هر ماه)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">زمان اجرا</Label>
                          <Input type="time" defaultValue="02:30" className="text-sm" />
                        </div>
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <Checkbox
                            id="auto-backup"
                            defaultChecked
                            className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                          />
                          <Label htmlFor="auto-backup" className="text-sm text-gray-700 cursor-pointer">
                            فعال‌سازی پشتیبان‌گیری خودکار
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <Checkbox
                            id="notify-backup"
                            defaultChecked
                            className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                          />
                          <Label htmlFor="notify-backup" className="text-sm text-gray-700 cursor-pointer">
                            ارسال اعلان پس از اتمام
                          </Label>
                        </div>
                      </CardContent>
                    </Card>

                    <Button
                      className="w-full h-14 text-base bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg gap-2 rounded-xl"
                    >
                      <Save className="h-5 w-5" />
                      پشتیبان‌گیری فوری
                    </Button>

                    {/* Backup List */}
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-gray-900">لیست پشتیبان‌ها</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="max-h-[300px]">
                          <div className="space-y-3">
                            {backupData.map((backup, idx) => (
                              <motion.div
                                key={backup.id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-3 rounded-xl border border-gray-100 hover:border-emerald-200 transition-all"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Archive className="h-4 w-4 text-emerald-500" />
                                    <span className="text-sm font-medium text-gray-900">
                                      پشتیبان {getBackupTypeLabel(backup.type)}
                                    </span>
                                  </div>
                                  <Badge variant="outline" className={`text-[10px] ${getStatusColor(backup.status)}`}>
                                    {backup.status === 'completed' ? 'تکمیل شده' : backup.status === 'in_progress' ? 'در حال انجام' : 'ناموفق'}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1">
                                      <CalendarDays className="h-3 w-3" />
                                      {backup.date}
                                    </span>
                                    <span>{backup.size}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0 text-gray-400 hover:text-emerald-600"
                                      title="دانلود"
                                    >
                                      <Download className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0 text-gray-400 hover:text-orange-600"
                                      title="بازیابی"
                                      onClick={() => {
                                        setSelectedBackupId(backup.id);
                                        setShowRestoreDialog(true);
                                      }}
                                    >
                                      <RotateCcw className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0 text-gray-400 hover:text-red-600"
                                      title="حذف"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ─── Tab 4: Operation History ───────────────────────────── */}
            <TabsContent value="history">
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'کل واردکردن‌ها', value: totalImports, icon: <Upload className="h-4 w-4" />, color: 'text-blue-600 bg-blue-50' },
                    { label: 'کل خروجی‌ها', value: totalExports, icon: <Download className="h-4 w-4" />, color: 'text-emerald-600 bg-emerald-50' },
                    { label: 'کل پشتیبان‌ها', value: totalBackups, icon: <Archive className="h-4 w-4" />, color: 'text-purple-600 bg-purple-50' },
                    { label: 'خطاها', value: totalErrors, icon: <XCircle className="h-4 w-4" />, color: 'text-red-600 bg-red-50' },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${stat.color}`}>{stat.icon}</div>
                            <div>
                              <p className="text-xs text-gray-500">{stat.label}</p>
                              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Filters */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="جستجو در تاریخچه..."
                          value={historySearch}
                          onChange={(e) => setHistorySearch(e.target.value)}
                          className="pr-10 text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <Select value={historyFilter} onValueChange={setHistoryFilter}>
                          <SelectTrigger className="w-[160px] text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">همه عملیات</SelectItem>
                            <SelectItem value="import">واردکردن</SelectItem>
                            <SelectItem value="export">خروجی</SelectItem>
                            <SelectItem value="backup">پشتیبان‌گیری</SelectItem>
                            <SelectItem value="restore">بازیابی</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-gray-900">خط زمانی عملیات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="max-h-[600px]">
                      <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute right-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-200 via-teal-200 to-gray-100" />

                        <div className="space-y-1">
                          <AnimatePresence>
                            {filteredHistory.map((item, idx) => (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="relative pr-12"
                              >
                                {/* Timeline dot */}
                                <div className="absolute right-[13px] top-4 p-1 rounded-full bg-white shadow-sm border border-gray-100">
                                  <div className="p-0.5 rounded-full bg-emerald-400" />
                                </div>

                                <div className="p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all mb-2">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-3">
                                      <div className={`p-1.5 rounded-lg ${getOperationTypeBadgeColor(item.operationType)}`}>
                                        {getOperationTypeIcon(item.operationType)}
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">{item.description}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{item.timestamp}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 mr-auto sm:mr-0">
                                      <Badge variant="outline" className={`text-[10px] ${getOperationTypeBadgeColor(item.operationType)}`}>
                                        {getOperationTypeLabel(item.operationType)}
                                      </Badge>
                                      <Badge variant="outline" className={`text-[10px] ${getStatusColor(item.status)}`}>
                                        {item.status === 'completed' ? 'تکمیل شده' : item.status === 'failed' ? 'ناموفق' : 'در حال انجام'}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Database className="h-3 w-3" />
                                      {item.records.toLocaleString('fa-IR')} رکورد
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {item.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {item.user}
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>

                        {filteredHistory.length === 0 && (
                          <div className="text-center py-12 text-gray-400">
                            <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">موردی یافت نشد</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>

      {/* ─── Restore Dialog ─────────────────────────────────────────────── */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              هشدار بازیابی از پشتیبان
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-800 font-medium mb-2">
                آیا از بازیابی از این پشتیبان اطمینان دارید؟
              </p>
              <p className="text-xs text-red-600 leading-relaxed">
                این عملیات تمام داده‌های فعلی را با داده‌های پشتیبان جایگزین می‌کند. تغییراتی که پس از تاریخ
                پشتیبان‌گیری انجام شده‌اند، از بین خواهند رفت. این عملیات قابل بازگشت نیست.
              </p>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-xs font-medium">توصیه می‌شود قبل از بازیابی، یک پشتیبان جدید بگیرید.</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setShowRestoreDialog(false)}
                className="gap-2"
              >
                انصراف
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white gap-2"
                onClick={() => setShowRestoreDialog(false)}
              >
                <RotateCcw className="h-4 w-4" />
                تأیید بازیابی
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
