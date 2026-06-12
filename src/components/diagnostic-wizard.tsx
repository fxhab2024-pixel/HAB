'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useAppStore } from '@/lib/store';
import { DIMENSIONS, type DiagnosticQuestion } from '@/lib/diagnostic-questions';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  ChevronLeft,
  Send,
  Sparkles,
} from 'lucide-react';

export default function DiagnosticWizard() {
  const { diagnosticAnswers, setDiagnosticAnswer, setView, setDiagnosticResults, user } =
    useAppStore();
  const [currentDimension, setCurrentDimension] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const dimension = DIMENSIONS[currentDimension];
  const totalDimensions = DIMENSIONS.length;
  const progress = ((currentDimension + 1) / totalDimensions) * 100;

  const answeredInDimension = dimension.questions.filter(
    (q) => diagnosticAnswers[q.id] !== undefined
  ).length;
  const totalAnswered = DIMENSIONS.flatMap((d) => d.questions).filter(
    (q) => diagnosticAnswers[q.id] !== undefined
  ).length;
  const totalQuestions = DIMENSIONS.flatMap((d) => d.questions).length;

  const handleNext = () => {
    if (currentDimension < totalDimensions - 1) {
      setCurrentDimension(currentDimension + 1);
    }
  };

  const handlePrev = () => {
    if (currentDimension > 0) {
      setCurrentDimension(currentDimension - 1);
    }
  };

  const handleSubmit = async () => {
    if (totalAnswered < totalQuestions) {
      toast.error(`لطفاً تمام سؤالات را پاسخ دهید (${totalAnswered}/${totalQuestions})`);
      return;
    }

    setSubmitting(true);
    try {
      // Calculate scores locally for demo
      const dimensionScores = DIMENSIONS.map((d) => {
        const dimAnswers = d.questions.map((q) => diagnosticAnswers[q.id] || 0);
        const avg = dimAnswers.reduce((a, b) => a + b, 0) / dimAnswers.length;
        return {
          key: d.key,
          name: d.name,
          score: Math.round((avg / 5) * 100),
          weight: d.weight,
        };
      });

      const overallScore = Math.round(
        dimensionScores.reduce((acc, d) => acc + d.score * (d.weight / 100), 0)
      );

      const riskScore = Math.round(
        100 -
          (dimensionScores
            .filter((d) => ['financial_health', 'business_model', 'operations'].includes(d.key))
            .reduce((acc, d) => acc + d.score * (d.weight / 30), 0) *
            100) /
            100
      );

      const growthPotential = Math.round(
        dimensionScores
          .filter((d) => ['growth_strategy', 'market_customers', 'product_value'].includes(d.key))
          .reduce((acc, d) => acc + d.score * (d.weight / 27), 0)
      );

      const investmentReadiness = Math.round(
        dimensionScores
          .filter((d) =>
            ['financial_health', 'team_leadership', 'business_model', 'growth_strategy'].includes(
              d.key
            )
          )
          .reduce((acc, d) => acc + d.score * (d.weight / 42), 0)
      );

      setDiagnosticResults({
        id: 'demo-1',
        overallScore,
        riskScore: Math.max(0, Math.min(100, riskScore)),
        growthPotential: Math.max(0, Math.min(100, growthPotential)),
        investmentReadiness: Math.max(0, Math.min(100, investmentReadiness)),
        dimensions: dimensionScores,
        tier:
          overallScore >= 90
            ? 'پیشگام استراتژیک'
            : overallScore >= 80
            ? 'رشدگر پایدار'
            : overallScore >= 65
            ? 'پتانسیل رشد'
            : overallScore >= 50
            ? 'نیازمند بهبود'
            : 'بحرانی',
        createdAt: new Date().toISOString(),
      });

      toast.success('تشخیص استراتژیک با موفقیت تکمیل شد');
      setView('results');
    } catch {
      toast.error('خطا در پردازش نتایج');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-slate-900">تشخیص استراتژیک کسب‌وکار</h2>
        <p className="text-slate-500 mt-1">
          به ۱۰۰ سؤال در ۱۰ بُعد استراتژیک پاسخ دهید
        </p>
      </motion.div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-600">
              بُعد {currentDimension + 1} از {totalDimensions}
            </span>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              {totalAnswered}/{totalQuestions} پاسخ
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Dimension Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {DIMENSIONS.map((d, i) => {
          const answered = d.questions.filter((q) => diagnosticAnswers[q.id] !== undefined).length;
          const isComplete = answered === d.questions.length;
          const isCurrent = i === currentDimension;

          return (
            <Button
              key={d.key}
              variant={isCurrent ? 'default' : 'outline'}
              size="sm"
              className={`shrink-0 gap-1.5 text-xs whitespace-nowrap
                ${isCurrent ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                ${isComplete ? 'border-emerald-300 text-emerald-700' : ''}
              `}
              onClick={() => setCurrentDimension(i)}
            >
              {isComplete ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Circle className="w-3.5 h-3.5" />
              )}
              {d.name}
            </Button>
          );
        })}
      </div>

      {/* Current Dimension */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDimension}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: dimension.color }}
                  />
                  {dimension.name}
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  وزن: {dimension.weight}%
                </Badge>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {answeredInDimension} از {dimension.questions.length} سؤال پاسخ داده شده
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              {dimension.questions.map((q, qIndex) => {
                const value = diagnosticAnswers[q.id] ?? -1;
                return (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: qIndex * 0.05 }}
                    className="space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-sm font-bold text-emerald-600 mt-0.5 shrink-0">
                        {qIndex + 1}.
                      </span>
                      <p className="text-sm text-slate-700 leading-relaxed">{q.question}</p>
                    </div>
                    <div className="flex items-center gap-4 me-6">
                      <Slider
                        value={[value >= 0 ? value : 0]}
                        min={0}
                        max={5}
                        step={1}
                        onValueChange={(v) => setDiagnosticAnswer(q.id, v[0])}
                        className="flex-1"
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        {[0, 1, 2, 3, 4, 5].map((score) => (
                          <Button
                            key={score}
                            variant={value === score ? 'default' : 'outline'}
                            size="sm"
                            className={`w-8 h-8 p-0 text-xs
                              ${value === score ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                            `}
                            onClick={() => setDiagnosticAnswer(q.id, score)}
                          >
                            {score}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 me-6">
                      <span>کلاً نه</span>
                      <span>بسیار زیاد</span>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentDimension === 0}
          className="gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          بُعد قبلی
        </Button>

        {currentDimension === totalDimensions - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          >
            {submitting ? (
              'در حال پردازش...'
            ) : (
              <>
                <Send className="w-4 h-4" />
                تکمیل و محاسبه نتایج
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          >
            بُعد بعدی
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
