import { create } from 'zustand';

export type ViewType =
  | 'landing'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'diagnostic'
  | 'results'
  | 'strategy'
  | 'roadmap'
  | 'advisor'
  | 'analysis'
  | 'financial'
  | 'investment'
  | 'benchmark'
  | 'knowledge'
  | 'reports'
  | 'execution'
  | 'settings'
  | 'profile'
  | 'admin'
  // Enterprise Views
  | 'crm'
  | 'crm-lead-detail'
  | 'bi-dashboard'
  | 'ai-agents'
  | 'notifications'
  | 'bpm'
  | 'portal-ceo'
  | 'portal-consultant'
  | 'portal-sme'
  | 'invoices'
  | 'expenses'
  | 'budgets'
  // Phase 2 Views
  | 'automation'
  | 'ai-predictor'
  | 'data-export'
  // Phase 3 Views
  | 'organizations'
  | 'report-generator'
  | 'admin-advanced'
  | 'integration-hub'
  | 'security-center'
  | 'data-center';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'sme' | 'consultant' | 'admin' | 'ceo' | 'analyst' | 'branch_manager' | 'investor';
  companyId?: string;
  companyName?: string;
  branchId?: string;
}

export interface DiagnosticResult {
  id: string;
  overallScore: number;
  riskScore: number;
  growthPotential: number;
  investmentReadiness: number;
  dimensions: { key: string; name: string; score: number; weight: number }[];
  tier: string;
  createdAt: string;
}

export interface Strategy {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: number;
  impact: 'high' | 'medium' | 'low';
  feasibility: 'high' | 'medium' | 'low';
  cost: 'high' | 'medium' | 'low';
  risk: 'high' | 'medium' | 'low';
  status: 'recommended' | 'accepted' | 'rejected' | 'in_progress';
  rationale: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done' | 'blocked';
  priority: 'critical' | 'high' | 'medium' | 'low';
  dueDate?: string;
  strategyId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface CrmLead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  industry?: string;
  source: string;
  stage: string;
  value: number;
  probability: number;
  notes?: string;
  nextFollowUp?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'reminder';
  category: 'system' | 'strategy' | 'crm' | 'financial' | 'workflow' | 'ai';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export type AgentType = 'strategist' | 'financial' | 'market' | 'reporter' | 'execution' | 'investor' | 'benchmark' | 'predictor';

export interface AgentSession {
  id: string;
  agentType: AgentType;
  title: string;
  createdAt: string;
}

export interface InvoiceItem { description: string; quantity: number; unitPrice: number; total: number; }

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: string;
  status: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  paidAmount: number;
}

export interface KPIData {
  metric: string;
  value: number;
  previousValue?: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

// Phase 2 Types
export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  status: 'active' | 'paused' | 'draft';
  executionCount: number;
  lastExecutedAt?: string;
  createdAt: string;
}

export interface AutomationTrigger {
  type: 'on_event' | 'scheduled' | 'on_threshold' | 'on_stage_change';
  event?: string;
  schedule?: string;
  threshold?: { metric: string; operator: 'gt' | 'lt' | 'eq'; value: number };
  fromStage?: string;
  toStage?: string;
}

export interface AutomationAction {
  id: string;
  type: 'send_notification' | 'create_task' | 'update_status' | 'send_email' | 'create_workflow' | 'ai_analysis';
  config: Record<string, unknown>;
}

export interface BIWidget {
  id: string;
  type: 'kpi_card' | 'chart' | 'table' | 'insight';
  title: string;
  config: Record<string, unknown>;
  position: { x: number; y: number; w: number; h: number };
}

export interface PredictionResult {
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  horizon: string;
  scenario: 'optimistic' | 'likely' | 'pessimistic';
}

// Phase 3 Types
export interface Organization {
  id: string;
  name: string;
  industry: string;
  stage: string;
  plan: 'starter' | 'professional' | 'enterprise';
  employeeCount: number;
  branchCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface Branch {
  id: string;
  organizationId: string;
  name: string;
  region: string;
  managerName: string;
  employeeCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  ip: string;
  timestamp: string;
}

export interface Integration {
  id: string;
  name: string;
  type: 'crm' | 'accounting' | 'communication' | 'analytics' | 'storage' | 'payment';
  status: 'connected' | 'disconnected' | 'error';
  logo?: string;
  lastSync?: string;
  config: Record<string, unknown>;
}

export interface ReportTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  sections: string[];
  format: 'pdf' | 'excel' | 'csv';
}

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;

  // Navigation
  currentView: ViewType;
  sidebarOpen: boolean;

  // Diagnostic
  selectedDiagnosticId: string | null;
  diagnosticResults: DiagnosticResult | null;
  diagnosticAnswers: Record<string, number>;

  // Strategies
  strategies: Strategy[];
  selectedStrategyId: string | null;

  // Tasks
  tasks: Task[];

  // Chat
  chatMessages: ChatMessage[];
  chatLoading: boolean;

  // CRM
  crmLeads: CrmLead[];
  selectedLeadId: string | null;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;

  // AI Agents
  activeAgentType: AgentType;
  agentSessions: AgentSession[];
  agentMessages: ChatMessage[];
  agentLoading: boolean;

  // Financial
  invoices: Invoice[];

  // KPI
  kpiData: KPIData[];

  // Phase 2: Automation
  automationRules: AutomationRule[];
  selectedRuleId: string | null;

  // Phase 2: BI
  biTimeRange: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  biWidgets: BIWidget[];

  // Phase 2: Predictions
  predictions: PredictionResult[];

  // Phase 3: Multi-Tenant
  organizations: Organization[];
  branches: Branch[];
  selectedOrgId: string | null;

  // Phase 3: Audit
  auditLogs: AuditLog[];

  // Phase 3: Integrations
  integrations: Integration[];

  // Phase 3: Reports
  reportTemplates: ReportTemplate[];

  // Actions - Auth & Nav
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setView: (view: ViewType) => void;
  setSidebarOpen: (open: boolean) => void;

  // Actions - Diagnostic & Strategy
  setSelectedDiagnosticId: (id: string | null) => void;
  setDiagnosticResults: (results: DiagnosticResult | null) => void;
  setDiagnosticAnswers: (answers: Record<string, number>) => void;
  setDiagnosticAnswer: (questionId: string, value: number) => void;
  setStrategies: (strategies: Strategy[]) => void;
  setSelectedStrategyId: (id: string | null) => void;

  // Actions - Tasks & Chat
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  addChatMessage: (message: ChatMessage) => void;
  setChatLoading: (loading: boolean) => void;

  // Actions - CRM & Notifications
  setCrmLeads: (leads: CrmLead[]) => void;
  addCrmLead: (lead: CrmLead) => void;
  setSelectedLeadId: (id: string | null) => void;
  setNotifications: (notifications: NotificationItem[]) => void;
  addNotification: (notification: NotificationItem) => void;
  markNotificationRead: (id: string) => void;

  // Actions - AI Agents
  setActiveAgentType: (agentType: AgentType) => void;
  setAgentMessages: (messages: ChatMessage[]) => void;
  addAgentMessage: (message: ChatMessage) => void;
  setAgentLoading: (loading: boolean) => void;

  // Actions - Financial & KPI
  setInvoices: (invoices: Invoice[]) => void;
  setKpiData: (data: KPIData[]) => void;

  // Actions - Phase 2
  setAutomationRules: (rules: AutomationRule[]) => void;
  addAutomationRule: (rule: AutomationRule) => void;
  updateAutomationRule: (id: string, updates: Partial<AutomationRule>) => void;
  setSelectedRuleId: (id: string | null) => void;
  setBiTimeRange: (range: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly') => void;
  setBiWidgets: (widgets: BIWidget[]) => void;
  setPredictions: (predictions: PredictionResult[]) => void;

  // Actions - Phase 3
  setOrganizations: (orgs: Organization[]) => void;
  addOrganization: (org: Organization) => void;
  setBranches: (branches: Branch[]) => void;
  setSelectedOrgId: (id: string | null) => void;
  setAuditLogs: (logs: AuditLog[]) => void;
  setIntegrations: (integrations: Integration[]) => void;
  updateIntegration: (id: string, updates: Partial<Integration>) => void;
  setReportTemplates: (templates: ReportTemplate[]) => void;

  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  currentView: 'landing',
  sidebarOpen: true,
  selectedDiagnosticId: null,
  diagnosticResults: null,
  diagnosticAnswers: {},
  strategies: [],
  selectedStrategyId: null,
  tasks: [],
  chatMessages: [],
  chatLoading: false,
  crmLeads: [],
  selectedLeadId: null,
  notifications: [],
  unreadNotificationCount: 0,
  activeAgentType: 'strategist',
  agentSessions: [],
  agentMessages: [],
  agentLoading: false,
  invoices: [],
  kpiData: [],
  automationRules: [],
  selectedRuleId: null,
  biTimeRange: 'monthly',
  biWidgets: [],
  predictions: [],
  // Phase 3
  organizations: [],
  branches: [],
  selectedOrgId: null,
  auditLogs: [],
  integrations: [],
  reportTemplates: [],

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => set({ token }),
  setView: (currentView) => set({ currentView }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setSelectedDiagnosticId: (selectedDiagnosticId) => set({ selectedDiagnosticId }),
  setDiagnosticResults: (diagnosticResults) => set({ diagnosticResults }),
  setDiagnosticAnswers: (diagnosticAnswers) => set({ diagnosticAnswers }),
  setDiagnosticAnswer: (questionId, value) =>
    set((state) => ({ diagnosticAnswers: { ...state.diagnosticAnswers, [questionId]: value } })),
  setStrategies: (strategies) => set({ strategies }),
  setSelectedStrategyId: (selectedStrategyId) => set({ selectedStrategyId }),
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTaskStatus: (id, status) =>
    set((state) => ({ tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)) })),
  setChatMessages: (chatMessages) => set({ chatMessages }),
  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  setChatLoading: (chatLoading) => set({ chatLoading }),
  setCrmLeads: (crmLeads) => set({ crmLeads }),
  addCrmLead: (lead) => set((state) => ({ crmLeads: [...state.crmLeads, lead] })),
  setSelectedLeadId: (selectedLeadId) => set({ selectedLeadId }),
  setNotifications: (notifications) =>
    set({ notifications, unreadNotificationCount: notifications.filter((n) => !n.isRead).length }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadNotificationCount: state.unreadNotificationCount + (notification.isRead ? 0 : 1),
    })),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      unreadNotificationCount: Math.max(0, state.unreadNotificationCount - 1),
    })),
  setActiveAgentType: (activeAgentType) => set({ activeAgentType }),
  setAgentMessages: (agentMessages) => set({ agentMessages }),
  addAgentMessage: (message) =>
    set((state) => ({ agentMessages: [...state.agentMessages, message] })),
  setAgentLoading: (agentLoading) => set({ agentLoading }),
  setInvoices: (invoices) => set({ invoices }),
  setKpiData: (kpiData) => set({ kpiData }),
  setAutomationRules: (automationRules) => set({ automationRules }),
  addAutomationRule: (rule) => set((state) => ({ automationRules: [...state.automationRules, rule] })),
  updateAutomationRule: (id, updates) =>
    set((state) => ({ automationRules: state.automationRules.map((r) => (r.id === id ? { ...r, ...updates } : r)) })),
  setSelectedRuleId: (selectedRuleId) => set({ selectedRuleId }),
  setBiTimeRange: (biTimeRange) => set({ biTimeRange }),
  setBiWidgets: (biWidgets) => set({ biWidgets }),
  setPredictions: (predictions) => set({ predictions }),
  // Phase 3 Actions
  setOrganizations: (organizations) => set({ organizations }),
  addOrganization: (org) => set((state) => ({ organizations: [...state.organizations, org] })),
  setBranches: (branches) => set({ branches }),
  setSelectedOrgId: (selectedOrgId) => set({ selectedOrgId }),
  setAuditLogs: (auditLogs) => set({ auditLogs }),
  setIntegrations: (integrations) => set({ integrations }),
  updateIntegration: (id, updates) =>
    set((state) => ({ integrations: state.integrations.map((i) => (i.id === id ? { ...i, ...updates } : i)) })),
  setReportTemplates: (reportTemplates) => set({ reportTemplates }),
  logout: () =>
    set({
      user: null, isAuthenticated: false, token: null, currentView: 'landing',
      diagnosticResults: null, diagnosticAnswers: {}, strategies: [], tasks: [],
      chatMessages: [], crmLeads: [], selectedLeadId: null, notifications: [],
      unreadNotificationCount: 0, agentMessages: [], invoices: [], kpiData: [],
      automationRules: [], selectedRuleId: null, predictions: [],
      organizations: [], branches: [], selectedOrgId: null, auditLogs: [],
      integrations: [], reportTemplates: [],
    }),
}));
