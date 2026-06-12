# Task: Create Phase 2 Automation Engine Component

## Summary
Created a comprehensive automation engine view component at `/home/z/my-project/src/components/automation/automation-view.tsx` (1455 lines) for the BCGSP project.

## What was done

### 1. Created `/home/z/my-project/src/components/automation/automation-view.tsx`
- Full 'use client' component with RTL/Persian text
- **Header Section**: Title "موتور اتوماسیون هوشمند", subtitle, "ایجاد قانون" button, emerald/teal gradient icon
- **Stats Badges**: 4 stat cards (active rules, total executions, success rate, errors) with animated cards
- **Tab Navigation**: 3 tabs using shadcn/ui Tabs:
  - قوانین اتوماسیون (Automation Rules) - default
  - تاریخچه اجرا (Execution History)
  - قالب‌های آماده (Ready Templates)
- **Automation Rules Tab**: 8 mock rules as cards with:
  - Trigger type badge with icons (event/scheduled/threshold/stage_change)
  - Actions list with badges
  - Status toggle (Switch component)
  - Execution count & last executed time
  - Quick actions: edit, pause/play, duplicate, delete (with confirmation)
- **Create/Edit Rule Dialog**: Comprehensive dialog with:
  - Rule name & description inputs
  - Trigger section with type selector and conditional fields:
    - on_event: event name dropdown
    - scheduled: cron-like schedule input
    - on_threshold: metric, operator, value fields
    - on_stage_change: from/to stage dropdowns
  - Actions section with add/remove capability and type-specific config fields
  - Save/Cancel buttons
- **Execution History Tab**: Timeline with 12 mock records, expandable details, success/failed badges
- **Templates Tab**: 6 pre-built templates as cards with "استفاده از قالب" button

### 2. Updated `/home/z/my-project/src/app/page.tsx`
- Added import for AutomationView
- Added `case 'automation'` to render the component

### 3. Updated `/home/z/my-project/src/components/app-layout.tsx`
- Added `Zap` icon import
- Added "موتور اتوماسیون" nav item with "فاز ۲" badge in "اتوماسیون" group

## Store Integration
Uses existing store:
- `automationRules`, `setAutomationRules`, `addAutomationRule`, `updateAutomationRule`
- Types: `AutomationRule`, `AutomationTrigger`, `AutomationAction`

## Style
- Emerald/teal primary colors
- RTL layout with `dir="rtl"`
- Framer Motion animations on all cards and tabs
- Professional, clean design consistent with existing BCGSP components
- All Persian text
