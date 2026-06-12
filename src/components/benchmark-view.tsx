'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { GitCompare, TrendingUp, TrendingDown, Minus, Building2 } from 'lucide-react';
import { DIMENSIONS } from '@/lib/diagnostic-questions';

const mockCompanyScores = DIMENSIONS.map((d) => ({
  dimension: d.name,
  company: Math.floor(Math.random() * 40) + 50,
  industry: Math.floor(Math.random() * 30) + 55,
}));

const comparisonData = [
  { metric: 'مدل کسب‌وکار', company: 65, industry: 72, diff: -7 },
  { metric: 'بازار و مشتریان', company: 58, industry: 68, diff: -10 },
  { metric: 'محصول', company: 75, industry: 70, diff: 5 },
  { metric: 'بخش‌بندی مشتری', company: 62, industry: 65, diff: -3 },
  { metric: 'بازاریابی', company: 55, industry: 63, diff: -8 },
  { metric: 'فروش', company: 70, industry: 66, diff: 4 },
  { metric: 'عملیات', company: 60, industry: 69, diff: -9 },
  { metric: 'سلامت مالی', company: 50, industry: 61, diff: -11 },
  { metric: 'تیم و رهبری', company: 68, industry: 64, diff: 4 },
  { metric: 'رشد و استراتژی', company: 72, industry: 67, diff: 5 },
];

export default function BenchmarkView() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">مقایسه صنعتی</h2>
            <p className="text-slate-500 mt-1">مقایسه عملکرد شما با میانگین صنعت</p>
          </div>
          <Badge className="bg-teal-100 text-teal-700">
            <GitCompare className="w-4 h-4 ms-1" />
            بنچمارک
          </Badge>
        </div>
      </motion.div>

      {/* Radar Comparison */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              نمودار مقایسه رادار
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={mockCompanyScores} cx="50%" cy="50%" outerRadius="65%">
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar name="شرکت شما" dataKey="company" stroke="#059669" fill="#059669" fillOpacity={0.2} strokeWidth={2} />
                  <Radar name="میانگین صنعت" dataKey="industry" stroke="#0d9488" fill="#0d9488" fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 5" />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Comparison Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">جدول مقایسه تفصیلی</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>شاخص</TableHead>
                  <TableHead>شرکت شما</TableHead>
                  <TableHead>میانگین صنعت</TableHead>
                  <TableHead>تفاوت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((row) => (
                  <TableRow key={row.metric}>
                    <TableCell className="font-medium text-slate-800">{row.metric}</TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${
                        row.company >= 80 ? 'bg-emerald-100 text-emerald-700' :
                        row.company >= 65 ? 'bg-yellow-100 text-yellow-700' :
                        row.company >= 50 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {row.company}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{row.industry}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {row.diff > 0 ? (
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                        ) : row.diff < 0 ? (
                          <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                        ) : (
                          <Minus className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span className={`text-sm font-medium ${
                          row.diff > 0 ? 'text-emerald-600' : row.diff < 0 ? 'text-red-600' : 'text-slate-500'
                        }`}>
                          {row.diff > 0 ? '+' : ''}{row.diff}
                        </span>
                      </div>
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
