'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/lib/store';
import {
  DIMENSIONS,
  getScoreColor,
  getScoreBgColor,
  getScoreLabel,
  getTierLabel,
} from '@/lib/diagnostic-questions';
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
  Lightbulb,
  Map,
  ArrowLeft,
  Award,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

function ScoreGauge({ score, label, size = 160 }: { score: number; label: string; size?: number }) {
  const color = score >= 80 ? '#059669' : score >= 65 ? '#eab308' : score >= 50 ? '#f97316' : '#ef4444';
  const data = [
    { name: 'score', value: score },
    { name: 'remaining', value: 100 - score },
  ];

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
              <Cell fill={color} />
              <Cell fill="#e2e8f0" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>{score}</span>
          <span className="text-xs text-slate-500">از ۱۰۰</span>
        </div>
      </div>
      <span className="text-sm font-medium text-slate-700 mt-2">{label}</span>
    </div>
  );
}

export default function DiagnosticResults() {
  const { diagnosticResults, setView } = useAppStore();
  const results = diagnosticResults;

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Target className="w-16 h-16 text-slate-300" />
        <h3 className="text-xl font-bold text-slate-700">نتیجه‌ای یافت نشد</h3>
        <p className="text-slate-500">ابتدا تشخیص استراتژیک را تکمیل کنید</p>
        <Button
          onClick={() => setView('diagnostic')}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          شروع تشخیص
        </Button>
      </div>
    );
  }

  const radarData = results.dimensions.map((d) => ({
    dimension: d.name,
    score: d.score,
    fullMark: 100,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-900">نتایج تشخیص استراتژیک</h2>
          <p className="text-slate-500 mt-1">تحلیل جامع وضعیت کسب‌وکار شما</p>
        </div>
        <Badge
          className={`text-sm px-4 py-1.5 ${getScoreBgColor(results.overallScore)}`}
        >
          <Award className="w-4 h-4 ms-1.5" />
          {getTierLabel(results.overallScore)}
        </Badge>
      </motion.div>

      {/* Main Score & Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                امتیاز سلامت استراتژیک
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-4">
              <ScoreGauge score={results.overallScore} label="امتیاز کل" size={200} />
            </CardContent>
          </Card>
        </motion.div>

        {[
          { score: results.riskScore, label: 'امتیاز ریسک', icon: Shield },
          { score: results.growthPotential, label: 'پتانسیل رشد', icon: TrendingUp },
          { score: results.investmentReadiness, label: 'آمادگی سرمایه‌گذاری', icon: Zap },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * (i + 1) }}
          >
            <Card className="h-full">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <ScoreGauge score={item.score} label={item.label} size={120} />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Radar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">نمودار رادار ابعاد استراتژیک</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="dimension"
                    tick={{ fontSize: 11, fill: '#64748b' }}
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

      {/* Dimension Scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">امتیاز تفصیلی ابعاد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.dimensions.map((dim, i) => {
              const color =
                dim.score >= 80
                  ? 'emerald'
                  : dim.score >= 65
                  ? 'yellow'
                  : dim.score >= 50
                  ? 'orange'
                  : 'red';
              return (
                <div key={dim.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full
                          ${color === 'emerald' ? 'bg-emerald-500' : ''}
                          ${color === 'yellow' ? 'bg-yellow-500' : ''}
                          ${color === 'orange' ? 'bg-orange-500' : ''}
                          ${color === 'red' ? 'bg-red-500' : ''}
                        `}
                      />
                      <span className="text-sm font-medium text-slate-700">{dim.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getScoreBgColor(dim.score)}`}
                      >
                        {getScoreLabel(dim.score)}
                      </Badge>
                      <span className="text-sm font-bold text-slate-900">{dim.score}</span>
                      <span className="text-xs text-slate-400">/۱۰۰</span>
                    </div>
                  </div>
                  <Progress value={dim.score} className="h-2" />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>وزن: {dim.weight}%</span>
                    <span>
                      {dim.score >= 80 && <CheckCircle2 className="w-3.5 h-3.5 inline text-emerald-500 ms-1" />}
                      {dim.score < 50 && <AlertTriangle className="w-3.5 h-3.5 inline text-red-500 ms-1" />}
                      {dim.score >= 50 && dim.score < 80 && 'نیاز به بهبود'}
                      {dim.score >= 80 && 'وضعیت مطلوب'}
                      {dim.score < 50 && 'وضعیت بحرانی'}
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Button
          onClick={() => setView('strategy')}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2"
        >
          <Lightbulb className="w-5 h-5" />
          مشاهده توصیه‌های استراتژیک
        </Button>
        <Button
          onClick={() => setView('roadmap')}
          variant="outline"
          className="flex-1 border-emerald-300 text-emerald-700 gap-2"
        >
          <Map className="w-5 h-5" />
          مشاهده نقشه راه
        </Button>
      </motion.div>
    </div>
  );
}
