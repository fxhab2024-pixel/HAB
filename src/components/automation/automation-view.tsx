'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAppStore, type AutomationRule, type AutomationTrigger, type AutomationAction } from '@/lib/store';
import {
  Zap,
  Plus,
  Play,
  Pause,
  Copy,
  Trash2,
  Edit3,
  Clock,
  Activity,
  Bell,
  CheckCircle2,
  XCircle,
  Calendar,
  TrendingUp,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Timer,
  Mail,
  FileText,
  Brain,
  Workflow,
  RefreshCcw,
  Sparkles,
  AlertTriangle,
  BarChart3,
  Settings2,
  Eye,
} from 'lucide-react';

// ─── Trigger type labels and configs ─────────────────────────────
const triggerTypeLabels: Record<AutomationTrigger['type'], string> = {
  on_event: 'رویداد',
  scheduled: 'زمان‌بندی',
  on_threshold: 'آستانه',
  on_stage_change: 'تغییر مرحله',
};

const triggerTypeConfig: Record<AutomationTrigger['type'], { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  on_event: { label: 'رویداد', color: 'bg-emerald-100 text-emerald-700', icon: Zap },
  scheduled: { label: 'زمان‌بندی', color: 'bg-teal-100 text-teal-700', icon: Clock },
  on_threshold: { label: 'آستانه', color: 'bg-amber-100 text-amber-700', icon: TrendingUp },
  on_stage_change: { label: 'تغییر مرحله', color: 'bg-purple-100 text-purple-700', icon: ArrowRight },
};

// ─── Action type labels and configs ──────────────────────────────
const actionTypeLabels: Record<AutomationAction['type'], string> = {
  send_notification: 'اعلان',
  create_task: 'وظیفه',
  update_status: 'بروزرسانی وضعیت',
  send_email: 'ایمیل',
  create_workflow: 'گردش کار',
  ai_analysis: 'تحلیل هوشمند',
};

const actionTypeConfig: Record<AutomationAction['type'], { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  send_notification: { label: 'اعلان', color: 'bg-blue-100 text-blue-700', icon: Bell },
  create_task: { label: 'وظیفه', color: 'bg-emerald-100 text-emerald-700', icon: FileText },
  update_status: { label: 'بروزرسانی وضعیت', color: 'bg-teal-100 text-teal-700', icon: RefreshCcw },
  send_email: { label: 'ایمیل', color: 'bg-rose-100 text-rose-700', icon: Mail },
  create_workflow: { label: 'گردش کار', color: 'bg-purple-100 text-purple-700', icon: Workflow },
  ai_analysis: { label: 'تحلیل هوشمند', color: 'bg-amber-100 text-amber-700', icon: Brain },
};

// ─── Status configs ──────────────────────────────────────────────
const statusConfig: Record<AutomationRule['status'], { label: string; color: string; dotColor: string }> = {
  active: { label: 'فعال', color: 'bg-emerald-100 text-emerald-700', dotColor: 'bg-emerald-500' },
  paused: { label: 'متوقف', color: 'bg-yellow-100 text-yellow-700', dotColor: 'bg-yellow-500' },
  draft: { label: 'پیش‌نویس', color: 'bg-slate-100 text-slate-600', dotColor: 'bg-slate-400' },
};

// ─── Event name options ──────────────────────────────────────────
const EVENT_OPTIONS = [
  { value: 'lead_created', label: 'ایجاد لید جدید' },
  { value: 'deal_closed', label: 'بستن معامله' },
  { value: 'task_completed', label: 'تکمیل وظیفه' },
  { value: 'invoice_paid', label: 'پرداخت فاکتور' },
  { value: 'strategy_approved', label: 'تأیید استراتژی' },
  { value: 'report_generated', label: 'تولید گزارش' },
];

// ─── CRM Stage options ──────────────────────────────────────────
const CRM_STAGES = [
  { value: 'new', label: 'جدید' },
  { value: 'contacted', label: 'تماس‌شده' },
  { value: 'qualified', label: 'واجد شرایط' },
  { value: 'proposal', label: 'پیشنهاد' },
  { value: 'negotiation', label: 'مذاکره' },
  { value: 'closed_won', label: 'موفق' },
  { value: 'closed_lost', label: 'از دست‌رفته' },
];

// ─── Metric options for threshold ────────────────────────────────
const METRIC_OPTIONS = [
  { value: 'revenue', label: 'درآمد' },
  { value: 'expenses', label: 'هزینه‌ها' },
  { value: 'conversion_rate', label: 'نرخ تبدیل' },
  { value: 'customer_count', label: 'تعداد مشتریان' },
  { value: 'task_completion', label: 'تکمیل وظایف' },
  { value: 'budget_usage', label: 'مصرف بودجه' },
];

// ─── Mock Automation Rules ───────────────────────────────────────
const MOCK_RULES: AutomationRule[] = [
  {
    id: 'rule-1',
    name: 'اعلان خودکار لید جدید',
    description: 'هنگام ثبت لید جدید، اعلان برای تیم فروش ارسال می‌شود',
    trigger: { type: 'on_event', event: 'lead_created' },
    actions: [
      { id: 'a1', type: 'send_notification', config: { target: 'تیم فروش', message: 'لید جدید ثبت شد' } },
      { id: 'a2', type: 'create_task', config: { assignee: 'کارشناس فروش', title: 'پیگیری لید جدید' } },
    ],
    status: 'active',
    executionCount: 47,
    lastExecutedAt: '۱۴۰۴/۰۴/۱۰ - ۱۴:۳۰',
    createdAt: '۱۴۰۴/۰۲/۱۵',
  },
  {
    id: 'rule-2',
    name: 'پیگیری فروش منقضی',
    description: 'تماس‌های فروش که بیش از ۳ روز پیگیری نشده‌اند شناسایی می‌شوند',
    trigger: { type: 'scheduled', schedule: '0 9 * * *' },
    actions: [
      { id: 'a3', type: 'send_notification', config: { target: 'مدیر فروش', message: 'لیست پیگیری‌های منقضی' } },
      { id: 'a4', type: 'send_email', config: { to: 'sales@company.com', subject: 'پیگیری‌های منقضی روزانه' } },
    ],
    status: 'active',
    executionCount: 128,
    lastExecutedAt: '۱۴۰۴/۰۴/۱۲ - ۰۹:۰۰',
    createdAt: '۱۴۰۴/۰۱/۲۰',
  },
  {
    id: 'rule-3',
    name: 'هشدار بودجه',
    description: 'زمانی که مصرف بودجه از ۸۰٪ فراتر رود، هشدار صادر می‌شود',
    trigger: { type: 'on_threshold', threshold: { metric: 'budget_usage', operator: 'gt', value: 80 } },
    actions: [
      { id: 'a5', type: 'send_notification', config: { target: 'مدیر مالی', message: 'هشدار مصرف بودجه' } },
      { id: 'a6', type: 'create_workflow', config: { workflowName: 'بازبینی بودجه' } },
    ],
    status: 'active',
    executionCount: 12,
    lastExecutedAt: '۱۴۰۴/۰۳/۲۸ - ۱۱:۱۵',
    createdAt: '۱۴۰۴/۰۲/۰۵',
  },
  {
    id: 'rule-4',
    name: 'ارتقای مرحله CRM',
    description: 'هنگام انتقال لید به مرحله مذاکره، وظیفه تهیه پیشنهاد ایجاد می‌شود',
    trigger: { type: 'on_stage_change', fromStage: 'proposal', toStage: 'negotiation' },
    actions: [
      { id: 'a7', type: 'create_task', config: { assignee: 'مدیر فروش', title: 'تهیه پیشنهاد نهایی' } },
      { id: 'a8', type: 'update_status', config: { entity: 'lead', status: 'in_review' } },
      { id: 'a9', type: 'send_notification', config: { target: 'مدیرعامل', message: 'لید وارد مرحله مذاکره شد' } },
    ],
    status: 'active',
    executionCount: 23,
    lastExecutedAt: '۱۴۰۴/۰۴/۰۸ - ۱۶:۴۵',
    createdAt: '۱۴۰۴/۰۳/۰۱',
  },
  {
    id: 'rule-5',
    name: 'تحلیل هوشمند هفتگی',
    description: 'هر هفته تحلیل هوشمند عملکرد فروش و استراتژی انجام می‌شود',
    trigger: { type: 'scheduled', schedule: '0 8 * * 1' },
    actions: [
      { id: 'a10', type: 'ai_analysis', config: { analysisType: 'sales_performance', depth: 'full' } },
      { id: 'a11', type: 'send_email', config: { to: 'management@company.com', subject: 'گزارش تحلیل هفتگی' } },
    ],
    status: 'active',
    executionCount: 16,
    lastExecutedAt: '۱۴۰۴/۰۴/۰۷ - ۰۸:۰۰',
    createdAt: '۱۴۰۴/۰۱/۱۰',
  },
  {
    id: 'rule-6',
    name: 'گزارش ماهانه خودکار',
    description: 'تولید و ارسال خودکار گزارش عملکرد ماهانه به مدیران ارشد',
    trigger: { type: 'scheduled', schedule: '0 10 1 * *' },
    actions: [
      { id: 'a12', type: 'ai_analysis', config: { analysisType: 'monthly_report', depth: 'summary' } },
      { id: 'a13', type: 'send_email', config: { to: 'ceo@company.com', subject: 'گزارش ماهانه عملکرد' } },
      { id: 'a14', type: 'create_task', config: { assignee: 'تحلیلگر', title: 'بازبینی گزارش ماهانه' } },
    ],
    status: 'paused',
    executionCount: 4,
    lastExecutedAt: '۱۴۰۴/۰۳/۰۱ - ۱۰:۰۰',
    createdAt: '۱۴۰۴/۰۲/۱۵',
  },
  {
    id: 'rule-7',
    name: 'نرخ تبدیل پایین',
    description: 'اگر نرخ تبدیل از ۱۰٪ کمتر شود، تحلیل و هشدار صادر می‌گردد',
    trigger: { type: 'on_threshold', threshold: { metric: 'conversion_rate', operator: 'lt', value: 10 } },
    actions: [
      { id: 'a15', type: 'send_notification', config: { target: 'مدیر فروش', message: 'نرخ تبدیل پایین است' } },
      { id: 'a16', type: 'ai_analysis', config: { analysisType: 'conversion_funnel', depth: 'detailed' } },
    ],
    status: 'draft',
    executionCount: 0,
    lastExecutedAt: undefined,
    createdAt: '۱۴۰۴/۰۴/۰۵',
  },
  {
    id: 'rule-8',
    name: 'بستن معامله موفق',
    description: 'پس از بسته شدن معامله، وظایف تحویل و پیگیری ایجاد می‌شود',
    trigger: { type: 'on_event', event: 'deal_closed' },
    actions: [
      { id: 'a17', type: 'create_task', config: { assignee: 'تیم پیاده‌سازی', title: 'شروع فرآیند تحویل' } },
      { id: 'a18', type: 'send_email', config: { to: 'customer@client.com', subject: 'خوش آمدید' } },
      { id: 'a19', type: 'update_status', config: { entity: 'deal', status: 'delivered' } },
      { id: 'a20', type: 'create_workflow', config: { workflowName: 'فرآیند تحویل مشتری' } },
    ],
    status: 'active',
    executionCount: 31,
    lastExecutedAt: '۱۴۰۴/۰۴/۱۱ - ۱۳:۲۰',
    createdAt: '۱۴۰۴/۰۲/۲۵',
  },
];

// ─── Mock Execution History ──────────────────────────────────────
interface ExecutionRecord {
  id: string;
  ruleId: string;
  ruleName: string;
  triggerType: AutomationTrigger['type'];
  executedAt: string;
  duration: string;
  result: 'success' | 'failed';
  details: string;
}

const MOCK_EXECUTION_HISTORY: ExecutionRecord[] = [
  { id: 'exec-1', ruleId: 'rule-1', ruleName: 'اعلان خودکار لید جدید', triggerType: 'on_event', executedAt: '۱۴۰۴/۰۴/۱۲ - ۱۴:۳۰', duration: '۱.۲ ثانیه', result: 'success', details: 'اعلان برای تیم فروش ارسال شد. وظیفه پیگیری برای کارشناس فروش ایجاد گردید.' },
  { id: 'exec-2', ruleId: 'rule-2', ruleName: 'پیگیری فروش منقضی', triggerType: 'scheduled', executedAt: '۱۴۰۴/۰۴/۱۲ - ۰۹:۰۰', duration: '۳.۵ ثانیه', result: 'success', details: '۵ پیگیری منقضی شناسایی شد. اعلان و ایمیل ارسال گردید.' },
  { id: 'exec-3', ruleId: 'rule-5', ruleName: 'تحلیل هوشمند هفتگی', triggerType: 'scheduled', executedAt: '۱۴۰۴/۰۴/۰۷ - ۰۸:۰۰', duration: '۱۲.۸ ثانیه', result: 'success', details: 'تحلیل کامل عملکرد فروش انجام شد. گزارش به ایمیل مدیریت ارسال گردید.' },
  { id: 'exec-4', ruleId: 'rule-4', ruleName: 'ارتقای مرحله CRM', triggerType: 'on_stage_change', executedAt: '۱۴۰۴/۰۴/۰۸ - ۱۶:۴۵', duration: '۰.۸ ثانیه', result: 'success', details: 'لید "شرکت نوآوران" به مرحله مذاکره منتقل شد. وظیفه و اعلان مربوطه ایجاد گردید.' },
  { id: 'exec-5', ruleId: 'rule-3', ruleName: 'هشدار بودجه', triggerType: 'on_threshold', executedAt: '۱۴۰۴/۰۳/۲۸ - ۱۱:۱۵', duration: '۰.۵ ثانیه', result: 'success', details: 'مصرف بودجه به ۸۵٪ رسید. هشدار به مدیر مالی ارسال و گردش کار بازبینی فعال شد.' },
  { id: 'exec-6', ruleId: 'rule-8', ruleName: 'بستن معامله موفق', triggerType: 'on_event', executedAt: '۱۴۰۴/۰۴/۱۱ - ۱۳:۲۰', duration: '۲.۱ ثانیه', result: 'success', details: 'معامله "صنایع پارسیان" بسته شد. ایمیل خوش‌آمدگویی و وظیفه تحویل ایجاد گردید.' },
  { id: 'exec-7', ruleId: 'rule-2', ruleName: 'پیگیری فروش منقضی', triggerType: 'scheduled', executedAt: '۱۴۰۴/۰۴/۱۱ - ۰۹:۰۰', duration: '۲.۳ ثانیه', result: 'failed', details: 'خطا در ارسال ایمیل: آدرس گیرنده نامعتبر. اعلان با موفقیت ارسال شد.' },
  { id: 'exec-8', ruleId: 'rule-6', ruleName: 'گزارش ماهانه خودکار', triggerType: 'scheduled', executedAt: '۱۴۰۴/۰۳/۰۱ - ۱۰:۰۰', duration: '۸.۴ ثانیه', result: 'success', details: 'گزارش ماهانه اسفند تولید و ارسال شد. وظیفه بازبینی ایجاد گردید.' },
  { id: 'exec-9', ruleId: 'rule-1', ruleName: 'اعلان خودکار لید جدید', triggerType: 'on_event', executedAt: '۱۴۰۴/۰۴/۱۱ - ۱۱:۰۰', duration: '۰.۹ ثانیه', result: 'success', details: 'اعلان برای تیم فروش ارسال شد. وظیفه پیگیری ایجاد گردید.' },
  { id: 'exec-10', ruleId: 'rule-4', ruleName: 'ارتقای مرحله CRM', triggerType: 'on_stage_change', executedAt: '۱۴۰۴/۰۴/۰۶ - ۱۰:۳۰', duration: '۱.۱ ثانیه', result: 'failed', details: 'خطا در بروزرسانی وضعیت: رکورد یافت نشد. اعلان و وظیفه با موفقیت ایجاد شدند.' },
  { id: 'exec-11', ruleId: 'rule-5', ruleName: 'تحلیل هوشمند هفتگی', triggerType: 'scheduled', executedAt: '۱۴۰۴/۰۳/۳۱ - ۰۸:۰۰', duration: '۱۵.۲ ثانیه', result: 'success', details: 'تحلیل هفتگی با موفقیت انجام شد. روندهای مثبت در نرخ تبدیل شناسایی گردید.' },
  { id: 'exec-12', ruleId: 'rule-3', ruleName: 'هشدار بودجه', triggerType: 'on_threshold', executedAt: '۱۴۰۴/۰۳/۲۵ - ۱۴:۰۰', duration: '۰.۶ ثانیه', result: 'success', details: 'هشدار مصرف بودجه (۷۸٪) صادر شد. مدیر مالی مطلع گردید.' },
];

// ─── Mock Templates ──────────────────────────────────────────────
interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  actionCount: number;
  category: string;
}

const MOCK_TEMPLATES: AutomationTemplate[] = [
  {
    id: 'tpl-1',
    name: 'اعلان خودکار لید جدید',
    description: 'هنگام ثبت لید جدید، فوراً اعلان به تیم فروش ارسال و وظیفه پیگیری ایجاد شود',
    icon: Bell,
    trigger: { type: 'on_event', event: 'lead_created' },
    actions: [
      { id: 'ta1', type: 'send_notification', config: { target: 'تیم فروش' } },
      { id: 'ta2', type: 'create_task', config: { title: 'پیگیری لید جدید' } },
    ],
    actionCount: 2,
    category: 'فروش',
  },
  {
    id: 'tpl-2',
    name: 'پیگیری فروش منقضی',
    description: 'شناسایی روزانه تماس‌هایی که بیش از ۳ روز پیگیری نشده‌اند و ارسال اعلان',
    icon: Clock,
    trigger: { type: 'scheduled', schedule: '0 9 * * *' },
    actions: [
      { id: 'ta3', type: 'send_notification', config: { target: 'مدیر فروش' } },
      { id: 'ta4', type: 'send_email', config: { subject: 'لیست پیگیری منقضی' } },
    ],
    actionCount: 2,
    category: 'فروش',
  },
  {
    id: 'tpl-3',
    name: 'هشدار بودجه',
    description: 'صدور هشدار زمانی که مصرف بودجه از آستانه مشخصی فراتر رود',
    icon: AlertTriangle,
    trigger: { type: 'on_threshold', threshold: { metric: 'budget_usage', operator: 'gt', value: 80 } },
    actions: [
      { id: 'ta5', type: 'send_notification', config: { target: 'مدیر مالی' } },
      { id: 'ta6', type: 'create_workflow', config: { workflowName: 'بازبینی بودجه' } },
    ],
    actionCount: 2,
    category: 'مالی',
  },
  {
    id: 'tpl-4',
    name: 'تحلیل هوشمند هفتگی',
    description: 'تحلیل هوشمند هفتگی عملکرد فروش با هوش مصنوعی و ارسال گزارش',
    icon: Brain,
    trigger: { type: 'scheduled', schedule: '0 8 * * 1' },
    actions: [
      { id: 'ta7', type: 'ai_analysis', config: { analysisType: 'weekly_sales' } },
      { id: 'ta8', type: 'send_email', config: { subject: 'گزارش تحلیل هفتگی' } },
    ],
    actionCount: 2,
    category: 'تحلیل',
  },
  {
    id: 'tpl-5',
    name: 'اتوماسیون ارتقای مرحله CRM',
    description: 'ایجاد خودکار وظایف و اعلان‌ها هنگام انتقال لید به مرحله جدید در CRM',
    icon: ArrowRight,
    trigger: { type: 'on_stage_change', fromStage: 'proposal', toStage: 'negotiation' },
    actions: [
      { id: 'ta9', type: 'create_task', config: { title: 'تهیه پیشنهاد نهایی' } },
      { id: 'ta10', type: 'send_notification', config: { target: 'مدیرعامل' } },
      { id: 'ta11', type: 'update_status', config: { entity: 'lead', status: 'in_review' } },
    ],
    actionCount: 3,
    category: 'CRM',
  },
  {
    id: 'tpl-6',
    name: 'گزارش ماهانه خودکار',
    description: 'تولید و ارسال خودکار گزارش عملکرد ماهانه به مدیران ارشد با تحلیل هوشمند',
    icon: BarChart3,
    trigger: { type: 'scheduled', schedule: '0 10 1 * *' },
    actions: [
      { id: 'ta12', type: 'ai_analysis', config: { analysisType: 'monthly_report' } },
      { id: 'ta13', type: 'send_email', config: { subject: 'گزارش ماهانه عملکرد' } },
      { id: 'ta14', type: 'create_task', config: { title: 'بازبینی گزارش ماهانه' } },
    ],
    actionCount: 3,
    category: 'گزارش‌دهی',
  },
];

// ─── Helper: operator label ──────────────────────────────────────
function operatorLabel(op: 'gt' | 'lt' | 'eq'): string {
  switch (op) {
    case 'gt': return 'بزرگ‌تر از';
    case 'lt': return 'کوچک‌تر از';
    case 'eq': return 'مساوی با';
  }
}

// ─── Helper: event label ─────────────────────────────────────────
function eventLabel(eventVal: string): string {
  const found = EVENT_OPTIONS.find((e) => e.value === eventVal);
  return found ? found.label : eventVal;
}

// ─── Helper: stage label ────────────────────────────────────────
function stageLabel(stageVal: string): string {
  const found = CRM_STAGES.find((s) => s.value === stageVal);
  return found ? found.label : stageVal;
}

// ─── Helper: metric label ───────────────────────────────────────
function metricLabel(metricVal: string): string {
  const found = METRIC_OPTIONS.find((m) => m.value === metricVal);
  return found ? found.label : metricVal;
}

// ═══════════════════════════════════════════════════════════════════
//  Main Component
// ═══════════════════════════════════════════════════════════════════
export default function AutomationView() {
  const { automationRules, setAutomationRules, addAutomationRule, updateAutomationRule } = useAppStore();
  const [activeTab, setActiveTab] = useState('rules');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [expandedExecId, setExpandedExecId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // ── Form state ──────────────────────────────────────────────
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTriggerType, setFormTriggerType] = useState<AutomationTrigger['type']>('on_event');
  const [formEvent, setFormEvent] = useState('lead_created');
  const [formSchedule, setFormSchedule] = useState('0 9 * * *');
  const [formThresholdMetric, setFormThresholdMetric] = useState('budget_usage');
  const [formThresholdOperator, setFormThresholdOperator] = useState<'gt' | 'lt' | 'eq'>('gt');
  const [formThresholdValue, setFormThresholdValue] = useState('80');
  const [formFromStage, setFormFromStage] = useState('proposal');
  const [formToStage, setFormToStage] = useState('negotiation');
  const [formActions, setFormActions] = useState<AutomationAction[]>([
    { id: 'new-a1', type: 'send_notification', config: {} },
  ]);

  // Initialize mock data
  const rules = useMemo(() => {
    if (automationRules.length === 0) {
      setAutomationRules(MOCK_RULES);
      return MOCK_RULES;
    }
    return automationRules;
  }, [automationRules, setAutomationRules]);

  // ── Stats ───────────────────────────────────────────────────
  const stats = useMemo(() => {
    const activeCount = rules.filter((r) => r.status === 'active').length;
    const totalExecutions = rules.reduce((sum, r) => sum + r.executionCount, 0);
    const failedExecutions = MOCK_EXECUTION_HISTORY.filter((e) => e.result === 'failed').length;
    const successRate = MOCK_EXECUTION_HISTORY.length > 0
      ? Math.round(((MOCK_EXECUTION_HISTORY.length - failedExecutions) / MOCK_EXECUTION_HISTORY.length) * 100)
      : 100;
    return { activeCount, totalExecutions, failedExecutions, successRate };
  }, [rules]);

  // ── Open dialog for create ──────────────────────────────────
  const handleCreateRule = () => {
    setEditingRule(null);
    resetForm();
    setDialogOpen(true);
  };

  // ── Open dialog for edit ────────────────────────────────────
  const handleEditRule = (rule: AutomationRule) => {
    setEditingRule(rule);
    setFormName(rule.name);
    setFormDescription(rule.description);
    setFormTriggerType(rule.trigger.type);
    setFormEvent(rule.trigger.event || 'lead_created');
    setFormSchedule(rule.trigger.schedule || '0 9 * * *');
    setFormThresholdMetric(rule.trigger.threshold?.metric || 'budget_usage');
    setFormThresholdOperator(rule.trigger.threshold?.operator || 'gt');
    setFormThresholdValue(rule.trigger.threshold?.value?.toString() || '80');
    setFormFromStage(rule.trigger.fromStage || 'proposal');
    setFormToStage(rule.trigger.toStage || 'negotiation');
    setFormActions(rule.actions.length > 0 ? rule.actions : [{ id: 'new-a1', type: 'send_notification', config: {} }]);
    setDialogOpen(true);
  };

  // ── Reset form ──────────────────────────────────────────────
  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormTriggerType('on_event');
    setFormEvent('lead_created');
    setFormSchedule('0 9 * * *');
    setFormThresholdMetric('budget_usage');
    setFormThresholdOperator('gt');
    setFormThresholdValue('80');
    setFormFromStage('proposal');
    setFormToStage('negotiation');
    setFormActions([{ id: 'new-a1', type: 'send_notification', config: {} }]);
  };

  // ── Save rule ───────────────────────────────────────────────
  const handleSaveRule = () => {
    if (!formName.trim()) return;

    const trigger: AutomationTrigger = { type: formTriggerType };
    switch (formTriggerType) {
      case 'on_event':
        trigger.event = formEvent;
        break;
      case 'scheduled':
        trigger.schedule = formSchedule;
        break;
      case 'on_threshold':
        trigger.threshold = { metric: formThresholdMetric, operator: formThresholdOperator, value: parseFloat(formThresholdValue) || 0 };
        break;
      case 'on_stage_change':
        trigger.fromStage = formFromStage;
        trigger.toStage = formToStage;
        break;
    }

    if (editingRule) {
      updateAutomationRule(editingRule.id, {
        name: formName,
        description: formDescription,
        trigger,
        actions: formActions,
      });
    } else {
      const newRule: AutomationRule = {
        id: `rule-${Date.now()}`,
        name: formName,
        description: formDescription,
        trigger,
        actions: formActions,
        status: 'active',
        executionCount: 0,
        lastExecutedAt: undefined,
        createdAt: new Date().toLocaleDateString('fa-IR'),
      };
      addAutomationRule(newRule);
    }
    setDialogOpen(false);
    resetForm();
  };

  // ── Toggle rule status ──────────────────────────────────────
  const handleToggleStatus = (ruleId: string) => {
    const rule = rules.find((r) => r.id === ruleId);
    if (!rule) return;
    const newStatus: AutomationRule['status'] = rule.status === 'active' ? 'paused' : 'active';
    updateAutomationRule(ruleId, { status: newStatus });
  };

  // ── Duplicate rule ──────────────────────────────────────────
  const handleDuplicateRule = (rule: AutomationRule) => {
    const duplicated: AutomationRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      name: `${rule.name} (کپی)`,
      executionCount: 0,
      lastExecutedAt: undefined,
      createdAt: new Date().toLocaleDateString('fa-IR'),
      actions: rule.actions.map((a) => ({ ...a, id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` })),
    };
    addAutomationRule(duplicated);
  };

  // ── Delete rule ─────────────────────────────────────────────
  const handleDeleteRule = (ruleId: string) => {
    setAutomationRules(rules.filter((r) => r.id !== ruleId));
    setDeleteConfirmId(null);
  };

  // ── Use template ────────────────────────────────────────────
  const handleUseTemplate = (template: AutomationTemplate) => {
    const newRule: AutomationRule = {
      id: `rule-${Date.now()}`,
      name: template.name,
      description: template.description,
      trigger: template.trigger,
      actions: template.actions.map((a) => ({ ...a, id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` })),
      status: 'active',
      executionCount: 0,
      lastExecutedAt: undefined,
      createdAt: new Date().toLocaleDateString('fa-IR'),
    };
    addAutomationRule(newRule);
    setActiveTab('rules');
  };

  // ── Add action to form ──────────────────────────────────────
  const handleAddAction = () => {
    setFormActions([
      ...formActions,
      { id: `a-${Date.now()}`, type: 'send_notification', config: {} },
    ]);
  };

  // ── Remove action from form ─────────────────────────────────
  const handleRemoveAction = (actionId: string) => {
    if (formActions.length <= 1) return;
    setFormActions(formActions.filter((a) => a.id !== actionId));
  };

  // ── Update action type ──────────────────────────────────────
  const handleUpdateActionType = (actionId: string, newType: AutomationAction['type']) => {
    setFormActions(
      formActions.map((a) => (a.id === actionId ? { ...a, type: newType, config: {} } : a))
    );
  };

  // ── Render trigger description ──────────────────────────────
  const renderTriggerDescription = (trigger: AutomationTrigger): string => {
    switch (trigger.type) {
      case 'on_event':
        return `هنگام: ${eventLabel(trigger.event || '')}`;
      case 'scheduled':
        return `زمان‌بندی: ${trigger.schedule}`;
      case 'on_threshold':
        return trigger.threshold
          ? `${metricLabel(trigger.threshold.metric)} ${operatorLabel(trigger.threshold.operator)} ${trigger.threshold.value}`
          : 'آستانه';
      case 'on_stage_change':
        return `${stageLabel(trigger.fromStage || '')} ← ${stageLabel(trigger.toStage || '')}`;
      default:
        return '';
    }
  };

  // ═══════════════════════════════════════════════════════════
  //  Render
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="space-y-6" dir="rtl">
      {/* ── Header Section ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">موتور اتوماسیون هوشمند</h2>
              <p className="text-slate-500 mt-0.5">مدیریت و خودکارسازی فرآیندهای کسب‌وکار با قوانین هوشمند</p>
            </div>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2 shadow-md shadow-emerald-100" onClick={handleCreateRule}>
            <Plus className="w-4 h-4" />
            ایجاد قانون
          </Button>
        </div>
      </motion.div>

      {/* ── Stats Badges ────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'قوانین فعال', value: stats.activeCount, icon: Play, color: 'emerald' },
          { label: 'کل اجراها', value: stats.totalExecutions, icon: Activity, color: 'teal' },
          { label: 'نرخ موفقیت', value: `${stats.successRate}٪`, icon: CheckCircle2, color: 'amber' },
          { label: 'خطاها', value: stats.failedExecutions, icon: XCircle, color: 'rose' },
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
                    ${stat.color === 'rose' ? 'bg-rose-100' : ''}
                  `}>
                    <stat.icon className={`w-5 h-5
                      ${stat.color === 'emerald' ? 'text-emerald-600' : ''}
                      ${stat.color === 'teal' ? 'text-teal-600' : ''}
                      ${stat.color === 'amber' ? 'text-amber-600' : ''}
                      ${stat.color === 'rose' ? 'text-rose-600' : ''}
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

      {/* ── Tabs ────────────────────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 p-1 h-auto">
          <TabsTrigger value="rules" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white gap-1.5 px-4 py-2">
            <Settings2 className="w-4 h-4" />
            قوانین اتوماسیون
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white gap-1.5 px-4 py-2">
            <Clock className="w-4 h-4" />
            تاریخچه اجرا
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white gap-1.5 px-4 py-2">
            <Sparkles className="w-4 h-4" />
            قالب‌های آماده
          </TabsTrigger>
        </TabsList>

        {/* ── Rules Tab ──────────────────────────────────────── */}
        <TabsContent value="rules">
          <AnimatePresence mode="wait">
            <motion.div
              key="rules-list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {rules.map((rule, i) => {
                  const triggerCfg = triggerTypeConfig[rule.trigger.type];
                  const TriggerIcon = triggerCfg.icon;
                  const statusCfg = statusConfig[rule.status];

                  return (
                    <motion.div
                      key={rule.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      layout
                    >
                      <Card className="hover:shadow-lg transition-all hover:border-emerald-200 group">
                        <CardContent className="p-5">
                          {/* Header: status & trigger badges */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge className={`${statusCfg.color} text-xs gap-1`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotColor}`} />
                                {statusCfg.label}
                              </Badge>
                              <Badge className={`${triggerCfg.color} text-xs gap-1`}>
                                <TriggerIcon className="w-3 h-3" />
                                {triggerCfg.label}
                              </Badge>
                            </div>
                            <Switch
                              checked={rule.status === 'active'}
                              onCheckedChange={() => handleToggleStatus(rule.id)}
                              className="data-[state=checked]:bg-emerald-500"
                            />
                          </div>

                          {/* Rule name & description */}
                          <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
                            {rule.name}
                          </h3>
                          <p className="text-sm text-slate-500 mb-3 line-clamp-2">{rule.description}</p>

                          {/* Trigger description */}
                          <div className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 mb-3 flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{renderTriggerDescription(rule.trigger)}</span>
                          </div>

                          {/* Actions list */}
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {rule.actions.map((action) => {
                              const actCfg = actionTypeConfig[action.type];
                              const ActIcon = actCfg.icon;
                              return (
                                <Badge key={action.id} variant="outline" className="text-[10px] gap-1 py-0.5 px-1.5">
                                  <ActIcon className="w-3 h-3" />
                                  {actCfg.label}
                                </Badge>
                              );
                            })}
                          </div>

                          <Separator className="mb-3" />

                          {/* Footer: stats & quick actions */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Activity className="w-3.5 h-3.5" />
                                {rule.executionCount} اجرا
                              </span>
                              {rule.lastExecutedAt && (
                                <span className="flex items-center gap-1">
                                  <Timer className="w-3.5 h-3.5" />
                                  {rule.lastExecutedAt}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-emerald-50" onClick={() => handleEditRule(rule)}>
                                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-emerald-50" onClick={() => handleToggleStatus(rule.id)}>
                                {rule.status === 'active' ? (
                                  <Pause className="w-3.5 h-3.5 text-amber-500" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 text-emerald-500" />
                                )}
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-emerald-50" onClick={() => handleDuplicateRule(rule)}>
                                <Copy className="w-3.5 h-3.5 text-slate-500" />
                              </Button>
                              {deleteConfirmId === rule.id ? (
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-50" onClick={() => handleDeleteRule(rule.id)}>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteConfirmId(null)}>
                                    <XCircle className="w-3.5 h-3.5 text-slate-400" />
                                  </Button>
                                </div>
                              ) : (
                                <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-50" onClick={() => setDeleteConfirmId(rule.id)}>
                                  <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}

                {/* Empty state */}
                {rules.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400"
                  >
                    <Zap className="w-12 h-12 mb-3 opacity-40" />
                    <p className="text-lg font-medium">هنوز قانونی تعریف نشده</p>
                    <p className="text-sm mt-1">با کلیک روی «ایجاد قانون» شروع کنید</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* ── Execution History Tab ──────────────────────────── */}
        <TabsContent value="history">
          <AnimatePresence mode="wait">
            <motion.div
              key="history-list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    تاریخچه اجرای اتوماسیون‌ها
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="max-h-[550px]">
                    <div className="divide-y">
                      {MOCK_EXECUTION_HISTORY.map((exec, i) => {
                        const triggerCfg = triggerTypeConfig[exec.triggerType];
                        const TriggerIcon = triggerCfg.icon;
                        const isExpanded = expandedExecId === exec.id;

                        return (
                          <motion.div
                            key={exec.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <div
                              className="p-4 flex items-center gap-3 cursor-pointer"
                              onClick={() => setExpandedExecId(isExpanded ? null : exec.id)}
                            >
                              {/* Result icon */}
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                exec.result === 'success' ? 'bg-emerald-50' : 'bg-red-50'
                              }`}>
                                {exec.result === 'success' ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-red-500" />
                                )}
                              </div>

                              {/* Main info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium text-slate-900 text-sm">{exec.ruleName}</span>
                                  <Badge className={`${triggerCfg.color} text-[10px] gap-0.5 py-0 px-1.5`}>
                                    <TriggerIcon className="w-3 h-3" />
                                    {triggerCfg.label}
                                  </Badge>
                                  <Badge className={`text-[10px] py-0 px-1.5 ${
                                    exec.result === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                                  }`}>
                                    {exec.result === 'success' ? 'موفق' : 'ناموفق'}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {exec.executedAt}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Timer className="w-3 h-3" />
                                    {exec.duration}
                                  </span>
                                </div>
                              </div>

                              {/* Expand toggle */}
                              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-slate-400" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-slate-400" />
                                )}
                              </Button>
                            </div>

                            {/* Expanded details */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-4 pb-4 pe-16">
                                    <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600 leading-relaxed">
                                      <div className="flex items-center gap-1.5 mb-2">
                                        <Eye className="w-4 h-4 text-emerald-500" />
                                        <span className="font-medium text-slate-700">جزئیات اجرا</span>
                                      </div>
                                      {exec.details}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* ── Templates Tab ──────────────────────────────────── */}
        <TabsContent value="templates">
          <AnimatePresence mode="wait">
            <motion.div
              key="templates-list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {MOCK_TEMPLATES.map((template, i) => {
                  const TemplateIcon = template.icon;
                  const triggerCfg = triggerTypeConfig[template.trigger.type];

                  return (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <Card className="hover:shadow-lg transition-all hover:border-teal-200 group h-full flex flex-col">
                        <CardContent className="p-5 flex flex-col flex-1">
                          {/* Icon & category */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-100">
                              <TemplateIcon className="w-5 h-5 text-white" />
                            </div>
                            <Badge variant="outline" className="text-xs">{template.category}</Badge>
                          </div>

                          {/* Name & description */}
                          <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
                            {template.name}
                          </h3>
                          <p className="text-sm text-slate-500 mb-4 flex-1 line-clamp-2">{template.description}</p>

                          {/* Trigger & actions info */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Badge className={`${triggerCfg.color} text-[10px] gap-0.5 py-0 px-1.5`}>
                                {triggerCfg.label}
                              </Badge>
                              <span className="flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                {renderTriggerDescription(template.trigger)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Activity className="w-3.5 h-3.5" />
                              <span>{template.actionCount} اقدام</span>
                              <div className="flex gap-1 ms-1">
                                {template.actions.map((action) => {
                                  const aCfg = actionTypeConfig[action.type];
                                  const AIcon = aCfg.icon;
                                  return (
                                    <span key={action.id} className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center" title={aCfg.label}>
                                      <AIcon className="w-3 h-3 text-slate-500" />
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Use button */}
                          <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2 mt-auto"
                            onClick={() => handleUseTemplate(template)}
                          >
                            <Sparkles className="w-4 h-4" />
                            استفاده از قالب
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>

      {/* ── Create/Edit Rule Dialog ──────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        if (!open) { resetForm(); }
        setDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-emerald-600" />
              {editingRule ? 'ویرایش قانون اتوماسیون' : 'ایجاد قانون اتوماسیون'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Rule Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">نام قانون *</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="مثلاً: اعلان خودکار لید جدید"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">توضیحات</Label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="توضیح مختصر درباره عملکرد این قانون..."
                rows={2}
              />
            </div>

            <Separator />

            {/* ── Trigger Section ─────────────────────────────── */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                تنظیمات ماشه (Trigger)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">نوع ماشه</Label>
                  <Select value={formTriggerType} onValueChange={(v) => setFormTriggerType(v as AutomationTrigger['type'])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on_event">رویداد</SelectItem>
                      <SelectItem value="scheduled">زمان‌بندی</SelectItem>
                      <SelectItem value="on_threshold">آستانه</SelectItem>
                      <SelectItem value="on_stage_change">تغییر مرحله</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Conditional trigger fields */}
                {formTriggerType === 'on_event' && (
                  <div className="space-y-2">
                    <Label className="text-sm">نام رویداد</Label>
                    <Select value={formEvent} onValueChange={setFormEvent}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EVENT_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formTriggerType === 'scheduled' && (
                  <div className="space-y-2">
                    <Label className="text-sm">زمان‌بندی (Cron)</Label>
                    <Input
                      value={formSchedule}
                      onChange={(e) => setFormSchedule(e.target.value)}
                      placeholder="0 9 * * *"
                      dir="ltr"
                    />
                    <p className="text-xs text-slate-400">فرمت: دقیقه ساعت روز ماه روز‌هفته</p>
                  </div>
                )}

                {formTriggerType === 'on_threshold' && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm">معیار</Label>
                      <Select value={formThresholdMetric} onValueChange={setFormThresholdMetric}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {METRIC_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">عملگر</Label>
                      <Select value={formThresholdOperator} onValueChange={(v) => setFormThresholdOperator(v as 'gt' | 'lt' | 'eq')}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gt">بزرگ‌تر از</SelectItem>
                          <SelectItem value="lt">کوچک‌تر از</SelectItem>
                          <SelectItem value="eq">مساوی با</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">مقدار آستانه</Label>
                      <Input
                        type="number"
                        value={formThresholdValue}
                        onChange={(e) => setFormThresholdValue(e.target.value)}
                        placeholder="80"
                        dir="ltr"
                      />
                    </div>
                  </>
                )}

                {formTriggerType === 'on_stage_change' && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm">از مرحله</Label>
                      <Select value={formFromStage} onValueChange={setFormFromStage}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CRM_STAGES.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">به مرحله</Label>
                      <Select value={formToStage} onValueChange={setFormToStage}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CRM_STAGES.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            </div>

            <Separator />

            {/* ── Actions Section ──────────────────────────────── */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-emerald-600" />
                  اقدامات ({formActions.length})
                </h4>
                <Button variant="outline" size="sm" className="gap-1 text-emerald-700 border-emerald-200 hover:bg-emerald-50" onClick={handleAddAction}>
                  <Plus className="w-3.5 h-3.5" />
                  افزودن اقدام
                </Button>
              </div>

              <div className="space-y-3">
                {formActions.map((action, idx) => {
                  const actCfg = actionTypeConfig[action.type];
                  const ActIcon = actCfg.icon;

                  return (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border border-slate-200 rounded-lg p-4 bg-slate-50/50"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                          <ActIcon className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <Select value={action.type} onValueChange={(v) => handleUpdateActionType(action.id, v as AutomationAction['type'])}>
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="send_notification">اعلان</SelectItem>
                              <SelectItem value="create_task">وظیفه</SelectItem>
                              <SelectItem value="update_status">بروزرسانی وضعیت</SelectItem>
                              <SelectItem value="send_email">ایمیل</SelectItem>
                              <SelectItem value="create_workflow">گردش کار</SelectItem>
                              <SelectItem value="ai_analysis">تحلیل هوشمند</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {formActions.length > 1 && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-50 shrink-0" onClick={() => handleRemoveAction(action.id)}>
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </Button>
                        )}
                      </div>

                      {/* Action-specific config fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {action.type === 'send_notification' && (
                          <>
                            <div className="space-y-1">
                              <Label className="text-xs">مخاطب</Label>
                              <Input
                                value={(action.config.target as string) || ''}
                                onChange={(e) => {
                                  const updated = formActions.map((a) =>
                                    a.id === action.id ? { ...a, config: { ...a.config, target: e.target.value } } : a
                                  );
                                  setFormActions(updated);
                                }}
                                placeholder="مثلاً: تیم فروش"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">پیام</Label>
                              <Input
                                value={(action.config.message as string) || ''}
                                onChange={(e) => {
                                  const updated = formActions.map((a) =>
                                    a.id === action.id ? { ...a, config: { ...a.config, message: e.target.value } } : a
                                  );
                                  setFormActions(updated);
                                }}
                                placeholder="متن اعلان..."
                              />
                            </div>
                          </>
                        )}
                        {action.type === 'create_task' && (
                          <>
                            <div className="space-y-1">
                              <Label className="text-xs">عنوان وظیفه</Label>
                              <Input
                                value={(action.config.title as string) || ''}
                                onChange={(e) => {
                                  const updated = formActions.map((a) =>
                                    a.id === action.id ? { ...a, config: { ...a.config, title: e.target.value } } : a
                                  );
                                  setFormActions(updated);
                                }}
                                placeholder="عنوان وظیفه..."
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">مسئول</Label>
                              <Input
                                value={(action.config.assignee as string) || ''}
                                onChange={(e) => {
                                  const updated = formActions.map((a) =>
                                    a.id === action.id ? { ...a, config: { ...a.config, assignee: e.target.value } } : a
                                  );
                                  setFormActions(updated);
                                }}
                                placeholder="مثلاً: کارشناس فروش"
                              />
                            </div>
                          </>
                        )}
                        {action.type === 'update_status' && (
                          <>
                            <div className="space-y-1">
                              <Label className="text-xs">موجودیت</Label>
                              <Input
                                value={(action.config.entity as string) || ''}
                                onChange={(e) => {
                                  const updated = formActions.map((a) =>
                                    a.id === action.id ? { ...a, config: { ...a.config, entity: e.target.value } } : a
                                  );
                                  setFormActions(updated);
                                }}
                                placeholder="مثلاً: lead"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">وضعیت جدید</Label>
                              <Input
                                value={(action.config.status as string) || ''}
                                onChange={(e) => {
                                  const updated = formActions.map((a) =>
                                    a.id === action.id ? { ...a, config: { ...a.config, status: e.target.value } } : a
                                  );
                                  setFormActions(updated);
                                }}
                                placeholder="مثلاً: in_review"
                              />
                            </div>
                          </>
                        )}
                        {action.type === 'send_email' && (
                          <>
                            <div className="space-y-1">
                              <Label className="text-xs">گیرنده</Label>
                              <Input
                                value={(action.config.to as string) || ''}
                                onChange={(e) => {
                                  const updated = formActions.map((a) =>
                                    a.id === action.id ? { ...a, config: { ...a.config, to: e.target.value } } : a
                                  );
                                  setFormActions(updated);
                                }}
                                placeholder="email@example.com"
                                dir="ltr"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">موضوع</Label>
                              <Input
                                value={(action.config.subject as string) || ''}
                                onChange={(e) => {
                                  const updated = formActions.map((a) =>
                                    a.id === action.id ? { ...a, config: { ...a.config, subject: e.target.value } } : a
                                  );
                                  setFormActions(updated);
                                }}
                                placeholder="موضوع ایمیل..."
                              />
                            </div>
                          </>
                        )}
                        {action.type === 'create_workflow' && (
                          <div className="space-y-1 col-span-full">
                            <Label className="text-xs">نام گردش کار</Label>
                            <Input
                              value={(action.config.workflowName as string) || ''}
                              onChange={(e) => {
                                const updated = formActions.map((a) =>
                                  a.id === action.id ? { ...a, config: { ...a.config, workflowName: e.target.value } } : a
                                );
                                setFormActions(updated);
                              }}
                              placeholder="مثلاً: بازبینی بودجه"
                            />
                          </div>
                        )}
                        {action.type === 'ai_analysis' && (
                          <>
                            <div className="space-y-1">
                              <Label className="text-xs">نوع تحلیل</Label>
                              <Input
                                value={(action.config.analysisType as string) || ''}
                                onChange={(e) => {
                                  const updated = formActions.map((a) =>
                                    a.id === action.id ? { ...a, config: { ...a.config, analysisType: e.target.value } } : a
                                  );
                                  setFormActions(updated);
                                }}
                                placeholder="مثلاً: sales_performance"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">عمق تحلیل</Label>
                              <Select
                                value={(action.config.depth as string) || 'summary'}
                                onValueChange={(v) => {
                                  const updated = formActions.map((a) =>
                                    a.id === action.id ? { ...a, config: { ...a.config, depth: v } } : a
                                  );
                                  setFormActions(updated);
                                }}
                              >
                                <SelectTrigger className="h-8 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="summary">خلاصه</SelectItem>
                                  <SelectItem value="detailed">تفصیلی</SelectItem>
                                  <SelectItem value="full">کامل</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* ── Dialog Actions ───────────────────────────────── */}
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => { resetForm(); setDialogOpen(false); }}>
                انصراف
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                onClick={handleSaveRule}
                disabled={!formName.trim()}
              >
                <CheckCircle2 className="w-4 h-4" />
                {editingRule ? 'بروزرسانی قانون' : 'ذخیره قانون'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
