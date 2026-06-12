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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Receipt,
  Plus,
  ArrowLeft,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Filter,
  Search,
  FileText,
  CreditCard,
  Banknote,
} from 'lucide-react';

// Types
type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  type: string;
  customer: string;
  amount: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  taxRate: number;
  paidAmount: number;
  notes?: string;
}

// Status config
const statusConfig: Record<InvoiceStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  draft: { label: 'پیش‌نویس', color: 'bg-slate-100 text-slate-600', icon: FileText },
  sent: { label: 'ارسال‌شده', color: 'bg-blue-100 text-blue-700', icon: Clock },
  paid: { label: 'پرداخت‌شده', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  partially_paid: { label: 'بخشی‌پرداخت', color: 'bg-yellow-100 text-yellow-700', icon: CreditCard },
  overdue: { label: 'سررسیدگذشته', color: 'bg-red-100 text-red-600', icon: AlertTriangle },
  cancelled: { label: 'لغو‌شده', color: 'bg-slate-100 text-slate-500 line-through', icon: XCircle },
};

// Mock Data
const mockInvoices: Invoice[] = [
  {
    id: 'inv1', invoiceNumber: 'INV-1404-001', type: 'مشاوره', customer: 'شرکت فناوری نوین',
    amount: 45000000, status: 'paid', issueDate: '۱۴۰۴/۰۲/۱۵', dueDate: '۱۴۰۴/۰۳/۱۵',
    items: [
      { description: 'مشاوره استراتژیک', quantity: 10, unitPrice: 3000000, total: 30000000 },
      { description: 'ارزیابی تشخیصی', quantity: 1, unitPrice: 15000000, total: 15000000 },
    ],
    taxRate: 0.09, paidAmount: 45000000,
  },
  {
    id: 'inv2', invoiceNumber: 'INV-1404-002', type: 'اشتراک', customer: 'صنایع غذایی پارس',
    amount: 12000000, status: 'sent', issueDate: '۱۴۰۴/۰۳/۰۱', dueDate: '۱۴۰۴/۰۴/۰۱',
    items: [
      { description: 'اشتراک ماهانه پلتفرم', quantity: 1, unitPrice: 12000000, total: 12000000 },
    ],
    taxRate: 0.09, paidAmount: 0,
  },
  {
    id: 'inv3', invoiceNumber: 'INV-1404-003', type: 'مشاوره', customer: 'گروه ساختمانی آریا',
    amount: 78000000, status: 'partially_paid', issueDate: '۱۴۰۴/۰۲/۲۰', dueDate: '۱۴۰۴/۰۳/۲۰',
    items: [
      { description: 'مشاوره رشد سازمانی', quantity: 20, unitPrice: 3000000, total: 60000000 },
      { description: 'جلسات راهبردی', quantity: 3, unitPrice: 6000000, total: 18000000 },
    ],
    taxRate: 0.09, paidAmount: 40000000,
  },
  {
    id: 'inv4', invoiceNumber: 'INV-1404-004', type: 'خدماتی', customer: 'فروشگاه آنلاین دیجی‌مارکت',
    amount: 25000000, status: 'overdue', issueDate: '۱۴۰۴/۰۱/۱۰', dueDate: '۱۴۰۴/۰۲/۱۰',
    items: [
      { description: 'تحلیل بازار', quantity: 1, unitPrice: 15000000, total: 15000000 },
      { description: 'گزارش رقابتی', quantity: 1, unitPrice: 10000000, total: 10000000 },
    ],
    taxRate: 0.09, paidAmount: 0,
  },
  {
    id: 'inv5', invoiceNumber: 'INV-1404-005', type: 'اشتراک', customer: 'شرکت تحول دیجیتال',
    amount: 12000000, status: 'paid', issueDate: '۱۴۰۴/۰۲/۰۱', dueDate: '۱۴۰۴/۰۳/۰۱',
    items: [
      { description: 'اشتراک ماهانه پلتفرم', quantity: 1, unitPrice: 12000000, total: 12000000 },
    ],
    taxRate: 0.09, paidAmount: 12000000,
  },
  {
    id: 'inv6', invoiceNumber: 'INV-1404-006', type: 'مشاوره', customer: 'صنایع غذایی پارس',
    amount: 35000000, status: 'draft', issueDate: '۱۴۰۴/۰۴/۰۱', dueDate: '۱۴۰۴/۰۵/۰۱',
    items: [
      { description: 'مشاوره بازاریابی', quantity: 5, unitPrice: 5000000, total: 25000000 },
      { description: 'طرح بازاریابی دیجیتال', quantity: 1, unitPrice: 10000000, total: 10000000 },
    ],
    taxRate: 0.09, paidAmount: 0,
  },
  {
    id: 'inv7', invoiceNumber: 'INV-1404-007', type: 'خدماتی', customer: 'شرکت فناوری نوین',
    amount: 18000000, status: 'cancelled', issueDate: '۱۴۰۴/۰۱/۲۵', dueDate: '۱۴۰۴/۰۲/۲۵',
    items: [
      { description: 'سرویس اضافی', quantity: 1, unitPrice: 18000000, total: 18000000 },
    ],
    taxRate: 0.09, paidAmount: 0,
  },
  {
    id: 'inv8', invoiceNumber: 'INV-1404-008', type: 'اشتراک', customer: 'گروه ساختمانی آریا',
    amount: 12000000, status: 'paid', issueDate: '۱۴۰۴/۰۳/۰۱', dueDate: '۱۴۰۴/۰۴/۰۱',
    items: [
      { description: 'اشتراک ماهانه پلتفرم', quantity: 1, unitPrice: 12000000, total: 12000000 },
    ],
    taxRate: 0.09, paidAmount: 12000000,
  },
  {
    id: 'inv9', invoiceNumber: 'INV-1404-009', type: 'مشاوره', customer: 'فروشگاه آنلاین دیجی‌مارکت',
    amount: 52000000, status: 'sent', issueDate: '۱۴۰۴/۰۳/۱۰', dueDate: '۱۴۰۴/۰۴/۱۰',
    items: [
      { description: 'مشاوره استراتژیک جامع', quantity: 15, unitPrice: 3000000, total: 45000000 },
      { description: 'ارزیابی تشخیصی', quantity: 1, unitPrice: 7000000, total: 7000000 },
    ],
    taxRate: 0.09, paidAmount: 0,
  },
  {
    id: 'inv10', invoiceNumber: 'INV-1404-010', type: 'خدماتی', customer: 'شرکت تحول دیجیتال',
    amount: 22000000, status: 'overdue', issueDate: '۱۴۰۴/۰۱/۰۵', dueDate: '۱۴۰۴/۰۲/۰۵',
    items: [
      { description: 'تحلیل SWOT', quantity: 1, unitPrice: 8000000, total: 8000000 },
      { description: 'برنامه‌ریزی راهبردی', quantity: 1, unitPrice: 14000000, total: 14000000 },
    ],
    taxRate: 0.09, paidAmount: 0,
  },
];

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('fa-IR').format(amount);
};

export default function InvoicesView() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');

  const filteredInvoices = mockInvoices.filter((inv) => {
    if (filterStatus !== 'all' && inv.status !== filterStatus) return false;
    if (searchQuery && !inv.customer.includes(searchQuery) && !inv.invoiceNumber.includes(searchQuery)) return false;
    return true;
  });

  // Summary stats
  const totalAmount = mockInvoices.filter(i => i.status !== 'cancelled').reduce((sum, i) => sum + i.amount, 0);
  const paidAmount = mockInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const unpaidAmount = mockInvoices.filter(i => ['sent', 'partially_paid'].includes(i.status)).reduce((sum, i) => sum + i.amount - i.paidAmount, 0);
  const overdueAmount = mockInvoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);

  const summaryStats = [
    { label: 'کل فاکتورها', value: formatAmount(totalAmount), icon: Receipt, color: 'emerald' },
    { label: 'پرداخت‌شده', value: formatAmount(paidAmount), icon: CheckCircle2, color: 'teal' },
    { label: 'پرداخت‌نشده', value: formatAmount(unpaidAmount), icon: Clock, color: 'amber' },
    { label: 'سررسیدگذشته', value: formatAmount(overdueAmount), icon: AlertTriangle, color: 'red' },
  ];

  const colorMap: Record<string, { bg: string; text: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    red: { bg: 'bg-red-50', text: 'text-red-600' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-7 h-7 text-emerald-600" />
              مدیریت فاکتورها
            </h2>
            <p className="text-slate-500 mt-1">صدور، پیگیری و مدیریت فاکتورها</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 ms-1.5" />
                ایجاد فاکتور
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>ایجاد فاکتور جدید</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>مشتری</Label>
                    <Input placeholder="نام مشتری" />
                  </div>
                  <div className="space-y-2">
                    <Label>نوع</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="انتخاب نوع" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consulting">مشاوره</SelectItem>
                        <SelectItem value="subscription">اشتراک</SelectItem>
                        <SelectItem value="service">خدماتی</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>تاریخ صدور</Label>
                    <Input placeholder="۱۴۰۴/۰۴/۰۱" />
                  </div>
                  <div className="space-y-2">
                    <Label>تاریخ سررسید</Label>
                    <Input placeholder="۱۴۰۴/۰۵/۰۱" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>شرح</Label>
                  <Input placeholder="شرح خدمات" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>مقدار</Label>
                    <Input type="number" placeholder="1" />
                  </div>
                  <div className="space-y-2">
                    <Label>قیمت واحد (ریال)</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>مالیات</Label>
                    <Input value="۹٪" readOnly />
                  </div>
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowCreateDialog(false)}>
                  ایجاد فاکتور
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[stat.color].bg}`}>
                    <stat.icon className={`w-4 h-4 ${colorMap[stat.color].text}`} />
                  </div>
                  <span className="text-xs text-slate-500">{stat.label}</span>
                </div>
                <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                <p className="text-[10px] text-slate-400">ریال</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="جستجوی مشتری یا شماره فاکتور..."
              className="ps-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 ms-1.5 text-slate-400" />
              <SelectValue placeholder="فیلتر وضعیت" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه وضعیت‌ها</SelectItem>
              <SelectItem value="draft">پیش‌نویس</SelectItem>
              <SelectItem value="sent">ارسال‌شده</SelectItem>
              <SelectItem value="paid">پرداخت‌شده</SelectItem>
              <SelectItem value="partially_paid">بخشی‌پرداخت</SelectItem>
              <SelectItem value="overdue">سررسیدگذشته</SelectItem>
              <SelectItem value="cancelled">لغو‌شده</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Invoices Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardContent className="p-0">
            <ScrollArea className="max-h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">شماره فاکتور</TableHead>
                    <TableHead className="text-xs">نوع</TableHead>
                    <TableHead className="text-xs">مشتری</TableHead>
                    <TableHead className="text-xs text-left">مبلغ (ریال)</TableHead>
                    <TableHead className="text-xs">وضعیت</TableHead>
                    <TableHead className="text-xs">تاریخ صدور</TableHead>
                    <TableHead className="text-xs">تاریخ سررسید</TableHead>
                    <TableHead className="text-xs">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((inv) => {
                    const cfg = statusConfig[inv.status];
                    const StatusIcon = cfg.icon;
                    return (
                      <TableRow key={inv.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedInvoice(inv)}>
                        <TableCell className="font-medium text-sm">{inv.invoiceNumber}</TableCell>
                        <TableCell className="text-sm text-slate-600">{inv.type}</TableCell>
                        <TableCell className="text-sm">{inv.customer}</TableCell>
                        <TableCell className="text-sm text-left font-bold">{formatAmount(inv.amount)}</TableCell>
                        <TableCell>
                          <Badge className={`text-[10px] ${cfg.color}`}>
                            <StatusIcon className="w-3 h-3 ms-0.5" />
                            {cfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">{inv.issueDate}</TableCell>
                        <TableCell className="text-sm text-slate-500">{inv.dueDate}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedInvoice(inv); }}>
                            مشاهده
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>

      {/* Invoice Detail Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-lg">
          {selectedInvoice && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-600" />
                  فاکتور {selectedInvoice.invoiceNumber}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-500">مشتری</p>
                    <p className="text-sm font-medium">{selectedInvoice.customer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">نوع</p>
                    <p className="text-sm font-medium">{selectedInvoice.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">تاریخ صدور</p>
                    <p className="text-sm">{selectedInvoice.issueDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">تاریخ سررسید</p>
                    <p className="text-sm">{selectedInvoice.dueDate}</p>
                  </div>
                </div>
                <Badge className={statusConfig[selectedInvoice.status].color}>
                  {statusConfig[selectedInvoice.status].label}
                </Badge>
                <Separator />
                {/* Line Items */}
                <div>
                  <p className="text-sm font-bold mb-2">آیتم‌های فاکتور</p>
                  <div className="space-y-2">
                    {selectedInvoice.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded">
                        <div>
                          <p className="font-medium text-slate-800">{item.description}</p>
                          <p className="text-xs text-slate-500">{item.quantity} × {formatAmount(item.unitPrice)} ریال</p>
                        </div>
                        <p className="font-bold text-slate-900">{formatAmount(item.total)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">جمع کل</span>
                    <span className="font-medium">{formatAmount(selectedInvoice.amount)} ریال</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">مالیات ({(selectedInvoice.taxRate * 100).toFixed(0)}٪)</span>
                    <span className="font-medium">{formatAmount(Math.round(selectedInvoice.amount * selectedInvoice.taxRate))} ریال</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>مبلغ نهایی</span>
                    <span className="text-emerald-600">{formatAmount(Math.round(selectedInvoice.amount * (1 + selectedInvoice.taxRate)))} ریال</span>
                  </div>
                  {selectedInvoice.paidAmount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>پرداخت‌شده</span>
                      <span>{formatAmount(selectedInvoice.paidAmount)} ریال</span>
                    </div>
                  )}
                  {selectedInvoice.paidAmount > 0 && selectedInvoice.paidAmount < selectedInvoice.amount && (
                    <div className="flex justify-between text-red-500">
                      <span>مانده</span>
                      <span>{formatAmount(selectedInvoice.amount - selectedInvoice.paidAmount)} ریال</span>
                    </div>
                  )}
                </div>
                {['sent', 'partially_paid', 'overdue'].includes(selectedInvoice.status) && (
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowPaymentDialog(true)}>
                    <Banknote className="w-4 h-4 ms-1.5" />
                    ثبت پرداخت
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ثبت پرداخت</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-3 bg-emerald-50 rounded-lg">
              <p className="text-sm text-slate-700">
                فاکتور: <span className="font-bold">{selectedInvoice?.invoiceNumber}</span>
              </p>
              <p className="text-sm text-slate-700">
                مبلغ باقی‌مانده: <span className="font-bold text-emerald-600">
                  {selectedInvoice ? formatAmount(selectedInvoice.amount - selectedInvoice.paidAmount) : '0'} ریال
                </span>
              </p>
            </div>
            <div className="space-y-2">
              <Label>مبلغ پرداخت (ریال)</Label>
              <Input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="مبلغ پرداختی را وارد کنید"
              />
            </div>
            <div className="space-y-2">
              <Label>روش پرداخت</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="انتخاب روش" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer">انتقال بانکی</SelectItem>
                  <SelectItem value="card">کارت به کارت</SelectItem>
                  <SelectItem value="cash">نقدی</SelectItem>
                  <SelectItem value="check">چک</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowPaymentDialog(false)}>
              ثبت پرداخت
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
