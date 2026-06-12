'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { useAppStore, type Organization, type Branch } from '@/lib/store';
import {
  Building2,
  MapPin,
  Users,
  Crown,
  Plus,
  Settings,
  BarChart3,
  Globe,
  Shield,
  ChevronLeft,
  Edit,
  Eye,
  TrendingUp,
  Package,
  Check,
  Zap,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Database,
  Server,
  ChevronRight,
  X,
  LayoutGrid,
  List,
  Search,
  Filter,
  Briefcase,
  Layers,
  Activity,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════
//  Mock Data
// ═══════════════════════════════════════════════════════════════════

const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-1',
    name: 'گروه صنعتی پارس',
    industry: 'تولیدی',
    stage: 'رشد',
    plan: 'enterprise',
    employeeCount: 450,
    branchCount: 3,
    isActive: true,
    createdAt: '۱۴۰۲/۰۶/۱۵',
  },
  {
    id: 'org-2',
    name: 'فناوری نوین آریا',
    industry: 'فناوری اطلاعات',
    stage: 'راه‌اندازی',
    plan: 'starter',
    employeeCount: 25,
    branchCount: 1,
    isActive: true,
    createdAt: '۱۴۰۳/۰۱/۲۰',
  },
  {
    id: 'org-3',
    name: 'شرکت بازرگانی سپهر',
    industry: 'بازرگانی',
    stage: 'توسعه',
    plan: 'professional',
    employeeCount: 120,
    branchCount: 2,
    isActive: true,
    createdAt: '۱۴۰۲/۰۹/۱۰',
  },
  {
    id: 'org-4',
    name: 'هلدینگ ساختمانی راد',
    industry: 'ساختمان',
    stage: 'بلوغ',
    plan: 'enterprise',
    employeeCount: 680,
    branchCount: 4,
    isActive: true,
    createdAt: '۱۴۰۱/۰۳/۰۵',
  },
  {
    id: 'org-5',
    name: 'آکادمی آموزش پویا',
    industry: 'آموزش',
    stage: 'رشد',
    plan: 'professional',
    employeeCount: 85,
    branchCount: 2,
    isActive: false,
    createdAt: '۱۴۰۳/۰۴/۱۸',
  },
  {
    id: 'org-6',
    name: 'صنایع غذایی گلستان',
    industry: 'غذایی',
    stage: 'توسعه',
    plan: 'starter',
    employeeCount: 55,
    branchCount: 1,
    isActive: true,
    createdAt: '۱۴۰۲/۱۱/۲۵',
  },
];

const MOCK_BRANCHES: Branch[] = [
  {
    id: 'br-1',
    organizationId: 'org-1',
    name: 'شعبه مرکزی تهران',
    region: 'تهران',
    managerName: 'علی محمدی',
    employeeCount: 180,
    isActive: true,
    createdAt: '۱۴۰۲/۰۶/۱۵',
  },
  {
    id: 'br-2',
    organizationId: 'org-1',
    name: 'شعبه اصفهان',
    region: 'اصفهان',
    managerName: 'سارا رضایی',
    employeeCount: 120,
    isActive: true,
    createdAt: '۱۴۰۲/۰۸/۲۰',
  },
  {
    id: 'br-3',
    organizationId: 'org-1',
    name: 'شعبه شیراز',
    region: 'فارس',
    managerName: 'محمد حسینی',
    employeeCount: 150,
    isActive: true,
    createdAt: '۱۴۰۳/۰۱/۱۰',
  },
  {
    id: 'br-4',
    organizationId: 'org-2',
    name: 'دفتر مرکزی',
    region: 'تهران',
    managerName: 'نازنین کریمی',
    employeeCount: 25,
    isActive: true,
    createdAt: '۱۴۰۳/۰۱/۲۰',
  },
  {
    id: 'br-5',
    organizationId: 'org-3',
    name: 'شعبه مرکزی تهران',
    region: 'تهران',
    managerName: 'رضا احمدی',
    employeeCount: 70,
    isActive: true,
    createdAt: '۱۴۰۲/۰۹/۱۰',
  },
  {
    id: 'br-6',
    organizationId: 'org-3',
    name: 'شعبه تبریز',
    region: 'آذربایجان شرقی',
    managerName: 'مریم نجفی',
    employeeCount: 50,
    isActive: true,
    createdAt: '۱۴۰۳/۰۲/۰۵',
  },
  {
    id: 'br-7',
    organizationId: 'org-4',
    name: 'شعبه مرکزی',
    region: 'تهران',
    managerName: 'حسین عباسی',
    employeeCount: 220,
    isActive: true,
    createdAt: '۱۴۰۱/۰۳/۰۵',
  },
  {
    id: 'br-8',
    organizationId: 'org-4',
    name: 'شعبه مشهد',
    region: 'خراسان رضوی',
    managerName: 'فاطمه موسوی',
    employeeCount: 160,
    isActive: true,
    createdAt: '۱۴۰۱/۰۷/۱۲',
  },
  {
    id: 'br-9',
    organizationId: 'org-5',
    name: 'شعبه مرکزی تهران',
    region: 'تهران',
    managerName: 'امیر جعفری',
    employeeCount: 55,
    isActive: true,
    createdAt: '۱۴۰۳/۰۴/۱۸',
  },
  {
    id: 'br-10',
    organizationId: 'org-4',
    name: 'شعبه کیش',
    region: 'هرمزگان',
    managerName: 'زهرا صادقی',
    employeeCount: 100,
    isActive: false,
    createdAt: '۱۴۰۲/۰۲/۱۵',
  },
];

// Branch revenue trend data (mock)
const BRANCH_REVENUE_DATA: Record<string, { month: string; revenue: number }[]> = {
  'br-1': [
    { month: 'فروردین', revenue: 4200 },
    { month: 'اردیبهشت', revenue: 4800 },
    { month: 'خرداد', revenue: 5100 },
    { month: 'تیر', revenue: 4900 },
    { month: 'مرداد', revenue: 5600 },
    { month: 'شهریور', revenue: 6200 },
  ],
  'br-2': [
    { month: 'فروردین', revenue: 3100 },
    { month: 'اردیبهشت', revenue: 3500 },
    { month: 'خرداد', revenue: 3200 },
    { month: 'تیر', revenue: 3800 },
    { month: 'مرداد', revenue: 4100 },
    { month: 'شهریور', revenue: 4500 },
  ],
  'br-5': [
    { month: 'فروردین', revenue: 2800 },
    { month: 'اردیبهشت', revenue: 3000 },
    { month: 'خرداد', revenue: 3400 },
    { month: 'تیر', revenue: 3100 },
    { month: 'مرداد', revenue: 3600 },
    { month: 'شهریور', revenue: 4000 },
  ],
};

// Plan definitions
interface PlanDefinition {
  id: 'starter' | 'professional' | 'enterprise';
  name: string;
  nameEn: string;
  price: string;
  priceAnnual: string;
  features: string[];
  limits: { storage: number; users: number; apiCalls: number };
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PLAN_DEFINITIONS: PlanDefinition[] = [
  {
    id: 'starter',
    name: 'پایه',
    nameEn: 'Starter',
    price: '۲۹۰,۰۰۰',
    priceAnnual: '۲,۴۰۰,۰۰۰',
    features: [
      'تا ۵ کاربر',
      '۱ سازمان',
      'گزارش‌های پایه',
      'پشتیبانی ایمیل',
      '۵ گیگابایت فضای ذخیره‌سازی',
      'دسترسی API محدود',
    ],
    limits: { storage: 5, users: 5, apiCalls: 1000 },
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    icon: Package,
  },
  {
    id: 'professional',
    name: 'حرفه‌ای',
    nameEn: 'Professional',
    price: '۷۹۰,۰۰۰',
    priceAnnual: '۶,۹۰۰,۰۰۰',
    features: [
      'تا ۵۰ کاربر',
      'تا ۵ سازمان',
      'گزارش‌های پیشرفته',
      'پشتیبانی تلفنی',
      '۲۵ گیگابایت فضای ذخیره‌سازی',
      'دسترسی API کامل',
      'داشبورد BI',
      'اتوماسیون فرآیندها',
    ],
    limits: { storage: 25, users: 50, apiCalls: 10000 },
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    icon: Star,
  },
  {
    id: 'enterprise',
    name: 'سازمانی',
    nameEn: 'Enterprise',
    price: 'تماس بگیرید',
    priceAnnual: 'تماس بگیرید',
    features: [
      'کاربر نامحدود',
      'سازمان نامحدود',
      'گزارش‌های سفارشی',
      'پشتیبانی ۲۴/۷',
      'فضای ذخیره‌سازی نامحدود',
      'API نامحدود',
      'داشبورد BI پیشرفته',
      'اتوماسیون هوشمند',
      'امنیت پیشرفته',
      'مدیریت شعب',
      'یکپارچه‌سازی سفارشی',
    ],
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    icon: Crown,
  },
];

// Industry options
const INDUSTRY_OPTIONS = [
  { value: 'تولیدی', label: 'تولیدی' },
  { value: 'فناوری اطلاعات', label: 'فناوری اطلاعات' },
  { value: 'بازرگانی', label: 'بازرگانی' },
  { value: 'ساختمان', label: 'ساختمان' },
  { value: 'آموزش', label: 'آموزش' },
  { value: 'غذایی', label: 'غذایی' },
  { value: 'بهداشت و درمان', label: 'بهداشت و درمان' },
  { value: 'مالی و بانکی', label: 'مالی و بانکی' },
  { value: 'نفت و گاز', label: 'نفت و گاز' },
  { value: 'مشاوره', label: 'مشاوره' },
];

const REGION_OPTIONS = [
  { value: 'تهران', label: 'تهران' },
  { value: 'اصفهان', label: 'اصفهان' },
  { value: 'فارس', label: 'فارس' },
  { value: 'آذربایجان شرقی', label: 'آذربایجان شرقی' },
  { value: 'خراسان رضوی', label: 'خراسان رضوی' },
  { value: 'هرمزگان', label: 'هرمزگان' },
  { value: 'مازندران', label: 'مازندران' },
  { value: 'کرمان', label: 'کرمان' },
];

// Plan badge config
const planConfig: Record<Organization['plan'], { label: string; color: string; bgColor: string; borderColor: string }> = {
  starter: { label: 'پایه', color: 'text-slate-700', bgColor: 'bg-slate-100', borderColor: 'border-slate-300' },
  professional: { label: 'حرفه‌ای', color: 'text-emerald-700', bgColor: 'bg-emerald-100', borderColor: 'border-emerald-300' },
  enterprise: { label: 'سازمانی', color: 'text-indigo-700', bgColor: 'bg-indigo-100', borderColor: 'border-indigo-300' },
};

// Stage badge config
const stageConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  'راه‌اندازی': { label: 'راه‌اندازی', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  'رشد': { label: 'رشد', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  'توسعه': { label: 'توسعه', color: 'text-teal-700', bgColor: 'bg-teal-100' },
  'بلوغ': { label: 'بلوغ', color: 'text-indigo-700', bgColor: 'bg-indigo-100' },
};

// ═══════════════════════════════════════════════════════════════════
//  Mini Revenue Chart Component
// ═══════════════════════════════════════════════════════════════════
function MiniRevenueChart({ data }: { data: { month: string; revenue: number }[] }) {
  if (!data || data.length === 0) return null;

  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const minRevenue = Math.min(...data.map((d) => d.revenue));
  const range = maxRevenue - minRevenue || 1;

  const chartWidth = 200;
  const chartHeight = 60;
  const padding = 8;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (chartWidth - 2 * padding);
    const y = chartHeight - padding - ((d.revenue - minRevenue) / range) * (chartHeight - 2 * padding);
    return { x, y };
  });

  const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;

  return (
    <svg width={chartWidth} height={chartHeight} className="w-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
      <defs>
        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#revenueGrad)" />
      <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#10b981" stroke="white" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  Usage Meter Component
// ═══════════════════════════════════════════════════════════════════
function UsageMeter({ label, current, max, unit, icon: Icon }: { label: string; current: number; max: number; unit: string; icon: React.ComponentType<{ className?: string }> }) {
  const percentage = Math.min(Math.round((current / max) * 100), 100);
  const isWarning = percentage >= 80;
  const isCritical = percentage >= 95;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${isCritical ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-emerald-500'}`} />
          <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
        <span className="text-xs text-slate-500">
          {current.toLocaleString('fa-IR')} / {max.toLocaleString('fa-IR')} {unit}
        </span>
      </div>
      <Progress
        value={percentage}
        className={`h-2 ${isCritical ? '[&>div]:bg-red-500' : isWarning ? '[&>div]:bg-amber-500' : '[&>div]:bg-emerald-500'}`}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  Main Component
// ═══════════════════════════════════════════════════════════════════
export default function OrganizationView() {
  const {
    organizations,
    branches,
    selectedOrgId,
    setOrganizations,
    addOrganization,
    setBranches,
    setSelectedOrgId,
  } = useAppStore();

  // ── Local state ─────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('organizations');
  const [createOrgDialogOpen, setCreateOrgDialogOpen] = useState(false);
  const [createBranchDialogOpen, setCreateBranchDialogOpen] = useState(false);
  const [branchFilterOrg, setBranchFilterOrg] = useState<string>('all');
  const [orgSearchQuery, setOrgSearchQuery] = useState('');
  const [detailViewOrgId, setDetailViewOrgId] = useState<string | null>(null);

  // Create Org form state
  const [orgFormName, setOrgFormName] = useState('');
  const [orgFormIndustry, setOrgFormIndustry] = useState('');
  const [orgFormPlan, setOrgFormPlan] = useState<Organization['plan']>('starter');
  const [orgFormEmployeeCount, setOrgFormEmployeeCount] = useState('');
  const [orgFormBranchName, setOrgFormBranchName] = useState('');
  const [orgFormBranchRegion, setOrgFormBranchRegion] = useState('');
  const [orgFormBranchManager, setOrgFormBranchManager] = useState('');

  // Create Branch form state
  const [branchFormName, setBranchFormName] = useState('');
  const [branchFormOrgId, setBranchFormOrgId] = useState('');
  const [branchFormRegion, setBranchFormRegion] = useState('');
  const [branchFormManager, setBranchFormManager] = useState('');
  const [branchFormEmployeeCount, setBranchFormEmployeeCount] = useState('');

  // ── Initialize mock data ────────────────────────────────────
  const orgs = useMemo(() => {
    if (organizations.length === 0) {
      setOrganizations(MOCK_ORGANIZATIONS);
      return MOCK_ORGANIZATIONS;
    }
    return organizations;
  }, [organizations, setOrganizations]);

  const allBranches = useMemo(() => {
    if (branches.length === 0) {
      setBranches(MOCK_BRANCHES);
      return MOCK_BRANCHES;
    }
    return branches;
  }, [branches, setBranches]);

  // ── Computed stats ───────────────────────────────────────────
  const stats = useMemo(() => {
    const totalOrgs = orgs.length;
    const activeBranches = allBranches.filter((b) => b.isActive).length;
    const totalUsers = orgs.reduce((sum, o) => sum + o.employeeCount, 0);
    const activePlans = orgs.filter((o) => o.isActive).length;
    return { totalOrgs, activeBranches, totalUsers, activePlans };
  }, [orgs, allBranches]);

  // ── Filtered organizations ──────────────────────────────────
  const filteredOrgs = useMemo(() => {
    if (!orgSearchQuery.trim()) return orgs;
    const q = orgSearchQuery.trim().toLowerCase();
    return orgs.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.industry.toLowerCase().includes(q) ||
        planConfig[o.plan].label.includes(q)
    );
  }, [orgs, orgSearchQuery]);

  // ── Filtered branches ───────────────────────────────────────
  const filteredBranches = useMemo(() => {
    if (branchFilterOrg === 'all') return allBranches;
    return allBranches.filter((b) => b.organizationId === branchFilterOrg);
  }, [allBranches, branchFilterOrg]);

  // ── Selected org detail ─────────────────────────────────────
  const selectedOrg = useMemo(() => {
    if (!detailViewOrgId) return null;
    return orgs.find((o) => o.id === detailViewOrgId) || null;
  }, [orgs, detailViewOrgId]);

  const selectedOrgBranches = useMemo(() => {
    if (!detailViewOrgId) return [];
    return allBranches.filter((b) => b.organizationId === detailViewOrgId);
  }, [allBranches, detailViewOrgId]);

  // ── Plan subscriber counts ──────────────────────────────────
  const planSubscribers = useMemo(() => {
    const counts: Record<string, number> = { starter: 0, professional: 0, enterprise: 0 };
    orgs.forEach((o) => { counts[o.plan]++; });
    return counts;
  }, [orgs]);

  // ── Toggle org active status ────────────────────────────────
  const handleToggleOrgActive = useCallback(
    (orgId: string) => {
      const updated = orgs.map((o) =>
        o.id === orgId ? { ...o, isActive: !o.isActive } : o
      );
      setOrganizations(updated);
    },
    [orgs, setOrganizations]
  );

  // ── Reset org form ──────────────────────────────────────────
  const resetOrgForm = useCallback(() => {
    setOrgFormName('');
    setOrgFormIndustry('');
    setOrgFormPlan('starter');
    setOrgFormEmployeeCount('');
    setOrgFormBranchName('');
    setOrgFormBranchRegion('');
    setOrgFormBranchManager('');
  }, []);

  // ── Create organization ─────────────────────────────────────
  const handleCreateOrg = useCallback(() => {
    if (!orgFormName.trim() || !orgFormIndustry) return;

    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name: orgFormName.trim(),
      industry: orgFormIndustry,
      stage: 'راه‌اندازی',
      plan: orgFormPlan,
      employeeCount: parseInt(orgFormEmployeeCount) || 0,
      branchCount: orgFormBranchName.trim() ? 1 : 0,
      isActive: true,
      createdAt: new Date().toLocaleDateString('fa-IR'),
    };
    addOrganization(newOrg);

    if (orgFormBranchName.trim()) {
      const newBranch: Branch = {
        id: `br-${Date.now()}`,
        organizationId: newOrg.id,
        name: orgFormBranchName.trim(),
        region: orgFormBranchRegion || 'تهران',
        managerName: orgFormBranchManager.trim() || 'تعیین نشده',
        employeeCount: parseInt(orgFormEmployeeCount) || 0,
        isActive: true,
        createdAt: new Date().toLocaleDateString('fa-IR'),
      };
      setBranches([...allBranches, newBranch]);
    }

    setCreateOrgDialogOpen(false);
    resetOrgForm();
  }, [orgFormName, orgFormIndustry, orgFormPlan, orgFormEmployeeCount, orgFormBranchName, orgFormBranchRegion, orgFormBranchManager, addOrganization, allBranches, setBranches, resetOrgForm]);

  // ── Reset branch form ───────────────────────────────────────
  const resetBranchForm = useCallback(() => {
    setBranchFormName('');
    setBranchFormOrgId('');
    setBranchFormRegion('');
    setBranchFormManager('');
    setBranchFormEmployeeCount('');
  }, []);

  // ── Create branch ───────────────────────────────────────────
  const handleCreateBranch = useCallback(() => {
    if (!branchFormName.trim() || !branchFormOrgId) return;

    const newBranch: Branch = {
      id: `br-${Date.now()}`,
      organizationId: branchFormOrgId,
      name: branchFormName.trim(),
      region: branchFormRegion || 'تهران',
      managerName: branchFormManager.trim() || 'تعیین نشده',
      employeeCount: parseInt(branchFormEmployeeCount) || 0,
      isActive: true,
      createdAt: new Date().toLocaleDateString('fa-IR'),
    };
    setBranches([...allBranches, newBranch]);

    // Update org branch count
    const updated = orgs.map((o) =>
      o.id === branchFormOrgId ? { ...o, branchCount: o.branchCount + 1 } : o
    );
    setOrganizations(updated);

    setCreateBranchDialogOpen(false);
    resetBranchForm();
  }, [branchFormName, branchFormOrgId, branchFormRegion, branchFormManager, branchFormEmployeeCount, allBranches, orgs, setBranches, setOrganizations, resetBranchForm]);

  // ── Handle org click for detail view ────────────────────────
  const handleOrgClick = useCallback((orgId: string) => {
    setDetailViewOrgId(orgId);
    setSelectedOrgId(orgId);
  }, [setSelectedOrgId]);

  // ── Back from detail view ───────────────────────────────────
  const handleBackFromDetail = useCallback(() => {
    setDetailViewOrgId(null);
    setSelectedOrgId(null);
  }, [setSelectedOrgId]);

  // ═══════════════════════════════════════════════════════════
  //  Render: Stats Row
  // ═══════════════════════════════════════════════════════════
  const renderStats = () => {
    const items = [
      { label: 'تعداد سازمان‌ها', value: stats.totalOrgs, icon: Building2, colorClass: 'bg-emerald-100', iconClass: 'text-emerald-600' },
      { label: 'شعب فعال', value: stats.activeBranches, icon: MapPin, colorClass: 'bg-teal-100', iconClass: 'text-teal-600' },
      { label: 'کاربران کل', value: stats.totalUsers, icon: Users, colorClass: 'bg-amber-100', iconClass: 'text-amber-600' },
      { label: 'طرح‌های فعال', value: stats.activePlans, icon: Crown, colorClass: 'bg-indigo-100', iconClass: 'text-indigo-600' },
    ];

    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.3 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.colorClass}`}>
                    <item.icon className={`w-5 h-5 ${item.iconClass}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 truncate">{item.label}</p>
                    <p className="text-lg font-bold text-slate-900">{item.value.toLocaleString('fa-IR')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  //  Render: Organization Card
  // ═══════════════════════════════════════════════════════════
  const renderOrgCard = (org: Organization, index: number) => {
    const pCfg = planConfig[org.plan];
    const sCfg = stageConfig[org.stage] || { label: org.stage, color: 'text-slate-700', bgColor: 'bg-slate-100' };
    const orgBranches = allBranches.filter((b) => b.organizationId === org.id);

    return (
      <motion.div
        key={org.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        layout
      >
        <Card className={`hover:shadow-lg transition-all group ${!org.isActive ? 'opacity-70' : ''} hover:border-emerald-200`}>
          <CardContent className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 shadow-md">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                    {org.name}
                  </h3>
                  <p className="text-xs text-slate-500">{org.industry}</p>
                </div>
              </div>
              <Switch
                checked={org.isActive}
                onCheckedChange={() => handleToggleOrgActive(org.id)}
                className="data-[state=checked]:bg-emerald-500 shrink-0"
              />
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <Badge className={`${pCfg.bgColor} ${pCfg.color} text-xs gap-1 border ${pCfg.borderColor}`}>
                <Crown className="w-3 h-3" />
                {pCfg.label}
              </Badge>
              <Badge className={`${sCfg.bgColor} ${sCfg.color} text-xs`}>
                {sCfg.label}
              </Badge>
              {!org.isActive && (
                <Badge className="bg-red-100 text-red-700 text-xs">غیرفعال</Badge>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center bg-slate-50 rounded-lg py-2 px-1">
                <p className="text-xs text-slate-500">کارکنان</p>
                <p className="text-sm font-bold text-slate-800">{org.employeeCount.toLocaleString('fa-IR')}</p>
              </div>
              <div className="text-center bg-slate-50 rounded-lg py-2 px-1">
                <p className="text-xs text-slate-500">شعب</p>
                <p className="text-sm font-bold text-slate-800">{orgBranches.length.toLocaleString('fa-IR')}</p>
              </div>
              <div className="text-center bg-slate-50 rounded-lg py-2 px-1">
                <p className="text-xs text-slate-500">تاریخ عضویت</p>
                <p className="text-sm font-bold text-slate-800">{org.createdAt}</p>
              </div>
            </div>

            <Separator className="mb-3" />

            {/* Actions */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">{org.createdAt}</p>
              <div className="flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-emerald-50"
                  onClick={() => handleOrgClick(org.id)}
                  title="مشاهده جزئیات"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-emerald-50"
                  title="مدیریت شعب"
                  onClick={() => {
                    setBranchFilterOrg(org.id);
                    setActiveTab('branches');
                  }}
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-emerald-50"
                  title="تحلیل‌ها"
                  onClick={() => handleOrgClick(org.id)}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-emerald-50"
                  title="تنظیمات"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  //  Render: Organizations Tab
  // ═══════════════════════════════════════════════════════════
  const renderOrganizationsTab = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key="orgs-tab"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
      >
        {/* Search */}
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="جستجوی سازمان..."
              value={orgSearchQuery}
              onChange={(e) => setOrgSearchQuery(e.target.value)}
              className="pr-9"
            />
          </div>
          <p className="text-sm text-slate-500">
            {filteredOrgs.length.toLocaleString('fa-IR')} سازمان
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredOrgs.map((org, i) => renderOrgCard(org, i))}
        </div>

        {filteredOrgs.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">سازمانی یافت نشد</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );

  // ═══════════════════════════════════════════════════════════
  //  Render: Branches Tab
  // ═══════════════════════════════════════════════════════════
  const renderBranchesTab = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key="branches-tab"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
        className="space-y-4"
      >
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-slate-400" />
            <Select value={branchFilterOrg} onValueChange={setBranchFilterOrg}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="فیلتر بر اساس سازمان" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه سازمان‌ها</SelectItem>
                {orgs.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 gap-2 shadow-md shadow-emerald-100"
            onClick={() => setCreateBranchDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
            ایجاد شعبه
          </Button>
        </div>

        {/* Branch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredBranches.map((branch, i) => {
            const parentOrg = orgs.find((o) => o.id === branch.organizationId);
            const revenueData = BRANCH_REVENUE_DATA[branch.id];
            const growthPercent = revenueData
              ? Math.round(((revenueData[revenueData.length - 1].revenue - revenueData[0].revenue) / revenueData[0].revenue) * 100)
              : null;

            return (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                layout
              >
                <Card className={`hover:shadow-lg transition-all group ${!branch.isActive ? 'opacity-70' : ''} hover:border-teal-200`}>
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 truncate text-sm group-hover:text-teal-700 transition-colors">
                            {branch.name}
                          </h3>
                          <p className="text-xs text-slate-500">{parentOrg?.name || 'نامشخص'}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-xs shrink-0 ${branch.isActive ? 'border-emerald-300 text-emerald-700' : 'border-red-300 text-red-700'}`}>
                        {branch.isActive ? 'فعال' : 'غیرفعال'}
                      </Badge>
                    </div>

                    {/* Info row */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        {branch.region}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {branch.employeeCount.toLocaleString('fa-IR')} نفر
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 col-span-2">
                        <Shield className="w-3.5 h-3.5 text-slate-400" />
                        مدیر: {branch.managerName}
                      </div>
                    </div>

                    {/* Mini chart */}
                    {revenueData && (
                      <div className="bg-slate-50 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-500">روند درآمد</span>
                          {growthPercent !== null && (
                            <span className={`text-xs font-medium flex items-center gap-0.5 ${growthPercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {growthPercent >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                              {Math.abs(growthPercent)}٪
                            </span>
                          )}
                        </div>
                        <MiniRevenueChart data={revenueData} />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-0.5">
                      <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-teal-50" title="مشاهده">
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-teal-50" title="ویرایش">
                        <Edit className="w-3.5 h-3.5 text-slate-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-teal-50" title="تنظیمات">
                        <Settings className="w-3.5 h-3.5 text-slate-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Branch Comparison Table */}
        {filteredBranches.length > 1 && (
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-600" />
                مقایسه عملکرد شعب
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-right py-2 px-3 font-medium text-slate-500">نام شعبه</th>
                      <th className="text-right py-2 px-3 font-medium text-slate-500">سازمان</th>
                      <th className="text-right py-2 px-3 font-medium text-slate-500">منطقه</th>
                      <th className="text-right py-2 px-3 font-medium text-slate-500">کارکنان</th>
                      <th className="text-right py-2 px-3 font-medium text-slate-500">وضعیت</th>
                      <th className="text-right py-2 px-3 font-medium text-slate-500">رشد درآمد</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBranches.map((branch) => {
                      const parentOrg = orgs.find((o) => o.id === branch.organizationId);
                      const revenueData = BRANCH_REVENUE_DATA[branch.id];
                      const growth = revenueData
                        ? Math.round(((revenueData[revenueData.length - 1].revenue - revenueData[0].revenue) / revenueData[0].revenue) * 100)
                        : null;

                      return (
                        <tr key={branch.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="py-2 px-3 font-medium text-slate-800">{branch.name}</td>
                          <td className="py-2 px-3 text-slate-600">{parentOrg?.name || '—'}</td>
                          <td className="py-2 px-3 text-slate-600">{branch.region}</td>
                          <td className="py-2 px-3 text-slate-600">{branch.employeeCount.toLocaleString('fa-IR')}</td>
                          <td className="py-2 px-3">
                            <Badge variant="outline" className={`text-[10px] ${branch.isActive ? 'border-emerald-300 text-emerald-700' : 'border-red-300 text-red-700'}`}>
                              {branch.isActive ? 'فعال' : 'غیرفعال'}
                            </Badge>
                          </td>
                          <td className="py-2 px-3">
                            {growth !== null ? (
                              <span className={`flex items-center gap-0.5 text-xs font-medium ${growth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {Math.abs(growth)}٪
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredBranches.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">شعبه‌ای یافت نشد</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );

  // ═══════════════════════════════════════════════════════════
  //  Render: Plans Tab
  // ═══════════════════════════════════════════════════════════
  const renderPlansTab = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key="plans-tab"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
        className="space-y-6"
      >
        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLAN_DEFINITIONS.map((plan, i) => {
            const PlanIcon = plan.icon;
            const subscriberCount = planSubscribers[plan.id] || 0;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <Card className={`relative overflow-hidden ${plan.borderColor} border-2 hover:shadow-xl transition-all`}>
                  {plan.id === 'professional' && (
                    <div className="absolute top-0 left-0 right-0 bg-emerald-600 text-white text-center text-xs py-1 font-medium">
                      پیشنهاد ویژه
                    </div>
                  )}
                  <CardHeader className={`pb-3 ${plan.id === 'professional' ? 'pt-8' : ''}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl ${plan.bgColor} flex items-center justify-center`}>
                        <PlanIcon className={`w-5 h-5 ${plan.color}`} />
                      </div>
                      <div>
                        <CardTitle className={`text-lg ${plan.color}`}>{plan.name}</CardTitle>
                        <p className="text-xs text-slate-400">{plan.nameEn}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-2xl font-bold text-slate-900">
                        {plan.price}
                        {plan.id !== 'enterprise' && <span className="text-sm font-normal text-slate-500"> تومان/ماه</span>}
                      </p>
                      {plan.id !== 'enterprise' && (
                        <p className="text-xs text-slate-400 mt-1">
                          سالانه: {plan.priceAnnual} تومان
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Separator className="mb-4" />

                    {/* Features */}
                    <ul className="space-y-2 mb-4">
                      {plan.features.map((feature, fi) => (
                        <li key={fi} className="flex items-start gap-2 text-sm text-slate-600">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.id === 'starter' ? 'text-slate-500' : plan.id === 'professional' ? 'text-emerald-500' : 'text-indigo-500'}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Subscriber count */}
                    <div className="flex items-center justify-between mb-4 bg-slate-50 rounded-lg px-3 py-2">
                      <span className="text-xs text-slate-500">مشترکین فعلی</span>
                      <span className="text-sm font-bold text-slate-800">{subscriberCount.toLocaleString('fa-IR')} سازمان</span>
                    </div>

                    {/* Action button */}
                    <Button
                      className={`w-full gap-2 ${
                        plan.id === 'starter'
                          ? 'bg-slate-700 hover:bg-slate-800'
                          : plan.id === 'professional'
                          ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-100'
                          : 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100'
                      }`}
                    >
                      {plan.id === 'enterprise' ? 'تماس با فروش' : 'انتخاب طرح'}
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              مقایسه طرح‌ها
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-right py-2 px-3 font-medium text-slate-500">ویژگی</th>
                    <th className="text-center py-2 px-3 font-medium text-slate-500">پایه</th>
                    <th className="text-center py-2 px-3 font-medium text-emerald-700 bg-emerald-50 rounded-t-lg">حرفه‌ای</th>
                    <th className="text-center py-2 px-3 font-medium text-indigo-700 bg-indigo-50 rounded-t-lg">سازمانی</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'تعداد کاربران', starter: 'تا ۵', professional: 'تا ۵۰', enterprise: 'نامحدود' },
                    { feature: 'سازمان‌ها', starter: '۱', professional: 'تا ۵', enterprise: 'نامحدود' },
                    { feature: 'فضای ذخیره‌سازی', starter: '۵ گیگابایت', professional: '۲۵ گیگابایت', enterprise: 'نامحدود' },
                    { feature: 'دسترسی API', starter: 'محدود', professional: 'کامل', enterprise: 'نامحدود' },
                    { feature: 'داشبورد BI', starter: '—', professional: '✓', enterprise: '✓ پیشرفته' },
                    { feature: 'اتوماسیون', starter: '—', professional: '✓', enterprise: '✓ هوشمند' },
                    { feature: 'مدیریت شعب', starter: '—', professional: '—', enterprise: '✓' },
                    { feature: 'پشتیبانی', starter: 'ایمیل', professional: 'تلفنی', enterprise: '۲۴/۷' },
                    { feature: 'قیمت ماهانه', starter: '۲۹۰,۰۰۰ ت', professional: '۷۹۰,۰۰۰ ت', enterprise: 'تماس بگیرید' },
                  ].map((row, ri) => (
                    <tr key={ri} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-3 font-medium text-slate-700">{row.feature}</td>
                      <td className="py-2 px-3 text-center text-slate-600">{row.starter}</td>
                      <td className="py-2 px-3 text-center text-slate-800 bg-emerald-50/50 font-medium">{row.professional}</td>
                      <td className="py-2 px-3 text-center text-slate-800 bg-indigo-50/50 font-medium">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Usage Meters (for current org) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              میزان استفاده (سازمان انتخاب‌شده)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <UsageMeter
              label="فضای ذخیره‌سازی"
              current={18}
              max={25}
              unit="گیگابایت"
              icon={Database}
            />
            <UsageMeter
              label="کاربران فعال"
              current={42}
              max={50}
              unit="نفر"
              icon={Users}
            />
            <UsageMeter
              label="فراخوانی API"
              current={7200}
              max={10000}
              unit="درخواست"
              icon={Server}
            />
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );

  // ═══════════════════════════════════════════════════════════
  //  Render: Organization Detail View
  // ═══════════════════════════════════════════════════════════
  const renderOrgDetail = () => {
    if (!selectedOrg) return null;
    const pCfg = planConfig[selectedOrg.plan];
    const sCfg = stageConfig[selectedOrg.stage] || { label: selectedOrg.stage, color: 'text-slate-700', bgColor: 'bg-slate-100' };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="org-detail"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Back button */}
          <Button
            variant="ghost"
            className="gap-2 text-slate-600 hover:text-emerald-700"
            onClick={handleBackFromDetail}
          >
            <ChevronRight className="w-4 h-4" />
            بازگشت به لیست سازمان‌ها
          </Button>

          {/* Org Info Card */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-l from-emerald-500 to-teal-600 p-6 text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedOrg.name}</h2>
                    <p className="text-emerald-100 mt-1">{selectedOrg.industry} • {sCfg.label}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${pCfg.bgColor} ${pCfg.color} gap-1 border ${pCfg.borderColor} text-sm px-3 py-1`}>
                    <Crown className="w-3.5 h-3.5" />
                    طرح {pCfg.label}
                  </Badge>
                  <Badge className={`text-sm px-3 py-1 ${selectedOrg.isActive ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'}`}>
                    {selectedOrg.isActive ? 'فعال' : 'غیرفعال'}
                  </Badge>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <Users className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-slate-900">{selectedOrg.employeeCount.toLocaleString('fa-IR')}</p>
                  <p className="text-xs text-slate-500">کارکنان</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-slate-900">{selectedOrgBranches.length.toLocaleString('fa-IR')}</p>
                  <p className="text-xs text-slate-500">شعب</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <Briefcase className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-slate-900">{selectedOrg.industry}</p>
                  <p className="text-xs text-slate-500">صنعت</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <Globe className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-slate-900">{sCfg.label}</p>
                  <p className="text-xs text-slate-500">مرحله رشد</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Branches & Users side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Branches list */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  شعب سازمان
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {selectedOrgBranches.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-6">شعبه‌ای ثبت نشده</p>
                ) : (
                  <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar">
                    {selectedOrgBranches.map((branch) => (
                      <div
                        key={branch.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-teal-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{branch.name}</p>
                            <p className="text-xs text-slate-500">{branch.region} • {branch.managerName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">
                            {branch.employeeCount.toLocaleString('fa-IR')} نفر
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${branch.isActive ? 'border-emerald-300 text-emerald-700' : 'border-red-300 text-red-700'}`}
                          >
                            {branch.isActive ? 'فعال' : 'غیرفعال'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Users list (mock) */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  کاربران کلیدي
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar">
                  {[
                    { name: 'مدیرعامل', role: 'مدیر ارشد', email: 'ceo@org.com' },
                    { name: 'مدیر مالی', role: 'مدیر مالی', email: 'cfo@org.com' },
                    { name: 'مدیر عملیات', role: 'مدیر عملیات', email: 'coo@org.com' },
                    { name: 'مدیر فروش', role: 'مدیر فروش', email: 'sales@org.com' },
                    { name: 'تحلیلگر داده', role: 'تحلیلگر', email: 'analyst@org.com' },
                  ].map((user, ui) => (
                    <div
                      key={ui}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                خلاصه تحلیل‌ها
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'درآمد ماهانه', value: '۱.۲ میلیارد', change: '+۱۲٪', positive: true },
                  { label: 'هزینه‌ها', value: '۸۵۰ میلیون', change: '-۵٪', positive: true },
                  { label: 'حاشیه سود', value: '۲۹٪', change: '+۳٪', positive: true },
                  { label: 'رضایت مشتری', value: '۸۷٪', change: '+۲٪', positive: true },
                ].map((metric, mi) => (
                  <div key={mi} className="bg-slate-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-slate-500 mb-1">{metric.label}</p>
                    <p className="text-lg font-bold text-slate-900">{metric.value}</p>
                    <p className={`text-xs font-medium mt-1 flex items-center justify-center gap-0.5 ${metric.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                      {metric.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {metric.change}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                دسترسی سریع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'ویرایش اطلاعات', icon: Edit, color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
                  { label: 'مدیریت شعب', icon: MapPin, color: 'bg-teal-50 text-teal-700 hover:bg-teal-100' },
                  { label: 'گزارش‌ها', icon: BarChart3, color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
                  { label: 'تنظیمات', icon: Settings, color: 'bg-slate-50 text-slate-700 hover:bg-slate-100' },
                ].map((action, ai) => (
                  <button
                    key={ai}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${action.color}`}
                  >
                    <action.icon className="w-6 h-6" />
                    <span className="text-xs font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  };

  // ═══════════════════════════════════════════════════════════
  //  Render: Create Organization Dialog
  // ═══════════════════════════════════════════════════════════
  const renderCreateOrgDialog = () => (
    <Dialog open={createOrgDialogOpen} onOpenChange={setCreateOrgDialogOpen}>
      <DialogContent className="max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-emerald-600" />
            </div>
            ایجاد سازمان جدید
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>نام سازمان</Label>
            <Input
              placeholder="نام سازمان را وارد کنید"
              value={orgFormName}
              onChange={(e) => setOrgFormName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>صنعت</Label>
              <Select value={orgFormIndustry} onValueChange={setOrgFormIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب صنعت" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>طرح اشتراک</Label>
              <Select value={orgFormPlan} onValueChange={(v) => setOrgFormPlan(v as Organization['plan'])}>
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب طرح" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">پایه (Starter)</SelectItem>
                  <SelectItem value="professional">حرفه‌ای (Professional)</SelectItem>
                  <SelectItem value="enterprise">سازمانی (Enterprise)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>تعداد کارکنان</Label>
            <Input
              type="number"
              placeholder="تعداد تقریبی کارکنان"
              value={orgFormEmployeeCount}
              onChange={(e) => setOrgFormEmployeeCount(e.target.value)}
            />
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">شعبه اولیه (اختیاری)</p>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>نام شعبه</Label>
                <Input
                  placeholder="شعبه مرکزی"
                  value={orgFormBranchName}
                  onChange={(e) => setOrgFormBranchName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>منطقه</Label>
                  <Select value={orgFormBranchRegion} onValueChange={setOrgFormBranchRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب منطقه" />
                    </SelectTrigger>
                    <SelectContent>
                      {REGION_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>مدیر شعبه</Label>
                  <Input
                    placeholder="نام مدیر"
                    value={orgFormBranchManager}
                    onChange={(e) => setOrgFormBranchManager(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => { setCreateOrgDialogOpen(false); resetOrgForm(); }}>
              انصراف
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 gap-2"
              onClick={handleCreateOrg}
              disabled={!orgFormName.trim() || !orgFormIndustry}
            >
              <Check className="w-4 h-4" />
              ایجاد سازمان
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // ═══════════════════════════════════════════════════════════
  //  Render: Create Branch Dialog
  // ═══════════════════════════════════════════════════════════
  const renderCreateBranchDialog = () => (
    <Dialog open={createBranchDialogOpen} onOpenChange={setCreateBranchDialogOpen}>
      <DialogContent className="max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-teal-600" />
            </div>
            ایجاد شعبه جدید
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>سازمان</Label>
            <Select value={branchFormOrgId} onValueChange={setBranchFormOrgId}>
              <SelectTrigger>
                <SelectValue placeholder="انتخاب سازمان" />
              </SelectTrigger>
              <SelectContent>
                {orgs.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>نام شعبه</Label>
            <Input
              placeholder="نام شعبه را وارد کنید"
              value={branchFormName}
              onChange={(e) => setBranchFormName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>منطقه</Label>
              <Select value={branchFormRegion} onValueChange={setBranchFormRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب منطقه" />
                </SelectTrigger>
                <SelectContent>
                  {REGION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>مدیر شعبه</Label>
              <Input
                placeholder="نام مدیر"
                value={branchFormManager}
                onChange={(e) => setBranchFormManager(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>تعداد کارکنان</Label>
            <Input
              type="number"
              placeholder="تعداد تقریبی کارکنان"
              value={branchFormEmployeeCount}
              onChange={(e) => setBranchFormEmployeeCount(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => { setCreateBranchDialogOpen(false); resetBranchForm(); }}>
              انصراف
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700 gap-2"
              onClick={handleCreateBranch}
              disabled={!branchFormName.trim() || !branchFormOrgId}
            >
              <Check className="w-4 h-4" />
              ایجاد شعبه
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // ═══════════════════════════════════════════════════════════
  //  Main Render
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="space-y-6" dir="rtl">
      {/* ── Header Section ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900">مدیریت سازمان و شعب</h2>
                <Badge className="bg-emerald-100 text-emerald-700 text-xs border border-emerald-300">
                  فاز ۳ - Multi-Tenant
                </Badge>
              </div>
              <p className="text-slate-500 mt-0.5">مدیریت چندسازمانی، شعب و طرح‌های اشتراک در پلتفرم BCGSP</p>
            </div>
          </div>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 gap-2 shadow-md shadow-emerald-100"
            onClick={() => setCreateOrgDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
            ایجاد سازمان
          </Button>
        </div>
      </motion.div>

      {/* ── Stats Row ───────────────────────────────────────── */}
      {renderStats()}

      {/* ── Detail View or Tabs ─────────────────────────────── */}
      {detailViewOrgId ? (
        renderOrgDetail()
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100 p-1 h-auto">
            <TabsTrigger
              value="organizations"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white gap-1.5 px-4 py-2"
            >
              <Building2 className="w-4 h-4" />
              سازمان‌ها
            </TabsTrigger>
            <TabsTrigger
              value="branches"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white gap-1.5 px-4 py-2"
            >
              <MapPin className="w-4 h-4" />
              شعب
            </TabsTrigger>
            <TabsTrigger
              value="plans"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white gap-1.5 px-4 py-2"
            >
              <Crown className="w-4 h-4" />
              طرح‌ها و اشتراک
            </TabsTrigger>
          </TabsList>

          <TabsContent value="organizations">{renderOrganizationsTab()}</TabsContent>
          <TabsContent value="branches">{renderBranchesTab()}</TabsContent>
          <TabsContent value="plans">{renderPlansTab()}</TabsContent>
        </Tabs>
      )}

      {/* ── Dialogs ─────────────────────────────────────────── */}
      {renderCreateOrgDialog()}
      {renderCreateBranchDialog()}
    </div>
  );
}
