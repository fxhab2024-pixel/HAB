'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ShieldCheck,
  CheckCircle2,
  Circle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  FileCheck,
  Target,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const mockScore = 48;

const checklist = [
  { title: 'صورتهای مالی حسابرسی‌شده (۳ سال اخیر)', completed: true, critical: true },
  { title: 'مدل مالی پیش‌بینی‌شده (۳ سال آینده)', completed: false, critical: true },
  { title: 'ارائه ارزش‌گذاری شرکت', completed: false, critical: true },
  { title: 'تیم مدیریت کامل و شفاف', completed: false, critical: true },
  { title: 'قراردادهای کلیدی مستند', completed: true, critical: false },
  { title: 'حفاظت از مالکیت فکری', completed: false, critical: false },
  { title: 'پروپوزال سرمایه‌گذاری (Pitch Deck)', completed: false, critical: true },
  { title: 'شناخت بازار و رقبا', completed: true, critical: false },
  { title: 'استراتژی خروج سرمایه‌گذار', completed: false, critical: false },
  { title: 'راه‌حل انطباق قانونی', completed: true, critical: false },
  { title: 'شاخص‌های کلیدی عملکرد (KPIs)', completed: true, critical: false },
  { title: 'مشتریان مرجع و تاییدیه', completed: false, critical: false },
];

const recommendations = [
  {
    title: 'تهیه Pitch Deck حرفه‌ای',
    description: 'ارائه‌ای ۱۲-۱۵ اسلایدی که داستان کسب‌وکار، فرصت بازار و مدل مالی را شفاف بیان کند',
    effort: 'متوسط',
    impact: 'بالا',
  },
  {
    title: 'تکمیل مدل مالی پیش‌بینی',
    description: 'مدل مالی ۳ ساله با سناریوهای خوش‌بینانه، بدبینانه و واقع‌بینانه',
    effort: 'بالا',
    impact: 'بحرانی',
  },
  {
    title: 'استخدام CFO',
    description: 'جذب مدیر ارشد مالی برای تقویت شفافیت مالی و اعتماد سرمایه‌گذاران',
    effort: 'بالا',
    impact: 'بالا',
  },
];

export default function InvestmentReadiness() {
  const completedCount = checklist.filter((c) => c.completed).length;
  const totalCount = checklist.length;
  const criticalCompleted = checklist.filter((c) => c.critical && c.completed).length;
  const criticalTotal = checklist.filter((c) => c.critical).length;

  const data = [
    { name: 'completed', value: completedCount },
    { name: 'remaining', value: totalCount - completedCount },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">آمادگی سرمایه‌گذاری</h2>
            <p className="text-slate-500 mt-1">ارزیابی و بهبود آمادگی برای جذب سرمایه</p>
          </div>
          <Badge className={mockScore >= 80 ? 'bg-emerald-100 text-emerald-700' : mockScore >= 65 ? 'bg-yellow-100 text-yellow-700' : mockScore >= 50 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}>
            <ShieldCheck className="w-4 h-4 ms-1" />
            {mockScore}/۱۰۰
          </Badge>
        </div>
      </motion.div>

      {/* Main Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                امتیاز آمادگی سرمایه‌گذاری
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-6">
                <div className="relative" style={{ width: 200, height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={90}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell fill={mockScore >= 80 ? '#059669' : mockScore >= 65 ? '#eab308' : mockScore >= 50 ? '#f97316' : '#ef4444'} />
                        <Cell fill="#e2e8f0" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-slate-900">{mockScore}</span>
                    <span className="text-sm text-slate-500">از ۱۰۰</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">موارد تکمیل‌شده</p>
                  <p className="text-lg font-bold text-emerald-600">{completedCount}/{totalCount}</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">موارد بحرانی</p>
                  <p className="text-lg font-bold text-orange-600">{criticalCompleted}/{criticalTotal}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Checklist */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                چک‌لیست آمادگی
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[450px] overflow-y-auto">
              {checklist.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-2.5 rounded-lg ${
                    item.completed ? 'bg-emerald-50' : item.critical ? 'bg-red-50' : 'bg-slate-50'
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : item.critical ? (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                  )}
                  <span className={`text-sm flex-1 ${
                    item.completed ? 'text-emerald-700 line-through' : 'text-slate-700'
                  }`}>
                    {item.title}
                  </span>
                  {item.critical && !item.completed && (
                    <Badge className="bg-red-100 text-red-700 text-[10px] shrink-0">بحرانی</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recommendations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              توصیه‌های افزایش آمادگی
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.title} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
                  <h4 className="font-medium text-slate-800">{rec.title}</h4>
                  <Badge variant="outline" className="text-xs ms-auto">
                    تلاش: {rec.effort}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 mb-2">{rec.description}</p>
                <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                  اثر: {rec.impact}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
