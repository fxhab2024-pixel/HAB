# Task 4-b - Component Builder Agent

## Task Summary
Create AI Agents Hub and Notifications Center components for the BCGSP Enterprise Platform.

## Files Created
1. `/home/z/my-project/src/components/ai-agents/ai-agents-hub.tsx` - AI Agents Hub with 8 specialized agents
2. `/home/z/my-project/src/components/notifications/notifications-center.tsx` - Notifications Center with tabbed view

## Additional Placeholder Files (to prevent build errors)
3. `/home/z/my-project/src/components/portals/portal-sme.tsx` - Placeholder
4. `/home/z/my-project/src/components/financial/invoices-view.tsx` - Placeholder
5. `/home/z/my-project/src/components/financial/expenses-view.tsx` - Placeholder
6. `/home/z/my-project/src/components/financial/budgets-view.tsx` - Placeholder
7. `/home/z/my-project/src/components/bi/bi-dashboard.tsx` - Placeholder

## Key Implementation Details

### AI Agents Hub
- 8 agents: strategist (emerald), financial (blue), market (purple), reporter (orange), execution (teal), investor (indigo), benchmark (pink), predictor (amber)
- Grid view → Chat view transition with AnimatePresence
- Per-agent chat history in local state
- 3-4 suggested questions per agent in Persian
- System prompts as code comments
- Mock responses via setTimeout simulation
- Framer-motion card hover/tap animations

### Notifications Center
- 7 tabs: همه, سیستم, استراتژی, CRM, مالی, گردشکار, AI
- 17 mock notifications across all types and categories
- 5 notification types with distinct colors/icons
- Mark all as read, individual mark as read, delete
- Unread badge counts per tab
- AnimatePresence for entry/exit animations
- ScrollArea for list
- Empty state for filtered views

## Verification
- `bun run lint` passes clean
- Dev server compiles successfully
- All text in Persian (Farsi), RTL layout
- Emerald/teal color scheme consistent with platform
