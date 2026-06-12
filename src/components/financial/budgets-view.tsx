'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  PiggyBank,
  Plus,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Target,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

// Types
interface BudgetCategory {
  name: string;
  budgeted: number;
  actual: number;
}

interface Budget {
  id: string;
  name: string;
  period: string;
  totalBudget: number;
  spent: number;
  remaining: number;
  categories: BudgetCategory[];
}

// Mock Data
const mockBudgets: Budget[] = [
  {
    id: 'b1',
    name: 'بودجه عملیاتی Q2',
    period: 'فروردین - خرداد ۱۴۰۴',
    totalBudget: 500000000,
    spent: 380000000,
    remaining: 120000000,
    categories: [
      { name: 'حقوق و دستمزد', budgeted: 200000000, actual: 195000000 },
      { name: 'اجاره و تأسیسات', budgeted: 80000000, actual: 75000000 },
      { name: 'بازاریابی', budgeted: 60000000, actual: 55000000 },
      { name: 'نرم‌افزار و فناوری', budgeted: 40000000, actual: 30000000 },
      { name: 'سفر و مأموریت', budgeted: 30000000, actual: 15000000 },
      { name: 'متفرقه', budgeted: 90000000, actual: 10000000 },
    ],
  },
  {
    id: 'b2',
    name: 'بودجه بازاریابی ۱۴۰۴',
    period: 'فروردین - اسفند ۱۴۰۴',
    totalBudget: 360000000,
    spent: 150000000,
    remaining: 210000000,
    categories: [
      { name: 'تبلیغات دیجیتال', budgeted: 120000000, actual: 65000000 },
      { name: 'رویدادها و نمایشگاه‌ها', budgeted: 80000000, actual: 40000000 },
      { name: 'تولید محتوا', budgeted: 60000000, actual: 25000000 },
      { name: 'رابطه‌های عمومی', budgeted: 50000000, actual: 15000000 },
      { name: 'تحقیقات بازار', budgeted: 50000000, actual: 5000000 },
    ],
  },
  {
    id: 'b3',
    name: 'بودجه توسعه فناوری',
    period: 'تیر - آذر ۱۴۰۴',
    totalBudget: 250000000,
    spent: 180000000,
    remaining: 70000000,
    categories: [
      { name: 'توسعه نرم‌افزار', budgeted: 100000000, actual: 85000000 },
      { name: 'زیرساخت ابری', budgeted: 50000000, actual: 45000000 },
      { name: 'امنیت سایبری', budgeted: 40000000, actual: 30000000 },
      { name: 'آموزش تیم فنی', budgeted: 30000000, actual: 15000000 },
      { name: 'تجهیزات', budgeted: 30000000, actual: 5000000 },
    ],
  },
  {
    id: 'b4',
    name: 'بودجه منابع انسانی',
    period: 'فروردین - اسفند ۱۴۰۴',
    totalBudget: 200000000,
    spent: 120000000,
    remaining: 80000000,
    categories: [
      { name: 'استخدام و جذب', budgeted: 60000000, actual: 40000000 },
      { name: 'آموزش و توسعه', budgeted: 50000000, actual: 35000000 },
      { name: 'رفاه و مزایا', budgeted: 50000000, actual: 30000000 },
      { name: 'مشاوره HR', budgeted: 40000000, actual: 15000000 },
    ],
  },
];

const formatAmount = (amount: number) => new Intl.NumberFormat('fa-IR').format(amount);

function getVarianceColor(budgeted: number, actual: number): string {
  const variance = ((actual - budgeted) / budgeted) * 100;
  if (variance > 10) return 'text-red-600';
  if (variance > 0) return 'text-amber-600';
  return 'text-emerald-600';
}

function getVarianceIcon(budgeted: number, actual: number) {
  return actual > budgeted ? TrendingUp : TrendingDown;
}

export default function BudgetsView() {
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const totalBudgetAll = mockBudgets.reduce((sum, b) => sum + b.totalBudget, 0);
  const totalSpentAll = mockBudgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemainingAll = mockBudgets.reduce((sum, b) => sum + b.remaining, 0);
  const overBudgetCategories = mockBudgets.reduce((count, b) => {
    return count + b.categories.filter((c) => c.actual > c.budgeted).length;
  }, 0);

  const summaryStats = [
    { label: 'کل بودجه', value: formatAmount(totalBudgetAll), icon: PiggyBank, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { label: 'مصرف‌شده', value: formatAmount(totalSpentAll), icon: DollarSign, bg: 'bg-teal-50', text: 'text-teal-600' },
    { label: 'باقی‌مانده', value: formatAmount(totalRemainingAll), icon: Target, bg: 'bg-amber-50', text: 'text-amber-600' },
    { label: 'تجاوز بودجه', value: String(overBudgetCategories), icon: AlertTriangle, bg: 'bg-red-50', text: 'text-red-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {selectedBudget && (
              <Button variant="ghost" size="icon" onClick={() => setSelectedBudget(null)} className="hover:bg-emerald-50">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <PiggyBank className="w-7 h-7 text-emerald-600" />
                {selectedBudget ? selectedBudget.name : 'بودجه‌بندی'}
              </h2>
              <p className="text-slate-500 mt-1">
                {selectedBudget ? selectedBudget.period : 'برنامه‌ریزی و پایش بودجه سازمانی'}
              </p>
            </div>
          </div>
          {!selectedBudget && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 ms-1.5" />
                  ایجاد بودجه
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>ایجاد بودجه جدید</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>نام بودجه</Label>
                    <Input placeholder="مثلاً: بودجه عملیاتی Q3" />
                  </div>
                  <div className="space-y-2">
                    <Label>دوره</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="انتخاب دوره" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="q1">سه‌ماهه اول</SelectItem>
                        <SelectItem value="q2">سه‌ماهه دوم</SelectItem>
                        <SelectItem value="q3">سه‌ماهه سوم</SelectItem>
                        <SelectItem value="q4">سه‌ماهه چهارم</SelectItem>
                        <SelectItem value="annual">سالانه</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>بودجه کل (ریال)</Label>
                    <Input type="number" placeholder="مبلغ بودجه" />
                  </div>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowCreateDialog(false)}>
                    ایجاد بودجه
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </motion.div>

      {selectedBudget ? (
        /* Budget Detail View */
        <BudgetDetail budget={selectedBudget} />
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg}`}>
                        <stat.icon className={`w-4 h-4 ${stat.text}`} />
                      </div>
                      <span className="text-xs text-slate-500">{stat.label}</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                    {stat.label !== 'تجاوز بودجه' && (
                      <p className="text-[10px] text-slate-400">ریال</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Budget List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockBudgets.map((budget, i) => {
              const percentage = Math.round((budget.spent / budget.totalBudget) * 100);
              const isOverBudget = budget.spent > budget.totalBudget;
              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card
                    className="hover:shadow-md transition-shadow cursor-pointer hover:border-emerald-300"
                    onClick={() => setSelectedBudget(budget)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-slate-900">{budget.name}</h3>
                        {isOverBudget ? (
                          <Badge className="bg-red-100 text-red-600">
                            <AlertTriangle className="w-3 h-3 ms-1" />
                            تجاوز
                          </Badge>
                        ) : percentage > 80 ? (
                          <Badge className="bg-amber-100 text-amber-700">نزدیک سقف</Badge>
                        ) : (
                          <Badge className="bg-emerald-100 text-emerald-700">سالم</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {budget.period}
                      </p>
                      {/* Progress */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">مصرف‌شده</span>
                          <span className="font-bold">{percentage}٪</span>
                        </div>
                        <Progress value={Math.min(percentage, 100)} className="h-2.5" />
                      </div>
                      {/* Amounts */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-[10px] text-slate-500">بودجه</p>
                          <p className="text-sm font-bold text-slate-900">{formatAmount(budget.totalBudget / 1000000)}M</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500">مصرف</p>
                          <p className="text-sm font-bold text-teal-600">{formatAmount(budget.spent / 1000000)}M</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500">باقی</p>
                          <p className={`text-sm font-bold ${budget.remaining >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {formatAmount(budget.remaining / 1000000)}M
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* Sub-component: Budget Detail */
function BudgetDetail({ budget }: { budget: Budget }) {
  const chartData = budget.categories.map((cat) => ({
    name: cat.name,
    budgeted: cat.budgeted / 1000000,
    actual: cat.actual / 1000000,
  }));

  return (
    <div className="space-y-6">
      {/* Summary Row */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-1">بودجه کل</p>
                <p className="text-2xl font-bold text-slate-900">{formatAmount(budget.totalBudget)}</p>
                <p className="text-xs text-slate-400">ریال</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-1">مصرف‌شده</p>
                <p className="text-2xl font-bold text-teal-600">{formatAmount(budget.spent)}</p>
                <p className="text-xs text-slate-400">ریال</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-1">باقی‌مانده</p>
                <p className={`text-2xl font-bold ${budget.remaining >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {formatAmount(budget.remaining)}
                </p>
                <p className="text-xs text-slate-400">ریال</p>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={Math.min(Math.round((budget.spent / budget.totalBudget) * 100), 100)} className="h-3" />
              <p className="text-xs text-slate-500 mt-1 text-center">
                {Math.round((budget.spent / budget.totalBudget) * 100)}٪ مصرف‌شده
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Comparison Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              مقایسه بودجه واقعی vs برنامه‌ریزی‌شده
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip formatter={(value: number, name: string) => [`${value} میلیون ریال`, name === 'budgeted' ? 'بودجه برنامه‌ریزی' : 'بودجه واقعی']} />
                  <Legend formatter={(value: string) => value === 'budgeted' ? 'بودجه برنامه‌ریزی' : 'بودجه واقعی'} />
                  <Bar dataKey="budgeted" fill="#059669" name="budgeted" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" fill="#14b8a6" name="actual" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-teal-600" />
              تفکیک دسته‌بندی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budget.categories.map((cat, i) => {
                const variance = cat.actual - cat.budgeted;
                const variancePercent = ((variance / cat.budgeted) * 100).toFixed(1);
                const isOver = cat.actual > cat.budgeted;
                const VarIcon = getVarianceIcon(cat.budgeted, cat.actual);

                return (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-900">{cat.name}</h4>
                      {isOver ? (
                        <Badge className="bg-red-100 text-red-600 text-xs">
                          <VarIcon className="w-3 h-3 ms-0.5" />
                          تجاوز {variancePercent}٪
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                          <VarIcon className="w-3 h-3 ms-0.5" />
                          صرفه‌جویی {Math.abs(parseFloat(variancePercent))}٪
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-slate-500">برنامه‌ریزی</p>
                        <p className="font-bold text-slate-900">{formatAmount(cat.budgeted)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">واقعی</p>
                        <p className="font-bold text-teal-600">{formatAmount(cat.actual)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">انحراف</p>
                        <p className={`font-bold ${getVarianceColor(cat.budgeted, cat.actual)}`}>
                          {isOver ? '+' : ''}{formatAmount(variance)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Progress
                        value={Math.min(Math.round((cat.actual / cat.budgeted) * 100), 100)}
                        className={`h-1.5 ${isOver ? '[&>div]:bg-red-500' : ''}`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
