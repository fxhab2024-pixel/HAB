'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAppStore, type ChatMessage } from '@/lib/store';
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Sparkles,
  Plus,
  Lightbulb,
} from 'lucide-react';
import { toast } from 'sonner';

const suggestedQuestions = [
  'بزرگ‌ترین ریسک استراتژیک کسب‌وکار من چیست؟',
  'چگونه می‌توانم آمادگی سرمایه‌گذاری را افزایش دهم؟',
  'بهترین استراتژی رشد برای صنعت من چیست؟',
  'نقاط قوت و ضعف اصلی کسب‌وکار من کدامند؟',
];

export default function AIAdvisor() {
  const { chatMessages, addChatMessage, chatLoading, setChatLoading } = useAppStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = async (message?: string) => {
    const text = message || input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMsg);
    setInput('');
    setChatLoading(true);

    try {
      // Simulate AI response
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const aiResponses: Record<string, string> = {
        default: `بر اساس تحلیل استراتژیک کسب‌وکار شما، پیشنهاد می‌کنم:\n\n۱. **تقویت سلامت مالی**: ایجاد ذخیره اضطراری حداقل ۶ ماهه هزینه‌های عملیاتی\n۲. **بهینه‌سازی فرآیند فروش**: کاهش چرخه فروش با استانداردسازی فرآیندها\n۳. **توسعه حضور دیجیتال**: سرمایه‌گذاری در بازاریابی محتوایی و شبکه‌های اجتماعی\n\nبرای هر یک از این موارد می‌توانم جزئیات بیشتری ارائه دهم.`,
      };

      const responseText =
        aiResponses[text] ||
        aiResponses['default'].replace(
          'بر اساس تحلیل استراتژیک',
          `در پاسخ به سؤال شما درباره "${text.slice(0, 30)}..."، بر اساس تحلیل`
        );

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toISOString(),
      };
      addChatMessage(aiMsg);
    } catch {
      toast.error('خطا در ارتباط با مشاور هوشمند');
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-4 h-[calc(100vh-10rem)] flex flex-col">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">مشاور استراتژیک هوشمند</h2>
            <p className="text-slate-500 mt-1">با هوش مصنوعی تخصصی استراتژی کسب‌وکار گفتگو کنید</p>
          </div>
          <Badge className="bg-teal-100 text-teal-700">
            <Bot className="w-4 h-4 ms-1" />
            آنلاین
          </Badge>
        </div>
      </motion.div>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col min-h-0">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-700 mb-2">
                  مشاور استراتژیک BCGSP
                </h3>
                <p className="text-sm text-slate-500 max-w-md">
                  من می‌توانم در تحلیل استراتژیک، شناسایی ریسک‌ها، و ارائه توصیه‌های
                  عملیاتی به شما کمک کنم.
                </p>
              </div>

              {/* Suggested Questions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {suggestedQuestions.map((q) => (
                  <Button
                    key={q}
                    variant="outline"
                    className="h-auto py-3 px-4 text-sm text-start justify-start hover:border-emerald-300 hover:bg-emerald-50 whitespace-normal"
                    onClick={() => handleSend(q)}
                  >
                    <Lightbulb className="w-4 h-4 shrink-0 ms-2 text-emerald-500" />
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    msg.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'assistant'
                        ? 'bg-emerald-100'
                        : 'bg-slate-200'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <Bot className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <User className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      msg.role === 'assistant'
                        ? 'bg-slate-100 text-slate-800 rounded-se-none'
                        : 'bg-emerald-600 text-white rounded-ss-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}

              {chatLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="bg-slate-100 rounded-2xl rounded-se-none px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="سؤال استراتژیک خود را بپرسید..."
              className="flex-1"
              disabled={chatLoading}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || chatLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
