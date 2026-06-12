'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { DIMENSIONS, getScoreLabel, getScoreColor, getTierLabel } from '@/lib/diagnostic-questions';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Shield,
  Zap,
  Target,
  ClipboardCheck,
  Lightbulb,
  Map,
  ArrowLeft,
  Activity,
} from 'lucide-react';

// Mock data for demo
const mockOverallScore = 62;
const mockRiskScore = 35;
const mockGrowthPotential = 71;
const mockInvestmentReadiness = 48;

const mockDimensionScores = DIMENSIONS.map((d) => ({
  dimension: d.name,
  score: Math.floor(Math.random() * 40) + 40,
  fullMark: 100,
}));

const scoreColor = (score: number) => {
  if (score >= 80) return '#059669';
  if (score >= 65) return '#eab308';
  if (score >= 50) return '#f97316';
  return '#ef4444';
};

function ScoreGauge({ score, label, size = 120 }: { score: number; label: string; size?: number }) {
  const data = [
    { name: 'score', value: score },
    { name: 'remaining', value: 100 - score },
  ];
  const colors = [scoreColor(score), '#e2e8f0'];

  return (
    <div className="flex flex-col items-center">
      <div style={{ width: size, height: size }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={size * 0.32}
              outerRadius={size * 0.45}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</span>
          <span className="text-[10px] text-slate-500">از ۱۰۰</span>
        </div>
      </div>
      <span className="text-sm font-medium text-slate-700 mt-2">{label}</span>
    </div>
  );
}

export default function Dashboard() {
  const { setView, user } = useAppStore();

  const kpis = [
    {
      title: 'امتیاز کل',
      value: mockOverallScore,
      icon: Target,
      color: 'emerald',
      description: getTierLabel(mockOverallScore),
    },
    {
      title: 'امتیاز ریسک',
      value: mockRiskScore,
      icon: Shield,
      color: 'red',
      description: getScoreLabel(100 - mockRiskScore),
    },
    {
      title: 'پتانسیل رشد',
      value: mockGrowthPotential,
      icon: TrendingUp,
      color: 'teal',
      description: getScoreLabel(mockGrowthPotential),
    },
    {
      title: 'آمادگی سرمایه‌گذاری',
      value: mockInvestmentReadiness,
      icon: Zap,
      color: 'orange',
      description: getScoreLabel(mockInvestmentReadiness),
    },
  ];

  const recentActivity = [
    { title: 'تشخیص استراتژیک تکمیل شد', time: '۲ ساعت پیش', type: 'success' },
    { title: 'توصیه‌های جدید تولید شد', time: '۳ ساعت پیش', type: 'info' },
    { title: 'نقشه راه بروزرسانی شد', time: '۱ روز پیش', type: 'info' },
    { title: 'وظیفه جدید اضافه شد', time: '۲ روز پیش', type: 'default' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-slate-900">
          خوش آمدید، {user?.name || 'کاربر'}
        </h2>
        <p className="text-slate-500 mt-1">خلاصه وضعیت استراتژیک کسب‌وکار شما</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * index }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center
                    ${kpi.color === 'emerald' ? 'bg-emerald-100' : ''}
                    ${kpi.color === 'red' ? 'bg-red-100' : ''}
                    ${kpi.color === 'teal' ? 'bg-teal-100' : ''}
                    ${kpi.color === 'orange' ? 'bg-orange-100' : ''}
                  `}
                  >
                    <kpi.icon
                      className={`w-5 h-5
                      ${kpi.color === 'emerald' ? 'text-emerald-600' : ''}
                      ${kpi.color === 'red' ? 'text-red-600' : ''}
                      ${kpi.color === 'teal' ? 'text-teal-600' : ''}
                      ${kpi.color === 'orange' ? 'text-orange-600' : ''}
                    `}
                    />
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      kpi.value >= 80
                        ? 'bg-emerald-100 text-emerald-700'
                        : kpi.value >= 65
                        ? 'bg-yellow-100 text-yellow-700'
                        : kpi.value >= 50
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {kpi.description}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500 mb-1">{kpi.title}</p>
                <p className="text-3xl font-bold text-slate-900">{kpi.value}</p>
                <Progress
                  value={kpi.value}
                  className="h-1.5 mt-3"
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strategic Health Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                سلامت استراتژیک
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                <ScoreGauge score={mockOverallScore} label="امتیاز سلامت استراتژیک" size={180} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                نمودار ابعاد استراتژیک
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={mockDimensionScores} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis
                      dataKey="dimension"
                      tick={{ fontSize: 10, fill: '#64748b' }}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                    <Radar
                      name="امتیاز"
                      dataKey="score"
                      stroke="#059669"
                      fill="#059669"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">دسترسی سریع</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 hover:border-emerald-300 hover:bg-emerald-50"
                onClick={() => setView('diagnostic')}
              >
                <ClipboardCheck className="w-6 h-6 text-emerald-600" />
                <span className="text-sm">تشخیص جدید</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 hover:border-emerald-300 hover:bg-emerald-50"
                onClick={() => setView('strategy')}
              >
                <Lightbulb className="w-6 h-6 text-teal-600" />
                <span className="text-sm">توصیه‌ها</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 hover:border-emerald-300 hover:bg-emerald-50"
                onClick={() => setView('roadmap')}
              >
                <Map className="w-6 h-6 text-emerald-500" />
                <span className="text-sm">نقشه راه</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 hover:border-emerald-300 hover:bg-emerald-50"
                onClick={() => setView('advisor')}
              >
                <Target className="w-6 h-6 text-teal-500" />
                <span className="text-sm">مشاور AI</span>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">فعالیت‌های اخیر</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0
                    ${activity.type === 'success' ? 'bg-emerald-500' : ''}
                    ${activity.type === 'info' ? 'bg-teal-500' : ''}
                    ${activity.type === 'default' ? 'bg-slate-400' : ''}
                  `}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 truncate">{activity.title}</p>
                    <p className="text-xs text-slate-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
