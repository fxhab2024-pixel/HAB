'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  CreditCard,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  Briefcase,
  Home,
  Megaphone,
  Settings,
  Monitor,
  Plane,
  MoreHorizontal,
  TrendingUp,
  Filter,
} from 'lucide-react';

// Types
type ExpenseCategory = 'salary' | 'rent' | 'marketing' | 'operations' | 'software' | 'travel' | 'other';
type ExpenseStatus = 'pending' | 'approved' | 'rejected';

interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  date: string;
  status: ExpenseStatus;
}

// Category config
const categoryConfig: Record<ExpenseCategory, { label: string; color: string; bgColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  salary: { label: 'حقوق', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: Briefcase },
  rent: { label: 'اجاره', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: Home },
  marketing: { label: 'بازاریابی', color: 'text-purple-600', bgColor: 'bg-purple-50', icon: Megaphone },
  operations: { label: 'عملیاتی', color: 'text-teal-600', bgColor: 'bg-teal-50', icon: Settings },
  software: { label: 'نرم‌افزار', color: 'text-indigo-600', bgColor: 'bg-indigo-50', icon: Monitor },
  travel: { label: 'سفر', color: 'text-amber-600', bgColor: 'bg-amber-50', icon: Plane },
  other: { label: 'سایر', color: 'text-slate-600', bgColor: 'bg-slate-50', icon: MoreHorizontal },
};

const statusConfig: Record<ExpenseStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { label: 'در انتظار', color: 'bg-amber-100 text-amber-700', icon: Clock },
  approved: { label: 'تأییدشده', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  rejected: { label: 'ردشده', color: 'bg-red-100 text-red-600', icon: XCircle },
};

// Mock Data
const mockExpenses: Expense[] = [
  { id: 'e1', category: 'salary', amount: 85000000, description: 'حقوق کارمندان خرداد', date: '۱۴۰۴/۰۳/۰۱', status: 'approved' },
  { id: 'e2', category: 'rent', amount: 25000000, description: 'اجاره دفتر مرکزی', date: '۱۴۰۴/۰۳/۰۱', status: 'approved' },
  { id: 'e3', category: 'marketing', amount: 15000000, description: 'تبلیغات اینستاگرام', date: '۱۴۰۴/۰۳/۰۵', status: 'approved' },
  { id: 'e4', category: 'software', amount: 8000000, description: 'اشتراک نرم‌افزار CRM', date: '۱۴۰۴/۰۳/۰۳', status: 'approved' },
  { id: 'e5', category: 'operations', amount: 12000000, description: 'هزینه‌های عملیاتی ماهانه', date: '۱۴۰۴/۰۳/۰۷', status: 'pending' },
  { id: 'e6', category: 'travel', amount: 5000000, description: 'سفر کاری مشهد', date: '۱۴۰۴/۰۳/۱۰', status: 'approved' },
  { id: 'e7', category: 'marketing', amount: 20000000, description: 'کمپین تبلیغاتی تابستانه', date: '۱۴۰۴/۰۳/۱۲', status: 'pending' },
  { id: 'e8', category: 'salary', amount: 85000000, description: 'حقوق کارمندان تیر', date: '۱۴۰۴/۰۴/۰۱', status: 'pending' },
  { id: 'e9', category: 'other', amount: 3000000, description: 'هزینه‌های متفرقه', date: '۱۴۰۴/۰۳/۱۵', status: 'approved' },
  { id: 'e10', category: 'software', amount: 4500000, description: 'سرور ابری', date: '۱۴۰۴/۰۳/۰۸', status: 'rejected' },
  { id: 'e11', category: 'operations', amount: 7000000, description: 'تعمیرات دفتر', date: '۱۴۰۴/۰۳/۱۸', status: 'pending' },
  { id: 'e12', category: 'rent', amount: 25000000, description: 'اجاره دفتر مرکزی - تیر', date: '۱۴۰۴/۰۴/۰۱', status: 'pending' },
];

// Chart data
const chartData = Object.keys(categoryConfig).map((cat) => {
  const key = cat as ExpenseCategory;
  const total = mockExpenses.filter((e) => e.category === key).reduce((sum, e) => sum + e.amount, 0);
  return { category: categoryConfig[key].label, amount: total / 1000000, fill: getCategoryChartColor(key) };
});

function getCategoryChartColor(cat: ExpenseCategory): string {
  const map: Record<ExpenseCategory, string> = {
    salary: '#3b82f6',
    rent: '#f97316',
    marketing: '#a855f7',
    operations: '#14b8a6',
    software: '#6366f1',
    travel: '#f59e0b',
    other: '#94a3b8',
  };
  return map[cat];
}

const formatAmount = (amount: number) => new Intl.NumberFormat('fa-IR').format(amount);

export default function ExpensesView() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredExpenses = mockExpenses.filter((exp) => {
    if (filterCategory !== 'all' && exp.category !== filterCategory) return false;
    if (filterStatus !== 'all' && exp.status !== filterStatus) return false;
    return true;
  });

  const totalExpenses = mockExpenses.reduce((sum, e) => sum + e.amount, 0);
  const approvedExpenses = mockExpenses.filter((e) => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenses = mockExpenses.filter((e) => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);
  const rejectedExpenses = mockExpenses.filter((e) => e.status === 'rejected').reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-7 h-7 text-emerald-600" />
              مدیریت هزینه‌ها
            </h2>
            <p className="text-slate-500 mt-1">ثبت، پیگیری و مدیریت هزینه‌های سازمان</p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 ms-1.5" />
                ثبت هزینه
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>ثبت هزینه جدید</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>دسته‌بندی</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="انتخاب دسته‌بندی" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryConfig).map(([key, cfg]) => (
                        <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>مبلغ (ریال)</Label>
                  <Input type="number" placeholder="مبلغ هزینه" />
                </div>
                <div className="space-y-2">
                  <Label>توضیحات</Label>
                  <Input placeholder="شرح هزینه" />
                </div>
                <div className="space-y-2">
                  <Label>تاریخ</Label>
                  <Input placeholder="۱۴۰۴/۰۴/۰۱" />
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowAddDialog(false)}>
                  ثبت هزینه
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'کل هزینه‌ها', value: totalExpenses, icon: CreditCard, bg: 'bg-emerald-50', text: 'text-emerald-600' },
          { label: 'تأییدشده', value: approvedExpenses, icon: CheckCircle2, bg: 'bg-teal-50', text: 'text-teal-600' },
          { label: 'در انتظار تأیید', value: pendingExpenses, icon: Clock, bg: 'bg-amber-50', text: 'text-amber-600' },
          { label: 'ردشده', value: rejectedExpenses, icon: XCircle, bg: 'bg-red-50', text: 'text-red-600' },
        ].map((stat, i) => (
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
                <p className="text-lg font-bold text-slate-900">{formatAmount(stat.value)}</p>
                <p className="text-[10px] text-slate-400">ریال</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Monthly Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              هزینه‌ها بر اساس دسته‌بندی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip formatter={(value: number) => [`${value} میلیون ریال`, 'مبلغ']} />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[160px]">
            <Filter className="w-4 h-4 ms-1.5 text-slate-400" />
            <SelectValue placeholder="دسته‌بندی" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه دسته‌ها</SelectItem>
            {Object.entries(categoryConfig).map(([key, cfg]) => (
              <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="وضعیت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه وضعیت‌ها</SelectItem>
            <SelectItem value="pending">در انتظار</SelectItem>
            <SelectItem value="approved">تأییدشده</SelectItem>
            <SelectItem value="rejected">ردشده</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Expense List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardContent className="p-0">
            <ScrollArea className="max-h-[500px]">
              <div className="divide-y">
                {filteredExpenses.map((exp, i) => {
                  const catCfg = categoryConfig[exp.category];
                  const stCfg = statusConfig[exp.status];
                  const CatIcon = catCfg.icon;
                  const StIcon = stCfg.icon;
                  return (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${catCfg.bgColor}`}>
                        <CatIcon className={`w-5 h-5 ${catCfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{exp.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px]">
                            {catCfg.label}
                          </Badge>
                          <span className="text-xs text-slate-400">{exp.date}</span>
                        </div>
                      </div>
                      <div className="text-left shrink-0">
                        <p className="text-sm font-bold text-slate-900">{formatAmount(exp.amount)}</p>
                        <p className="text-[10px] text-slate-400">ریال</p>
                      </div>
                      <Badge className={`text-[10px] shrink-0 ${stCfg.color}`}>
                        <StIcon className="w-3 h-3 ms-0.5" />
                        {stCfg.label}
                      </Badge>
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}


