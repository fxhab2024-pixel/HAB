'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import {
  Settings,
  User,
  Bell,
  Moon,
  Globe,
  Save,
  Shield,
  Mail,
} from 'lucide-react';

export default function SettingsView() {
  const { user } = useAppStore();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
    strategy: true,
  });
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      toast.success('تنظیمات ذخیره شد');
    } catch {
      toast.error('خطا در ذخیره‌سازی');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDark = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-slate-900">تنظیمات</h2>
        <p className="text-slate-500 mt-1">مدیریت تنظیمات حساب کاربری</p>
      </motion.div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              پروفایل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>نام و نام خانوادگی</Label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>ایمیل</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="ps-3 pe-10"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>رمز عبور فعلی</Label>
              <Input type="password" placeholder="••••••••" dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>رمز عبور جدید</Label>
              <Input type="password" placeholder="حداقل ۸ کاراکتر" dir="ltr" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Moon className="w-5 h-5 text-emerald-600" />
              ظاهر
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">حالت تاریک</p>
                <p className="text-xs text-slate-500">تغییر تم برنامه به حالت تاریک</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={handleToggleDark} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-700">زبان</p>
                  <p className="text-xs text-slate-500">فارسی (پیش‌فرض)</p>
                </div>
              </div>
              <span className="text-sm text-slate-400">فارسی</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-600" />
              اعلان‌ها
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'email' as const, label: 'اعلان ایمیلی', desc: 'دریافت اعلان‌ها از طریق ایمیل' },
              { key: 'push' as const, label: 'اعلان پوش', desc: 'اعلان‌های مرورگر' },
              { key: 'weekly' as const, label: 'گزارش هفتگی', desc: 'خلاصه وضعیت استراتژیک هر هفته' },
              { key: 'strategy' as const, label: 'به‌روزرسانی استراتژی', desc: 'اطلاع از تغییرات و توصیه‌های جدید' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <Switch
                  checked={notifications[item.key]}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, [item.key]: checked })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              امنیت
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">احراز هویت دومرحله‌ای</p>
                <p className="text-xs text-slate-500">افزایش امنیت حساب کاربری</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
        </Button>
      </div>
    </div>
  );
}
