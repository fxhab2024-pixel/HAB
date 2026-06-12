'use client';

import { useState, useMemo } from 'react';
import { useAppStore, type Integration } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plug,
  RefreshCw,
  Settings,
  Search,
  Plus,
  Link2,
  Unlink,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  Zap,
  ExternalLink,
  Filter,
  ArrowRight,
  Activity,
  Globe,
  MessageSquare,
  BarChart3,
  Wallet,
  HardDrive,
  CreditCard,
  Users,
  FolderKanban,
  Mail,
  Cloud,
  Phone,
  GitBranch,
  Bot,
  ChevronDown,
  Play,
} from 'lucide-react';

// Additional icon imports
const Shield = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
  </svg>
);

// ─── Data Types ───────────────────────────────────────────────────────────────

interface ConnectedIntegration extends Integration {
  syncFrequency: string;
  description: string;
  color: string;
  recordsSynced: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface AvailableIntegration {
  id: string;
  name: string;
  category: string;
  description: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  popularity: number;
}

interface SyncLogEntry {
  id: string;
  integrationName: string;
  timestamp: string;
  recordsSynced: number;
  errors: number;
  status: 'success' | 'partial' | 'failed';
  duration: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const connectedIntegrations: ConnectedIntegration[] = [
  {
    id: 'int-1',
    name: 'Slack',
    type: 'communication',
    status: 'connected',
    lastSync: '۱۴۰۳/۱۲/۱۲ - ۱۴:۳۰',
    syncFrequency: 'هر ۱۵ دقیقه',
    description: 'اعلان‌ها و پیام‌های تیمی',
    color: '#E01E5A',
    recordsSynced: 1250,
    config: {},
    icon: MessageSquare,
  },
  {
    id: 'int-2',
    name: 'Google Analytics',
    type: 'analytics',
    status: 'connected',
    lastSync: '۱۴۰۳/۱۲/۱۲ - ۱۴:۰۰',
    syncFrequency: 'ساعتی',
    description: 'داده‌های ترافیک و رفتار کاربران',
    color: '#F9AB00',
    recordsSynced: 3420,
    config: {},
    icon: BarChart3,
  },
  {
    id: 'int-3',
    name: 'QuickBooks',
    type: 'accounting',
    status: 'connected',
    lastSync: '۱۴۰۳/۱۲/۱۲ - ۱۳:۴۵',
    syncFrequency: 'روزانه',
    description: 'داده‌های مالی و حسابداری',
    color: '#2CA01C',
    recordsSynced: 890,
    config: {},
    icon: Wallet,
  },
  {
    id: 'int-4',
    name: 'Salesforce',
    type: 'crm',
    status: 'error',
    lastSync: '۱۴۰۳/۱۲/۱۱ - ۰۹:۱۵',
    syncFrequency: 'هر ۳۰ دقیقه',
    description: 'داده‌های مشتریان و فرصت‌ها',
    color: '#00A1E0',
    recordsSynced: 2100,
    config: {},
    icon: Users,
  },
  {
    id: 'int-5',
    name: 'Dropbox',
    type: 'storage',
    status: 'connected',
    lastSync: '۱۴۰۳/۱۲/۱۲ - ۱۴:۲۰',
    syncFrequency: 'هر ۶ ساعت',
    description: 'فایل‌ها و اسناد سازمانی',
    color: '#0061FF',
    recordsSynced: 560,
    config: {},
    icon: HardDrive,
  },
  {
    id: 'int-6',
    name: 'Stripe',
    type: 'payment',
    status: 'connected',
    lastSync: '۱۴۰۳/۱۲/۱۲ - ۱۴:۱۰',
    syncFrequency: 'هر ۵ دقیقه',
    description: 'پرداخت‌ها و تراکنش‌ها',
    color: '#635BFF',
    recordsSynced: 4780,
    config: {},
    icon: CreditCard,
  },
];

const availableIntegrations: AvailableIntegration[] = [
  { id: 'avail-1', name: 'Microsoft Teams', category: 'ارتباطات', description: 'چت سازمانی، ویدیو کنفرانس و همکاری تیمی', color: '#6264A7', icon: MessageSquare, popularity: 95 },
  { id: 'avail-2', name: 'HubSpot', category: 'CRM', description: 'مدیریت ارتباط با مشتری و بازاریابی ورودی', color: '#FF7A59', icon: Users, popularity: 92 },
  { id: 'avail-3', name: 'Mailchimp', category: 'ارتباطات', description: 'بازاریابی ایمیلی و کمپین‌های خودکار', color: '#FFE01B', icon: Mail, popularity: 88 },
  { id: 'avail-4', name: 'Zapier', category: 'اتوماسیون', description: 'اتوماسیون گردش کار بین اپلیکیشن‌ها', color: '#FF4A00', icon: Zap, popularity: 97 },
  { id: 'avail-5', name: 'Xero', category: 'حسابداری', description: 'حسابداری ابری و مدیریت مالی', color: '#13B5EA', icon: Wallet, popularity: 85 },
  { id: 'avail-6', name: 'Jira', category: 'مدیریت پروژه', description: 'ردیابی مسئله و مدیریت پروژه نرم‌افزاری', color: '#0052CC', icon: FolderKanban, popularity: 90 },
  { id: 'avail-7', name: 'Trello', category: 'مدیریت پروژه', description: 'مدیریت پروژه بصری با بوردهای کانبان', color: '#0079BF', icon: FolderKanban, popularity: 87 },
  { id: 'avail-8', name: 'AWS S3', category: 'ذخیره‌سازی', description: 'ذخیره‌سازی ابری شیء‌گرای مقیاس‌پذیر', color: '#FF9900', icon: Cloud, popularity: 93 },
  { id: 'avail-9', name: 'Twilio', category: 'ارتباطات', description: 'API پیامک، تماس صوتی و ویدیویی', color: '#F22F46', icon: Phone, popularity: 82 },
  { id: 'avail-10', name: 'Pipedrive', category: 'CRM', description: 'CRM فروش و مدیریت خط لوله', color: '#204660', icon: Users, popularity: 80 },
  { id: 'avail-11', name: 'Zendesk', category: 'ارتباطات', description: 'پشتیبانی مشتری و مدیریت تیکت', color: '#03363D', icon: Bot, popularity: 86 },
  { id: 'avail-12', name: 'GitHub', category: 'مدیریت پروژه', description: 'میزبان کد و همکاری توسعه‌دهندگان', color: '#24292E', icon: GitBranch, popularity: 94 },
];

const syncHistoryLog: SyncLogEntry[] = [
  { id: 'sync-1', integrationName: 'Slack', timestamp: '۱۴۰۳/۱۲/۱۲ - ۱۴:۳۰', recordsSynced: 45, errors: 0, status: 'success', duration: '۲ ثانیه' },
  { id: 'sync-2', integrationName: 'Google Analytics', timestamp: '۱۴۰۳/۱۲/۱۲ - ۱۴:۰۰', recordsSynced: 120, errors: 0, status: 'success', duration: '۵ ثانیه' },
  { id: 'sync-3', integrationName: 'QuickBooks', timestamp: '۱۴۰۳/۱۲/۱۲ - ۱۳:۴۵', recordsSynced: 34, errors: 0, status: 'success', duration: '۳ ثانیه' },
  { id: 'sync-4', integrationName: 'Salesforce', timestamp: '۱۴۰۳/۱۲/۱۲ - ۱۳:۰۰', recordsSynced: 0, errors: 12, status: 'failed', duration: '۱۵ ثانیه' },
  { id: 'sync-5', integrationName: 'Dropbox', timestamp: '۱۴۰۳/۱۲/۱۲ - ۱۲:۲۰', recordsSynced: 18, errors: 2, status: 'partial', duration: '۸ ثانیه' },
  { id: 'sync-6', integrationName: 'Stripe', timestamp: '۱۴۰۳/۱۲/۱۲ - ۱۲:۱۰', recordsSynced: 89, errors: 0, status: 'success', duration: '۱ ثانیه' },
  { id: 'sync-7', integrationName: 'Slack', timestamp: '۱۴۰۳/۱۲/۱۲ - ۱۱:۳۰', recordsSynced: 38, errors: 0, status: 'success', duration: '۲ ثانیه' },
  { id: 'sync-8', integrationName: 'Google Analytics', timestamp: '۱۴۰۳/۱۲/۱۲ - ۱۱:۰۰', recordsSynced: 95, errors: 1, status: 'partial', duration: '۴ ثانیه' },
  { id: 'sync-9', integrationName: 'QuickBooks', timestamp: '۱۴۰۳/۱۲/۱۱ - ۰۹:۴۵', recordsSynced: 28, errors: 0, status: 'success', duration: '۳ ثانیه' },
  { id: 'sync-10', integrationName: 'Stripe', timestamp: '۱۴۰۳/۱۲/۱۱ - ۰۹:۱۰', recordsSynced: 76, errors: 0, status: 'success', duration: '۱ ثانیه' },
];

// ─── Category Filters ─────────────────────────────────────────────────────────

const categoryFilters = [
  { key: 'all', label: 'همه' },
  { key: 'CRM', label: 'CRM' },
  { key: 'حسابداری', label: 'حسابداری' },
  { key: 'ارتباطات', label: 'ارتباطات' },
  { key: 'تحلیل', label: 'تحلیل' },
  { key: 'ذخیره‌سازی', label: 'ذخیره‌سازی' },
  { key: 'پرداخت', label: 'پرداخت' },
  { key: 'مدیریت پروژه', label: 'مدیریت پروژه' },
];

// ─── Type Badge Map ───────────────────────────────────────────────────────────

const typeBadgeMap: Record<string, { label: string; className: string }> = {
  communication: { label: 'ارتباطات', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  analytics: { label: 'تحلیل', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  accounting: { label: 'حسابداری', className: 'bg-green-100 text-green-700 border-green-200' },
  crm: { label: 'CRM', className: 'bg-purple-100 text-purple-700 border-purple-200' },
  storage: { label: 'ذخیره‌سازی', className: 'bg-sky-100 text-sky-700 border-sky-200' },
  payment: { label: 'پرداخت', className: 'bg-rose-100 text-rose-700 border-rose-200' },
};

// ─── Animation Variants ───────────────────────────────────────────────────────

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
  scale: 1.02,
  transition: { duration: 0.2 },
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function IntegrationHub() {
  const { integrations, setIntegrations, updateIntegration } = useAppStore();
  const [activeTab, setActiveTab] = useState('connected');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedAvailableService, setSelectedAvailableService] = useState<AvailableIntegration | null>(null);
  const [connectStep, setConnectStep] = useState(1);
  const [syncFrequency, setSyncFrequency] = useState('hourly');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'failed'>('idle');
  const [manualSyncing, setManualSyncing] = useState(false);

  // Sync settings state
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [conflictResolution, setConflictResolution] = useState('newer_wins');
  const [syncOnStartup, setSyncOnStartup] = useState(true);
  const [notifyOnSync, setNotifyOnSync] = useState(false);
  const [notifyOnError, setNotifyOnError] = useState(true);

  // Computed stats
  const stats = useMemo(() => {
    const connected = connectedIntegrations.filter((i) => i.status === 'connected').length;
    const available = availableIntegrations.length;
    const syncsToday = syncHistoryLog.filter((s) => s.status === 'success').length;
    const recentErrors = syncHistoryLog.filter((s) => s.errors > 0).length;
    return { connected, available, syncsToday, recentErrors };
  }, []);

  // Filter marketplace
  const filteredMarketplace = useMemo(() => {
    let result = availableIntegrations;
    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.includes(q) ||
          item.category.includes(q)
      );
    }
    return result;
  }, [selectedCategory, searchQuery]);

  // Handlers
  const handleSync = (id: string) => {
    updateIntegration(id, { lastSync: 'در حال همگام‌سازی...' });
    setTimeout(() => {
      updateIntegration(id, { lastSync: '۱۴۰۳/۱۲/۱۲ - ۱۴:۴۵' });
    }, 2000);
  };

  const handleDisconnect = (id: string) => {
    updateIntegration(id, { status: 'disconnected' });
  };

  const handleConnectService = (service: AvailableIntegration) => {
    setSelectedAvailableService(service);
    setConnectStep(1);
    setTestResult('idle');
    setConnectDialogOpen(true);
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult(Math.random() > 0.2 ? 'success' : 'failed');
    }, 2500);
  };

  const handleManualSync = () => {
    setManualSyncing(true);
    setTimeout(() => {
      setManualSyncing(false);
    }, 3000);
  };

  const handleFinishConnect = () => {
    setConnectDialogOpen(false);
    setConnectStep(1);
    setTestResult('idle');
  };

  // ─── Render: Stats Row ──────────────────────────────────────────────────────

  const renderStatsRow = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <motion.div variants={itemVariants} whileHover={cardHover}>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-600 font-medium">سرویس‌های متصل</p>
                <p className="text-2xl font-bold text-emerald-700 mt-1">{stats.connected}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Link2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} whileHover={cardHover}>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-sky-50 to-cyan-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-sky-600 font-medium">سرویس‌های در دسترس</p>
                <p className="text-2xl font-bold text-sky-700 mt-1">{stats.available}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-sky-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} whileHover={cardHover}>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-600 font-medium">همگام‌سازی‌ها امروز</p>
                <p className="text-2xl font-bold text-amber-700 mt-1">{stats.syncsToday}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} whileHover={cardHover}>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-rose-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-600 font-medium">خطاهای اخیر</p>
                <p className="text-2xl font-bold text-red-700 mt-1">{stats.recentErrors}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  // ─── Render: Connected Services Tab ─────────────────────────────────────────

  const renderConnectedTab = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      {connectedIntegrations.map((integration) => {
        const IconComp = integration.icon;
        const isError = integration.status === 'error';
        const typeBadge = typeBadgeMap[integration.type] || { label: integration.type, className: 'bg-gray-100 text-gray-700 border-gray-200' };

        return (
          <motion.div key={integration.id} variants={itemVariants} whileHover={cardHover}>
            <Card
              className={`overflow-hidden border-0 shadow-sm transition-shadow hover:shadow-md ${
                isError ? 'ring-2 ring-red-300 bg-red-50/30' : 'bg-white'
              }`}
            >
              {/* Color stripe */}
              <div className="h-1" style={{ backgroundColor: integration.color }} />

              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${integration.color}15` }}
                    >
                      <IconComp className="w-5 h-5" style={{ color: integration.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-slate-800">{integration.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{integration.description}</p>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Badge variant="outline" className={`text-[10px] px-2 py-0 h-5 ${typeBadge.className}`}>
                    {typeBadge.label}
                  </Badge>
                  {isError ? (
                    <Badge className="text-[10px] px-2 py-0 h-5 bg-red-500 text-white">
                      <XCircle className="w-3 h-3 ml-1" />
                      خطا
                    </Badge>
                  ) : (
                    <Badge className="text-[10px] px-2 py-0 h-5 bg-emerald-500 text-white">
                      <CheckCircle2 className="w-3 h-3 ml-1" />
                      متصل
                    </Badge>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      آخرین همگام‌سازی
                    </span>
                    <span className={isError ? 'text-red-600 font-medium' : 'text-slate-700'}>
                      {integration.lastSync}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      فرکانس
                    </span>
                    <span className="text-slate-700">{integration.syncFrequency}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Database className="w-3 h-3" />
                      رکوردها
                    </span>
                    <span className="text-slate-700">
                      {integration.recordsSynced.toLocaleString('fa-IR')}
                    </span>
                  </div>
                </div>

                {/* Error message */}
                {isError && (
                  <div className="bg-red-100/70 border border-red-200 rounded-lg p-2.5 mb-3">
                    <p className="text-xs text-red-700 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      خطای اتصال: توکن منقضی شده است
                    </p>
                    <p className="text-[10px] text-red-600 mt-1">
                      لطفاً احراز هویت را مجدداً انجام دهید
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-xs gap-1 border-slate-200 hover:border-emerald-300 hover:text-emerald-600"
                    onClick={() => handleSync(integration.id)}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    همگام‌سازی
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 border-slate-200 hover:border-slate-400"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 border-slate-200 hover:border-red-300 hover:text-red-500"
                    onClick={() => handleDisconnect(integration.id)}
                  >
                    <Unlink className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );

  // ─── Render: Marketplace Tab ─────────────────────────────────────────────────

  const renderMarketplaceTab = () => (
    <div>
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="جستجوی سرویس..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 h-10 bg-white border-slate-200"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          {categoryFilters.map((cat) => (
            <Button
              key={cat.key}
              size="sm"
              variant={selectedCategory === cat.key ? 'default' : 'outline'}
              className={`h-8 text-xs px-3 ${
                selectedCategory === cat.key
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'border-slate-200 text-slate-600 hover:border-emerald-300'
              }`}
              onClick={() => setSelectedCategory(cat.key)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredMarketplace.map((service) => {
            const IconComp = service.icon;
            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={cardHover}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white h-full flex flex-col">
                  <CardContent className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${service.color}15` }}
                      >
                        <IconComp className="w-5 h-5" style={{ color: service.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-slate-800 truncate">
                          {service.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1.5 py-0 h-4 mt-0.5 border-slate-200 text-slate-500"
                        >
                          {service.category}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed mb-3 flex-1">
                      {service.description}
                    </p>

                    {/* Popularity bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span>محبوبیت</span>
                        <span>{service.popularity}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: service.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${service.popularity}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="w-full h-8 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => handleConnectService(service)}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      اتصال
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filteredMarketplace.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">سرویسی با این مشخصات یافت نشد</p>
          <Button
            variant="link"
            className="text-emerald-600 mt-2 text-xs"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          >
            پاک کردن فیلترها
          </Button>
        </motion.div>
      )}
    </div>
  );

  // ─── Render: Sync Settings Tab ───────────────────────────────────────────────

  const renderSyncSettingsTab = () => (
    <div className="space-y-6">
      {/* Sync Schedule */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              برنامه زمانی همگام‌سازی
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm text-slate-700">همگام‌سازی خودکار</Label>
                <p className="text-xs text-slate-500 mt-0.5">فعال‌سازی همگام‌سازی خودکار تمام سرویس‌ها</p>
              </div>
              <Switch checked={autoSyncEnabled} onCheckedChange={setAutoSyncEnabled} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm text-slate-700">همگام‌سازی هنگام ورود</Label>
                <p className="text-xs text-slate-500 mt-0.5">همگام‌سازی خودکار هنگام ورود به سیستم</p>
              </div>
              <Switch checked={syncOnStartup} onCheckedChange={setSyncOnStartup} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm text-slate-700">اعلان پس از همگام‌سازی</Label>
                <p className="text-xs text-slate-500 mt-0.5">دریافت اعلان پس از هر همگام‌سازی موفق</p>
              </div>
              <Switch checked={notifyOnSync} onCheckedChange={setNotifyOnSync} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm text-slate-700">اعلان خطا</Label>
                <p className="text-xs text-slate-500 mt-0.5">دریافت اعلان فوری در صورت بروز خطا</p>
              </div>
              <Switch checked={notifyOnError} onCheckedChange={setNotifyOnError} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Mapping */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              نگاشت داده‌ها
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { source: 'CRM', target: 'مدیریت مشتریان', field: 'نام و نام خانوادگی', active: true },
              { source: 'حسابداری', target: 'مالی', field: 'مبلغ تراکنش', active: true },
              { source: 'ارتباطات', target: 'اعلان‌ها', field: 'موضوع پیام', active: true },
              { source: 'تحلیل', target: 'داشبورد BI', field: 'نرخ تبدیل', active: false },
              { source: 'ذخیره‌سازی', target: 'اسناد', field: 'نام فایل', active: true },
            ].map((mapping, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 border-emerald-200 text-emerald-700 bg-emerald-50">
                    {mapping.source}
                  </Badge>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 border-sky-200 text-sky-700 bg-sky-50">
                    {mapping.target}
                  </Badge>
                  <span className="text-xs text-slate-600 flex-1">{mapping.field}</span>
                  <Switch checked={mapping.active} />
                </div>
                {idx < 4 && <Separator className="mt-3" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Conflict Resolution */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              تنظیمات حل تعارض
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-slate-700 mb-2 block">استراتژی حل تعارض</Label>
              <Select value={conflictResolution} onValueChange={setConflictResolution}>
                <SelectTrigger className="h-10 bg-white border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newer_wins">داده جدیدتر اولویت دارد</SelectItem>
                  <SelectItem value="source_wins">داده مبدأ اولویت دارد</SelectItem>
                  <SelectItem value="target_wins">داده مقصد اولویت دارد</SelectItem>
                  <SelectItem value="manual">تصمیم دستی</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-700 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                در صورت انتخاب «تصمیم دستی»، تعارضات در صف بررسی قرار می‌گیرند
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Manual Sync Button */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Button
          className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          onClick={handleManualSync}
          disabled={manualSyncing}
        >
          {manualSyncing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              در حال همگام‌سازی...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              همگام‌سازی دستی تمام سرویس‌ها
            </>
          )}
        </Button>
      </motion.div>

      {/* Sync History Log */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              تاریخچه همگام‌سازی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto custom-scrollbar space-y-1">
              {syncHistoryLog.map((entry, idx) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {/* Status icon */}
                  <div className="shrink-0">
                    {entry.status === 'success' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    )}
                    {entry.status === 'partial' && (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                    {entry.status === 'failed' && (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-700">{entry.integrationName}</span>
                      <Badge
                        variant="outline"
                        className={`text-[9px] px-1.5 py-0 h-4 ${
                          entry.status === 'success'
                            ? 'border-emerald-200 text-emerald-600 bg-emerald-50'
                            : entry.status === 'partial'
                            ? 'border-amber-200 text-amber-600 bg-amber-50'
                            : 'border-red-200 text-red-600 bg-red-50'
                        }`}
                      >
                        {entry.status === 'success'
                          ? 'موفق'
                          : entry.status === 'partial'
                          ? 'ناقص'
                          : 'ناموفق'}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{entry.timestamp}</p>
                  </div>

                  {/* Stats */}
                  <div className="text-left shrink-0">
                    <p className="text-xs text-slate-600">
                      {entry.recordsSynced > 0
                        ? `${entry.recordsSynced} رکورد`
                        : '—'}
                    </p>
                    {entry.errors > 0 && (
                      <p className="text-[10px] text-red-500">{entry.errors} خطا</p>
                    )}
                  </div>

                  {/* Duration */}
                  <div className="text-[10px] text-slate-400 shrink-0">{entry.duration}</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  // ─── Render: Connect Dialog ──────────────────────────────────────────────────

  const renderConnectDialog = () => {
    if (!selectedAvailableService) return null;
    const IconComp = selectedAvailableService.icon;

    const steps = [
      { num: 1, label: 'انتخاب سرویس' },
      { num: 2, label: 'احراز هویت' },
      { num: 3, label: 'نگاشت داده' },
      { num: 4, label: 'تست اتصال' },
    ];

    return (
      <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
        <DialogContent className="sm:max-w-lg dir-rtl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${selectedAvailableService.color}15` }}
              >
                <IconComp className="w-4 h-4" style={{ color: selectedAvailableService.color }} />
              </div>
              اتصال {selectedAvailableService.name}
            </DialogTitle>
          </DialogHeader>

          {/* Step indicator */}
          <div className="flex items-center gap-1 mb-4">
            {steps.map((step, idx) => (
              <div key={step.num} className="flex items-center flex-1">
                <div className="flex items-center gap-1.5 flex-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                      connectStep >= step.num
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {connectStep > step.num ? '✓' : step.num}
                  </div>
                  <span
                    className={`text-[10px] font-medium ${
                      connectStep >= step.num ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-px flex-1 mx-1 ${
                      connectStep > step.num ? 'bg-emerald-400' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Service Selection */}
            {connectStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${selectedAvailableService.color}15` }}
                    >
                      <IconComp className="w-5 h-5" style={{ color: selectedAvailableService.color }} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-800">{selectedAvailableService.name}</h4>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-slate-200 text-slate-500">
                        {selectedAvailableService.category}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">{selectedAvailableService.description}</p>
                </div>

                <div>
                  <Label className="text-sm text-slate-700 mb-1.5 block">فرکانس همگام‌سازی</Label>
                  <Select value={syncFrequency} onValueChange={setSyncFrequency}>
                    <SelectTrigger className="h-10 bg-white border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5min">هر ۵ دقیقه</SelectItem>
                      <SelectItem value="15min">هر ۱۵ دقیقه</SelectItem>
                      <SelectItem value="30min">هر ۳۰ دقیقه</SelectItem>
                      <SelectItem value="hourly">ساعتی</SelectItem>
                      <SelectItem value="6hours">هر ۶ ساعت</SelectItem>
                      <SelectItem value="daily">روزانه</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}

            {/* Step 2: Authentication */}
            {connectStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5 mb-2">
                    <Shield className="w-3.5 h-3.5" />
                    احراز هویت امن
                  </p>
                  <p className="text-[11px] text-emerald-600">
                    برای اتصال به {selectedAvailableService.name}، اطلاعات احراز هویت خود را وارد کنید
                  </p>
                </div>

                <div>
                  <Label className="text-sm text-slate-700 mb-1.5 block">کلید API</Label>
                  <Input
                    placeholder="کلید API خود را وارد کنید..."
                    className="h-10 bg-white border-slate-200"
                    dir="ltr"
                  />
                </div>

                <div>
                  <Label className="text-sm text-slate-700 mb-1.5 block">شناسه مشتری (Client ID)</Label>
                  <Input
                    placeholder="Client ID را وارد کنید..."
                    className="h-10 bg-white border-slate-200"
                    dir="ltr"
                  />
                </div>

                <div>
                  <Label className="text-sm text-slate-700 mb-1.5 block">رمز مشتری (Client Secret)</Label>
                  <Input
                    type="password"
                    placeholder="Client Secret را وارد کنید..."
                    className="h-10 bg-white border-slate-200"
                    dir="ltr"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Data Mapping */}
            {connectStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-xs text-slate-500">
                  فیلدهایی که می‌خواهید همگام‌سازی شوند را انتخاب کنید:
                </p>

                {[
                  { source: 'نام شرکت', target: 'نام سازمان', enabled: true },
                  { source: 'ایمیل', target: 'رایانامه', enabled: true },
                  { source: 'تلفن', target: 'شماره تماس', enabled: true },
                  { source: 'آدرس', target: 'محل', enabled: false },
                  { source: 'صنعت', target: 'حوزه فعالیت', enabled: true },
                  { source: 'درآمد', target: 'گردش مالی', enabled: false },
                ].map((field, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 border-slate-200 text-slate-600 min-w-[70px] justify-center">
                      {field.source}
                    </Badge>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 border-emerald-200 text-emerald-600 min-w-[70px] justify-center">
                      {field.target}
                    </Badge>
                    <div className="flex-1" />
                    <Switch defaultChecked={field.enabled} />
                  </div>
                ))}
              </motion.div>
            )}

            {/* Step 4: Test Connection */}
            {connectStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center py-4">
                  {testResult === 'idle' && (
                    <>
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <Plug className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-700 font-medium mb-1">آماده تست اتصال</p>
                      <p className="text-xs text-slate-500">
                        برای بررسی صحت تنظیمات، اتصال را تست کنید
                      </p>
                    </>
                  )}

                  {isTesting && (
                    <>
                      <motion.div
                        className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                      </motion.div>
                      <p className="text-sm text-emerald-700 font-medium mb-1">در حال تست اتصال...</p>
                      <p className="text-xs text-slate-500">
                        لطفاً چند لحظه صبر کنید
                      </p>
                    </>
                  )}

                  {testResult === 'success' && (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"
                      >
                        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                      </motion.div>
                      <p className="text-sm text-emerald-700 font-medium mb-1">اتصال با موفقیت برقرار شد!</p>
                      <p className="text-xs text-slate-500">
                        سرویس {selectedAvailableService.name} آماده همگام‌سازی است
                      </p>
                    </>
                  )}

                  {testResult === 'failed' && (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"
                      >
                        <XCircle className="w-8 h-8 text-red-500" />
                      </motion.div>
                      <p className="text-sm text-red-600 font-medium mb-1">اتصال ناموفق بود</p>
                      <p className="text-xs text-slate-500">
                        لطفاً اطلاعات احراز هویت را بررسی کنید و مجدداً تلاش نمایید
                      </p>
                    </>
                  )}
                </div>

                <Button
                  className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                  onClick={handleTestConnection}
                  disabled={isTesting || testResult === 'success'}
                >
                  {isTesting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  {isTesting
                    ? 'در حال تست...'
                    : testResult === 'success'
                    ? 'اتصال تأیید شد'
                    : 'تست اتصال'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1"
              onClick={() => setConnectStep(Math.max(1, connectStep - 1))}
              disabled={connectStep === 1}
            >
              <ArrowRight className="w-3.5 h-3.5" />
              قبلی
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 text-xs text-slate-500"
                onClick={() => setConnectDialogOpen(false)}
              >
                انصراف
              </Button>
              {connectStep < 4 ? (
                <Button
                  size="sm"
                  className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                  onClick={() => setConnectStep(connectStep + 1)}
                >
                  بعدی
                  <ChevronDown className="w-3.5 h-3.5 rotate-[-90deg]" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                  onClick={handleFinishConnect}
                  disabled={testResult !== 'success'}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  اتصال نهایی
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // ─── Main Render ─────────────────────────────────────────────────────────────

  return (
    <div dir="rtl" className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                <Plug className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">مرکز یکپارچگی</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  اتصال سرویس‌های خارجی و مدیریت همگام‌سازی داده‌ها
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-600 text-white text-xs px-3 py-1 shadow-sm">
              فاز ۳
            </Badge>
            <Button
              size="sm"
              className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm"
              onClick={() => {
                setSelectedAvailableService(availableIntegrations[0]);
                setConnectStep(1);
                setTestResult('idle');
                setConnectDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              اتصال سرویس جدید
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      {renderStatsRow()}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-white border border-slate-200 shadow-sm h-11 p-1">
          <TabsTrigger
            value="connected"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-xs gap-1.5 px-4"
          >
            <Link2 className="w-3.5 h-3.5" />
            سرویس‌های متصل
            <Badge className="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0 h-4 ml-1">
              {stats.connected}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="marketplace"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-xs gap-1.5 px-4"
          >
            <Globe className="w-3.5 h-3.5" />
            بازار سرویس
            <Badge className="bg-sky-100 text-sky-700 text-[9px] px-1.5 py-0 h-4 ml-1">
              {stats.available}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-xs gap-1.5 px-4"
          >
            <Settings className="w-3.5 h-3.5" />
            تنظیمات همگام‌سازی
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connected">{renderConnectedTab()}</TabsContent>
        <TabsContent value="marketplace">{renderMarketplaceTab()}</TabsContent>
        <TabsContent value="settings">{renderSyncSettingsTab()}</TabsContent>
      </Tabs>

      {/* Connect Dialog */}
      {renderConnectDialog()}
    </div>
  );
}
