'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Map,
  CheckCircle2,
  Circle,
  Clock,
  Flag,
  TrendingUp,
  Target,
  Zap,
} from 'lucide-react';

interface Milestone {
  title: string;
  completed: boolean;
  dueDate: string;
}

interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  progress: number;
  startDate: string;
  endDate: string;
  milestones: Milestone[];
}

const mockPhases: RoadmapPhase[] = [
  {
    id: '1',
    title: 'فاز ۱: تثبیت و بهینه‌سازی',
    description: 'تثبیت فرآیندهای هسته‌ای و رفع نقاط ضعف بحرانی',
    status: 'completed',
    progress: 100,
    startDate: 'مهر ۱۴۰۴',
    endDate: 'آذر ۱۴۰۴',
    milestones: [
      { title: 'بهینه‌سازی فرآیند فروش', completed: true, dueDate: 'مهر ۱۴۰۴' },
      { title: 'ایجاد ذخیره اضطراری مالی', completed: true, dueDate: 'آبان ۱۴۰۴' },
      { title: 'پیاده‌سازی CRM', completed: true, dueDate: 'آذر ۱۴۰۴' },
      { title: 'تدوین مدل درآمدی جدید', completed: true, dueDate: 'آذر ۱۴۰۴' },
    ],
  },
  {
    id: '2',
    title: 'فاز ۲: رشد و مقیاس‌پذیری',
    description: 'توسعه بازار و افزایش مقیاس با بهره‌وری عملیاتی',
    status: 'in_progress',
    progress: 45,
    startDate: 'دی ۱۴۰۴',
    endDate: 'خرداد ۱۴۰۵',
    milestones: [
      { title: 'راه‌اندازی بازاریابی دیجیتال', completed: true, dueDate: 'دی ۱۴۰۴' },
      { title: 'تنوع‌بخشی جریان درآمدی', completed: false, dueDate: 'بهمن ۱۴۰۴' },
      { title: 'توسعه تیم مدیریت', completed: false, dueDate: 'اسفند ۱۴۰۴' },
      { title: 'ورود به بازار جدید', completed: false, dueDate: 'خرداد ۱۴۰۵' },
    ],
  },
  {
    id: '3',
    title: 'فاز ۳: رهبری و نوآوری',
    description: 'ایجاد مزیت رقابتی پایدار و آمادگی برای جذب سرمایه',
    status: 'upcoming',
    progress: 0,
    startDate: 'تیر ۱۴۰۵',
    endDate: 'آذر ۱۴۰۵',
    milestones: [
      { title: 'ایجاد مزیت رقابتی داده‌محور', completed: false, dueDate: 'تیر ۱۴۰۵' },
      { title: 'توسعه پلتفرم/اثر شبکه‌ای', completed: false, dueDate: 'شهریور ۱۴۰۵' },
      { title: 'آمادگی برای جذب سرمایه Series A', completed: false, dueDate: 'آذر ۱۴۰۵' },
      { title: 'بین‌المللی‌سازی', completed: false, dueDate: 'آذر ۱۴۰۵' },
    ],
  },
];

const statusConfig = {
  completed: { label: 'تکمیل شده', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  in_progress: { label: 'در حال اجرا', color: 'bg-teal-100 text-teal-700', icon: Clock },
  upcoming: { label: 'آینده', color: 'bg-slate-100 text-slate-600', icon: Circle },
};

export default function RoadmapView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">نقشه راه رشد استراتژیک</h2>
            <p className="text-slate-500 mt-1">برنامه سه‌فازی رشد کسب‌وکار شما</p>
          </div>
          <Badge className="bg-teal-100 text-teal-700">
            <Map className="w-4 h-4 ms-1" />
            نقشه راه
          </Badge>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute start-6 top-0 bottom-0 w-0.5 bg-slate-200 hidden sm:block" />

        <div className="space-y-6">
          {mockPhases.map((phase, index) => {
            const config = statusConfig[phase.status];
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="hidden sm:flex absolute start-4 top-6 w-5 h-5 rounded-full bg-white border-2 items-center justify-center z-10"
                  style={{
                    borderColor: phase.status === 'completed' ? '#059669' : phase.status === 'in_progress' ? '#14b8a6' : '#cbd5e1',
                  }}
                >
                  <StatusIcon className="w-3 h-3" style={{
                    color: phase.status === 'completed' ? '#059669' : phase.status === 'in_progress' ? '#14b8a6' : '#cbd5e1',
                  }} />
                </div>

                <Card className={`sm:ms-14 ${
                  phase.status === 'in_progress'
                    ? 'border-teal-300 shadow-md'
                    : phase.status === 'completed'
                    ? 'border-emerald-200'
                    : 'border-slate-200'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{phase.title}</CardTitle>
                        <Badge className={`text-xs ${config.color}`}>
                          {config.label}
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-500">{phase.startDate} — {phase.endDate}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{phase.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-slate-500">پیشرفت کلی فاز</span>
                        <span className="text-xs font-bold text-slate-700">{phase.progress}%</span>
                      </div>
                      <Progress value={phase.progress} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      {phase.milestones.map((milestone, mi) => (
                        <div
                          key={mi}
                          className={`flex items-center gap-3 p-2 rounded-lg ${
                            milestone.completed
                              ? 'bg-emerald-50'
                              : phase.status === 'in_progress'
                              ? 'bg-slate-50'
                              : 'bg-slate-50/50'
                          }`}
                        >
                          {milestone.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                          )}
                          <span
                            className={`text-sm flex-1 ${
                              milestone.completed
                                ? 'text-emerald-700 line-through'
                                : 'text-slate-600'
                            }`}
                          >
                            {milestone.title}
                          </span>
                          <span className="text-xs text-slate-400">{milestone.dueDate}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Flag, label: 'نقاط عطف', value: '۱۲', color: 'emerald' },
          { icon: TrendingUp, label: 'فاز فعال', value: 'فاز ۲', color: 'teal' },
          { icon: Target, label: 'پیشرفت کلی', value: '۴۸%', color: 'emerald' },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                item.color === 'emerald' ? 'bg-emerald-100' : 'bg-teal-100'
              }`}>
                <item.icon className={`w-5 h-5 ${
                  item.color === 'emerald' ? 'text-emerald-600' : 'text-teal-600'
                }`} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="text-lg font-bold text-slate-900">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
