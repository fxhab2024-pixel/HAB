'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import {
  BarChart3,
  Brain,
  Target,
  TrendingUp,
  Shield,
  Zap,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'تشخیص استراتژیک ۱۰۰ سؤالی',
    description: 'تحلیل عمیق ۱۰ بُعد کسب‌وکار با الگوریتم هوشمند و وزن‌دهی علمی',
  },
  {
    icon: Brain,
    title: 'مشاور استراتژیک هوشمند',
    description: 'هوش مصنوعی مخصوص استراتژی کسب‌وکار با دانش تخصصی صنعت',
  },
  {
    icon: Target,
    title: 'توصیه‌های استراتژیک عملیاتی',
    description: 'توصیه‌های اولویت‌بندی‌شده با تحلیل اثر، هزینه، ریسک و امکان‌پذیری',
  },
  {
    icon: TrendingUp,
    title: 'نقشه راه رشد سه‌فازی',
    description: 'برنامه رشد بلندمدت با نقاط عطف و شاخص‌های اندازه‌گیری',
  },
  {
    icon: Shield,
    title: 'آمادگی سرمایه‌گذاری',
    description: 'ارزیابی و بهبود آمادگی برای جذب سرمایه با استانداردهای جهانی',
  },
  {
    icon: Zap,
    title: 'ردیابی اجرای استراتژی',
    description: 'مدیریت وظایف و پیگیری اجرای استراتژی‌ها با داشبورد عملکردی',
  },
];

export default function Landing() {
  const { setView } = useAppStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/30">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-emerald-800">BCGSP</h1>
              <p className="text-[10px] text-slate-500 -mt-1">Strategic Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => setView('login')}
              className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
            >
              ورود
            </Button>
            <Button
              onClick={() => setView('register')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              ثبت‌نام رایگان
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-teal-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              پلتفرم هوش مصنوعی استراتژی کسب‌وکار
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              سیستم عامل{' '}
              <span className="bg-gradient-to-l from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                هوش استراتژیک
              </span>{' '}
              کسب‌وکار
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
              از تشخیص تا استراتژی، از برنامه‌ریزی تا اجرا — همه‌چیز در یک پلتفرم یکپارچه
              با هوش مصنوعی تخصصی برای کسب‌وکارهای کوچک و متوسط
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => setView('register')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-emerald-600/25"
              >
                شروع رایگان
                <ArrowLeft className="w-5 h-5 ms-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setView('login')}
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-lg rounded-xl"
              >
                ورود به حساب کاربری
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              قابلیت‌های کلیدی پلتفرم
            </h3>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              ابزارهای هوشمند برای هر مرحله از سفر رشد استراتژیک کسب‌وکار شما
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <Card className="h-full border-slate-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors duration-300">
                      <feature.icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h4>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-10 sm:p-16 text-center text-white"
          >
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">
              همین حالا سفر استراتژیک خود را آغاز کنید
            </h3>
            <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
              تشخیص رایگان ۱۰۰ سؤالی و دریافت توصیه‌های استراتژیک هوشمند
            </p>
            <Button
              size="lg"
              onClick={() => setView('register')}
              className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-lg rounded-xl shadow-lg"
            >
              ثبت‌نام رایگان
              <ArrowLeft className="w-5 h-5 ms-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          <p>© ۱۴۰۴ BCGSP - سیستم عامل هوش استراتژیک کسب‌وکار. تمامی حقوق محفوظ است.</p>
        </div>
      </footer>
    </div>
  );
}
