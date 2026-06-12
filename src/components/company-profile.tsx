'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import { Briefcase, Building2, Save, Calendar, Globe, Users, FileText } from 'lucide-react';

const industries = [
  'فناوری اطلاعات',
  'خرده‌فروشی',
  'تولید صنعتی',
  'خدمات مالی',
  'بهداشت و درمان',
  'آموزش',
  'کشاورزی',
  'حمل و نقل',
  'غذا و نوشیدنی',
  'ساختمان و عمران',
  'مشاوره',
  'لوازم خانگی',
  'مد و پوشاک',
  'انرژی',
  'سرگرمی',
  'سایر',
];

const stages = [
  'ایده',
  'پیش‌نخست (Pre-seed)',
  'نخستین (Seed)',
  'مرحله آغازین (Early Stage)',
  'رشد (Growth)',
  'توسعه (Scale)',
  'بلوغ (Mature)',
];

export default function CompanyProfile() {
  const { user } = useAppStore();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: user?.companyName || '',
    industry: '',
    stage: '',
    employeeCount: '',
    foundedYear: '',
    website: '',
    description: '',
    city: '',
    annualRevenue: '',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      toast.success('پروفایل شرکت ذخیره شد');
    } catch {
      toast.error('خطا در ذخیره‌سازی');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-slate-900">پروفایل شرکت</h2>
        <p className="text-slate-500 mt-1">اطلاعات شرکت خود را تکمیل و بروزرسانی کنید</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              اطلاعات پایه
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>نام شرکت</Label>
                <div className="relative">
                  <Briefcase className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="نام شرکت"
                    className="ps-3 pe-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>صنعت</Label>
                <Select value={form.industry} onValueChange={(v) => setForm({ ...form, industry: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب صنعت" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>مرحله رشد</Label>
                <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب مرحله" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((st) => (
                      <SelectItem key={st} value={st}>{st}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>تعداد کارکنان</Label>
                <div className="relative">
                  <Users className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    value={form.employeeCount}
                    onChange={(e) => setForm({ ...form, employeeCount: e.target.value })}
                    placeholder="مثلاً ۲۵"
                    className="ps-3 pe-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>سال تأسیس</Label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    value={form.foundedYear}
                    onChange={(e) => setForm({ ...form, foundedYear: e.target.value })}
                    placeholder="مثلاً ۱۳۹۸"
                    className="ps-3 pe-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>وبسایت</Label>
                <div className="relative">
                  <Globe className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    placeholder="www.example.com"
                    className="ps-3 pe-10"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>توضیحات شرکت</Label>
              <div className="relative">
                <FileText className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="توضیح مختصری درباره فعالیت‌ها و اهداف شرکت..."
                  className="ps-3 pe-10 min-h-[100px]"
                />
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
