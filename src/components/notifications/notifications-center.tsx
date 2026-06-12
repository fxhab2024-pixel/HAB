'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAppStore, type NotificationItem } from '@/lib/store';
import {
  Bell,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  CheckCheck,
  BellOff,
  ShieldCheck,
  TrendingUp,
  Users,
  DollarSign,
  Workflow,
  Brain,
  Settings,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';

// Category labels
const categoryLabels: Record<string, string> = {
  all: 'همه',
  system: 'سیستم',
  strategy: 'استراتژی',
  crm: 'CRM',
  financial: 'مالی',
  workflow: 'گردشکار',
  ai: 'AI',
};

// Category icons
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  system: Settings,
  strategy: TrendingUp,
  crm: Users,
  financial: DollarSign,
  workflow: Workflow,
  ai: Brain,
};

// Notification type styling
const typeConfig: Record<string, {
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  textColor: string;
  dotColor: string;
}> = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    dotColor: 'bg-blue-500',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    dotColor: 'bg-yellow-500',
  },
  success: {
    icon: CheckCircle2,
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    dotColor: 'bg-emerald-500',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    dotColor: 'bg-red-500',
  },
  reminder: {
    icon: Clock,
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    dotColor: 'bg-purple-500',
  },
};

// Mock notification data (15+ realistic notifications in Persian)
const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'success',
    category: 'strategy',
    title: 'تشخیص استراتژیک تکمیل شد',
    message: 'تشخیص استراتژیک شرکت شما با موفقیت تکمیل شد. امتیاز کل: ۷۲ از ۱۰۰. نتایج آماده بررسی هستند.',
    isRead: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    link: 'results',
  },
  {
    id: 'notif-2',
    type: 'info',
    category: 'ai',
    title: 'پیشنهاد جدید عامل هوشمند',
    message: 'عامل تحلیلگر استراتژیک یک فرصت رشد جدید در بازارهای مجاور شناسایی کرده است.',
    isRead: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    link: 'ai-agents',
  },
  {
    id: 'notif-3',
    type: 'warning',
    category: 'financial',
    title: 'هشدار جریان نقدینگی',
    message: 'پیش‌بینی جریان نقدینکی نشان‌دهنده کاهش ۲۰٪ در ماه آینده است. لطفاً برنامه تأمین مالی را بررسی کنید.',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-4',
    type: 'success',
    category: 'crm',
    title: 'معامله جدید ثبت شد',
    message: 'معامله «مشاوره استراتژیک» با شرکت فناوری نوین به مبلغ ۴۵۰ میلیون ریال در مرحله مذاکره قرار گرفت.',
    isRead: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    link: 'crm',
  },
  {
    id: 'notif-5',
    type: 'reminder',
    category: 'workflow',
    title: 'سررسید وظیفه',
    message: 'وظیفه «تهیه گزارش سه ماهه» فردا سررسید می‌شود. لطفاً اقدامات لازم را انجام دهید.',
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-6',
    type: 'error',
    category: 'system',
    title: 'خطا در همگام‌سازی داده‌ها',
    message: 'همگام‌سازی داده‌های مالی با بانک با خطا مواجه شد. لطفاً اتصال را بررسی و مجدداً تلاش کنید.',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-7',
    type: 'info',
    category: 'strategy',
    title: 'بروزرسانی توصیه‌های استراتژیک',
    message: 'بر اساس تغییرات جدید بازار، ۳ توصیه استراتژیک جدید تولید شده است. بررسی کنید.',
    isRead: true,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    link: 'strategy',
  },
  {
    id: 'notif-8',
    type: 'success',
    category: 'financial',
    title: 'پرداخت فاکتور تأیید شد',
    message: 'فاکتور شماره INV-1402 با مبلغ ۱۲۰ میلیون ریال با موفقیت پرداخت و ثبت شد.',
    isRead: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-9',
    type: 'warning',
    category: 'crm',
    title: 'پیگیری مشتری متأخر',
    message: 'مشتری «شرکت آینده‌نگر» بیش از ۲ هفته است که پیگیری نشده. لطفاً اقدام کنید.',
    isRead: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'crm',
  },
  {
    id: 'notif-10',
    type: 'info',
    category: 'ai',
    title: 'مدل AI بروزرسانی شد',
    message: 'مدل تحلیلگر بازار با داده‌های جدید صنعت بروزرسانی شد. دقت پیش‌بینی به ۸۷٪ افزایش یافته.',
    isRead: true,
    createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-11',
    type: 'reminder',
    category: 'strategy',
    title: 'بازنگری فصلی استراتژی',
    message: 'زمان بازنگری فصلی استراتژی فرا رسیده است. لطفاً جلسه تیم استراتژی را برنامه‌ریزی کنید.',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-12',
    type: 'success',
    category: 'workflow',
    title: 'فرآیند تأیید شد',
    message: 'فرآیند «تأیید بودجه سالانه» با موفقیت تکمیل و توسط مدیرعامل تأیید شد.',
    isRead: true,
    createdAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-13',
    type: 'error',
    category: 'financial',
    title: 'خطای حسابداری',
    message: 'تضاد در ثبت اسناد مالی ماه بهمن شناسایی شد. مبلغ: ۲۸ میلیون ریال. بررسی اوراق لازم است.',
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-14',
    type: 'info',
    category: 'system',
    title: 'بروزرسانی سیستم',
    message: 'نسخه جدید پلتفرم BCGSP (v2.4) منتشر شد. امکانات جدید شامل داشبورد BI و پورتال مدیرعامل است.',
    isRead: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-15',
    type: 'warning',
    category: 'system',
    title: 'پشتیبان‌گیری لازم است',
    message: 'آخرین پشتیبان‌گیری بیش از ۷ روز پیش انجام شده. لطفاً پشتیبان‌گیری از داده‌ها را انجام دهید.',
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-16',
    type: 'success',
    category: 'ai',
    title: 'گزارش AI تولید شد',
    message: 'عامل گزارش‌ساز یک گزارش تحلیل شکاف استراتژیک تولید کرده است. گزارش آماده دانلود است.',
    isRead: true,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'ai-agents',
  },
  {
    id: 'notif-17',
    type: 'info',
    category: 'workflow',
    title: 'وظیفه جدید محول شد',
    message: 'وظیفه «تحلیل رقابتی صنعت فناوری» به شما محول شده است. مهلت: ۱ هفته.',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

// Time ago formatter
function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'همین الان';
  if (diffMinutes < 60) return `${diffMinutes} دقیقه پیش`;
  if (diffHours < 24) return `${diffHours} ساعت پیش`;
  if (diffDays < 7) return `${diffDays} روز پیش`;
  return `${Math.floor(diffDays / 7)} هفته پیش`;
}

export default function NotificationsCenter() {
  const {
    notifications,
    setNotifications,
    markNotificationRead,
    unreadNotificationCount,
    setView,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('all');
  const [localNotifications, setLocalNotifications] = useState<NotificationItem[]>([]);

  // Initialize with mock data if store is empty
  useEffect(() => {
    if (notifications.length === 0) {
      setNotifications(mockNotifications);
      setLocalNotifications(mockNotifications);
    } else {
      setLocalNotifications(notifications);
    }
  }, [notifications, setNotifications]);

  // Sync local state with store
  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  // Filter notifications by category
  const filteredNotifications = useMemo(() => {
    if (activeTab === 'all') return localNotifications;
    return localNotifications.filter((n) => n.category === activeTab);
  }, [localNotifications, activeTab]);

  // Category unread counts
  const categoryUnreadCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    localNotifications.forEach((n) => {
      if (!n.isRead) {
        counts.all++;
        counts[n.category] = (counts[n.category] || 0) + 1;
      }
    });
    return counts;
  }, [localNotifications]);

  const handleMarkAllRead = () => {
    localNotifications.forEach((n) => {
      if (!n.isRead) {
        markNotificationRead(n.id);
      }
    });
    toast.success('همه اعلان‌ها خوانده شد');
  };

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
  };

  const handleDelete = (id: string) => {
    const updated = localNotifications.filter((n) => n.id !== id);
    setNotifications(updated);
    toast.success('اعلان حذف شد');
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    if (!notif.isRead) {
      markNotificationRead(notif.id);
    }
    if (notif.link) {
      setView(notif.link as any);
    }
  };

  return (
    <div className="space-y-4 h-[calc(100vh-10rem)] flex flex-col">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">مرکز اعلان‌ها</h2>
              <p className="text-slate-500 mt-0.5 text-sm">
                {unreadNotificationCount > 0
                  ? `${unreadNotificationCount} اعلان خوانده‌نشده`
                  : 'همه اعلان‌ها خوانده شده‌اند'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadNotificationCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5 hover:bg-emerald-50 hover:border-emerald-300"
                onClick={handleMarkAllRead}
              >
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                خواندن همه
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tabs & Content */}
      <Card className="flex-1 flex flex-col min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          {/* Category Tabs */}
          <div className="border-b px-4 pt-3">
            <TabsList className="bg-slate-100 h-auto p-1 flex-wrap gap-0.5">
              {Object.entries(categoryLabels).map(([key, label]) => {
                const count = categoryUnreadCounts[key] || 0;
                return (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm gap-1 px-2.5 py-1.5"
                  >
                    {label}
                    {count > 0 && (
                      <Badge className="bg-emerald-500 text-white text-[9px] min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                        {count}
                      </Badge>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Tab Content - same structure for all tabs */}
          {Object.keys(categoryLabels).map((key) => (
            <TabsContent key={key} value={key} className="flex-1 min-h-0 m-0">
              <ScrollArea className="h-full max-h-[calc(100vh-18rem)]">
                {filteredNotifications.length === 0 ? (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                      <BellOff className="w-8 h-8 text-slate-400" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-base font-bold text-slate-600 mb-1">اعلانی یافت نشد</h3>
                      <p className="text-sm text-slate-400">
                        {activeTab === 'all'
                          ? 'در حال حاضر اعلان جدیدی وجود ندارد'
                          : `اعلانی در دسته «${categoryLabels[activeTab]}» وجود ندارد`}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    <AnimatePresence mode="popLayout">
                      {filteredNotifications.map((notif, index) => {
                        const config = typeConfig[notif.type];
                        const TypeIcon = config.icon;
                        const CategoryIcon = categoryIcons[notif.category] || Bell;

                        return (
                          <motion.div
                            key={notif.id}
                            layout
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, x: -50, height: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.02 }}
                            className={`group relative px-4 py-3.5 transition-colors cursor-pointer ${
                              notif.isRead
                                ? 'bg-white hover:bg-slate-50'
                                : `${config.bgColor} hover:bg-slate-100`
                            }`}
                            onClick={() => handleNotificationClick(notif)}
                          >
                            <div className="flex items-start gap-3">
                              {/* Type Icon */}
                              <div
                                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${config.bgColor}`}
                              >
                                <TypeIcon className={`w-4.5 h-4.5 ${config.textColor}`} />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  {/* Unread dot */}
                                  {!notif.isRead && (
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${config.dotColor}`} />
                                  )}
                                  <h4
                                    className={`text-sm truncate ${
                                      notif.isRead
                                        ? 'font-medium text-slate-700'
                                        : 'font-bold text-slate-900'
                                    }`}
                                  >
                                    {notif.title}
                                  </h4>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                  {notif.message}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="text-[11px] text-slate-400">
                                    {timeAgo(notif.createdAt)}
                                  </span>
                                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                                    <CategoryIcon className="w-3 h-3" />
                                    {categoryLabels[notif.category]}
                                  </span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!notif.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMarkRead(notif.id);
                                    }}
                                    title="خوانده شد"
                                  >
                                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(notif.id);
                                  }}
                                  title="حذف"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}
