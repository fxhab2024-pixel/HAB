'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/lib/store';
import {
  Workflow,
  Plus,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  Clock,
  User,
  Play,
  Pause,
  Archive,
  ArrowLeft,
  Activity,
} from 'lucide-react';

// Types
type WorkflowStatus = 'active' | 'paused' | 'archived';
type WorkflowType = 'approval' | 'review' | 'escalation' | 'notification';
type StepAction = 'approve' | 'reject' | 'review' | 'comment';

interface WorkflowStep {
  id: string;
  name: string;
  assigneeRole: string;
  actionType: StepAction;
  order: number;
}

interface WorkflowDefinition {
  id: string;
  name: string;
  type: WorkflowType;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  createdAt: string;
}

interface WorkflowInstance {
  id: string;
  workflowId: string;
  workflowName: string;
  currentStep: number;
  totalSteps: number;
  status: 'in_progress' | 'completed' | 'rejected' | 'paused';
  initiatedBy: string;
  initiatedAt: string;
}

interface ActionLog {
  id: string;
  instanceId: string;
  workflowName: string;
  stepName: string;
  user: string;
  action: StepAction;
  timestamp: string;
  comment?: string;
}

// Mock Data
const mockWorkflows: WorkflowDefinition[] = [
  {
    id: 'wf1',
    name: 'تأیید استراتژی',
    type: 'approval',
    status: 'active',
    steps: [
      { id: 's1', name: 'ارائه پیشنهاد', assigneeRole: 'مشاور', actionType: 'review', order: 1 },
      { id: 's2', name: 'بازبینی تحلیلی', assigneeRole: 'تحلیلگر', actionType: 'review', order: 2 },
      { id: 's3', name: 'تأیید مدیریتی', assigneeRole: 'مدیرعامل', actionType: 'approve', order: 3 },
      { id: 's4', name: 'اعلام نتیجه', assigneeRole: 'مشاور', actionType: 'comment', order: 4 },
    ],
    createdAt: '۱۴۰۴/۰۳/۱۵',
  },
  {
    id: 'wf2',
    name: 'بازبینی ارزیابی',
    type: 'review',
    status: 'active',
    steps: [
      { id: 's5', name: 'ثبت نتایج', assigneeRole: 'مشاور', actionType: 'review', order: 1 },
      { id: 's6', name: 'بررسی کیفیت', assigneeRole: 'سرپرست', actionType: 'approve', order: 2 },
      { id: 's7', name: 'تأیید نهایی', assigneeRole: 'مدیرعامل', actionType: 'approve', order: 3 },
    ],
    createdAt: '۱۴۰۴/۰۳/۲۰',
  },
  {
    id: 'wf3',
    name: 'تأیید بودجه',
    type: 'approval',
    status: 'paused',
    steps: [
      { id: 's8', name: 'تهیه پیش‌نویس', assigneeRole: 'تحلیلگر مالی', actionType: 'review', order: 1 },
      { id: 's9', name: 'بررسی مالی', assigneeRole: 'مدیر مالی', actionType: 'approve', order: 2 },
      { id: 's10', name: 'تأیید مدیرعامل', assigneeRole: 'مدیرعامل', actionType: 'approve', order: 3 },
      { id: 's11', name: 'اعلام بودجه', assigneeRole: 'حسابداری', actionType: 'comment', order: 4 },
    ],
    createdAt: '۱۴۰۴/۰۲/۱۰',
  },
  {
    id: 'wf4',
    name: 'تشدید مسئله',
    type: 'escalation',
    status: 'active',
    steps: [
      { id: 's12', name: 'ثبت مسئله', assigneeRole: 'مشاور', actionType: 'comment', order: 1 },
      { id: 's13', name: 'بررسی فوری', assigneeRole: 'مدیر شعبه', actionType: 'review', order: 2 },
      { id: 's14', name: 'تصمیم‌گیری', assigneeRole: 'مدیرعامل', actionType: 'approve', order: 3 },
    ],
    createdAt: '۱۴۰۴/۰۴/۰۱',
  },
  {
    id: 'wf5',
    name: 'اعلان عمومی',
    type: 'notification',
    status: 'archived',
    steps: [
      { id: 's15', name: 'تهیه محتوا', assigneeRole: 'بازاریابی', actionType: 'review', order: 1 },
      { id: 's16', name: 'تأیید محتوا', assigneeRole: 'مدیر ارتباطات', actionType: 'approve', order: 2 },
      { id: 's17', name: 'انتشار', assigneeRole: 'فنی', actionType: 'comment', order: 3 },
    ],
    createdAt: '۱۴۰۴/۰۱/۰۵',
  },
];

const mockInstances: WorkflowInstance[] = [
  { id: 'inst1', workflowId: 'wf1', workflowName: 'تأیید استراتژی', currentStep: 2, totalSteps: 4, status: 'in_progress', initiatedBy: 'علی محمدی', initiatedAt: '۱۴۰۴/۰۴/۱۰' },
  { id: 'inst2', workflowId: 'wf2', workflowName: 'بازبینی ارزیابی', currentStep: 3, totalSteps: 3, status: 'in_progress', initiatedBy: 'سارا رضایی', initiatedAt: '۱۴۰۴/۰۴/۰۸' },
  { id: 'inst3', workflowId: 'wf1', workflowName: 'تأیید استراتژی', currentStep: 4, totalSteps: 4, status: 'completed', initiatedBy: 'رضا احمدی', initiatedAt: '۱۴۰۴/۰۳/۲۵' },
  { id: 'inst4', workflowId: 'wf3', workflowName: 'تأیید بودجه', currentStep: 1, totalSteps: 4, status: 'paused', initiatedBy: 'مریم کریمی', initiatedAt: '۱۴۰۴/۰۳/۱۵' },
  { id: 'inst5', workflowId: 'wf4', workflowName: 'تشدید مسئله', currentStep: 2, totalSteps: 3, status: 'in_progress', initiatedBy: 'حسین نوری', initiatedAt: '۱۴۰۴/۰۴/۱۲' },
];

const mockActionLog: ActionLog[] = [
  { id: 'log1', instanceId: 'inst1', workflowName: 'تأیید استراتژی', stepName: 'ارائه پیشنهاد', user: 'علی محمدی', action: 'review', timestamp: '۱۴۰۴/۰۴/۱۰ - ۰۹:۳۰', comment: 'پیشنهاد بررسی شد' },
  { id: 'log2', instanceId: 'inst1', workflowName: 'تأیید استراتژی', stepName: 'بازبینی تحلیلی', user: 'سارا رضایی', action: 'review', timestamp: '۱۴۰۴/۰۴/۱۱ - ۱۴:۰۰', comment: 'تحلیل تایید شد' },
  { id: 'log3', instanceId: 'inst2', workflowName: 'بازبینی ارزیابی', stepName: 'ثبت نتایج', user: 'سارا رضایی', action: 'review', timestamp: '۱۴۰۴/۰۴/۰۸ - ۱۰:۱۵' },
  { id: 'log4', instanceId: 'inst3', workflowName: 'تأیید استراتژی', stepName: 'تأیید مدیریتی', user: 'محمد مدیرعامل', action: 'approve', timestamp: '۱۴۰۴/۰۳/۲۶ - ۱۱:۰۰', comment: 'تأیید شد' },
  { id: 'log5', instanceId: 'inst5', workflowName: 'تشدید مسئله', stepName: 'ثبت مسئله', user: 'حسین نوری', action: 'comment', timestamp: '۱۴۰۴/۰۴/۱۲ - ۰۸:۴۵', comment: 'مسئله بحرانی ثبت شد' },
  { id: 'log6', instanceId: 'inst4', workflowName: 'تأیید بودجه', stepName: 'تهیه پیش‌نویس', user: 'مریم کریمی', action: 'reject', timestamp: '۱۴۰۴/۰۳/۱۶ - ۱۶:۳۰', comment: 'نیاز به اصلاح ارقام' },
];

const typeLabels: Record<WorkflowType, string> = {
  approval: 'تأییدیه',
  review: 'بازبینی',
  escalation: 'تشدید',
  notification: 'اعلان',
};

const statusConfig: Record<WorkflowStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  active: { label: 'فعال', color: 'bg-emerald-100 text-emerald-700', icon: Play },
  paused: { label: 'متوقف', color: 'bg-yellow-100 text-yellow-700', icon: Pause },
  archived: { label: 'بایگانی', color: 'bg-slate-100 text-slate-600', icon: Archive },
};

const actionConfig: Record<StepAction, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  approve: { label: 'تأیید', color: 'text-emerald-600', icon: CheckCircle2 },
  reject: { label: 'رد', color: 'text-red-500', icon: XCircle },
  review: { label: 'بازبینی', color: 'text-teal-600', icon: Eye },
  comment: { label: 'توضیح', color: 'text-slate-500', icon: MessageSquare },
};

const instanceStatusConfig: Record<string, { label: string; color: string }> = {
  in_progress: { label: 'در حال اجرا', color: 'bg-emerald-100 text-emerald-700' },
  completed: { label: 'تکمیل‌شده', color: 'bg-teal-100 text-teal-700' },
  rejected: { label: 'ردشده', color: 'bg-red-100 text-red-600' },
  paused: { label: 'متوقف', color: 'bg-yellow-100 text-yellow-700' },
};

export default function BpmView() {
  const { setView } = useAppStore();
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowDefinition | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'workflows' | 'instances' | 'log'>('workflows');
  const [newWfName, setNewWfName] = useState('');
  const [newWfType, setNewWfType] = useState<WorkflowType>('approval');

  const handleSelectWorkflow = (wf: WorkflowDefinition) => {
    setSelectedWorkflow(wf);
  };

  const handleBack = () => {
    setSelectedWorkflow(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {selectedWorkflow && (
              <Button variant="ghost" size="icon" onClick={handleBack} className="hover:bg-emerald-50">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Workflow className="w-7 h-7 text-emerald-600" />
                {selectedWorkflow ? selectedWorkflow.name : 'مدیریت گردش کار'}
              </h2>
              <p className="text-slate-500 mt-1">
                {selectedWorkflow ? 'جزئیات و مراحل گردش کار' : 'تعریف، مدیریت و پایش فرآیندهای کسب‌وکار'}
              </p>
            </div>
          </div>
          {!selectedWorkflow && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 ms-1.5" />
                  ایجاد گردش کار
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>ایجاد گردش کار جدید</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>نام گردش کار</Label>
                    <Input value={newWfName} onChange={(e) => setNewWfName(e.target.value)} placeholder="مثلاً: تأیید قرارداد" />
                  </div>
                  <div className="space-y-2">
                    <Label>نوع</Label>
                    <Select value={newWfType} onValueChange={(v) => setNewWfType(v as WorkflowType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approval">تأییدیه</SelectItem>
                        <SelectItem value="review">بازبینی</SelectItem>
                        <SelectItem value="escalation">تشدید</SelectItem>
                        <SelectItem value="notification">اعلان</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowCreateDialog(false)}>
                    ایجاد
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </motion.div>

      {selectedWorkflow ? (
        /* Workflow Detail View */
        <WorkflowDetail workflow={selectedWorkflow} />
      ) : (
        /* Main List View */
        <>
          {/* Tab Buttons */}
          <div className="flex gap-2">
            {[
              { key: 'workflows' as const, label: 'گردش‌های کاری', icon: Workflow },
              { key: 'instances' as const, label: 'نمونه‌های فعال', icon: Activity },
              { key: 'log' as const, label: 'تاریخچه اقدامات', icon: Clock },
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? 'default' : 'outline'}
                className={activeTab === tab.key ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                onClick={() => setActiveTab(tab.key)}
              >
                <tab.icon className="w-4 h-4 ms-1.5" />
                {tab.label}
              </Button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'workflows' && (
              <motion.div key="workflows" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {mockWorkflows.map((wf, i) => (
                    <motion.div
                      key={wf.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-emerald-300" onClick={() => handleSelectWorkflow(wf)}>
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <Badge className={statusConfig[wf.status].color}>
                              {statusConfig[wf.status].label}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {typeLabels[wf.type]}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-slate-900 mb-2">{wf.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <ChevronLeft className="w-4 h-4" />
                              {wf.steps.length} مرحله
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {wf.createdAt}
                            </span>
                          </div>
                          {/* Mini stepper */}
                          <div className="flex items-center gap-1 mt-4">
                            {wf.steps.map((step, idx) => (
                              <div key={step.id} className="flex items-center flex-1">
                                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700 shrink-0">
                                  {idx + 1}
                                </div>
                                {idx < wf.steps.length - 1 && (
                                  <div className="flex-1 h-0.5 bg-emerald-200" />
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'instances' && (
              <motion.div key="instances" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <Card>
                  <CardContent className="p-0">
                    <ScrollArea className="max-h-[500px]">
                      <div className="divide-y">
                        {mockInstances.map((inst, i) => (
                          <motion.div
                            key={inst.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <Workflow className="w-5 h-5 text-emerald-600" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{inst.workflowName}</p>
                                <p className="text-xs text-slate-500">
                                  {inst.initiatedBy} • {inst.initiatedAt}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-left">
                                <p className="text-sm text-slate-700">
                                  مرحله {inst.currentStep} از {inst.totalSteps}
                                </p>
                                <div className="w-24 h-1.5 bg-slate-200 rounded-full mt-1">
                                  <div
                                    className="h-full bg-emerald-500 rounded-full transition-all"
                                    style={{ width: `${(inst.currentStep / inst.totalSteps) * 100}%` }}
                                  />
                                </div>
                              </div>
                              <Badge className={instanceStatusConfig[inst.status].color}>
                                {instanceStatusConfig[inst.status].label}
                              </Badge>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'log' && (
              <motion.div key="log" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <Card>
                  <CardContent className="p-0">
                    <ScrollArea className="max-h-[500px]">
                      <div className="divide-y">
                        {mockActionLog.map((log, i) => {
                          const action = actionConfig[log.action];
                          const ActionIcon = action.icon;
                          return (
                            <motion.div
                              key={log.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors"
                            >
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${log.action === 'approve' ? 'bg-emerald-50' : log.action === 'reject' ? 'bg-red-50' : 'bg-teal-50'}`}>
                                <ActionIcon className={`w-5 h-5 ${action.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium text-slate-900">{log.user}</span>
                                  <span className="text-slate-500 text-sm">
                                    {action.label} کرد
                                  </span>
                                  <span className="text-slate-700 text-sm font-medium">{log.stepName}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {log.workflowName} • {log.timestamp}
                                </p>
                                {log.comment && (
                                  <p className="text-sm text-slate-600 mt-1 bg-slate-50 rounded p-2">
                                    {log.comment}
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

/* Sub-component: Workflow Detail */
function WorkflowDetail({ workflow }: { workflow: WorkflowDefinition }) {
  const statusCfg = statusConfig[workflow.status];
  const StatusIcon = statusCfg.icon;

  return (
    <div className="space-y-6">
      {/* Info Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-3">
                <Badge className={statusCfg.color}>
                  <StatusIcon className="w-3.5 h-3.5 ms-1" />
                  {statusCfg.label}
                </Badge>
                <Badge variant="outline">{typeLabels[workflow.type]}</Badge>
              </div>
              <span className="text-sm text-slate-500 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                تاریخ ایجاد: {workflow.createdAt}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{workflow.name}</h3>
            <p className="text-sm text-slate-500 mt-1">{workflow.steps.length} مرحله در این گردش کار</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Steps Stepper */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ChevronLeft className="w-5 h-5 text-emerald-600" />
              مراحل گردش کار
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {workflow.steps.map((step, idx) => {
                const action = actionConfig[step.actionType];
                const ActionIcon = action.icon;
                const isLast = idx === workflow.steps.length - 1;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.1, duration: 0.3 }}
                    className="flex gap-4"
                  >
                    {/* Step Number + Connector */}
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {idx + 1}
                      </div>
                      {!isLast && (
                        <div className="w-0.5 flex-1 bg-emerald-200 my-1 min-h-[40px]" />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className={`flex-1 pb-6 ${isLast ? 'pb-0' : ''}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-slate-900">{step.name}</h4>
                        <Badge className={`text-xs ${step.actionType === 'approve' ? 'bg-emerald-50 text-emerald-700' : step.actionType === 'reject' ? 'bg-red-50 text-red-600' : step.actionType === 'review' ? 'bg-teal-50 text-teal-700' : 'bg-slate-50 text-slate-600'}`}>
                          <ActionIcon className="w-3 h-3 ms-1" />
                          {action.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <User className="w-4 h-4" />
                        <span>نقش: {step.assigneeRole}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Related Instances */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              نمونه‌های این گردش کار
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockInstances
                .filter((inst) => inst.workflowId === workflow.id)
                .map((inst) => (
                  <div key={inst.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <Play className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{inst.initiatedBy}</p>
                        <p className="text-xs text-slate-500">{inst.initiatedAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-600">مرحله {inst.currentStep}/{inst.totalSteps}</span>
                      <Badge className={instanceStatusConfig[inst.status].color}>
                        {instanceStatusConfig[inst.status].label}
                      </Badge>
                    </div>
                  </div>
                ))}
              {mockInstances.filter((inst) => inst.workflowId === workflow.id).length === 0 && (
                <p className="text-sm text-slate-500 text-center py-6">نمونه فعالی یافت نشد</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
