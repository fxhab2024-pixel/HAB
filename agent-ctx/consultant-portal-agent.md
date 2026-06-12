# Task: Create Advanced Phase 2 Interactive Consultant Portal

## Summary
Successfully created the advanced consultant portal component at `/home/z/my-project/src/components/portals/portal-consultant.tsx` (1086 lines).

## What was done
1. Reviewed existing project structure, store (Zustand), and the original consultant portal (290 lines basic version)
2. Completely rewrote the consultant portal with all 9 required sections
3. Verified lint passes and dev server compiles successfully

## Sections Implemented
1. **Header Section** - Title "پورتال مشاور", welcome message with consultant name, Persian date/time, quick stats (active clients, pending diagnostics, today's follow-ups), quick action buttons
2. **Performance Metrics Row** (4 cards) - Active clients count, consulting revenue, strategy success rate, performance score with custom SVG gauge
3. **Client Pipeline** (Kanban-style) - 4 stages: ارزیابی اولیه, تشخیص در حال انجام, اجرای استراتژی, تکمیل و پیگیری with color-coded client cards showing name, progress, next action, priority
4. **Assigned Clients Section** - List with client name, company, industry, diagnostic score, strategy progress, last interaction date, next follow-up, quick action buttons (view diagnostic, chat, schedule)
5. **Diagnostic Summary** - Pie chart (Recharts) of client distribution by diagnostic tier, average scores with progress bars, clients needing attention highlighted in red
6. **Follow-ups & Schedule** (Phase 2) - Tabbed view: today's follow-ups, upcoming this week, overdue (highlighted in red with badge)
7. **Activity Feed** - Timeline-style layout with 10 recent activities, color-coded icons by type (diagnostic, strategy, interaction, milestone)
8. **AI Recommendations** (Phase 2) - 4 AI-generated recommendations with confidence level bars, category icons, expand/collapse, action buttons
9. **Quick Links** - 8 navigation cards to relevant sections

## Technical Details
- All text in Persian (Farsi) with RTL layout
- Emerald/teal + amber accent color scheme
- Framer Motion animations throughout
- Recharts PieChart for diagnostic distribution
- Custom SVG PerformanceGauge component
- Store integration with `useAppStore` and `setView()`
- Headphones icon as portal icon
- Responsive grid layouts (mobile-first)
- Proper TypeScript typing throughout
