'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';
import { BookOpen, Search, Clock, Tag, ArrowLeft } from 'lucide-react';

const categories = ['همه', 'استراتژی', 'مالی', 'بازاریابی', 'فروش', 'عملیات', 'رهبری', 'رشد'];

const mockArticles = [
  {
    id: '1',
    title: 'چگونه مدل درآمدی خود را تنوع ببخشید',
    category: 'استراتژی',
    readTime: '۸ دقیقه',
    summary: 'راهنمای عملی برای ایجاد جریان‌های درآمدی مستقل و کاهش وابستگی به یک منبع درآمد',
    tags: ['مدل درآمدی', 'تنوع‌بخشی', 'کسب‌وکار'],
  },
  {
    id: '2',
    title: '۱۰ اشتباه رایج مالی در SMEها',
    category: 'مالی',
    readTime: '۶ دقیقه',
    summary: 'شناخت و جلوگیری از اشتباهات مالی که بیشترین آسیب را به کسب‌وکارهای کوچک وارد می‌کنند',
    tags: ['سلامت مالی', 'مدیریت مالی', 'ریسک'],
  },
  {
    id: '3',
    title: 'استراتژی بازاریابی دیجیتال برای B2B',
    category: 'بازاریابی',
    readTime: '۱۰ دقیقه',
    summary: 'چارچوب جامع بازاریابی دیجیتال مخصوص کسب‌وکارهای B2B با تمرکز بر تولید سرنخ',
    tags: ['دیجیتال', 'B2B', 'لید جنریشن'],
  },
  {
    id: '4',
    title: 'فرآیند فروش استاندارد: از تماس اول تا بستن قرارداد',
    category: 'فروش',
    readTime: '۱۲ دقیقه',
    summary: 'مراحل کلیدی فرآیند فروش و نحوه استانداردسازی برای افزایش نرخ تبدیل',
    tags: ['فرآیند فروش', 'CRM', 'نرخ تبدیل'],
  },
  {
    id: '5',
    title: 'رهبری در دوران عدم قطعیت',
    category: 'رهبری',
    readTime: '۷ دقیقه',
    summary: 'مهارت‌ها و رویکردهای رهبری که در شرایط بحرانی و عدم قطعیت ضروری هستند',
    tags: ['رهبری', 'مدیریت بحران', 'تصمیم‌گیری'],
  },
  {
    id: '6',
    title: 'از استارتاپ تا شرکت بالغ: مراحل رشد',
    category: 'رشد',
    readTime: '۹ دقیقه',
    summary: 'شناسایی مرحله رشد کسب‌وکار و استراتژی‌های متناسب با هر مرحله',
    tags: ['رشد', 'مقیاس‌پذیری', 'استراتژی'],
  },
  {
    id: '7',
    title: 'بهبود عملیات با اتوماسیون',
    category: 'عملیات',
    readTime: '۸ دقیقه',
    summary: 'راهنمای انتخاب و پیاده‌سازی ابزارهای اتوماسیون برای بهبود بهره‌وری عملیاتی',
    tags: ['اتوماسیون', 'عملیات', 'بهره‌وری'],
  },
  {
    id: '8',
    title: 'آمادگی برای جذب سرمایه: چک‌لیست جامع',
    category: 'مالی',
    readTime: '۱۵ دقیقه',
    summary: 'تمام مواردی که قبل از مذاکره با سرمایه‌گذار باید آماده کنید',
    tags: ['جذب سرمایه', 'آمادگی', 'سرمایه‌گذار'],
  },
];

export default function KnowledgeHub() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('همه');

  const filtered = mockArticles.filter((a) => {
    const matchSearch =
      a.title.includes(search) ||
      a.summary.includes(search) ||
      a.tags.some((t) => t.includes(search));
    const matchCategory =
      activeCategory === 'همه' || a.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-slate-900">پایگاه دانش</h2>
        <p className="text-slate-500 mt-1">مقالات و منابع تخصصی برای رشد کسب‌وکار</p>
      </motion.div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در مقالات..."
            className="ps-3 pe-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              size="sm"
              className={
                activeCategory === cat
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'hover:border-emerald-300'
              }
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs border-emerald-300 text-emerald-700">
                    {article.category}
                  </Badge>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{article.summary}</p>
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] bg-slate-100 text-slate-600">
                      <Tag className="w-2.5 h-2.5 ms-0.5" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">مقاله‌ای یافت نشد</p>
        </div>
      )}
    </div>
  );
}
