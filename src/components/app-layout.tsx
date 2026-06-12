'use client';

import { useState } from 'react';
import { useAppStore, type ViewType } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  ClipboardCheck,
  BarChart3,
  Lightbulb,
  Map,
  MessageSquare,
  ListTodo,
  Briefcase,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  GitCompare,
  BookOpen,
  FileText,
  Settings,
  User,
  LogOut,
  Menu,
  Sparkles,
  ChevronLeft,
  Target,
  Bell,
  Users,
  Brain,
  Workflow,
  Crown,
  Headphones,
  Building2,
  Receipt,
  CreditCard,
  PiggyBank,
  BarChart2,
  Zap,
  Database,
  Plug,
  Shield,
} from 'lucide-react';

interface NavItem {
  key: ViewType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group?: string;
  badge?: string;
  roles?: string[]; // if specified, only show for these roles
}

const navItems: NavItem[] = [
  // اصلی
  { key: 'dashboard', label: 'داشبورد', icon: LayoutDashboard, group: 'اصلی' },
  { key: 'bi-dashboard', label: 'هوش تجاری (BI)', icon: BarChart2, group: 'اصلی' },
  { key: 'diagnostic', label: 'تشخیص استراتژیک', icon: ClipboardCheck, group: 'اصلی' },
  { key: 'results', label: 'نتایج تشخیص', icon: BarChart3, group: 'اصلی' },

  // استراتژی
  { key: 'strategy', label: 'توصیه‌های استراتژیک', icon: Lightbulb, group: 'استراتژی' },
  { key: 'analysis', label: 'تحلیل استراتژیک', icon: Target, group: 'استراتژی' },
  { key: 'roadmap', label: 'نقشه راه رشد', icon: Map, group: 'استراتژی' },
  { key: 'bpm', label: 'گردش کار (BPM)', icon: Workflow, group: 'استراتژی' },

  // هوش مصنوعی
  { key: 'advisor', label: 'مشاور هوشمند', icon: MessageSquare, group: 'هوش مصنوعی' },
  { key: 'ai-agents', label: 'Agent‌های تخصصی', icon: Brain, group: 'هوش مصنوعی', badge: 'جدید' },
  { key: 'ai-predictor', label: 'موتور پیش‌بینی', icon: Sparkles, group: 'هوش مصنوعی', badge: 'فاز ۳' },

  // اجرا
  { key: 'execution', label: 'ردیابی اجرا', icon: ListTodo, group: 'اجرا' },

  // CRM
  { key: 'crm', label: 'مدیریت مشتریان (CRM)', icon: Users, group: 'CRM', badge: 'جدید' },

  // مالی
  { key: 'financial', label: 'استراتژی مالی', icon: DollarSign, group: 'مالی' },
  { key: 'invoices', label: 'فاکتورها', icon: Receipt, group: 'مالی' },
  { key: 'expenses', label: 'هزینه‌ها', icon: CreditCard, group: 'مالی' },
  { key: 'budgets', label: 'بودجه‌بندی', icon: PiggyBank, group: 'مالی' },
  { key: 'investment', label: 'آمادگی سرمایه‌گذاری', icon: ShieldCheck, group: 'مالی' },

  // تحلیل
  { key: 'benchmark', label: 'مقایسه صنعتی', icon: GitCompare, group: 'تحلیل' },
  { key: 'knowledge', label: 'پایگاه دانش', icon: BookOpen, group: 'تحلیل' },
  { key: 'reports', label: 'گزارش‌ها', icon: FileText, group: 'تحلیل' },

  // اتوماسیون
  { key: 'automation', label: 'موتور اتوماسیون', icon: Zap, group: 'اتوماسیون', badge: 'فاز ۲' },

  // چندسازمانی
  { key: 'organizations', label: 'مدیریت سازمان و شعب', icon: Building2, group: 'چندسازمانی', badge: 'فاز ۳' },

  // گزارش‌ساز
  { key: 'report-generator', label: 'گزارش‌ساز حرفه‌ای', icon: FileText, group: 'گزارش‌ساز', badge: 'فاز ۳' },

  // یکپارچگی
  { key: 'integration-hub', label: 'مرکز یکپارچگی', icon: Plug, group: 'یکپارچگی', badge: 'فاز ۳' },

  // امنیت
  { key: 'security-center', label: 'مرکز امنیت', icon: Shield, group: 'امنیت', badge: 'فاز ۳' },

  // داده
  { key: 'data-center', label: 'مرکز داده', icon: Database, group: 'داده', badge: 'فاز ۳' },

  // تنظیمات
  { key: 'profile', label: 'پروفایل شرکت', icon: Briefcase, group: 'تنظیمات' },
  { key: 'settings', label: 'تنظیمات', icon: Settings, group: 'تنظیمات' },
];

const portalItems: NavItem[] = [
  { key: 'portal-ceo', label: 'پورتال مدیرعامل', icon: Crown, group: 'پورتال‌ها', roles: ['admin', 'ceo'] },
  { key: 'portal-consultant', label: 'پورتال مشاور', icon: Headphones, group: 'پورتال‌ها', roles: ['admin', 'consultant'] },
  { key: 'portal-sme', label: 'پورتال SME', icon: Building2, group: 'پورتال‌ها', roles: ['admin', 'sme'] },
];

const adminItems: NavItem[] = [
  { key: 'admin', label: 'پنل مدیریت', icon: TrendingUp, group: 'مدیریت' },
  { key: 'admin-advanced', label: 'پنل مدیریت پیشرفته', icon: Shield, group: 'مدیریت' },
];

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const { currentView, setView, user, logout, sidebarOpen, setSidebarOpen, unreadNotificationCount } = useAppStore();

  const handleNavClick = (key: ViewType) => {
    setView(key);
    onItemClick?.();
  };

  // Build groups with role-based filtering
  const allItems = [...navItems];

  // Add portal items based on role
  if (user?.role && ['admin', 'ceo', 'consultant', 'sme'].includes(user.role)) {
    const filteredPortals = portalItems.filter(
      (item) => !item.roles || item.roles.includes(user.role)
    );
    if (filteredPortals.length > 0) {
      allItems.push(...filteredPortals);
    }
  }

  // Add admin items
  if (user?.role === 'admin') {
    allItems.push(...adminItems);
  }

  const groups = allItems.reduce<Record<string, NavItem[]>>((acc, item) => {
    const group = item.group || 'سایر';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  const roleLabels: Record<string, string> = {
    sme: 'صاحب کسب‌وکار',
    consultant: 'مشاور',
    admin: 'مدیر سیستم',
    ceo: 'مدیرعامل',
    analyst: 'تحلیلگر',
    branch_manager: 'مدیر شعبه',
    investor: 'سرمایه‌گذار',
  };

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-sidebar-primary-foreground">BCGSP</h1>
            <p className="text-[10px] text-sidebar-foreground/60">Enterprise Platform</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <ChevronLeft className={`h-4 w-4 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
        </Button>
      </div>
      <Separator className="bg-sidebar-border" />

      {/* Nav */}
      <ScrollArea className="flex-1 px-3 py-2">
        {Object.entries(groups).map(([groupName, items]) => (
          <div key={groupName} className="mb-4">
            <p className="text-[11px] font-medium text-sidebar-foreground/40 px-2 mb-1.5 uppercase tracking-wider">
              {groupName}
            </p>
            {items.map((item) => {
              const isActive = currentView === item.key;
              return (
                <Button
                  key={item.key}
                  variant="ghost"
                  onClick={() => handleNavClick(item.key)}
                  className={`w-full justify-start gap-3 h-9 px-2 mb-0.5 text-sm font-medium transition-all
                    ${
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 shadow-sm'
                        : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                    }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {sidebarOpen !== false && (
                    <span className="flex-1 text-start">{item.label}</span>
                  )}
                  {item.badge && sidebarOpen !== false && (
                    <Badge className="bg-emerald-500 text-white text-[9px] px-1.5 py-0 h-4">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        ))}
      </ScrollArea>

      {/* User */}
      <Separator className="bg-sidebar-border" />
      <div className="p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-emerald-600 text-white text-xs">
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.name || 'کاربر'}
            </p>
            <p className="text-[11px] text-sidebar-foreground/50 truncate">
              {roleLabels[user?.role || 'sme'] || 'کاربر'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground/50 hover:text-red-400 hover:bg-sidebar-accent h-8 w-8"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen, unreadNotificationCount, setView } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-e border-border bg-sidebar transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-[70px]'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="p-0 w-64 border-0">
          <SidebarContent onItemClick={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-14 border-b bg-white/80 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {/* Notifications Bell */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setView('notifications')}
            >
              <Bell className="h-5 w-5 text-slate-600" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-0.5 -end-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="sm" className="text-sm text-slate-600" onClick={() => setView('profile')}>
              <User className="h-4 w-4 ms-1.5" />
              پروفایل
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
