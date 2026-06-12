'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Download, Plus, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Report {
  id: string;
  title: string;
  type: string;
  status: 'completed' | 'generating';
  createdAt: string;
  size: string;
}

const mockReports: Report[] = [
  { id: 'r1', title: 'گزارش تشخیص استراتژیک - آذر ۱۴۰۴', type: 'diagnostic', status: 'completed', createdAt: '۱۴۰۴/۰۹/۱۵', size: '۲.۴ مگابایت' },
  { id: 'r2', title: 'گزارش توصیه‌های استراتژیک', type: 'strategy', status: 'completed', createdAt: '۱۴۰۴/۰۹/۱۶', size: '۱.۸ مگابایت' },
  { id: 'r3', title: 'گزارش آمادگی سرمایه‌گذاری', type: 'investment', status: 'completed', createdAt: '۱۴۰۴/۰۹/۲۰', size: '۳.۱ مگابایت' },
  { id: 'r4', title: 'گزارش بنچمارک صنعتی', type: 'benchmark', status: 'completed', createdAt: '۱۴۰۴/۱۰/۰۱', size: '۱.۵ مگابایت' },
];

const reportTypes = [
  { value: 'diagnostic', label: 'گزارش تشخیص استراتژیک' },
  { value: 'strategy', label: 'گزارش توصیه‌های استراتژیک' },
  { value: 'investment', label: 'گزارش آمادگی سرمایه‌گذاری' },
  { value: 'benchmark', label: 'گزارش بنچمارک صنعتی' },
  { value: 'financial', label: 'گزارش سلامت مالی' },
  { value: 'roadmap', label: 'گزارش نقشه راه' },
  { value: 'full', label: 'گزارش جامع (تمام ابعاد)' },
];

export default function ReportsView() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedType, setSelectedType] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedType) {
      toast.error('لطفاً نوع گزارش را انتخاب کنید');
      return;
    }
    setGenerating(true);
    const typeLabel = reportTypes.find((t) => t.value === selectedType)?.label || selectedType;
    const newReport: Report = {
      id: `r-${Date.now()}`,
      title: `${typeLabel} - جدید`,
      type: selectedType,
      status: 'generating',
      createdAt: new Date().toLocaleDateString('fa-IR'),
      size: 'در حال تولید...',
    };
    setReports([newReport, ...reports]);

    await new Promise((r) => setTimeout(r, 3000));

    setReports((prev) =>
      prev.map((r) =>
        r.id === newReport.id
          ? { ...r, status: 'completed', size: '۲.۲ مگابایت' }
          : r
      )
    );
    setGenerating(false);
    setSelectedType('');
    toast.success('گزارش با موفقیت تولید شد');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-slate-900">گزارش‌ها</h2>
        <p className="text-slate-500 mt-1">تولید و مدیریت گزارش‌های استراتژیک</p>
      </motion.div>

      {/* Generate New */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              تولید گزارش جدید
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="نوع گزارش را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shrink-0"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    در حال تولید...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    تولید گزارش
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reports List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              گزارش‌های تولیدشده
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  report.status === 'completed' ? 'bg-emerald-100' : 'bg-yellow-100'
                }`}>
                  {report.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-slate-800 truncate">{report.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {report.createdAt}
                    </span>
                    <span className="text-xs text-slate-400">{report.size}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs shrink-0">
                  {reportTypes.find((t) => t.value === report.type)?.label || report.type}
                </Badge>
                {report.status === 'completed' && (
                  <Button variant="outline" size="sm" className="shrink-0 gap-1">
                    <Download className="w-3.5 h-3.5" />
                    دانلود
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
