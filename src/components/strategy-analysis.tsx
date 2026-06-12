'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, ArrowUpRight, ArrowDownRight, Minus, Edit3, Save, X } from 'lucide-react';
import { toast } from 'sonner';

// SWOT
interface SwotItem {
  id: string;
  text: string;
}

const defaultSwot = {
  strengths: [
    { id: 's1', text: 'تیم فنی مجرب و متعهد' },
    { id: 's2', text: 'محصول منحصربه‌فرد در بازار داخلی' },
    { id: 's3', text: 'هزینه عملیاتی پایین نسبت به رقبا' },
  ] as SwotItem[],
  weaknesses: [
    { id: 'w1', text: 'وابستگی به یک مشتری اصلی' },
    { id: 'w2', text: 'نبود تیم مدیریت ارشد کامل' },
    { id: 'w3', text: 'ضعف در بازاریابی دیجیتال' },
  ] as SwotItem[],
  opportunities: [
    { id: 'o1', text: 'رشد سریع بازار SaaS در ایران' },
    { id: 'o2', text: 'فرصت صادرات خدمات فنی به منطقه' },
    { id: 'o3', text: 'افزایش تقاضا برای دیجیتالی‌سازی SMEها' },
  ] as SwotItem[],
  threats: [
    { id: 't1', text: 'ورود رقبای بین‌المللی با سرمایه بالا' },
    { id: 't2', text: 'تحریم‌ها و محدودیت‌های مالی بین‌المللی' },
    { id: 't3', text: 'تغییرات سریع فناوری و نیاز به به‌روزرسانی مداوم' },
  ] as SwotItem[],
};

// PESTEL
const pestelData = [
  { factor: 'Political', label: 'سیاسی', score: 3, desc: 'تحریم‌ها و مقررات دولتی تأثیر مستقیم بر عملکرد' },
  { factor: 'Economic', label: 'اقتصادی', score: 4, desc: 'نرخ تورم بالا و نوسان ارزی' },
  { factor: 'Social', label: 'اجتماعی', score: 2, desc: 'رشد آگاهی دیجیتال در میان کسب‌وکارها' },
  { factor: 'Technological', label: 'فناوری', score: 3, desc: 'توسعه سریع فناوری ابری و AI' },
  { factor: 'Environmental', label: 'محیط زیستی', score: 1, desc: 'تأثیر محدود بر مدل کسب‌وکار' },
  { factor: 'Legal', label: 'قانونی', score: 3, desc: 'مقررات حریم خصوصی و داده‌های مشتری' },
];

// Porter's Five Forces
const porterData = [
  { force: 'رقابت داخل صنعت', score: 4, desc: 'رقابت متوسط به بالا، تعداد رقبای محلی کم', color: '#059669' },
  { force: 'تهدید ورود رقبای جدید', score: 3, desc: 'سد ورود فناوری متوسط، مزییت اول‌نبودن', color: '#0d9488' },
  { force: 'قدرت چانه‌زنی تامین‌کنندگان', score: 2, desc: 'وابستگی کم به تامین‌کنندگان خاص', color: '#0891b2' },
  { force: 'قدرت چانه‌زنی خریداران', score: 4, desc: 'مشتریان بزرگ قدرت چانه‌زنی بالایی دارند', color: '#f97316' },
  { force: 'تهدید جایگزین‌ها', score: 3, desc: 'جایگزین‌های سنتی و راه‌حل‌های داخلی', color: '#ef4444' },
];

export default function StrategyAnalysis() {
  const [activeTab, setActiveTab] = useState('swot');
  const [swot, setSwot] = useState(defaultSwot);
  const [editing, setEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleEdit = (category: string, id: string, currentText: string) => {
    setEditing(`${category}-${id}`);
    setEditText(currentText);
  };

  const handleSaveEdit = (category: keyof typeof swot) => {
    if (!editing) return;
    const id = editing.split('-')[1];
    setSwot({
      ...swot,
      [category]: swot[category].map((item: SwotItem) =>
        item.id === id ? { ...item, text: editText } : item
      ),
    });
    setEditing(null);
    toast.success('تغییرات ذخیره شد');
  };

  const swotConfig = [
    { key: 'strengths' as const, title: 'نقاط قوت', items: swot.strengths, bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', iconColor: 'text-emerald-600', icon: ArrowUpRight },
    { key: 'weaknesses' as const, title: 'نقاط ضعف', items: swot.weaknesses, bgColor: 'bg-red-50', borderColor: 'border-red-200', iconColor: 'text-red-600', icon: ArrowDownRight },
    { key: 'opportunities' as const, title: 'فرصت‌ها', items: swot.opportunities, bgColor: 'bg-teal-50', borderColor: 'border-teal-200', iconColor: 'text-teal-600', icon: ArrowUpRight },
    { key: 'threats' as const, title: 'تهدیدها', items: swot.threats, bgColor: 'bg-orange-50', borderColor: 'border-orange-200', iconColor: 'text-orange-600', icon: ArrowDownRight },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-slate-900">تحلیل استراتژیک</h2>
        <p className="text-slate-500 mt-1">ابزارهای تحلیل SWOT، PESTEL و پنج نیروی پورتر</p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="swot">SWOT</TabsTrigger>
          <TabsTrigger value="pestel">PESTEL</TabsTrigger>
          <TabsTrigger value="porter">پنج نیروی پورتر</TabsTrigger>
        </TabsList>

        <TabsContent value="swot">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {swotConfig.map((section) => (
              <Card key={section.key} className={`${section.borderColor}`}>
                <CardHeader className="pb-2">
                  <CardTitle className={`text-base flex items-center gap-2 ${section.iconColor}`}>
                    <section.icon className="w-5 h-5" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {section.items.map((item: SwotItem) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-2 p-2.5 rounded-lg ${section.bgColor}`}
                    >
                      {editing === `${section.key}-${item.id}` ? (
                        <div className="flex-1 flex gap-2">
                          <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="min-h-[40px] text-sm"
                          />
                          <div className="flex flex-col gap-1">
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleSaveEdit(section.key)}>
                              <Save className="w-3.5 h-3.5 text-emerald-600" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(null)}>
                              <X className="w-3.5 h-3.5 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm text-slate-700 flex-1">{item.text}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 shrink-0"
                            onClick={() => handleEdit(section.key, item.id, item.text)}
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="pestel">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 mt-4">
            {pestelData.map((item) => (
              <Card key={item.factor}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 font-bold text-sm">
                        {item.label.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">{item.label}</h4>
                        <p className="text-sm text-slate-600">{item.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={`w-3 h-3 rounded-full ${
                            star <= item.score ? 'bg-emerald-500' : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">تأثیر:</span>
                    <Badge className={`text-xs ${
                      item.score >= 4 ? 'bg-red-100 text-red-700' :
                      item.score >= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {item.score >= 4 ? 'بالا' : item.score >= 3 ? 'متوسط' : 'پایین'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="porter">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 mt-4">
            {porterData.map((item) => (
              <Card key={item.force}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-800">{item.force}</h4>
                    <Badge className="text-xs" style={{
                      backgroundColor: `${item.color}20`,
                      color: item.color,
                    }}>
                      شدت: {item.score}/۵
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{item.desc}</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className="flex-1 h-2 rounded-full"
                        style={{
                          backgroundColor: level <= item.score ? item.color : '#e2e8f0',
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
