'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore, type Task } from '@/lib/store';
import { toast } from 'sonner';
import {
  ListTodo,
  Circle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Plus,
  Filter,
} from 'lucide-react';

const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'استانداردسازی فرآیند فروش',
    description: 'تدوین مستندات فرآیند فروش و آموزش تیم',
    status: 'in_progress',
    priority: 'critical',
    dueDate: '۱۴۰۴/۱۰/۱۵',
    strategyId: 's2',
  },
  {
    id: 't2',
    title: 'راه‌اندازی CRM',
    description: 'انتخاب و پیاده‌سازی سیستم مدیریت ارتباط با مشتری',
    status: 'todo',
    priority: 'high',
    dueDate: '۱۴۰۴/۱۰/۳۰',
    strategyId: 's2',
  },
  {
    id: 't3',
    title: 'ایجاد ذخیره اضطراری مالی',
    description: 'انتقال ۱۰٪ درآمد ماهانه به حساب ذخیره',
    status: 'done',
    priority: 'critical',
    dueDate: '۱۴۰۴/۰۹/۳۰',
  },
  {
    id: 't4',
    title: 'تدوین استراتژی بازاریابی دیجیتال',
    description: 'برنامه ۳ ماهه بازاریابی دیجیتال با KPI مشخص',
    status: 'todo',
    priority: 'high',
    dueDate: '۱۴۰۴/۱۱/۱۵',
    strategyId: 's3',
  },
  {
    id: 't5',
    title: 'جذب مدیر ارشد مالی (CFO)',
    description: 'تعریف شرح وظایف و شروع فرآیند جذب',
    status: 'blocked',
    priority: 'medium',
    dueDate: '۱۴۰۴/۱۲/۰۱',
    strategyId: 's5',
  },
  {
    id: 't6',
    title: 'تنوع‌بخشی جریان درآمدی',
    description: 'شناسایی و ارزیابی ۳ فرصت درآمدی جدید',
    status: 'todo',
    priority: 'high',
    dueDate: '۱۴۰۴/۱۱/۳۰',
    strategyId: 's1',
  },
  {
    id: 't7',
    title: 'بررسی مدل درآمدی اشتراکی',
    description: 'امکان‌سنجی تبدیل بخشی از خدمات به مدل SaaS',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '۱۴۰۴/۱۱/۱۵',
  },
  {
    id: 't8',
    title: 'پایگاه دانش مشتریان',
    description: 'جمع‌آوری و تحلیل داده‌های مشتریان برای شخصی‌سازی',
    status: 'todo',
    priority: 'low',
    dueDate: '۱۴۰۵/۰۱/۱۵',
  },
];

const columns: { key: Task['status']; title: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { key: 'todo', title: 'انجام نشده', icon: Circle, color: 'bg-slate-100' },
  { key: 'in_progress', title: 'در حال انجام', icon: Clock, color: 'bg-teal-50' },
  { key: 'done', title: 'تکمیل شده', icon: CheckCircle2, color: 'bg-emerald-50' },
  { key: 'blocked', title: 'مسدود شده', icon: XCircle, color: 'bg-red-50' },
];

const priorityConfig = {
  critical: { label: 'بحرانی', color: 'bg-red-100 text-red-700' },
  high: { label: 'بالا', color: 'bg-orange-100 text-orange-700' },
  medium: { label: 'متوسط', color: 'bg-yellow-100 text-yellow-700' },
  low: { label: 'پایین', color: 'bg-slate-100 text-slate-600' },
};

export default function ExecutionTracker() {
  const { tasks, setTasks } = useAppStore();
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks.length > 0 ? tasks : mockTasks);

  const moveTask = (taskId: string, newStatus: Task['status']) => {
    const updated = localTasks.map((t) =>
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    setLocalTasks(updated);
    setTasks(updated);
    toast.success('وضعیت وظیفه بروزرسانی شد');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">ردیابی اجرای استراتژی</h2>
            <p className="text-slate-500 mt-1">مدیریت وظایف و پیگیری اجرای استراتژی‌ها</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            وظیفه جدید
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {columns.map((col) => {
          const count = localTasks.filter((t) => t.status === col.key).length;
          return (
            <Card key={col.key}>
              <CardContent className="p-3 flex items-center gap-3">
                <col.icon className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">{col.title}</p>
                  <p className="text-lg font-bold text-slate-900">{count}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const columnTasks = localTasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="space-y-3">
              <div className={`flex items-center gap-2 p-2 rounded-lg ${col.color}`}>
                <col.icon className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">{col.title}</span>
                <Badge variant="secondary" className="text-xs ms-auto">
                  {columnTasks.length}
                </Badge>
              </div>

              <div className="space-y-3 min-h-[200px]">
                {columnTasks.map((task) => {
                  const pConfig = priorityConfig[task.priority];
                  return (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="text-sm font-medium text-slate-800 leading-snug">
                              {task.title}
                            </h4>
                            <Badge className={`text-[10px] shrink-0 ${pConfig.color}`}>
                              {pConfig.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                            {task.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-400">
                              مهلت: {task.dueDate}
                            </span>
                            <div className="flex gap-1">
                              {col.key !== 'todo' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => {
                                    const order: Task['status'][] = ['todo', 'in_progress', 'done', 'blocked'];
                                    const currentIdx = order.indexOf(col.key);
                                    if (currentIdx > 0) moveTask(task.id, order[currentIdx - 1]);
                                  }}
                                >
                                  <ArrowRight className="w-3 h-3" />
                                </Button>
                              )}
                              {col.key !== 'done' && col.key !== 'blocked' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => {
                                    const nextMap: Record<string, Task['status']> = {
                                      todo: 'in_progress',
                                      in_progress: 'done',
                                    };
                                    moveTask(task.id, nextMap[task.status] || 'done');
                                  }}
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
