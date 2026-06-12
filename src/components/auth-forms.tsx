'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/lib/store';
import { Sparkles, ArrowLeft, Mail, Lock, User, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthForms() {
  const { setView, setUser, setToken } = useAppStore();
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('sme');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('لطفاً ایمیل و رمز عبور را وارد کنید');
      return;
    }
    setLoading(true);
    try {
      // Demo: login with mock data
      const mockUser = {
        id: '1',
        name: 'کاربر آزمایشی',
        email: loginEmail,
        role: 'sme' as const,
        companyName: 'شرکت نمونه',
      };
      const mockToken = 'demo-token-123';
      setUser(mockUser);
      setToken(mockToken);
      setView('dashboard');
      toast.success('ورود موفقیت‌آمیز بود');
    } catch {
      toast.error('خطا در ورود. لطفاً دوباره تلاش کنید');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      toast.error('لطفاً تمام فیلدها را پر کنید');
      return;
    }
    setLoading(true);
    try {
      // Demo: register with mock data
      const mockUser = {
        id: '2',
        name: regName,
        email: regEmail,
        role: regRole as 'sme' | 'consultant',
        companyName: '',
      };
      const mockToken = 'demo-token-456';
      setUser(mockUser);
      setToken(mockToken);
      setView('dashboard');
      toast.success('ثبت‌نام موفقیت‌آمیز بود');
    } catch {
      toast.error('خطا در ثبت‌نام. لطفاً دوباره تلاش کنید');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 cursor-pointer"
            onClick={() => setView('landing')}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">BCGSP</h2>
          <p className="text-slate-500 text-sm mt-1">سیستم عامل هوش استراتژیک کسب‌وکار</p>
        </div>

        <Card className="shadow-xl border-slate-200">
          <CardHeader className="pb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">ورود</TabsTrigger>
                <TabsTrigger value="register">ثبت‌نام</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">ایمیل</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="email@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="ps-3 pe-10"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">رمز عبور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="ps-3 pe-10"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={loading}
                  >
                    {loading ? 'در حال ورود...' : 'ورود'}
                    {!loading && <ArrowLeft className="w-4 h-4 ms-2" />}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">نام و نام خانوادگی</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="reg-name"
                        type="text"
                        placeholder="نام کامل"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="ps-3 pe-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">ایمیل</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="email@example.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="ps-3 pe-10"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">رمز عبور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="حداقل ۸ کاراکتر"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="ps-3 pe-10"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>نوع حساب</Label>
                    <Select value={regRole} onValueChange={setRegRole}>
                      <SelectTrigger>
                        <Building2 className="w-4 h-4 ms-2 text-slate-400" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sme">صاحب کسب‌وکار (SME)</SelectItem>
                        <SelectItem value="consultant">مشاور کسب‌وکار</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={loading}
                  >
                    {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
                    {!loading && <ArrowLeft className="w-4 h-4 ms-2" />}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-500 mt-4">
          با ورود یا ثبت‌نام،{' '}
          <span className="text-emerald-600 cursor-pointer hover:underline">
            شرایط استفاده
          </span>{' '}
          را می‌پذیرید.
        </p>
      </motion.div>
    </div>
  );
}
