'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import AppLayout from '@/components/app-layout';
import Landing from '@/components/landing';
import AuthForms from '@/components/auth-forms';
import Dashboard from '@/components/dashboard';
import DiagnosticWizard from '@/components/diagnostic-wizard';
import DiagnosticResults from '@/components/diagnostic-results';
import StrategyRecommendations from '@/components/strategy-recommendations';
import RoadmapView from '@/components/roadmap-view';
import AIAdvisor from '@/components/ai-advisor';
import ExecutionTracker from '@/components/execution-tracker';
import CompanyProfile from '@/components/company-profile';
import AdminPanel from '@/components/admin-panel';
import KnowledgeHub from '@/components/knowledge-hub';
import BenchmarkView from '@/components/benchmark-view';
import FinancialView from '@/components/financial-view';
import InvestmentReadiness from '@/components/investment-readiness';
import StrategyAnalysis from '@/components/strategy-analysis';
import ReportsView from '@/components/reports-view';
import SettingsView from '@/components/settings-view';
// New Enterprise Components
import CrmView from '@/components/crm/crm-view';
import BiDashboard from '@/components/bi/bi-dashboard';
import AiAgentsHub from '@/components/ai-agents/ai-agents-hub';
import NotificationsCenter from '@/components/notifications/notifications-center';
import BpmView from '@/components/bpm/bpm-view';
import PortalCeo from '@/components/portals/portal-ceo';
import PortalConsultant from '@/components/portals/portal-consultant';
import PortalSme from '@/components/portals/portal-sme';
import InvoicesView from '@/components/financial/invoices-view';
import ExpensesView from '@/components/financial/expenses-view';
import BudgetsView from '@/components/financial/budgets-view';
import AutomationView from '@/components/automation/automation-view';
import AiPredictorView from '@/components/ai-predictor/ai-predictor-view';
// Phase 3 Components
import OrganizationView from '@/components/multi-tenant/organization-view';
import ReportGenerator from '@/components/reports/report-generator';
import SecurityCenter from '@/components/security/security-center';
import AdminAdvanced from '@/components/admin/admin-advanced';
import IntegrationHub from '@/components/integrations/integration-hub';
import DataCenter from '@/components/data-center/data-center';

export default function Home() {
  const { currentView, isAuthenticated } = useAppStore();

  // Check for saved auth on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('bcgsp_token');
    const savedUser = localStorage.getItem('bcgsp_user');
    if (savedToken && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        useAppStore.getState().setUser(user);
        useAppStore.getState().setToken(savedToken);
        useAppStore.getState().setView('dashboard');
      } catch {
        localStorage.removeItem('bcgsp_token');
        localStorage.removeItem('bcgsp_user');
      }
    }
  }, []);

  // Save auth state changes
  useEffect(() => {
    const state = useAppStore.getState();
    if (state.token && state.user) {
      localStorage.setItem('bcgsp_token', state.token);
      localStorage.setItem('bcgsp_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('bcgsp_token');
      localStorage.removeItem('bcgsp_user');
    }
  });

  // Not authenticated views
  if (!isAuthenticated) {
    switch (currentView) {
      case 'login':
      case 'register':
        return <AuthForms />;
      default:
        return <Landing />;
    }
  }

  // Authenticated views
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'diagnostic':
        return <DiagnosticWizard />;
      case 'results':
        return <DiagnosticResults />;
      case 'strategy':
        return <StrategyRecommendations />;
      case 'roadmap':
        return <RoadmapView />;
      case 'advisor':
        return <AIAdvisor />;
      case 'execution':
        return <ExecutionTracker />;
      case 'analysis':
        return <StrategyAnalysis />;
      case 'financial':
        return <FinancialView />;
      case 'investment':
        return <InvestmentReadiness />;
      case 'benchmark':
        return <BenchmarkView />;
      case 'knowledge':
        return <KnowledgeHub />;
      case 'reports':
        return <ReportsView />;
      case 'profile':
        return <CompanyProfile />;
      case 'settings':
        return <SettingsView />;
      case 'admin':
        return <AdminPanel />;
      // New Enterprise Views
      case 'crm':
      case 'crm-lead-detail':
        return <CrmView />;
      case 'bi-dashboard':
        return <BiDashboard />;
      case 'ai-agents':
        return <AiAgentsHub />;
      case 'notifications':
        return <NotificationsCenter />;
      case 'bpm':
        return <BpmView />;
      case 'portal-ceo':
        return <PortalCeo />;
      case 'portal-consultant':
        return <PortalConsultant />;
      case 'portal-sme':
        return <PortalSme />;
      case 'invoices':
        return <InvoicesView />;
      case 'expenses':
        return <ExpensesView />;
      case 'budgets':
        return <BudgetsView />;
      // Phase 2 Views
      case 'automation':
        return <AutomationView />;
      case 'ai-predictor':
        return <AiPredictorView />;
      // Phase 3 Views
      case 'organizations':
        return <OrganizationView />;
      case 'report-generator':
        return <ReportGenerator />;
      case 'admin-advanced':
        return <AdminAdvanced />;
      case 'integration-hub':
        return <IntegrationHub />;
      case 'security-center':
        return <SecurityCenter />;
      case 'data-center':
        return <DataCenter />;
      default:
        return <Dashboard />;
    }
  };

  return <AppLayout>{renderContent()}</AppLayout>;
}
