'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
  BarChart3,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DIMENSIONS } from '@/lib/diagnostic-questions';

const mockRevenueData = [
  { month: 'فروردین', revenue: 450, expense: 380 },
  { month: 'اردیبهشت', revenue: 520, expense: 400 },
  { month: 'خرداد', revenue: 480, expense: 390 },
  { month: 'تیر', revenue: 610, expense: 420 },
  { month: 'مرداد', revenue: 580, expense: 410 },
  { month: 'شهریور', revenue: 650, expense: 440 },
];

const financialMetrics = [
  { label: 'حاشیه سود ناخالص', value: '۳۵٪', trend: 'up', icon: TrendingUp },
  { label: 'نسبت جاری', value: '۱.۸', trend: 'up', icon: ArrowUpRight },
  { label: 'بدهی به حقوق صاحبان', value: '۰.۶', trend: 'down', icon: ArrowDownRight },
  { label: 'دوره وصول مطالبات', value: '۴۵ روز', trend: 'neutral', icon: Wallet },
];

const recommendations = [
  {
    title: 'کاهش دوره وصول مطالبات',
    description: 'با اعمال سیاست‌های پرداخت زودهنگام و تنبیهی، دوره وصول را به ۳۰ روز کاهش دهید',
    priority: 'high',
    impact: 'بهبود جریان نقدی ۱۵٪',
  },
  {
    title: 'ایجاد ذخیره اضطراری',
    description: 'حداقل ۶ ماه هزینه‌های عملیاتی را به عنوان ذخیره نگهداری کنید',
    priority: 'critical',
    impact: 'کاهش ریسک مالی ۴۰٪',
  },
  {
    title: 'بهینه‌سازی ساختار هزینه',
    description: 'بازبینی هزینه‌های ثابت و تبدیل به هزینه‌های متغیر در صورت امکان',
    priority: 'medium',
    impact: 'صرفه‌جویی ۱۰٪',
  },
];

export default function FinancialView() {
  const financialDim = DIMENSIONS.find((d) => d.key === 'financial_health');
  const mockScore = 50;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">استراتژی مالی</h2>
            <p className="text-slate-500 mt-1">تحلیل سلامت مالی و توصیه‌های بهبود</p>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700">
            <DollarSign className="w-4 h-4 ms-1" />
            سلامت مالی: {mockScore}/۱۰۰
          </Badge>
        </div>
      </motion.div>

      {/* Financial Score */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className={`border-2 ${mockScore >= 80 ? 'border-emerald-300' : mockScore >= 65 ? 'border-yellow-300' : mockScore >= 50 ? 'border-orange-300' : 'border-red-300'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <PiggyBank className="w-6 h-6 text-emerald-600" />
                امتیاز سلامت مالی
              </h3>
              <Badge className={mockScore >= 80 ? 'bg-emerald-100 text-emerald-700' : mockScore >= 65 ? 'bg-yellow-100 text-yellow-700' : mockScore >= 50 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}>
                {mockScore >= 80 ? 'عالی' : mockScore >= 65 ? 'متوسط' : mockScore >= 50 ? 'ضعیف' : 'بحرانی'}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold text-slate-900">{mockScore}</span>
              <span className="text-lg text-slate-400">/۱۰۰</span>
            </div>
            <Progress value={mockScore} className="h-3 mt-4" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {financialMetrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * (i + 2) }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <metric.icon className={`w-4 h-4 ${
                    metric.trend === 'up' ? 'text-emerald-500' :
                    metric.trend === 'down' ? 'text-red-500' : 'text-slate-400'
                  }`} />
                  <span className="text-xs text-slate-500">{metric.label}</span>
                </div>
                <p className="text-xl font-bold text-slate-900">{metric.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              روند درآمد و هزینه
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#059669" name="درآمد" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="#14b8a6" name="هزینه" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">توصیه‌های مالی</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.title} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`text-xs ${
                    rec.priority === 'critical' ? 'bg-red-100 text-red-700' :
                    rec.priority === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {rec.priority === 'critical' ? 'بحرانی' : rec.priority === 'high' ? 'مهم' : 'متوسط'}
                  </Badge>
                  <h4 className="font-medium text-slate-800">{rec.title}</h4>
                </div>
                <p className="text-sm text-slate-600 mb-2">{rec.description}</p>
                <div className="flex items-center gap-1 text-xs text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {rec.impact}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
