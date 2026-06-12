'use client';

import { useState, useMemo } from 'react';
import { useAppStore, type AuditLog } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import {
  Shield,
  Users,
  Activity,
  Settings,
  Database,
  Clock,
  Server,
  HardDrive,
  Cpu,
  Wifi,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  Power,
} from 'lucide-react';

// --- Mock Data ---

const mockUsers = [
  { id: '1', name: 'علی محمدی', email: 'ali@novin.ir', role: 'admin' as const, company: 'فناوری نوین', status: 'active' as const, lastLogin: '۱۴۰۳/۱۲/۰۸ - ۱۴:۳۵' },
  { id: '2', name: 'مریم احمدی', email: 'maryam@creative.ir', role: 'consultant' as const, company: 'صنایع خلاق', status: 'active' as const, lastLogin: '۱۴۰۳/۱۲/۰۸ - ۱۳:۲۰' },
  { id: '3', name: 'رضا حسینی', email: 'reza@edu.ir', role: 'sme' as const, company: 'پلتفرم آموزشی آینده', status: 'active' as const, lastLogin: '۱۴۰۳/۱۲/۰۷ - ۱۶:۴۵' },
  { id: '4', name: 'زهرا کریمی', email: 'zahra@parsian.ir', role: 'ceo' as const, company: 'گروه بازرگانی پارسیان', status: 'active' as const, lastLogin: '۱۴۰۳/۱۲/۰۸ - ۱۱:۰۵' },
  { id: '5', name: 'حسن نوری', email: 'hasan@green.ir', role: 'sme' as const, company: 'استارتاپ سبز', status: 'inactive' as const, lastLogin: '۱۴۰۳/۱۱/۲۵ - ۰۹:۳۰' },
  { id: '6', name: 'فاطمه رضایی', email: 'fatemeh@health.ir', role: 'analyst' as const, company: 'شرکت بهداشتی سلامت', status: 'active' as const, lastLogin: '۱۴۰۳/۱۲/۰۸ - ۱۰:۱۵' },
  { id: '7', name: 'محمد عباسی', email: 'mohammad@tech.ir', role: 'branch_manager' as const, company: 'فناوری پیشرو', status: 'active' as const, lastLogin: '۱۴۰۳/۱۲/۰۶ - ۱۵:۰۰' },
  { id: '8', name: 'سارا نیکخواه', email: 'sara@invest.ir', role: 'investor' as const, company: 'سرمایه‌گذاری آینده', status: 'inactive' as const, lastLogin: '۱۴۰۳/۱۱/۳۰ - ۱۲:۴۰' },
];

const apiResponseTimeData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, '0')}:۰۰`,
  responseTime: Math.floor(Math.random() * 200) + 80,
  errorRate: Math.random() * 5,
}));

const requestVolumeData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, '0')}:۰۰`,
  requests: Math.floor(Math.random() * 5000) + 1000,
  errors: Math.floor(Math.random() * 200) + 10,
}));

const resourceUsage = [
  { name: 'CPU', value: 67, color: '#10b981' },
  { name: 'حافظه', value: 74, color: '#14b8a6' },
  { name: 'فضای ذخیره‌سازی', value: 52, color: '#059669' },
  { name: 'شبکه', value: 38, color: '#0d9488' },
];

const mockActivityLogs: (AuditLog & { severity: 'info' | 'warning' | 'error' | 'critical' })[] = [
  { id: '1', userId: '1', userName: 'علی محمدی', action: 'ورود به سیستم', resource: 'احراز هویت', details: 'ورود موفق از IP 192.168.1.10', ip: '192.168.1.10', timestamp: '۱۴۰۳/۱۲/۰۸ - ۱۴:۳۵', severity: 'info' },
  { id: '2', userId: '2', userName: 'مریم احمدی', action: 'ویرایش پروفایل', resource: 'کاربران', details: 'به‌روزرسانی اطلاعات شخصی', ip: '10.0.0.5', timestamp: '۱۴۰۳/۱۲/۰۸ - ۱۳:۵۰', severity: 'info' },
  { id: '3', userId: '3', userName: 'رضا حسینی', action: 'ایجاد تشخیص', resource: 'تشخیص استراتژیک', details: 'شروع ارزیابی جدید برای شرکت', ip: '172.16.0.12', timestamp: '۱۴۰۳/۱۲/۰۸ - ۱۲:۲۰', severity: 'info' },
  { id: '4', userId: '1', userName: 'علی محمدی', action: 'تغییر تنظیمات', resource: 'پلتفرم', details: 'به‌روزرسانی تنظیمات ایمیل SMTP', ip: '192.168.1.10', timestamp: '۱۴۰۳/۱۲/۰۸ - ۱۱:۴۵', severity: 'warning' },
  { id: '5', userId: '4', userName: 'زهرا کریمی', action: 'دانلود گزارش', resource: 'گزارش‌ها', details: 'خروجی PDF گزارش استراتژیک', ip: '10.0.1.22', timestamp: '۱۴۰۳/۱۲/۰۸ - ۱۱:۰۵', severity: 'info' },
  { id: '6', userId: 'system', userName: 'سیستم', action: 'پشتیبان‌گیری خودکار', resource: 'پشتیبان‌گیری', details: 'بکاپ روزانه تکمیل شد - حجم: ۲.۴ گیگابایت', ip: '127.0.0.1', timestamp: '۱۴۰۳/۱۲/۰۸ - ۰۳:۰۰', severity: 'info' },
  { id: '7', userId: '5', userName: 'حسن نوری', action: 'ورود ناموفق', resource: 'احراز هویت', details: '۵ تلاش ناموفق برای ورود - حساب مسدود شد', ip: '203.0.113.45', timestamp: '۱۴۰۳/۱۲/۰۸ - ۰۹:۱۵', severity: 'critical' },
  { id: '8', userId: '6', userName: 'فاطمه رضایی', action: 'ایجاد فاکتور', resource: 'مالی', details: 'صدور فاکتور شماره INV-1403-0045', ip: '10.0.0.8', timestamp: '۱۴۰۳/۱۲/۰۷ - ۱۶:۳۰', severity: 'info' },
  { id: '9', userId: 'system', userName: 'سیستم', action: 'خطای دیتابیس', resource: 'دیتابیس', details: 'Connection pool exhausted - افزایش اتصالات', ip: '127.0.0.1', timestamp: '۱۴۰۳/۱۲/۰۷ - ۱۵:۴۵', severity: 'error' },
  { id: '10', userId: '7', userName: 'محمد عباسی', action: 'ایجاد شعبه', resource: 'سازمان‌ها', details: 'افزودن شعبه جدید در شیراز', ip: '10.0.2.15', timestamp: '۱۴۰۳/۱۲/۰۷ - ۱۴:۲۰', severity: 'info' },
  { id: '11', userId: '2', userName: 'مریم احمدی', action: 'حذف مشتری', resource: 'CRM', details: 'حذف رکورد مشتری غیرفعال', ip: '10.0.0.5', timestamp: '۱۴۰۳/۱۲/۰۷ - ۱۳:۱۰', severity: 'warning' },
  { id: '12', userId: 'system', userName: 'سیستم', action: 'بروزرسانی سیستم', resource: 'پلتفرم', details: 'به‌روزرسانی نسخه به v3.2.1', ip: '127.0.0.1', timestamp: '۱۴۰۳/۱۲/۰۷ - ۰۲:۰۰', severity: 'warning' },
  { id: '13', userId: '1', userName: 'علی محمدی', action: 'دعوت کاربر', resource: 'کاربران', details: 'ارسال دعوت‌نامه به sara@invest.ir', ip: '192.168.1.10', timestamp: '۱۴۰۳/۱۲/۰۶ - ۱۶:۰۰', severity: 'info' },
  { id: '14', userId: '3', userName: 'رضا حسینی', action: 'مشاهده راهنما', resource: 'نقشه راه', details: 'دسترسی به نقشه راه استراتژیک', ip: '172.16.0.12', timestamp: '۱۴۰۳/۱۲/۰۶ - ۱۴:۳۰', severity: 'info' },
  { id: '15', userId: 'system', userName: 'سیستم', action: 'خطای حافظه', resource: 'زیرساخت', details: 'Memory usage exceeded 90% threshold', ip: '127.0.0.1', timestamp: '۱۴۰۳/۱۲/۰۶ - ۱۲:۱۵', severity: 'error' },
  { id: '16', userId: '8', userName: 'سارا نیکخواه', action: 'ثبت‌نام', resource: 'احراز هویت', details: 'ایجاد حساب سرمایه‌گذار جدید', ip: '203.0.113.50', timestamp: '۱۴۰۳/۱۲/۰۶ - ۱۰:۴۵', severity: 'info' },
  { id: '17', userId: '4', userName: 'زهرا کریمی', action: 'تایید بودجه', resource: 'مالی', details: 'تایید بودجه شعبه شمال', ip: '10.0.1.22', timestamp: '۱۴۰۳/۱۲/۰۵ - ۱۵:۲۰', severity: 'info' },
  { id: '18', userId: '1', userName: 'علی محمدی', action: 'غیرفعال‌سازی کاربر', resource: 'کاربران', details: 'غیرفعال‌سازی حساب حسن نوری به دلیل عدم فعالیت', ip: '192.168.1.10', timestamp: '۱۴۰۳/۱۲/۰۵ - ۱۱:۳۰', severity: 'warning' },
  { id: '19', userId: 'system', userName: 'سیستم', action: 'بهینه‌سازی دیتابیس', resource: 'دیتابیس', details: 'VACUUM و INDEX REBUILD تکمیل شد', ip: '127.0.0.1', timestamp: '۱۴۰۳/۱۲/۰۵ - ۰۳:۰۰', severity: 'info' },
  { id: '20', userId: '6', userName: 'فاطمه رضایی', action: 'خروجی داده', resource: 'گزارش‌ها', details: 'استخراج داده‌های CRM به فرمت Excel', ip: '10.0.0.8', timestamp: '۱۴۰۳/۱۲/۰۴ - ۱۶:۵۰', severity: 'info' },
];

const mockBackups = [
  { id: '1', date: '۱۴۰۳/۱۲/۰۸ - ۰۳:۰۰', size: '۲.۴ گیگابایت', type: 'auto' as const, status: 'completed' as const },
  { id: '2', date: '۱۴۰۳/۱۲/۰۷ - ۰۳:۰۰', size: '۲.۳ گیگابایت', type: 'auto' as const, status: 'completed' as const },
  { id: '3', date: '۱۴۰۳/۱۲/۰۶ - ۱۵:۳۰', size: '۲.۳۵ گیگابایت', type: 'manual' as const, status: 'completed' as const },
  { id: '4', date: '۱۴۰۳/۱۲/۰۶ - ۰۳:۰۰', size: '۲.۲ گیگابایت', type: 'auto' as const, status: 'completed' as const },
  { id: '5', date: '۱۴۰۳/۱۲/۰۵ - ۰۳:۰۰', size: '۲.۱ گیگابایت', type: 'auto' as const, status: 'failed' as const },
  { id: '6', date: '۱۴۰۳/۱۲/۰۴ - ۰۳:۰۰', size: '۲.۰ گیگابایت', type: 'auto' as const, status: 'completed' as const },
];

// --- Helper ---

const roleLabel = (role: string) => {
  const map: Record<string, string> = {
    admin: 'مدیر سیستم',
    consultant: 'مشاور',
    sme: 'کسب‌وکار',
    ceo: 'مدیرعامل',
    analyst: 'تحلیلگر',
    branch_manager: 'مدیر شعبه',
    investor: 'سرمایه‌گذار',
  };
  return map[role] || role;
};

const severityConfig = {
  info: { label: 'اطلاعات', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  warning: { label: 'هشدار', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  error: { label: 'خطا', className: 'bg-red-100 text-red-700 border-red-200' },
  critical: { label: 'بحرانی', className: 'bg-red-200 text-red-900 border-red-300' },
};

// --- Main Component ---

export default function AdminAdvanced() {
  const { auditLogs, setAuditLogs } = useAppStore();

  // Initialize audit logs from mock if empty
  if (auditLogs.length === 0) {
    setAuditLogs(mockActivityLogs.map(({ severity, ...log }) => log));
  }

  const [systemOnline, setSystemOnline] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('sme');
  const [inviteCompany, setInviteCompany] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedBackupId, setSelectedBackupId] = useState<string | null>(null);
  const [logActionFilter, setLogActionFilter] = useState('all');
  const [logSeverityFilter, setLogSeverityFilter] = useState('all');

  // Platform settings
  const [platformName, setPlatformName] = useState('BCGSP');
  const [supportEmail, setSupportEmail] = useState('support@bcgsp.ir');
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [passwordPolicy, setPasswordPolicy] = useState('strong');
  const [twoFactorEnforced, setTwoFactorEnforced] = useState(false);
  const [smtpHost, setSmtpHost] = useState('smtp.bcgsp.ir');
  const [smtpPort, setSmtpPort] = useState('587');
  const [rateLimit, setRateLimit] = useState('1000');
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.bcgsp.ir/events');
  const [backupSchedule, setBackupSchedule] = useState('daily');
  const [backupRetention, setBackupRetention] = useState('30');

  // Filtered users
  const filteredUsers = useMemo(() => {
    return mockUsers.filter((u) => {
      const matchesSearch =
        u.name.includes(userSearch) ||
        u.email.includes(userSearch) ||
        u.company.includes(userSearch);
      const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [userSearch, userRoleFilter]);

  // Filtered activity logs
  const filteredLogs = useMemo(() => {
    return mockActivityLogs.filter((log) => {
      const matchesAction = logActionFilter === 'all' || log.action.includes(logActionFilter);
      const matchesSeverity = logSeverityFilter === 'all' || log.severity === logSeverityFilter;
      return matchesAction && matchesSeverity;
    });
  }, [logActionFilter, logSeverityFilter]);

  const errorRate = 2.3;
  const errorRatePercent = Math.min(errorRate, 100);

  // Stats data
  const systemStats = [
    { icon: Users, label: 'کاربران فعال', value: '۱,۲۴۸', change: '+۱۲', color: 'emerald' },
    { icon: Activity, label: 'درخواست‌های API', value: '۴۸,۵۲۰', change: '+۵.۳٪', color: 'teal' },
    { icon: HardDrive, label: 'فضای ذخیره‌سازی', value: '۵۲٪', change: '۲.۴ گیگابایت آزاد', color: 'emerald' },
    { icon: Clock, label: 'uptime سیستم', value: '۹۹.۹۷٪', change: '۳۶۵ روز', color: 'teal' },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-bl from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">پنل مدیریت پیشرفته</h1>
            <p className="text-slate-500 text-sm mt-0.5">نظارت و مدیریت جامع پلتفرم BCGSP</p>
          </div>
          <Badge className="bg-gradient-to-l from-emerald-500 to-teal-600 text-white border-0 px-3 py-1 text-sm font-bold shadow-sm">
            فاز ۳
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSystemOnline(!systemOnline)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              systemOnline
                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            {systemOnline ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                سیستم آنلاین
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                سیستم آفلاین
              </>
            )}
          </button>
          <Button variant="outline" size="sm" className="gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
            <RefreshCw className="w-3.5 h-3.5" />
            بروزرسانی
          </Button>
        </div>
      </motion.div>

      {/* System Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      stat.color === 'emerald' ? 'bg-emerald-100' : 'bg-teal-100'
                    }`}
                  >
                    <stat.icon
                      className={`w-5 h-5 ${stat.color === 'emerald' ? 'text-emerald-600' : 'text-teal-600'}`}
                    />
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{stat.change}</span>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-slate-100 p-1 h-auto flex flex-wrap gap-1">
          <TabsTrigger value="users" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700">
            <Users className="w-4 h-4" />
            مدیریت کاربران
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700">
            <Activity className="w-4 h-4" />
            مانیتورینگ سیستم
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700">
            <Settings className="w-4 h-4" />
            تنظیمات پلتفرم
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700">
            <Database className="w-4 h-4" />
            لاگ فعالیت
          </TabsTrigger>
          <TabsTrigger value="backup" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700">
            <HardDrive className="w-4 h-4" />
            پشتیبان‌گیری
          </TabsTrigger>
        </TabsList>

        {/* ===== Tab 1: User Management ===== */}
        <TabsContent value="users">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    فهرست کاربران
                  </CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                      <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder="جستجوی نام، ایمیل، شرکت..."
                        className="ps-3 pe-9 h-9 w-56"
                      />
                    </div>
                    <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                      <SelectTrigger className="w-36 h-9">
                        <SelectValue placeholder="فیلتر نقش" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">همه نقش‌ها</SelectItem>
                        <SelectItem value="admin">مدیر سیستم</SelectItem>
                        <SelectItem value="consultant">مشاور</SelectItem>
                        <SelectItem value="sme">کسب‌وکار</SelectItem>
                        <SelectItem value="ceo">مدیرعامل</SelectItem>
                        <SelectItem value="analyst">تحلیلگر</SelectItem>
                        <SelectItem value="branch_manager">مدیر شعبه</SelectItem>
                        <SelectItem value="investor">سرمایه‌گذار</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => setInviteDialogOpen(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 h-9"
                    >
                      <Plus className="w-4 h-4" />
                      دعوت کاربر
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[480px]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-right py-3 px-3 font-medium text-slate-500">نام</th>
                          <th className="text-right py-3 px-3 font-medium text-slate-500">ایمیل</th>
                          <th className="text-right py-3 px-3 font-medium text-slate-500">نقش</th>
                          <th className="text-right py-3 px-3 font-medium text-slate-500">شرکت</th>
                          <th className="text-right py-3 px-3 font-medium text-slate-500">وضعیت</th>
                          <th className="text-right py-3 px-3 font-medium text-slate-500">آخرین ورود</th>
                          <th className="text-right py-3 px-3 font-medium text-slate-500">عملیات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr
                            key={user.id}
                            className="border-b border-slate-100 hover:bg-emerald-50/40 transition-colors"
                          >
                            <td className="py-3 px-3 font-medium text-slate-800">{user.name}</td>
                            <td className="py-3 px-3 text-slate-600 text-xs" dir="ltr">{user.email}</td>
                            <td className="py-3 px-3">
                              <Badge
                                className={`text-xs ${
                                  user.role === 'admin'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : user.role === 'ceo'
                                    ? 'bg-teal-100 text-teal-700'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {roleLabel(user.role)}
                              </Badge>
                            </td>
                            <td className="py-3 px-3 text-slate-600">{user.company}</td>
                            <td className="py-3 px-3">
                              <Badge
                                className={`text-xs ${
                                  user.status === 'active'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {user.status === 'active' ? 'فعال' : 'غیرفعال'}
                              </Badge>
                            </td>
                            <td className="py-3 px-3 text-xs text-slate-500">{user.lastLogin}</td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-emerald-600">
                                  <Edit className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-amber-600">
                                  {user.status === 'active' ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-red-600">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>نمایش {filteredUsers.length} از {mockUsers.length} کاربر</span>
                  <span>آخرین بروزرسانی: ۱۴۰۳/۱۲/۰۸ - ۱۴:۴۰</span>
                </div>
              </CardContent>
            </Card>

            {/* Invite User Dialog */}
            <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
              <DialogContent className="sm:max-w-md" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-emerald-700">
                    <Plus className="w-5 h-5" />
                    دعوت کاربر جدید
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="invite-email">آدرس ایمیل</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="example@company.ir"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invite-role">نقش کاربر</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger id="invite-role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sme">کسب‌وکار</SelectItem>
                        <SelectItem value="consultant">مشاور</SelectItem>
                        <SelectItem value="ceo">مدیرعامل</SelectItem>
                        <SelectItem value="analyst">تحلیلگر</SelectItem>
                        <SelectItem value="branch_manager">مدیر شعبه</SelectItem>
                        <SelectItem value="investor">سرمایه‌گذار</SelectItem>
                        <SelectItem value="admin">مدیر سیستم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invite-company">نام شرکت</Label>
                    <Input
                      id="invite-company"
                      value={inviteCompany}
                      onChange={(e) => setInviteCompany(e.target.value)}
                      placeholder="نام شرکت یا سازمان"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      onClick={() => setInviteDialogOpen(false)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
                    >
                      ارسال دعوت‌نامه
                    </Button>
                    <Button variant="outline" onClick={() => setInviteDialogOpen(false)} className="flex-1">
                      انصراف
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        </TabsContent>

        {/* ===== Tab 2: System Monitoring ===== */}
        <TabsContent value="monitoring">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* API Response Time */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    زمان پاسخ API (۲۴ ساعت اخیر)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={apiResponseTimeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                        <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" unit="ms" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="responseTime"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={false}
                          name="زمان پاسخ (ms)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Request Volume */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-teal-600" />
                    حجم درخواست‌ها (۲۴ ساعت اخیر)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={requestVolumeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                        <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="requests"
                          stroke="#14b8a6"
                          fill="#14b8a6"
                          fillOpacity={0.15}
                          strokeWidth={2}
                          name="درخواست‌ها"
                        />
                        <Area
                          type="monotone"
                          dataKey="errors"
                          stroke="#ef4444"
                          fill="#ef4444"
                          fillOpacity={0.1}
                          strokeWidth={1.5}
                          name="خطاها"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Error Rate & Resources */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Error Rate Gauge */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    نرخ خطا
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={errorRatePercent < 5 ? '#10b981' : errorRatePercent < 15 ? '#f59e0b' : '#ef4444'}
                        strokeWidth="10"
                        strokeDasharray={`${(errorRatePercent / 100) * 251.2} 251.2`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-slate-900">{errorRate}%</span>
                      <span className="text-xs text-slate-500">نرخ خطا</span>
                    </div>
                  </div>
                  <Badge className="mt-3 bg-emerald-100 text-emerald-700 border-emerald-200">سالم</Badge>
                </CardContent>
              </Card>

              {/* Resource Usage */}
              <Card className="border-0 shadow-sm md:col-span-1 lg:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-600" />
                    مصرف منابع
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resourceUsage.map((res) => (
                    <div key={res.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 font-medium">{res.name}</span>
                        <span className="font-bold text-slate-800">{res.value}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${res.value}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: res.color }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Server className="w-4 h-4 text-teal-600" />
                    اتصالات و دیتابیس
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-slate-600">اتصالات فعال</span>
                    </div>
                    <span className="font-bold text-emerald-700">۱,۲۴۸</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-teal-600" />
                      <span className="text-sm text-slate-600">کوئری/ثانیه</span>
                    </div>
                    <span className="font-bold text-teal-700">۳۴۲</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-slate-600">اتصالات دیتابیس</span>
                    </div>
                    <span className="font-bold text-emerald-700">۲۸</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-teal-600" />
                      <span className="text-sm text-slate-600">حجم دیتابیس</span>
                    </div>
                    <span className="font-bold text-teal-700">۴.۸ گیگابایت</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </TabsContent>

        {/* ===== Tab 3: Platform Settings ===== */}
        <TabsContent value="settings">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* General Settings */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-600" />
                  تنظیمات عمومی
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">نام پلتفرم</Label>
                    <Input
                      id="platform-name"
                      value={platformName}
                      onChange={(e) => setPlatformName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-email">ایمیل پشتیبانی</Label>
                    <Input
                      id="support-email"
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>لوگوی پلتفرم</Label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-bl from-emerald-500 to-teal-600 flex items-center justify-center">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                      <Upload className="w-4 h-4 ml-1.5" />
                      آپلود لوگو
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">ذخیره تنظیمات عمومی</Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-teal-600" />
                  تنظیمات امنیتی
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">مهلت نشست (دقیقه)</Label>
                    <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                      <SelectTrigger id="session-timeout">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">۱۵ دقیقه</SelectItem>
                        <SelectItem value="30">۳۰ دقیقه</SelectItem>
                        <SelectItem value="60">۶۰ دقیقه</SelectItem>
                        <SelectItem value="120">۱۲۰ دقیقه</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-policy">سیاست رمز عبور</Label>
                    <Select value={passwordPolicy} onValueChange={setPasswordPolicy}>
                      <SelectTrigger id="password-policy">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">ساده (حداقل ۶ کاراکتر)</SelectItem>
                        <SelectItem value="medium">متوسط (۸ کاراکتر + عدد)</SelectItem>
                        <SelectItem value="strong">قوی (۱۰ کاراکتر + عدد + نماد)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">اجبار احراز هویت دو مرحله‌ای</p>
                    <p className="text-sm text-slate-500 mt-0.5">تمام کاربران باید 2FA را فعال کنند</p>
                  </div>
                  <Switch checked={twoFactorEnforced} onCheckedChange={setTwoFactorEnforced} />
                </div>
                <div className="flex justify-end">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">ذخیره تنظیمات امنیتی</Button>
                </div>
              </CardContent>
            </Card>

            {/* Email Settings */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  تنظیمات ایمیل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">آدرس سرور SMTP</Label>
                    <Input
                      id="smtp-host"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">پورت SMTP</Label>
                    <Input
                      id="smtp-port"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      dir="ltr"
                    />
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="mb-2 block">قالب‌های ایمیل</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { name: 'دعوت‌نامه کاربر', desc: 'ایمیل دعوت به پلتفرم' },
                      { name: 'بازنشانی رمز', desc: 'لینک بازیابی رمز عبور' },
                      { name: 'گزارش هفتگی', desc: 'خلاصه فعالیت‌های هفتگی' },
                      { name: 'هشدار امنیتی', desc: 'اعلان رویدادهای امنیتی' },
                      { name: 'فاکتور', desc: 'ارسال فاکتور و رسید' },
                      { name: 'تکمیل تشخیص', desc: 'نتایج ارزیابی استراتژیک' },
                    ].map((tpl) => (
                      <div
                        key={tpl.name}
                        className="p-3 border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors cursor-pointer"
                      >
                        <p className="text-sm font-medium text-slate-800">{tpl.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{tpl.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">ذخیره تنظیمات ایمیل</Button>
                </div>
              </CardContent>
            </Card>

            {/* API Settings */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="w-5 h-5 text-teal-600" />
                  تنظیمات API
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rate-limit">محدودیت نرخ (درخواست/ساعت)</Label>
                    <Input
                      id="rate-limit"
                      value={rateLimit}
                      onChange={(e) => setRateLimit(e.target.value)}
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">آدرس Webhook</Label>
                    <Input
                      id="webhook-url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">ذخیره تنظیمات API</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ===== Tab 4: Activity Log ===== */}
        <TabsContent value="logs">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-600" />
                    لاگ فعالیت سیستم
                  </CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Select value={logActionFilter} onValueChange={setLogActionFilter}>
                      <SelectTrigger className="w-40 h-9">
                        <SelectValue placeholder="نوع فعالیت" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">همه فعالیت‌ها</SelectItem>
                        <SelectItem value="ورود">ورود/احراز هویت</SelectItem>
                        <SelectItem value="ویرایش">ویرایش</SelectItem>
                        <SelectItem value="ایجاد">ایجاد</SelectItem>
                        <SelectItem value="حذف">حذف</SelectItem>
                        <SelectItem value="خطا">خطا</SelectItem>
                        <SelectItem value="پشتیبان">پشتیبان‌گیری</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={logSeverityFilter} onValueChange={setLogSeverityFilter}>
                      <SelectTrigger className="w-32 h-9">
                        <SelectValue placeholder="سطح" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">همه سطوح</SelectItem>
                        <SelectItem value="info">اطلاعات</SelectItem>
                        <SelectItem value="warning">هشدار</SelectItem>
                        <SelectItem value="error">خطا</SelectItem>
                        <SelectItem value="critical">بحرانی</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[560px]">
                  <div className="space-y-2">
                    {filteredLogs.map((log, i) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100"
                      >
                        <div className="mt-0.5">
                          <Badge className={`text-xs border ${severityConfig[log.severity].className}`}>
                            {severityConfig[log.severity].label}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm text-slate-800">{log.action}</span>
                            <span className="text-xs text-slate-400">—</span>
                            <span className="text-xs text-slate-500">{log.resource}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{log.details}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {log.userName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {log.timestamp}
                            </span>
                            <span className="flex items-center gap-1" dir="ltr">
                              <Wifi className="w-3 h-3" />
                              {log.ip}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>نمایش {filteredLogs.length} از {mockActivityLogs.length} رکورد</span>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-emerald-600 gap-1">
                    <Download className="w-3 h-3" />
                    خروجی CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ===== Tab 5: Backup & Maintenance ===== */}
        <TabsContent value="backup">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Actions Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Download className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">ایجاد پشتیبان</p>
                    <p className="text-xs text-slate-500 mt-0.5">پشتیبان‌گیری دستی از تمام داده‌ها</p>
                  </div>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-9">ایجاد</Button>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">بهینه‌سازی دیتابیس</p>
                    <p className="text-xs text-slate-500 mt-0.5">VACUUM و بازسازی ایندکس‌ها</p>
                  </div>
                  <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50 h-9">اجرا</Button>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    maintenanceMode ? 'bg-red-100' : 'bg-slate-100'
                  }`}>
                    <Power className={`w-6 h-6 ${maintenanceMode ? 'text-red-600' : 'text-slate-600'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">حالت نگهداری</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {maintenanceMode ? 'سیستم در حالت نگهداری است' : 'سیستم در حالت عادی'}
                    </p>
                  </div>
                  <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                </CardContent>
              </Card>
            </div>

            {/* Scheduled Backup Config */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  پیکربندی پشتیبان‌گیری خودکار
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="backup-schedule">دوره پشتیبان‌گیری</Label>
                    <Select value={backupSchedule} onValueChange={setBackupSchedule}>
                      <SelectTrigger id="backup-schedule">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">هر ساعت</SelectItem>
                        <SelectItem value="daily">روزانه</SelectItem>
                        <SelectItem value="weekly">هفتگی</SelectItem>
                        <SelectItem value="monthly">ماهانه</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backup-retention">مدت نگهداری (روز)</Label>
                    <Select value={backupRetention} onValueChange={setBackupRetention}>
                      <SelectTrigger id="backup-retention">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">۷ روز</SelectItem>
                        <SelectItem value="14">۱۴ روز</SelectItem>
                        <SelectItem value="30">۳۰ روز</SelectItem>
                        <SelectItem value="60">۶۰ روز</SelectItem>
                        <SelectItem value="90">۹۰ روز</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">ذخیره تنظیمات</Button>
                </div>
              </CardContent>
            </Card>

            {/* Backup History */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-teal-600" />
                  تاریخچه پشتیبان‌گیری
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[360px]">
                  <div className="space-y-2">
                    {mockBackups.map((backup, i) => (
                      <motion.div
                        key={backup.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              backup.status === 'completed' ? 'bg-emerald-100' : 'bg-red-100'
                            }`}
                          >
                            {backup.status === 'completed' ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-slate-800">{backup.date}</span>
                              <Badge
                                className={`text-xs ${
                                  backup.type === 'auto'
                                    ? 'bg-slate-100 text-slate-600'
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}
                              >
                                {backup.type === 'auto' ? 'خودکار' : 'دستی'}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">حجم: {backup.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`text-xs ${
                              backup.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {backup.status === 'completed' ? 'موفق' : 'ناموفق'}
                          </Badge>
                          {backup.status === 'completed' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs text-teal-600 hover:text-teal-700 gap-1"
                              onClick={() => {
                                setSelectedBackupId(backup.id);
                                setRestoreDialogOpen(true);
                              }}
                            >
                              <Upload className="w-3 h-3" />
                              بازیابی
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500 gap-1">
                            <Download className="w-3 h-3" />
                            دانلود
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Restore Dialog */}
            <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
              <DialogContent className="sm:max-w-md" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-amber-700">
                    <AlertTriangle className="w-5 h-5" />
                    تایید بازیابی پشتیبان
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800 font-medium">هشدار!</p>
                    <p className="text-sm text-amber-700 mt-1">
                      بازیابی از پشتیبان باعث جایگزینی تمام داده‌های فعلی خواهد شد. این عمل قابل بازگشت نیست.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-700">
                      پشتیبان انتخابی:{' '}
                      <span className="font-bold">
                        {mockBackups.find((b) => b.id === selectedBackupId)?.date || '—'}
                      </span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      حجم:{' '}
                      {mockBackups.find((b) => b.id === selectedBackupId)?.size || '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setRestoreDialogOpen(false)}
                      className="bg-red-600 hover:bg-red-700 text-white flex-1"
                    >
                      تایید بازیابی
                    </Button>
                    <Button variant="outline" onClick={() => setRestoreDialogOpen(false)} className="flex-1">
                      انصراف
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
