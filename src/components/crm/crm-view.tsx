'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore, CrmLead } from '@/lib/store';
import {
  Plus,
  Search,
  Filter,
  Users,
  DollarSign,
  TrendingUp,
  Phone,
  Mail,
  Building2,
  Calendar,
  MessageSquare,
  ChevronLeft,
  GripVertical,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Clock,
  User,
  Briefcase,
  Tag,
  FileText,
  X,
} from 'lucide-react';

// Pipeline stage definitions
const PIPELINE_STAGES = [
  { key: 'new', label: 'جدید', color: 'bg-slate-500', lightColor: 'bg-slate-100', textColor: 'text-slate-700' },
  { key: 'contacted', label: 'تماس‌شده', color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-700' },
  { key: 'qualified', label: 'واجد شرایط', color: 'bg-amber-500', lightColor: 'bg-amber-50', textColor: 'text-amber-700' },
  { key: 'proposal', label: 'پیشنهاد', color: 'bg-purple-500', lightColor: 'bg-purple-50', textColor: 'text-purple-700' },
  { key: 'negotiation', label: 'مذاکره', color: 'bg-teal-500', lightColor: 'bg-teal-50', textColor: 'text-teal-700' },
  { key: 'closed_won', label: 'موفق', color: 'bg-emerald-500', lightColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
  { key: 'closed_lost', label: 'از دست‌رفته', color: 'bg-red-500', lightColor: 'bg-red-50', textColor: 'text-red-700' },
];

const SOURCES = ['وب‌سایت', 'ارجاع', 'لینکدین', 'نمایشگاه', 'تماس سرد', 'شبکه اجتماعی', 'ایمیل', 'سایر'];

// Mock CRM leads data
const MOCK_LEADS: CrmLead[] = [
  {
    id: '1', name: 'علی محمدی', email: 'ali@example.com', phone: '۰۹۱۲۱۲۳۴۵۶۷',
    company: 'شرکت نوآوران', industry: 'فناوری اطلاعات', source: 'وب‌سایت', stage: 'new',
    value: 50000000, probability: 10, notes: 'تماس اولیه برقرار شده',
    nextFollowUp: '۱۴۰۴/۰۱/۱۵', createdAt: '۱۴۰۴/۰۱/۰۱',
  },
  {
    id: '2', name: 'سارا احمدی', email: 'sara@example.com', phone: '۰۹۱۲۲۳۴۵۶۷۸',
    company: 'گروه سازندگان', industry: 'ساختمان‌سازی', source: 'ارجاع', stage: 'contacted',
    value: 120000000, probability: 25, notes: 'جلسه معرفی برگزار شد',
    nextFollowUp: '۱۴۰۴/۰۱/۱۲', createdAt: '۱۴۰۳/۱۲/۲۰',
  },
  {
    id: '3', name: 'رضا کریمی', email: 'reza@example.com', phone: '۰۹۱۲۳۴۵۶۷۸۹',
    company: 'صنایع پارسیان', industry: 'تولیدی', source: 'نمایشگاه', stage: 'qualified',
    value: 200000000, probability: 50, notes: 'نیازسنجی تکمیل شد',
    nextFollowUp: '۱۴۰۴/۰۱/۱۰', createdAt: '۱۴۰۳/۱۲/۱۵',
  },
  {
    id: '4', name: 'مریم حسینی', email: 'maryam@example.com', phone: '۰۹۱۲۴۵۶۷۸۹۰',
    company: 'فروشگاه آنلاین دیجی‌کالا', industry: 'خرده‌فروشی', source: 'لینکدین', stage: 'proposal',
    value: 85000000, probability: 65, notes: 'پیشنهاد قیمت ارسال شده',
    nextFollowUp: '۱۴۰۴/۰۱/۰۸', createdAt: '۱۴۰۳/۱۲/۱۰',
  },
  {
    id: '5', name: 'حسن نوری', email: 'hasan@example.com', phone: '۰۹۱۲۵۶۷۸۹۰۱',
    company: 'بانک آینده', industry: 'مالی', source: 'شبکه اجتماعی', stage: 'negotiation',
    value: 300000000, probability: 80, notes: 'در حال مذاکره روی قرارداد',
    nextFollowUp: '۱۴۰۴/۰۱/۰۵', createdAt: '۱۴۰۳/۱۲/۰۵',
  },
  {
    id: '6', name: 'فاطمه رضایی', email: 'fatemeh@example.com', phone: '۰۹۱۲۶۷۸۹۰۱۲',
    company: 'شرکت داروسازی رازک', industry: 'دارویی', source: 'ایمیل', stage: 'closed_won',
    value: 450000000, probability: 100, notes: 'قرارداد امضا شد',
    nextFollowUp: '۱۴۰۴/۰۲/۰۱', createdAt: '۱۴۰۳/۱۱/۲۰',
  },
  {
    id: '7', name: 'امیر جعفری', email: 'amir@example.com', phone: '۰۹۱۲۷۸۹۰۱۲۳',
    company: 'شرکت حمل‌ونقل سریع', industry: 'حمل‌ونقل', source: 'تماس سرد', stage: 'closed_lost',
    value: 75000000, probability: 0, notes: 'بودجه مشتری کافی نبود',
    nextFollowUp: undefined, createdAt: '۱۴۰۳/۱۱/۱۰',
  },
  {
    id: '8', name: 'زهرا موسوی', email: 'zahra@example.com', phone: '۰۹۱۲۸۹۰۱۲۳۴',
    company: 'استارتاپ هوشمند', industry: 'فناوری اطلاعات', source: 'وب‌سایت', stage: 'new',
    value: 35000000, probability: 10, notes: 'فرم تماس پر شده',
    nextFollowUp: '۱۴۰۴/۰۱/۱۸', createdAt: '۱۴۰۴/۰۱/۰۲',
  },
  {
    id: '9', name: 'محمد صادقی', email: 'mohammad@example.com', phone: '۰۹۱۲۹۰۱۲۳۴۵',
    company: 'شرکت بازرگانی پارس', industry: 'بازرگانی', source: 'ارجاع', stage: 'contacted',
    value: 95000000, probability: 20, notes: 'تماس تلفنی برقرار شد',
    nextFollowUp: '۱۴۰۴/۰۱/۱۴', createdAt: '۱۴۰۳/۱۲/۲۵',
  },
  {
    id: '10', name: 'نرگس عباسی', email: 'narges@example.com', phone: '۰۹۱۲۰۱۲۳۴۵۶',
    company: 'آژانس تبلیغاتی برند', industry: 'تبلیغات', source: 'نمایشگاه', stage: 'qualified',
    value: 60000000, probability: 45, notes: 'جلسه حضوری برگزار شد',
    nextFollowUp: '۱۴۰۴/۰۱/۱۱', createdAt: '۱۴۰۳/۱۲/۱۸',
  },
  {
    id: '11', name: 'کامران فرهادی', email: 'kamran@example.com', phone: '۰۹۱۲۱۲۳۴۵۰۰',
    company: 'شرکت بیمه آسیا', industry: 'بیمه', source: 'لینکدین', stage: 'proposal',
    value: 180000000, probability: 60, notes: 'پیشنهاد فنی ارسال شد',
    nextFollowUp: '۱۴۰۴/۰۱/۰۹', createdAt: '۱۴۰۳/۱۲/۱۲',
  },
  {
    id: '12', name: 'لیلا قاسمی', email: 'leila@example.com', phone: '۰۹۱۲۲۳۴۵۶۰۰',
    company: 'شرکت مشاوره مدیریت', industry: 'مشاوره', source: 'وب‌سایت', stage: 'negotiation',
    value: 110000000, probability: 75, notes: 'مذاکرات نهایی در جریان',
    nextFollowUp: '۱۴۰۴/۰۱/۰۶', createdAt: '۱۴۰۳/۱۲/۰۸',
  },
];

// Mock interaction history
const MOCK_INTERACTIONS: Record<string, Array<{ type: string; note: string; date: string; user: string }>> = {
  '1': [
    { type: 'call', note: 'تماس اولیه - علاقه‌مند به مشاوره استراتژیک', date: '۱۴۰۴/۰۱/۰۱', user: 'کارشناس فروش' },
    { type: 'email', note: 'ارسال بروشور معرفی خدمات', date: '۱۴۰۴/۰۱/۰۲', user: 'کارشناس فروش' },
  ],
  '3': [
    { type: 'meeting', note: 'جلسه نیازسنجی حضوری', date: '۱۴۰۳/۱۲/۱۵', user: 'مدیر فروش' },
    { type: 'call', note: 'پیگیری و تایید نیازها', date: '۱۴۰۳/۱۲/۲۰', user: 'کارشناس فروش' },
    { type: 'email', note: 'ارسال گزارش نیازسنجی', date: '۱۴۰۳/۱۲/۲۵', user: 'کارشناس فروش' },
  ],
  '5': [
    { type: 'meeting', note: 'جلسه مذاکره اول', date: '۱۴۰۳/۱۲/۰۵', user: 'مدیر فروش' },
    { type: 'meeting', note: 'جلسه مذاکره دوم - بررسی شرایط قرارداد', date: '۱۴۰۳/۱۲/۱۵', user: 'مدیر فروش' },
    { type: 'call', note: 'هماهنگی نهایی', date: '۱۴۰۳/۱۲/۲۰', user: 'مدیر فروش' },
  ],
  '6': [
    { type: 'call', note: 'تماس اولیه', date: '۱۴۰۳/۱۱/۲۰', user: 'کارشناس فروش' },
    { type: 'meeting', note: 'جلسه معرفی', date: '۱۴۰۳/۱۱/۲۵', user: 'مدیر فروش' },
    { type: 'email', note: 'ارسال پیشنهاد', date: '۱۴۰۳/۱۲/۰۱', user: 'کارشناس فروش' },
    { type: 'meeting', note: 'جلسه مذاکره و توافق', date: '۱۴۰۳/۱۲/۱۰', user: 'مدیر فروش' },
    { type: 'email', note: 'ارسال قرارداد نهایی', date: '۱۴۰۳/۱۲/۱۵', user: 'مدیر فروش' },
    { type: 'note', note: 'قرارداد امضا و واریز شد', date: '۱۴۰۳/۱۲/۲۰', user: 'مدیر فروش' },
  ],
};

function formatCurrency(value: number): string {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)} میلیارد`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(0)} میلیون`;
  return value.toLocaleString('fa-IR');
}

function formatShortCurrency(value: number): string {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)} میلیارد`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(0)} م`;
  return `${(value / 1000).toFixed(0)} هزار`;
}

export default function CrmView() {
  const { crmLeads, setCrmLeads, addCrmLead, selectedLeadId, setSelectedLeadId, setView } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formIndustry, setFormIndustry] = useState('');
  const [formSource, setFormSource] = useState('وب‌سایت');
  const [formValue, setFormValue] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Initialize mock data
  const leads = useMemo(() => {
    if (crmLeads.length === 0) {
      setCrmLeads(MOCK_LEADS);
      return MOCK_LEADS;
    }
    return crmLeads;
  }, [crmLeads, setCrmLeads]);

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch = searchTerm === '' ||
        lead.name.includes(searchTerm) ||
        lead.company?.includes(searchTerm) ||
        lead.email?.includes(searchTerm);
      const matchesSource = filterSource === 'all' || lead.source === filterSource;
      const matchesStage = filterStage === 'all' || lead.stage === filterStage;
      return matchesSearch && matchesSource && matchesStage;
    });
  }, [leads, searchTerm, filterSource, filterStage]);

  // Pipeline stats
  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const totalValue = leads.reduce((sum, l) => sum + l.value, 0);
    const wonLeads = leads.filter((l) => l.stage === 'closed_won').length;
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
    const pipelineValue = leads
      .filter((l) => !['closed_won', 'closed_lost'].includes(l.stage))
      .reduce((sum, l) => sum + l.value * (l.probability / 100), 0);
    return { totalLeads, totalValue, conversionRate, pipelineValue, wonLeads };
  }, [leads]);

  // Group leads by stage
  const leadsByStage = useMemo(() => {
    const grouped: Record<string, CrmLead[]> = {};
    PIPELINE_STAGES.forEach((stage) => {
      grouped[stage.key] = filteredLeads.filter((l) => l.stage === stage.key);
    });
    return grouped;
  }, [filteredLeads]);

  // Selected lead details
  const selectedLead = useMemo(() => {
    return leads.find((l) => l.id === selectedLeadId) || null;
  }, [leads, selectedLeadId]);

  const selectedLeadInteractions = selectedLead ? (MOCK_INTERACTIONS[selectedLead.id] || []) : [];

  // Handle drag
  const handleDragStart = (leadId: string) => {
    setDraggedLeadId(leadId);
  };

  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (stage: string) => {
    if (draggedLeadId) {
      const updatedLeads = leads.map((l) =>
        l.id === draggedLeadId ? { ...l, stage, probability: getProbabilityForStage(stage) } : l
      );
      setCrmLeads(updatedLeads);
    }
    setDraggedLeadId(null);
    setDragOverStage(null);
  };

  const getProbabilityForStage = (stage: string): number => {
    const probs: Record<string, number> = {
      new: 10, contacted: 25, qualified: 50, proposal: 65, negotiation: 80, closed_won: 100, closed_lost: 0,
    };
    return probs[stage] || 10;
  };

  // Add lead
  const handleAddLead = () => {
    if (!formName.trim()) return;
    const newLead: CrmLead = {
      id: Date.now().toString(),
      name: formName,
      email: formEmail || undefined,
      phone: formPhone || undefined,
      company: formCompany || undefined,
      industry: formIndustry || undefined,
      source: formSource,
      stage: 'new',
      value: parseInt(formValue) || 0,
      probability: 10,
      notes: formNotes || undefined,
      nextFollowUp: undefined,
      createdAt: new Date().toLocaleDateString('fa-IR'),
    };
    addCrmLead(newLead);
    resetForm();
    setAddDialogOpen(false);
  };

  const resetForm = () => {
    setFormName(''); setFormEmail(''); setFormPhone(''); setFormCompany('');
    setFormIndustry(''); setFormSource('وب‌سایت'); setFormValue(''); setFormNotes('');
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="w-3.5 h-3.5 text-teal-500" />;
      case 'email': return <Mail className="w-3.5 h-3.5 text-blue-500" />;
      case 'meeting': return <Users className="w-3.5 h-3.5 text-emerald-500" />;
      default: return <MessageSquare className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getInteractionLabel = (type: string) => {
    switch (type) {
      case 'call': return 'تماس';
      case 'email': return 'ایمیل';
      case 'meeting': return 'جلسه';
      default: return 'یادداشت';
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-900">مدیریت ارتباط با مشتری</h2>
          <p className="text-slate-500 mt-1">خط لوله فروش و مدیریت سرنخ‌ها</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              <Plus className="w-4 h-4" />
              افزودن سرنخ
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>افزودن سرنخ جدید</DialogTitle>
              <DialogDescription>اطلاعات سرنخ جدید را وارد کنید</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">نام و نام خانوادگی *</Label>
                <Input id="name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="نام کامل" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">ایمیل</Label>
                  <Input id="email" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="email@example.com" dir="ltr" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">تلفن</Label>
                  <Input id="phone" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="۰۹۱۲۱۲۳۴۵۶۷" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="company">شرکت</Label>
                  <Input id="company" value={formCompany} onChange={(e) => setFormCompany(e.target.value)} placeholder="نام شرکت" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="industry">صنعت</Label>
                  <Input id="industry" value={formIndustry} onChange={(e) => setFormIndustry(e.target.value)} placeholder="حوزه فعالیت" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>منبع</Label>
                  <Select value={formSource} onValueChange={setFormSource}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SOURCES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="value">ارزش (ریال)</Label>
                  <Input id="value" type="number" value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="مبلغ به ریال" dir="ltr" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">توضیحات</Label>
                <Textarea id="notes" value={formNotes} onChange={(e) => setFormNotes(e.target.value)} placeholder="توضیحات اضافی..." rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>انصراف</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAddLead}>ذخیره سرنخ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'کل سرنخ‌ها', value: stats.totalLeads, icon: Users, color: 'emerald' },
          { label: 'ارزش کل', value: formatShortCurrency(stats.totalValue), icon: DollarSign, color: 'teal' },
          { label: 'نرخ تبدیل', value: `${stats.conversionRate}٪`, icon: TrendingUp, color: 'amber' },
          { label: 'ارزش موثر خط لوله', value: formatShortCurrency(stats.pipelineValue), icon: Target, color: 'purple' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                    ${stat.color === 'emerald' ? 'bg-emerald-100' : ''}
                    ${stat.color === 'teal' ? 'bg-teal-100' : ''}
                    ${stat.color === 'amber' ? 'bg-amber-100' : ''}
                    ${stat.color === 'purple' ? 'bg-purple-100' : ''}
                  `}>
                    <stat.icon className={`w-5 h-5
                      ${stat.color === 'emerald' ? 'text-emerald-600' : ''}
                      ${stat.color === 'teal' ? 'text-teal-600' : ''}
                      ${stat.color === 'amber' ? 'text-amber-600' : ''}
                      ${stat.color === 'purple' ? 'text-purple-600' : ''}
                    `} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 truncate">{stat.label}</p>
                    <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            className="ps-3 pe-9"
            placeholder="جستجو نام، شرکت یا ایمیل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterSource} onValueChange={setFilterSource}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <Filter className="w-4 h-4 ms-2" />
            <SelectValue placeholder="منبع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه منابع</SelectItem>
            {SOURCES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStage} onValueChange={setFilterStage}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="مرحله" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه مراحل</SelectItem>
            {PIPELINE_STAGES.map((s) => (
              <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Pipeline Kanban */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: '500px' }}>
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = leadsByStage[stage.key] || [];
            const isDragOver = dragOverStage === stage.key;

            return (
              <div
                key={stage.key}
                className={`flex-shrink-0 w-[260px] flex flex-col rounded-xl border-2 transition-colors ${
                  isDragOver ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-200 bg-slate-50/50'
                }`}
                onDragOver={(e) => handleDragOver(e, stage.key)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDrop(stage.key)}
              >
                {/* Stage Header */}
                <div className={`p-3 rounded-t-xl ${stage.lightColor} border-b border-slate-200`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                      <span className={`font-semibold text-sm ${stage.textColor}`}>{stage.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-white/80">
                      {stageLeads.length}
                    </Badge>
                  </div>
                </div>

                {/* Stage Leads */}
                <ScrollArea className="flex-1 p-2">
                  <div className="space-y-2">
                    {stageLeads.map((lead, idx) => (
                      <motion.div
                        key={lead.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        layout
                        draggable
                        onDragStart={() => handleDragStart(lead.id)}
                        className={`cursor-grab active:cursor-grabbing rounded-lg bg-white border border-slate-200 p-3 shadow-sm hover:shadow-md transition-shadow ${
                          draggedLeadId === lead.id ? 'opacity-50' : ''
                        } ${selectedLeadId === lead.id ? 'ring-2 ring-emerald-500 border-emerald-300' : ''}`}
                        onClick={() => setSelectedLeadId(lead.id === selectedLeadId ? null : lead.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                              <User className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <span className="text-sm font-medium text-slate-800 truncate">{lead.name}</span>
                          </div>
                          <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
                        </div>

                        {lead.company && (
                          <div className="flex items-center gap-1 text-xs text-slate-500 mb-1.5">
                            <Building2 className="w-3 h-3" />
                            <span className="truncate">{lead.company}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-emerald-700">
                            {formatShortCurrency(lead.value)}
                          </span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {lead.probability}٪
                          </Badge>
                        </div>

                        {lead.nextFollowUp && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1.5">
                            <Clock className="w-3 h-3" />
                            <span>پیگیری: {lead.nextFollowUp}</span>
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {stageLeads.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                        <Users className="w-6 h-6 mb-2 opacity-50" />
                        <span className="text-xs">سرنخی وجود ندارد</span>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Lead Detail Panel */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-emerald-200 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-emerald-600" />
                    </div>
                    جزئیات سرنخ
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedLeadId(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Lead Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{selectedLead.name}</h3>
                        {selectedLead.company && (
                          <p className="text-sm text-slate-500">{selectedLead.company}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedLead.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600" dir="ltr">{selectedLead.email}</span>
                        </div>
                      )}
                      {selectedLead.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">{selectedLead.phone}</span>
                        </div>
                      )}
                      {selectedLead.industry && (
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">{selectedLead.industry}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Tag className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">منبع: {selectedLead.source}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-emerald-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-slate-500 mb-1">ارزش</p>
                        <p className="font-bold text-emerald-700 text-sm">{formatCurrency(selectedLead.value)}</p>
                      </div>
                      <div className="bg-teal-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-slate-500 mb-1">احتمال</p>
                        <p className="font-bold text-teal-700 text-sm">{selectedLead.probability}٪</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-1">پیشرفت مرحله</p>
                      <Progress value={selectedLead.probability} className="h-2" />
                    </div>

                    {selectedLead.notes && (
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center gap-1 mb-1">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-600">توضیحات</span>
                        </div>
                        <p className="text-sm text-slate-600">{selectedLead.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Interactions History */}
                  <div className="lg:col-span-2">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      تاریخچه تعاملات
                    </h4>
                    <ScrollArea className="max-h-80">
                      {selectedLeadInteractions.length > 0 ? (
                        <div className="space-y-3">
                          {selectedLeadInteractions.map((interaction, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.08 }}
                              className="flex gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-shadow"
                            >
                              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                                {getInteractionIcon(interaction.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-[10px] px-1.5">
                                    {getInteractionLabel(interaction.type)}
                                  </Badge>
                                  <span className="text-[10px] text-slate-400">{interaction.date}</span>
                                  <span className="text-[10px] text-slate-400">• {interaction.user}</span>
                                </div>
                                <p className="text-sm text-slate-700">{interaction.note}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                          <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                          <p className="text-sm">هنوز تعاملی ثبت نشده</p>
                        </div>
                      )}
                    </ScrollArea>

                    {selectedLead.nextFollowUp && (
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        <span className="text-sm text-amber-700">
                          پیگیری بعدی: <strong>{selectedLead.nextFollowUp}</strong>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
