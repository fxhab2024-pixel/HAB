'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore, type Strategy } from '@/lib/store';
import {
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Shield,
  Gauge,
} from 'lucide-react';
import { toast } from 'sonner';

const mockStrategies: Strategy[] = [
  {
    id: 's1',
    title: 'تنوع‌بخشی جریان‌های درآمدی',
    description: 'ایجاد حداقل ۳ جریان درآمدی مستقل برای کاهش وابستگی به یک منبع درآمد',
    category: 'مدل کسب‌وکار',
    priority: 95,
    impact: 'high',
    feasibility: 'medium',
    cost: 'medium',
    risk: 'low',
    status: 'recommended',
    rationale: 'با توجه به امتیاز پایین مدل کسب‌وکار در تنوع درآمدی، ایجاد جریان‌های جدید درآمدی اولویت بالایی دارد. این استراتژی ریسک وابستگی به یک مشتری/محصول را کاهش می‌دهد.',
  },
  {
    id: 's2',
    title: 'بهینه‌سازی فرآیند فروش',
    description: 'استانداردسازی فرآیند فروش و کاهش چرخه فروش از ۴۵ روز به ۲۰ روز',
    category: 'فروش',
    priority: 90,
    impact: 'high',
    feasibility: 'high',
    cost: 'low',
    risk: 'low',
    status: 'recommended',
    rationale: 'چرخه فروش طولانی یکی از مشکلات اصلی است. با پیاده‌سازی CRM و استانداردسازی فرآیندها، می‌توان نرخ تبدیل را ۳۰٪ افزایش داد.',
  },
  {
    id: 's3',
    title: 'توسعه حضور دیجیتال',
    description: 'راه‌اندازی استراتژی بازاریابی محتوایی و حضور فعال در شبکه‌های اجتماعی',
    category: 'بازاریابی',
    priority: 85,
    impact: 'high',
    feasibility: 'high',
    cost: 'low',
    risk: 'low',
    status: 'recommended',
    rationale: 'امتیاز پایین شناخت برند و حضور دیجیتال نشان‌دهنده فرصت بزرگ رشد در کانال‌های دیجیتال است.',
  },
  {
    id: 's4',
    title: 'تقویت سلامت مالی',
    description: 'ایجاد ذخیره اضطراری ۶ ماهه و بهبود جریان نقدی با مدیریت بهتر وصول مطالبات',
    category: 'مالی',
    priority: 88,
    impact: 'high',
    feasibility: 'medium',
    cost: 'low',
    risk: 'medium',
    status: 'recommended',
    rationale: 'سلامت مالی پایین‌ترین امتیاز را دارد و نیازمند اقدام فوری برای ایجاد ذخایر مالی و بهبود جریان نقدی است.',
  },
  {
    id: 's5',
    title: 'برنامه توسعه تیم رهبری',
    description: 'جذب مدیر ارشد مالی (CFO) و مدیر ارشد فناوری (CTO) برای تقویت تیم مدیریت',
    category: 'تیم و رهبری',
    priority: 75,
    impact: 'high',
    feasibility: 'low',
    cost: 'high',
    risk: 'medium',
    status: 'recommended',
    rationale: 'عدم تنوع مهارتی در تیم مدیریت ارشد یک ریسک استراتژیک است. جذب استعدادهای کلیدی می‌تواند تحول‌آفرین باشد.',
  },
  {
    id: 's6',
    title: 'ایجاد مزیت رقابتی مبتنی بر داده',
    description: 'ایجاد سیستم تحلیل داده مشتری و شخصی‌سازی پیشنهادات',
    category: 'محصول',
    priority: 80,
    impact: 'high',
    feasibility: 'medium',
    cost: 'high',
    risk: 'medium',
    status: 'recommended',
    rationale: 'با توجه به فرصت ایجاد اثر شبکه‌ای در محصول، سرمایه‌گذاری در تحلیل داده می‌تواند مزیت رقابتی پایدار ایجاد کند.',
  },
];

const impactLabels: Record<string, string> = {
  high: 'بالا',
  medium: 'متوسط',
  low: 'پایین',
};

const impactColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-emerald-100 text-emerald-700',
};

export default function StrategyRecommendations() {
  const { strategies, setStrategies } = useAppStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [localStrategies, setLocalStrategies] = useState<Strategy[]>(
    strategies.length > 0 ? strategies : mockStrategies
  );

  const handleAction = (id: string, action: 'accepted' | 'rejected') => {
    const updated = localStrategies.map((s) =>
      s.id === id ? { ...s, status: action } : s
    );
    setLocalStrategies(updated);
    setStrategies(updated);
    toast.success(
      action === 'accepted' ? 'استراتژی پذیرفته شد' : 'استراتژی رد شد'
    );
  };

  const categories = [...new Set(localStrategies.map((s) => s.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">توصیه‌های استراتژیک</h2>
            <p className="text-slate-500 mt-1">
              {localStrategies.filter((s) => s.status === 'recommended').length} توصیه فعال
            </p>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700">
            <Lightbulb className="w-4 h-4 ms-1" />
            مبتنی بر هوش مصنوعی
          </Badge>
        </div>
      </motion.div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline" className="cursor-pointer hover:bg-emerald-50 border-emerald-300 text-emerald-700">
          همه
        </Badge>
        {categories.map((cat) => (
          <Badge key={cat} variant="outline" className="cursor-pointer hover:bg-slate-50">
            {cat}
          </Badge>
        ))}
      </div>

      {/* Strategy Cards */}
      <div className="space-y-4">
        {localStrategies
          .sort((a, b) => b.priority - a.priority)
          .map((strategy, index) => (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <Card
                className={`transition-all ${
                  strategy.status === 'accepted'
                    ? 'border-emerald-300 bg-emerald-50/30'
                    : strategy.status === 'rejected'
                    ? 'border-red-200 bg-red-50/30 opacity-60'
                    : 'hover:shadow-md'
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs shrink-0">
                          {strategy.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Gauge className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs text-slate-500">
                            اولویت: {strategy.priority}
                          </span>
                        </div>
                        {strategy.status !== 'recommended' && (
                          <Badge
                            className={`text-xs ${
                              strategy.status === 'accepted'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {strategy.status === 'accepted' ? 'پذیرفته شده' : 'رد شده'}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 mb-1">{strategy.title}</h3>
                      <p className="text-sm text-slate-600">{strategy.description}</p>

                      {/* Impact/Feesability/Cost/Risk Badges */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {[
                          { label: 'اثر', value: strategy.impact, icon: TrendingUp },
                          { label: 'امکان', value: strategy.feasibility, icon: Check },
                          { label: 'هزینه', value: strategy.cost, icon: DollarSign },
                          { label: 'ریسک', value: strategy.risk, icon: AlertTriangle },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center gap-1 text-xs"
                          >
                            <item.icon className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-500">{item.label}:</span>
                            <Badge
                              variant="secondary"
                              className={`text-[10px] px-1.5 py-0 ${impactColors[item.value]}`}
                            >
                              {impactLabels[item.value]}
                            </Badge>
                          </div>
                        ))}
                      </div>

                      {/* Expandable rationale */}
                      <AnimatePresence>
                        {expandedId === strategy.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 p-3 bg-slate-50 rounded-lg border text-sm text-slate-600 leading-relaxed">
                              <span className="font-medium text-slate-700">دلیل توصیه: </span>
                              {strategy.rationale}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      {strategy.status === 'recommended' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleAction(strategy.id, 'accepted')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            پذیرش
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(strategy.id, 'rejected')}
                            className="gap-1 text-red-600 hover:bg-red-50 border-red-200"
                          >
                            <X className="w-3.5 h-3.5" />
                            رد
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setExpandedId(expandedId === strategy.id ? null : strategy.id)
                        }
                        className="text-slate-500"
                      >
                        {expandedId === strategy.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
