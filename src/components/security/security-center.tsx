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
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import {
  Shield,
  Lock,
  Key,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Smartphone,
  Monitor,
  Globe,
  Fingerprint,
  FileText,
  Download,
  Trash2,
  Plus,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const securityScoreBreakdown = [
  { key: 'auth', label: 'احراز هویت', score: 85, color: '#10b981' },
  { key: 'perm', label: 'مجوزها', score: 72, color: '#14b8a6' },
  { key: 'enc', label: 'رمزگذاری', score: 90, color: '#06b6d4' },
  { key: 'audit', label: 'حسابرسی', score: 68, color: '#f59e0b' },
  { key: 'net', label: 'شبکه', score: 78, color: '#8b5cf6' },
];

const overallScore = 79;

const activeSessions = [
  { id: 's1', device: 'Chrome - Windows', ip: '192.168.1.45', location: 'تهران، ایران', lastActive: '۲ دقیقه پیش', icon: Monitor },
  { id: 's2', device: 'Safari - macOS', ip: '10.0.0.12', location: 'اصفهان، ایران', lastActive: '۱۵ دقیقه پیش', icon: Monitor },
  { id: 's3', device: 'Mobile App - iOS', ip: '172.16.0.8', location: 'شیراز، ایران', lastActive: '۱ ساعت پیش', icon: Smartphone },
  { id: 's4', device: 'Firefox - Linux', ip: '192.168.2.100', location: 'مشهد، ایران', lastActive: '۳ ساعت پیش', icon: Monitor },
  { id: 's5', device: 'Edge - Windows', ip: '10.0.1.55', location: 'تبریز، ایران', lastActive: '۱ روز پیش', icon: Monitor },
];

const loginHistory = [
  { id: 'l1', time: '۱۴۰۳/۰۳/۱۵ - ۱۴:۳۲', ip: '192.168.1.45', device: 'Chrome - Windows', status: 'success' as const },
  { id: 'l2', time: '۱۴۰۳/۰۳/۱۵ - ۱۳:۱۸', ip: '10.0.0.12', device: 'Safari - macOS', status: 'success' as const },
  { id: 'l3', time: '۱۴۰۳/۰۳/۱۵ - ۱۲:۰۵', ip: '203.45.67.89', device: 'ناشناس', status: 'failed' as const },
  { id: 'l4', time: '۱۴۰۳/۰۳/۱۴ - ۲۲:۴۵', ip: '172.16.0.8', device: 'Mobile App - iOS', status: 'success' as const },
  { id: 'l5', time: '۱۴۰۳/۰۳/۱۴ - ۲۰:۱۱', ip: '45.67.89.12', device: 'ناشناس', status: 'failed' as const },
  { id: 'l6', time: '۱۴۰۳/۰۳/۱۴ - ۱۸:۳۰', ip: '192.168.2.100', device: 'Firefox - Linux', status: 'success' as const },
  { id: 'l7', time: '۱۴۰۳/۰۳/۱۴ - ۱۵:۲۲', ip: '192.168.1.45', device: 'Chrome - Windows', status: 'success' as const },
  { id: 'l8', time: '۱۴۰۳/۰۳/۱۴ - ۱۰:۰۵', ip: '99.88.77.66', device: 'ناشناس', status: 'failed' as const },
  { id: 'l9', time: '۱۴۰۳/۰۳/۱۳ - ۲۳:۴۵', ip: '10.0.1.55', device: 'Edge - Windows', status: 'success' as const },
  { id: 'l10', time: '۱۴۰۳/۰۳/۱۳ - ۲۱:۱۸', ip: '192.168.1.45', device: 'Chrome - Windows', status: 'success' as const },
];

const failedLoginsData = [
  { day: 'شنبه', attempts: 3 },
  { day: 'یکشنبه', attempts: 1 },
  { day: 'دوشنبه', attempts: 5 },
  { day: 'سه‌شنبه', attempts: 2 },
  { day: 'چهارشنبه', attempts: 8 },
  { day: 'پنجشنبه', attempts: 4 },
  { day: 'جمعه', attempts: 6 },
];

const mockAuditLogs: (AuditLog & { severity: string })[] = [
  { id: 'a1', userId: 'u1', userName: 'علی محمدی', action: 'ورود به سیستم', resource: 'احراز هویت', details: 'ورود موفق از Chrome', ip: '192.168.1.45', timestamp: '۱۴۰۳/۰۳/۱۵ ۱۴:۳۲', severity: 'info' },
  { id: 'a2', userId: 'u2', userName: 'مریم احمدی', action: 'تغییر رمز عبور', resource: 'کاربران', details: 'تغییر رمز عبور موفق', ip: '10.0.0.12', timestamp: '۱۴۰۳/۰۳/۱۵ ۱۳:۱۸', severity: 'warning' },
  { id: 'a3', userId: 'u3', userName: 'رضا کریمی', action: 'دسترسی غیرمجاز', resource: 'پنل مدیریت', details: 'تلاش برای دسترسی به تنظیمات حساس', ip: '203.45.67.89', timestamp: '۱۴۰۳/۰۳/۱۵ ۱۲:۰۵', severity: 'error' },
  { id: 'a4', userId: 'u1', userName: 'علی محمدی', action: 'ایجاد گزارش', resource: 'گزارش‌ها', details: 'گزارش مالی فصلی', ip: '192.168.1.45', timestamp: '۱۴۰۳/۰۳/۱۵ ۱۱:۴۵', severity: 'info' },
  { id: 'a5', userId: 'u4', userName: 'سارا حسینی', action: 'حذف داده', resource: 'CRM', details: 'حذف ۳ رکورد مشتری', ip: '172.16.0.8', timestamp: '۱۴۰۳/۰۳/۱۵ ۱۰:۳۰', severity: 'critical' },
  { id: 'a6', userId: 'u2', userName: 'مریم احمدی', action: 'خروج داده', resource: 'استراتژی', details: 'دانلود گزارش استراتژی', ip: '10.0.0.12', timestamp: '۱۴۰۳/۰۳/۱۴ ۲۲:۴۵', severity: 'warning' },
  { id: 'a7', userId: 'u5', userName: 'حسین نوری', action: 'ورود به سیستم', resource: 'احراز هویت', details: 'ورود موفق از موبایل', ip: '192.168.2.100', timestamp: '۱۴۰۳/۰۳/۱۴ ۲۰:۱۱', severity: 'info' },
  { id: 'a8', userId: 'u3', userName: 'رضا کریمی', action: 'تغییر مجوز', resource: 'مجوزها', details: 'ارتقای نقش به مدیر شعبه', ip: '203.45.67.89', timestamp: '۱۴۰۳/۰۳/۱۴ ۱۸:۳۰', severity: 'warning' },
  { id: 'a9', userId: 'u6', userName: 'فاطمه زارعی', action: 'تلاش ورود ناموفق', resource: 'احراز هویت', details: 'رمز عبور اشتباه ۳ بار', ip: '45.67.89.12', timestamp: '۱۴۰۳/۰۳/۱۴ ۱۵:۲۲', severity: 'error' },
  { id: 'a10', userId: 'u1', userName: 'علی محمدی', action: 'به‌روزرسانی تنظیمات', resource: 'پنل مدیریت', details: 'تغییر سیاست رمز عبور', ip: '192.168.1.45', timestamp: '۱۴۰۳/۰۳/۱۴ ۱۳:۰۵', severity: 'info' },
  { id: 'a11', userId: 'u7', userName: 'امیر صادقی', action: 'ایجاد کلید API', resource: 'مجوزها', details: 'کلید جدید برای یکپارچه‌سازی', ip: '10.0.1.55', timestamp: '۱۴۰۳/۰۳/۱۴ ۱۰:۱۸', severity: 'warning' },
  { id: 'a12', userId: 'u4', userName: 'سارا حسینی', action: 'مشاهده داده حساس', resource: 'مالی', details: 'دسترسی به گزارش بودجه', ip: '172.16.0.8', timestamp: '۱۴۰۳/۰۳/۱۴ ۰۹:۴۵', severity: 'info' },
  { id: 'a13', userId: 'u8', userName: 'نگار رحیمی', action: 'دسترسی غیرمجاز', resource: 'CRM', details: 'تلاش دسترسی به داده‌های شعبه دیگر', ip: '99.88.77.66', timestamp: '۱۴۰۳/۰۳/۱۳ ۲۳:۴۵', severity: 'critical' },
  { id: 'a14', userId: 'u2', userName: 'مریم احمدی', action: 'ویرایش پروفایل', resource: 'کاربران', details: 'به‌روزرسانی اطلاعات تماس', ip: '10.0.0.12', timestamp: '۱۴۰۳/۰۳/۱۳ ۲۱:۱۸', severity: 'info' },
  { id: 'a15', userId: 'u5', userName: 'حسین نوری', action: 'ایجاد وظیفه', resource: 'استراتژی', details: 'وظیفه جدید در نقشه راه', ip: '192.168.2.100', timestamp: '۱۴۰۳/۰۳/۱۳ ۱۸:۳۰', severity: 'info' },
  { id: 'a16', userId: 'u1', userName: 'علی محمدی', action: 'بازنشانی نشست', resource: 'احراز هویت', details: 'بازنشانی همه نشست‌های فعال', ip: '192.168.1.45', timestamp: '۱۴۰۳/۰۳/۱۳ ۱۵:۲۲', severity: 'warning' },
  { id: 'a17', userId: 'u9', userName: 'زهرا موسوی', action: 'حذف گزارش', resource: 'گزارش‌ها', details: 'حذف گزارش پیش‌نویس', ip: '10.0.2.33', timestamp: '۱۴۰۳/۰۳/۱۳ ۱۳:۰۵', severity: 'warning' },
  { id: 'a18', userId: 'u3', userName: 'رضا کریمی', action: 'ورود از دستگاه جدید', resource: 'احراز هویت', details: 'اولین ورود از iPad', ip: '203.45.67.89', timestamp: '۱۴۰۳/۰۳/۱۳ ۱۰:۴۵', severity: 'info' },
  { id: 'a19', userId: 'u6', userName: 'فاطمه زارعی', action: 'دسترسی غیرمجاز', resource: 'پنل مدیریت', details: 'تلاش تغییر تنظیمات سرور', ip: '45.67.89.12', timestamp: '۱۴۰۳/۰۳/۱۲ ۲۲:۳۰', severity: 'critical' },
  { id: 'a20', userId: 'u7', userName: 'امیر صادقی', action: 'خروج داده انبوه', resource: 'مالی', details: 'دانلود ۱۰۰۰+ رکورد مالی', ip: '10.0.1.55', timestamp: '۱۴۰۳/۰۳/۱۲ ۱۸:۱۵', severity: 'critical' },
];

const roleNames: Record<string, string> = {
  admin: 'مدیر سیستم',
  ceo: 'مدیرعامل',
  consultant: 'مشاور',
  sme: 'SME',
  analyst: 'تحلیلگر',
  branch_manager: 'مدیر شعبه',
  investor: 'سرمایه‌گذار',
};

const resourceNames: Record<string, string> = {
  diagnostic: 'تشخیص',
  strategy: 'استراتژی',
  crm: 'CRM',
  financial: 'مالی',
  ai: 'هوش مصنوعی',
  bpm: 'BPM',
  admin: 'مدیریت',
  reports: 'گزارش‌ها',
};

const accessMatrix: Record<string, Record<string, boolean>> = {
  admin: { diagnostic: true, strategy: true, crm: true, financial: true, ai: true, bpm: true, admin: true, reports: true },
  ceo: { diagnostic: true, strategy: true, crm: true, financial: true, ai: true, bpm: true, admin: false, reports: true },
  consultant: { diagnostic: true, strategy: true, crm: true, financial: false, ai: true, bpm: true, admin: false, reports: true },
  sme: { diagnostic: true, strategy: false, crm: false, financial: false, ai: false, bpm: false, admin: false, reports: false },
  analyst: { diagnostic: true, strategy: true, crm: false, financial: true, ai: true, bpm: false, admin: false, reports: true },
  branch_manager: { diagnostic: true, strategy: false, crm: true, financial: true, ai: false, bpm: true, admin: false, reports: true },
  investor: { diagnostic: false, strategy: true, crm: false, financial: true, ai: false, bpm: false, admin: false, reports: true },
};

const apiKeys = [
  { id: 'k1', name: 'یکپارچه‌سازی CRM', created: '۱۴۰۳/۰۲/۱۵', lastUsed: '۱۴۰۳/۰۳/۱۵', permissions: ['خواندن', 'نوشتن'], status: 'active' },
  { id: 'k2', name: 'ربات گزارش‌دهی', created: '۱۴۰۳/۰۱/۲۰', lastUsed: '۱۴۰۳/۰۳/۱۴', permissions: ['خواندن'], status: 'active' },
  { id: 'k3', name: 'همگام‌سازی مالی', created: '۱۴۰۳/۰۳/۰۱', lastUsed: '۱۴۰۳/۰۳/۱۰', permissions: ['خواندن', 'نوشتن', 'حذف'], status: 'active' },
  { id: 'k4', name: 'وب‌هوک اعلان', created: '۱۴۰۲/۱۲/۱۰', lastUsed: '۱۴۰۳/۰۲/۲۸', permissions: ['خواندن'], status: 'expired' },
];

const gdprItems = [
  { id: 'g1', label: 'رضایت صریح کاربر برای جمع‌آوری داده', enabled: true },
  { id: 'g2', label: 'حق دسترسی به داده‌های شخصی', enabled: true },
  { id: 'g3', label: 'حق حذف داده‌های شخصی', enabled: true },
  { id: 'g4', label: 'قابلیت انتقال داده', enabled: false },
  { id: 'g5', label: 'اعلان نقض داده ظرف ۷۲ ساعت', enabled: true },
  { id: 'g6', label: 'ارزیابی تأثیر حریم خصوصی', enabled: false },
  { id: 'g7', label: 'مسئول حفاظت از داده (DPO)', enabled: true },
  { id: 'g8', label: 'رمزگذاری داده‌ها در حال استراحت و انتقال', enabled: true },
];

// ─── Animation Variants ────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ─── Severity Badge ────────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: string }) {
  const config: Record<string, { label: string; className: string }> = {
    info: { label: 'اطلاعات', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    warning: { label: 'هشدار', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
    error: { label: 'خطا', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
    critical: { label: 'بحرانی', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
  };
  const c = config[severity] || config.info;
  return <Badge className={`${c.className} text-xs font-medium`}>{c.label}</Badge>;
}

// ─── SVG Circular Gauge ────────────────────────────────────────────────────────

function ScoreGauge({ score, size = 180 }: { score: number; size?: number }) {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const gaugeColor =
    score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center" dir="ltr">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted-foreground/15"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={gaugeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-bold"
          style={{ color: gaugeColor }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-muted-foreground">از ۱۰۰</span>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function SecurityCenter() {
  const { auditLogs, setAuditLogs } = useAppStore();

  // Initialize audit logs from mock if empty
  const allAuditLogs = useMemo(() => {
    if (auditLogs.length > 0) return auditLogs;
    setAuditLogs(mockAuditLogs.map(({ severity, ...log }) => log));
    return mockAuditLogs.map(({ severity, ...log }) => log);
  }, [auditLogs, setAuditLogs]);

  // Tab state
  const [activeTab, setActiveTab] = useState('auth');

  // Auth tab state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [minPasswordLength, setMinPasswordLength] = useState('8');
  const [passwordComplexity, setPasswordComplexity] = useState('high');
  const [passwordExpiry, setPasswordExpiry] = useState('90');
  const [revokedSessions, setRevokedSessions] = useState<string[]>([]);

  // Audit tab state
  const [auditFilterAction, setAuditFilterAction] = useState('all');
  const [auditFilterSeverity, setAuditFilterSeverity] = useState('all');
  const [auditFilterUser, setAuditFilterUser] = useState('');
  const [auditSearch, setAuditSearch] = useState('');

  // Access tab state
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>([]);

  // Privacy tab state
  const [gdprState, setGdprState] = useState<Record<string, boolean>>(
    Object.fromEntries(gdprItems.map((g) => [g.id, g.enabled]))
  );
  const [dataRetentionDays, setDataRetentionDays] = useState('365');
  const [allowAnalytics, setAllowAnalytics] = useState(true);
  const [allowMarketing, setAllowMarketing] = useState(false);
  const [allowThirdParty, setAllowThirdParty] = useState(false);

  // ── Filtered audit logs ──────────────────────────────────────────────────

  const filteredAuditLogs = useMemo(() => {
    let result = mockAuditLogs;
    if (auditFilterAction !== 'all') {
      result = result.filter((l) => l.action.includes(auditFilterAction));
    }
    if (auditFilterSeverity !== 'all') {
      result = result.filter((l) => l.severity === auditFilterSeverity);
    }
    if (auditFilterUser.trim()) {
      result = result.filter((l) => l.userName.includes(auditFilterUser.trim()));
    }
    if (auditSearch.trim()) {
      const q = auditSearch.trim();
      result = result.filter(
        (l) =>
          l.action.includes(q) || l.resource.includes(q) || l.details.includes(q) || l.userName.includes(q)
      );
    }
    return result;
  }, [auditFilterAction, auditFilterSeverity, auditFilterUser, auditSearch]);

  // ── GDPR compliance score ────────────────────────────────────────────────

  const gdprScore = useMemo(() => {
    const enabledCount = Object.values(gdprState).filter(Boolean).length;
    return Math.round((enabledCount / gdprItems.length) * 100);
  }, [gdprState]);

  // ── Handle revoke session ────────────────────────────────────────────────

  const handleRevokeSession = (sessionId: string) => {
    setRevokedSessions((prev) => [...prev, sessionId]);
  };

  // ── Handle create API key ────────────────────────────────────────────────

  const handleCreateApiKey = () => {
    if (!newKeyName.trim()) return;
    setShowApiKeyDialog(false);
    setNewKeyName('');
    setNewKeyPermissions([]);
  };

  // ── Handle export ────────────────────────────────────────────────────────

  const handleExportAuditLog = () => {
    const csvContent = [
      ['زمان', 'کاربر', 'عملیات', 'منبع', 'جزئیات', 'IP', 'شدت'].join(','),
      ...filteredAuditLogs.map((l) =>
        [l.timestamp, l.userName, l.action, l.resource, l.details, l.ip, l.severity].join(',')
      ),
    ].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'audit-log.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // ── Handle GDPR toggle ──────────────────────────────────────────────────

  const toggleGdpr = (id: string) => {
    setGdprState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <motion.div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950 p-4 md:p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
            <Shield className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 dark:text-emerald-100">
              مرکز امنیت و حریم خصوصی
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">مدیریت و نظارت بر امنیت پلتفرم BCGSP</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-600 text-white px-3 py-1 text-sm font-semibold">فاز ۳</Badge>
          <Badge
            className={`px-3 py-1 text-sm font-semibold ${
              overallScore >= 80
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                : overallScore >= 60
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}
          >
            {overallScore >= 80 ? (
              <ShieldCheck className="h-4 w-4 ml-1 inline" />
            ) : (
              <ShieldAlert className="h-4 w-4 ml-1 inline" />
            )}
            امتیاز امنیت: {overallScore}
          </Badge>
        </div>
      </motion.div>

      {/* ── Security Score Panel ──────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card className="border-emerald-200 dark:border-emerald-800/50 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <Fingerprint className="h-5 w-5" />
              وضعیت امنیت کلی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Gauge */}
              <div className="flex-shrink-0">
                <ScoreGauge score={overallScore} />
              </div>
              {/* Breakdown */}
              <div className="flex-1 w-full space-y-4">
                {securityScoreBreakdown.map((item) => (
                  <div key={item.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-emerald-900 dark:text-emerald-100">{item.label}</span>
                      <span className="font-bold" style={{ color: item.color }}>
                        {item.score}%
                      </span>
                    </div>
                    <Progress value={item.score} className="h-2.5" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Main Tabs ─────────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto gap-1 bg-emerald-100/50 dark:bg-emerald-900/20 p-1 rounded-xl">
            <TabsTrigger value="auth" className="flex items-center gap-1.5 py-2.5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg text-sm">
              <Lock className="h-4 w-4" />
              احراز هویت
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-1.5 py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg text-sm">
              <FileText className="h-4 w-4" />
              لاگ حسابرسی
            </TabsTrigger>
            <TabsTrigger value="access" className="flex items-center gap-1.5 py-2.5 data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-lg text-sm">
              <Key className="h-4 w-4" />
              دسترسی‌ها و مجوزها
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-1.5 py-2.5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg text-sm">
              <Eye className="h-4 w-4" />
              حریم خصوصی و تطبیق
            </TabsTrigger>
          </TabsList>

          {/* ════════════════════════════════════════════════════════════════════
              TAB 1: احراز هویت (Authentication)
              ════════════════════════════════════════════════════════════════════ */}
          <TabsContent value="auth" className="space-y-6">
            {/* 2FA & Password Policy Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 2FA Setup */}
              <Card className="border-emerald-200 dark:border-emerald-800/40">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                    <Smartphone className="h-5 w-5" />
                    احراز هویت دو مرحله‌ای
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">فعال‌سازی 2FA</p>
                      <p className="text-xs text-muted-foreground">افزایش امنیت با تأیید هویت دو مرحله‌ای</p>
                    </div>
                    <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                  </div>
                  <Separator />
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-40 h-40 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center border-2 border-dashed border-emerald-300 dark:border-emerald-700">
                      <div className="text-center space-y-1">
                        <div className="grid grid-cols-5 gap-0.5 mx-auto w-24">
                          {Array.from({ length: 25 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 rounded-sm ${
                                Math.random() > 0.4
                                  ? 'bg-emerald-600 dark:bg-emerald-400'
                                  : 'bg-white dark:bg-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">کد QR</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      اپلیکیشن احراز هویت خود را روی کد QR بالا اسکن کنید
                    </p>
                  </div>
                  {twoFactorEnabled && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                        احراز هویت دو مرحله‌ای فعال است
                      </span>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Password Policy */}
              <Card className="border-emerald-200 dark:border-emerald-800/40">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                    <Lock className="h-5 w-5" />
                    سیاست رمز عبور
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm">حداقل طول رمز عبور</Label>
                    <Select value={minPasswordLength} onValueChange={setMinPasswordLength}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">۶ کاراکتر</SelectItem>
                        <SelectItem value="8">۸ کاراکتر</SelectItem>
                        <SelectItem value="10">۱۰ کاراکتر</SelectItem>
                        <SelectItem value="12">۱۲ کاراکتر</SelectItem>
                        <SelectItem value="16">۱۶ کاراکتر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">پیچیدگی رمز عبور</Label>
                    <Select value={passwordComplexity} onValueChange={setPasswordComplexity}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">پایین - فقط حروف</SelectItem>
                        <SelectItem value="medium">متوسط - حروف و اعداد</SelectItem>
                        <SelectItem value="high">بالا - حروف، اعداد و نمادها</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">انقضای رمز عبور (روز)</Label>
                    <Select value={passwordExpiry} onValueChange={setPasswordExpiry}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">۳۰ روز</SelectItem>
                        <SelectItem value="60">۶۰ روز</SelectItem>
                        <SelectItem value="90">۹۰ روز</SelectItem>
                        <SelectItem value="180">۱۸۰ روز</SelectItem>
                        <SelectItem value="never">هرگز</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs text-emerald-700 dark:text-emerald-300">
                      سیاست فعلی: حداقل {minPasswordLength} کاراکتر، پیچیدگی{' '}
                      {passwordComplexity === 'high' ? 'بالا' : passwordComplexity === 'medium' ? 'متوسط' : 'پایین'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Session Management */}
            <Card className="border-emerald-200 dark:border-emerald-800/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                  <Globe className="h-5 w-5" />
                  مدیریت نشست‌های فعال
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-72">
                  <div className="space-y-3">
                    {activeSessions.map((session) => {
                      const isRevoked = revokedSessions.includes(session.id);
                      const Icon = session.icon;
                      return (
                        <motion.div
                          key={session.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: isRevoked ? 0.4 : 1, x: 0 }}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            isRevoked
                              ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30'
                              : 'bg-white dark:bg-gray-800 border-emerald-100 dark:border-emerald-800/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                isRevoked
                                  ? 'bg-red-100 dark:bg-red-900/20'
                                  : 'bg-emerald-100 dark:bg-emerald-900/20'
                              }`}
                            >
                              <Icon
                                className={`h-4 w-4 ${
                                  isRevoked ? 'text-red-600' : 'text-emerald-600'
                                }`}
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{session.device}</p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                <span className="flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  {session.ip}
                                </span>
                                <span>{session.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">{session.lastActive}</span>
                            {isRevoked ? (
                              <Badge className="bg-red-100 text-red-700 text-xs">ابطال شده</Badge>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs"
                                onClick={() => handleRevokeSession(session.id)}
                              >
                                <Trash2 className="h-3 w-3 ml-1" />
                                ابطال
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Login History & Failed Attempts Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Login History */}
              <Card className="border-emerald-200 dark:border-emerald-800/40">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                    <Clock className="h-5 w-5" />
                    تاریخچه ورود
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-64">
                    <div className="space-y-2">
                      {loginHistory.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                        >
                          <div className="flex items-center gap-2.5">
                            {entry.status === 'success' ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <div>
                              <p className="text-xs font-medium">{entry.device}</p>
                              <p className="text-[10px] text-muted-foreground">{entry.ip}</p>
                            </div>
                          </div>
                          <div className="text-left">
                            <Badge
                              className={`text-[10px] px-1.5 py-0 ${
                                entry.status === 'success'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                              }`}
                            >
                              {entry.status === 'success' ? 'موفق' : 'ناموفق'}
                            </Badge>
                            <p className="text-[10px] text-muted-foreground mt-1">{entry.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Failed Attempts Chart */}
              <Card className="border-emerald-200 dark:border-emerald-800/40">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-red-700 dark:text-red-300">
                    <AlertTriangle className="h-5 w-5" />
                    تلاش‌های ورود ناموفق (۷ روز اخیر)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={failedLoginsData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                        />
                        <Bar dataKey="attempts" fill="#ef4444" radius={[4, 4, 0, 0]} name="تلاش ناموفق" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ════════════════════════════════════════════════════════════════════
              TAB 2: لاگ حسابرسی (Audit Log)
              ════════════════════════════════════════════════════════════════════ */}
          <TabsContent value="audit" className="space-y-4">
            {/* Filter Panel */}
            <Card className="border-teal-200 dark:border-teal-800/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-teal-800 dark:text-teal-200">
                  <Filter className="h-5 w-5" />
                  فیلتر لاگ حسابرسی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">جستجو</Label>
                    <div className="relative">
                      <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="جستجو..."
                        value={auditSearch}
                        onChange={(e) => setAuditSearch(e.target.value)}
                        className="pr-8 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">نوع عملیات</Label>
                    <Select value={auditFilterAction} onValueChange={setAuditFilterAction}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">همه</SelectItem>
                        <SelectItem value="ورود">ورود</SelectItem>
                        <SelectItem value="تغییر">تغییر</SelectItem>
                        <SelectItem value="حذف">حذف</SelectItem>
                        <SelectItem value="ایجاد">ایجاد</SelectItem>
                        <SelectItem value="دسترسی">دسترسی</SelectItem>
                        <SelectItem value="خروج">خروج</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">شدت</Label>
                    <Select value={auditFilterSeverity} onValueChange={setAuditFilterSeverity}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">همه</SelectItem>
                        <SelectItem value="info">اطلاعات</SelectItem>
                        <SelectItem value="warning">هشدار</SelectItem>
                        <SelectItem value="error">خطا</SelectItem>
                        <SelectItem value="critical">بحرانی</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">کاربر</Label>
                    <Input
                      placeholder="نام کاربر..."
                      value={auditFilterUser}
                      onChange={(e) => setAuditFilterUser(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      className="w-full text-teal-700 border-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                      onClick={handleExportAuditLog}
                    >
                      <Download className="h-4 w-4 ml-1.5" />
                      خروجی CSV
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audit Log Table */}
            <Card className="border-teal-200 dark:border-teal-800/40">
              <CardContent className="p-0">
                <ScrollArea className="max-h-[520px]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-teal-50 dark:bg-teal-900/20 sticky top-0">
                        <tr>
                          <th className="text-right p-3 font-medium text-teal-800 dark:text-teal-200">زمان</th>
                          <th className="text-right p-3 font-medium text-teal-800 dark:text-teal-200">کاربر</th>
                          <th className="text-right p-3 font-medium text-teal-800 dark:text-teal-200">عملیات</th>
                          <th className="text-right p-3 font-medium text-teal-800 dark:text-teal-200">منبع</th>
                          <th className="text-right p-3 font-medium text-teal-800 dark:text-teal-200">جزئیات</th>
                          <th className="text-right p-3 font-medium text-teal-800 dark:text-teal-200">IP</th>
                          <th className="text-right p-3 font-medium text-teal-800 dark:text-teal-200">شدت</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAuditLogs.map((log, idx) => (
                          <motion.tr
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-colors"
                          >
                            <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{log.timestamp}</td>
                            <td className="p-3 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="font-medium text-xs">{log.userName}</span>
                              </div>
                            </td>
                            <td className="p-3 text-xs">{log.action}</td>
                            <td className="p-3 text-xs">{log.resource}</td>
                            <td className="p-3 text-xs text-muted-foreground max-w-[200px] truncate">{log.details}</td>
                            <td className="p-3 text-xs font-mono text-muted-foreground whitespace-nowrap">{log.ip}</td>
                            <td className="p-3">
                              <SeverityBadge severity={log.severity} />
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
                {filteredAuditLogs.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">موردی یافت نشد</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ════════════════════════════════════════════════════════════════════
              TAB 3: دسترسی‌ها و مجوزها (Access & Permissions)
              ════════════════════════════════════════════════════════════════════ */}
          <TabsContent value="access" className="space-y-6">
            {/* Access Matrix */}
            <Card className="border-cyan-200 dark:border-cyan-800/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-cyan-800 dark:text-cyan-200">
                  <Shield className="h-5 w-5" />
                  ماتریس کنترل دسترسی مبتنی بر نقش (RBAC)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[400px]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-cyan-50 dark:bg-cyan-900/20">
                          <th className="text-right p-3 font-medium text-cyan-800 dark:text-cyan-200 sticky right-0 bg-cyan-50 dark:bg-cyan-900/20 z-10 min-w-[120px]">
                            نقش / منبع
                          </th>
                          {Object.entries(resourceNames).map(([key, name]) => (
                            <th key={key} className="p-3 font-medium text-cyan-800 dark:text-cyan-200 text-center min-w-[80px]">
                              {name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(accessMatrix).map(([role, resources], idx) => (
                          <motion.tr
                            key={role}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-cyan-50/30 dark:hover:bg-cyan-900/10"
                          >
                            <td className="p-3 font-medium bg-white dark:bg-gray-900 sticky right-0 z-10">
                              <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 text-xs">
                                {roleNames[role]}
                              </Badge>
                            </td>
                            {Object.entries(resourceNames).map(([resKey]) => (
                              <td key={resKey} className="p-3 text-center">
                                {resources[resKey] ? (
                                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-gray-300 dark:text-gray-600 mx-auto" />
                                )}
                              </td>
                            ))}
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* API Keys */}
            <Card className="border-cyan-200 dark:border-cyan-800/40">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2 text-cyan-800 dark:text-cyan-200">
                    <Key className="h-5 w-5" />
                    مدیریت کلیدهای API
                  </CardTitle>
                  <Button
                    size="sm"
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    onClick={() => setShowApiKeyDialog(true)}
                  >
                    <Plus className="h-4 w-4 ml-1" />
                    کلید جدید
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-72">
                  <div className="space-y-3">
                    {apiKeys.map((apiKey) => (
                      <div
                        key={apiKey.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 gap-3"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-cyan-600" />
                            <p className="font-medium text-sm">{apiKey.name}</p>
                            <Badge
                              className={`text-[10px] px-1.5 py-0 ${
                                apiKey.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                              }`}
                            >
                              {apiKey.status === 'active' ? 'فعال' : 'منقضی'}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span>ایجاد: {apiKey.created}</span>
                            <span>آخرین استفاده: {apiKey.lastUsed}</span>
                            <span>مجوزها: {apiKey.permissions.join('، ')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="text-xs h-8">
                            <RefreshCw className="h-3 w-3 ml-1" />
                            بازتولید
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs h-8"
                          >
                            <Trash2 className="h-3 w-3 ml-1" />
                            ابطال
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Create API Key Dialog */}
            <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
              <DialogContent className="max-w-md" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                    <Plus className="h-5 w-5" />
                    ایجاد کلید API جدید
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label>نام کلید</Label>
                    <Input
                      placeholder="مثلاً: یکپارچه‌سازی CRM"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>مجوزها</Label>
                    <div className="space-y-2">
                      {['خواندن', 'نوشتن', 'حذف', 'مدیریت'].map((perm) => (
                        <div key={perm} className="flex items-center gap-2">
                          <Checkbox
                            id={`perm-${perm}`}
                            checked={newKeyPermissions.includes(perm)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewKeyPermissions((prev) => [...prev, perm]);
                              } else {
                                setNewKeyPermissions((prev) => prev.filter((p) => p !== perm));
                              }
                            }}
                          />
                          <Label htmlFor={`perm-${perm}`} className="text-sm font-normal cursor-pointer">
                            {perm}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
                      onClick={handleCreateApiKey}
                    >
                      ایجاد کلید
                    </Button>
                    <Button variant="outline" onClick={() => setShowApiKeyDialog(false)} className="flex-1">
                      انصراف
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* ════════════════════════════════════════════════════════════════════
              TAB 4: حریم خصوصی و تطبیق (Privacy & Compliance)
              ════════════════════════════════════════════════════════════════════ */}
          <TabsContent value="privacy" className="space-y-6">
            {/* Compliance Score */}
            <Card className="border-emerald-200 dark:border-emerald-800/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                  <ShieldCheck className="h-5 w-5" />
                  امتیاز تطبیق و انطباق
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <ScoreGauge score={gdprScore} size={120} />
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium">وضعیت انطباق با مقررات GDPR</p>
                    <Progress value={gdprScore} className="h-3" />
                    <p className="text-xs text-muted-foreground">
                      {gdprScore >= 80
                        ? 'وضعیت انطباق خوب است. موارد باقی‌مانده را تکمیل کنید.'
                        : gdprScore >= 50
                        ? 'انطباق متوسط. لطفاً موارد ناقص را فعال کنید.'
                        : 'انطباق ضعیف. نیاز به اقدام فوری دارید.'}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">موارد فعال:</span>
                      <span className="font-bold text-emerald-600">
                        {Object.values(gdprState).filter(Boolean).length} از {gdprItems.length}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Data Retention */}
              <Card className="border-emerald-200 dark:border-emerald-800/40">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                    <Clock className="h-5 w-5" />
                    سیاست نگهداری داده
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm">مدت نگهداری داده‌ها</Label>
                    <Select value={dataRetentionDays} onValueChange={setDataRetentionDays}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="90">۹۰ روز</SelectItem>
                        <SelectItem value="180">۱۸۰ روز</SelectItem>
                        <SelectItem value="365">۱ سال</SelectItem>
                        <SelectItem value="730">۲ سال</SelectItem>
                        <SelectItem value="1825">۵ سال</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800/30">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-amber-800 dark:text-amber-200">توجه</p>
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                          داده‌هایی که فراتر از مدت مشخص شده باشند، به‌طور خودکار حذف خواهند شد. این تنظیمات قابل
                          بازگشت نیست.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label className="text-sm">درخواست خروج داده</Label>
                    <p className="text-xs text-muted-foreground">
                      بر اساس مقررات GDPR، کاربران حق دارند نسخه‌ای از تمام داده‌های شخصی خود را دریافت کنند.
                    </p>
                    <Button variant="outline" className="w-full text-emerald-700 border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                      <Download className="h-4 w-4 ml-1.5" />
                      درخواست خروج داده شخصی
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card className="border-emerald-200 dark:border-emerald-800/40">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                    <Eye className="h-5 w-5" />
                    تنظیمات حریم خصوصی
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <div>
                      <p className="text-sm font-medium">تحلیل‌های استفاده</p>
                      <p className="text-xs text-muted-foreground">جمع‌آوری داده‌های ناشناس برای بهبود پلتفرم</p>
                    </div>
                    <Switch checked={allowAnalytics} onCheckedChange={setAllowAnalytics} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <div>
                      <p className="text-sm font-medium">اعلان‌های بازاریابی</p>
                      <p className="text-xs text-muted-foreground">دریافت پیشنهادات و به‌روزرسانی‌ها</p>
                    </div>
                    <Switch checked={allowMarketing} onCheckedChange={setAllowMarketing} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <div>
                      <p className="text-sm font-medium">اشتراک‌گذاری با شخص ثالث</p>
                      <p className="text-xs text-muted-foreground">اجازه اشتراک داده با شرکای تجاری</p>
                    </div>
                    <Switch checked={allowThirdParty} onCheckedChange={setAllowThirdParty} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30">
                    <div>
                      <p className="text-sm font-medium text-red-700 dark:text-red-300">حذف حساب کاربری</p>
                      <p className="text-xs text-red-600 dark:text-red-400">حذف دائمی حساب و تمام داده‌ها</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-100 dark:hover:bg-red-900/20 text-xs">
                      <Trash2 className="h-3 w-3 ml-1" />
                      حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* GDPR Checklist */}
            <Card className="border-emerald-200 dark:border-emerald-800/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                  <ShieldCheck className="h-5 w-5" />
                  چک‌لیست انطباق GDPR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {gdprItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        gdprState[item.id]
                          ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <Checkbox
                        id={item.id}
                        checked={gdprState[item.id]}
                        onCheckedChange={() => toggleGdpr(item.id)}
                      />
                      <Label htmlFor={item.id} className="flex-1 text-sm cursor-pointer">
                        {item.label}
                      </Label>
                      {gdprState[item.id] ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
