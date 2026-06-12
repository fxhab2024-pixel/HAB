# Task 5 - API Builder Agent

## Task
Create 10 backend API route files for the BCGSP Enterprise Platform.

## Work Completed

### Files Created
1. `/home/z/my-project/src/app/api/crm/leads/route.ts` - CRM Leads (GET, POST)
2. `/home/z/my-project/src/app/api/crm/followups/route.ts` - CRM Follow-ups (GET, POST)
3. `/home/z/my-project/src/app/api/notifications/route.ts` - Notifications (GET, POST, PATCH)
4. `/home/z/my-project/src/app/api/ai-agents/route.ts` - AI Agents (GET, POST with z-ai-web-dev-sdk)
5. `/home/z/my-project/src/app/api/bpm/workflows/route.ts` - BPM Workflows (GET, POST)
6. `/home/z/my-project/src/app/api/bpm/instances/route.ts` - BPM Instances (GET, POST, PATCH)
7. `/home/z/my-project/src/app/api/invoices/route.ts` - Invoices (GET, POST)
8. `/home/z/my-project/src/app/api/expenses/route.ts` - Expenses (GET, POST)
9. `/home/z/my-project/src/app/api/budgets/route.ts` - Budgets (GET, POST)
10. `/home/z/my-project/src/app/api/kpi/route.ts` - KPI (GET with computed metrics)

### Key Patterns Used
- `requireAuth` from `@/lib/auth` for authentication
- `db` from `@/lib/db` for Prisma client
- `NextRequest`/`NextResponse` from `next/server`
- try/catch with JSON error responses and appropriate status codes
- Query parameter filtering via `searchParams`
- Pagination with `limit`/`offset`

### Special Features
- AI Agents: 8 Persian system prompts, z-ai-web-dev-sdk integration, company context, conversation history, fallback responses
- BPM Instances: Create + advance step workflow with WorkflowAction records
- KPI: Live computation from database data (conversion_rate, cac, ltv, churn_rate, revenue_growth, strategy_completion)
- Notifications: Bulk mark-as-read via `markAll` + `userId`
- Invoices: Duplicate invoice number check

### Verification
- Lint passes clean
- Dev server running without errors
