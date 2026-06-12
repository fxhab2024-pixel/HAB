'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  TrendingUp,
  Users,
  ShieldCheck,
  AlertTriangle,
  Search,
  Eye,
  Building2,
  BarChart3,
} from 'lucide-react';

const mockSMEs = [
  { id: '1', name: 'شرکت فناوری نوین', industry: 'فناوری اطلاعات', score: 82, risk: 25, investmentReady: true, owner: 'علی محمدی' },
  { id: '2', name: 'صنایع خلاق', industry: 'مشاوره', score: 75, risk: 35, investmentReady: false, owner: 'مریم احمدی' },
  { id: '3', name: 'پلتفرم آموزشی آینده', industry: 'آموزش', score: 68, risk: 42, investmentReady: false, owner: 'رضا حسینی' },
  { id: '4', name: 'گروه بازرگانی پارسیان', industry: 'خرده‌فروشی', score: 91, risk: 15, investmentReady: true, owner: 'زهرا کریمی' },
  { id: '5', name: 'استارتاپ سبز', industry: 'کشاورزی', score: 55, risk: 60, investmentReady: false, owner: 'حسن نوری' },
  { id: '6', name: 'شرکت بهداشتی سلامت', industry: 'بهداشت', score: 73, risk: 38, investmentReady: true, owner: 'فاطمه رضایی' },
];

export default function AdminPanel() {
  const [search, setSearch] = useState('');

  const filteredSMEs = mockSMEs.filter(
    (s) =>
      s.name.includes(search) ||
      s.industry.includes(search) ||
      s.owner.includes(search)
  );

  const stats = [
    { icon: Users, label: 'کل SMEها', value: '۱۲۴', color: 'emerald' },
    { icon: ShieldCheck, label: 'آماده سرمایه‌گذاری', value: '۳۸', color: 'teal' },
    { icon: AlertTriangle, label: 'وضعیت بحرانی', value: '۱۲', color: 'red' },
    { icon: BarChart3, label: 'میانگین امتیاز', value: '۶۷', color: 'emerald' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">پنل مدیریت</h2>
            <p className="text-slate-500 mt-1">مدیریت و نظارت بر کسب‌وکارهای ثبت‌شده</p>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700">
            <TrendingUp className="w-4 h-4 ms-1" />
            مدیر سیستم
          </Badge>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  stat.color === 'emerald' ? 'bg-emerald-100' :
                  stat.color === 'teal' ? 'bg-teal-100' : 'bg-red-100'
                }`}>
                  <stat.icon className={`w-5 h-5 ${
                    stat.color === 'emerald' ? 'text-emerald-600' :
                    stat.color === 'teal' ? 'text-teal-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                  <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* SME Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                فهرست SMEها
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجو..."
                  className="ps-3 pe-9 h-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>شرکت</TableHead>
                  <TableHead>صنعت</TableHead>
                  <TableHead>امتیاز</TableHead>
                  <TableHead>ریسک</TableHead>
                  <TableHead>آمادگی سرمایه‌گذاری</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSMEs.map((sme) => (
                  <TableRow key={sme.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-800">{sme.name}</p>
                        <p className="text-xs text-slate-500">{sme.owner}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{sme.industry}</TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${
                        sme.score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                        sme.score >= 65 ? 'bg-yellow-100 text-yellow-700' :
                        sme.score >= 50 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {sme.score}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${
                        sme.risk <= 30 ? 'bg-emerald-100 text-emerald-700' :
                        sme.risk <= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {sme.risk}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {sme.investmentReady ? (
                        <Badge className="bg-emerald-100 text-emerald-700 text-xs">آماده</Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-600 text-xs">نامستعد</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        مشاهده
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
