import type { User } from './store';

const API_BASE = '/api';

function getHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { ...getHeaders(token), ...options.headers },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'خطای سرور' }));
    throw new Error(error.message || 'خطای ناشناخته');
  }
  return res.json();
}

// ============ Auth ============
export async function register(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<{ user: User; token: string }> {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<{ user: User; token: string }> {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMe(token: string): Promise<User> {
  return request('/auth/me', {}, token);
}

// ============ Company ============
export async function createCompany(
  token: string,
  data: {
    name: string;
    industry: string;
    stage: string;
    employeeCount?: number;
    foundedYear?: number;
    website?: string;
    description?: string;
  }
): Promise<unknown> {
  return request(
    '/company',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token
  );
}

export async function getCompany(token: string): Promise<unknown> {
  return request('/company', {}, token);
}

export async function updateCompany(
  token: string,
  data: Record<string, unknown>
): Promise<unknown> {
  return request(
    '/company',
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    token
  );
}

// ============ Diagnostic ============
export async function createDiagnostic(
  token: string,
  companyId: string
): Promise<{ id: string }> {
  return request(
    '/diagnostic',
    {
      method: 'POST',
      body: JSON.stringify({ companyId }),
    },
    token
  );
}

export async function listDiagnostics(token: string): Promise<unknown[]> {
  return request('/diagnostic', {}, token);
}

export async function getDiagnosticAnswers(
  token: string,
  diagnosticId: string
): Promise<unknown> {
  return request(`/diagnostic/${diagnosticId}/answers`, {}, token);
}

export async function saveDiagnosticAnswers(
  token: string,
  diagnosticId: string,
  answers: Record<string, number>
): Promise<unknown> {
  return request(
    `/diagnostic/${diagnosticId}/answers`,
    {
      method: 'PUT',
      body: JSON.stringify({ answers }),
    },
    token
  );
}

export async function calculateDiagnostic(
  token: string,
  diagnosticId: string
): Promise<unknown> {
  return request(
    `/diagnostic/${diagnosticId}/calculate`,
    {
      method: 'POST',
    },
    token
  );
}

export async function getRecommendations(
  token: string,
  diagnosticId: string
): Promise<unknown[]> {
  return request(`/diagnostic/${diagnosticId}/recommendations`, {}, token);
}

export async function generateRecommendations(
  token: string,
  diagnosticId: string
): Promise<unknown[]> {
  return request(
    `/diagnostic/${diagnosticId}/recommendations`,
    {
      method: 'POST',
    },
    token
  );
}

export async function getRoadmap(
  token: string,
  diagnosticId: string
): Promise<unknown> {
  return request(`/diagnostic/${diagnosticId}/roadmap`, {}, token);
}

export async function generateRoadmap(
  token: string,
  diagnosticId: string
): Promise<unknown> {
  return request(
    `/diagnostic/${diagnosticId}/roadmap`,
    {
      method: 'POST',
    },
    token
  );
}

// ============ Chat ============
export async function sendMessage(
  token: string,
  data: { message: string; sessionId?: string; diagnosticId?: string }
): Promise<{ response: string; sessionId: string }> {
  return request(
    '/chat',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token
  );
}

// ============ Tasks ============
export async function listTasks(token: string): Promise<unknown[]> {
  return request('/tasks', {}, token);
}

export async function createTask(
  token: string,
  data: Record<string, unknown>
): Promise<unknown> {
  return request(
    '/tasks',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token
  );
}

export async function updateTask(
  token: string,
  taskId: string,
  data: Record<string, unknown>
): Promise<unknown> {
  return request(
    `/tasks/${taskId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    token
  );
}

// ============ Reports ============
export async function listReports(token: string): Promise<unknown[]> {
  return request('/reports', {}, token);
}

export async function generateReport(
  token: string,
  data: { type: string; diagnosticId?: string; title?: string }
): Promise<unknown> {
  return request(
    '/reports',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token
  );
}

// ============ Benchmarks ============
export async function getBenchmarks(token: string): Promise<unknown[]> {
  return request('/benchmarks', {}, token);
}

// ============ Knowledge ============
export async function listKnowledge(
  token: string,
  params?: { category?: string; search?: string }
): Promise<unknown[]> {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.search) query.set('search', params.search);
  return request(`/knowledge?${query.toString()}`, {}, token);
}

// ============ KPI ============
export async function getKPIData(token: string, params?: { period?: string; metric?: string }): Promise<unknown[]> {
  const query = new URLSearchParams();
  if (params?.period) query.set('period', params.period);
  if (params?.metric) query.set('metric', params.metric);
  return request(`/kpi?${query.toString()}`, {}, token);
}

// ============ CRM ============
export async function getCrmLeads(token: string, params?: { stage?: string; search?: string }): Promise<unknown[]> {
  const query = new URLSearchParams();
  if (params?.stage) query.set('stage', params.stage);
  if (params?.search) query.set('search', params.search);
  return request(`/crm/leads?${query.toString()}`, {}, token);
}

export async function createCrmLead(
  token: string,
  data: Record<string, unknown>
): Promise<unknown> {
  return request(
    '/crm/leads',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token
  );
}

export async function updateCrmLead(
  token: string,
  leadId: string,
  data: Record<string, unknown>
): Promise<unknown> {
  return request(
    `/crm/leads?id=${leadId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    token
  );
}

export async function getCrmFollowups(token: string, leadId?: string): Promise<unknown[]> {
  const query = new URLSearchParams();
  if (leadId) query.set('leadId', leadId);
  return request(`/crm/followups?${query.toString()}`, {}, token);
}

export async function createCrmFollowup(
  token: string,
  data: Record<string, unknown>
): Promise<unknown> {
  return request(
    '/crm/followups',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token
  );
}

// ============ Notifications ============
export async function getNotifications(token: string): Promise<unknown[]> {
  return request('/notifications', {}, token);
}

export async function markNotificationRead(
  token: string,
  notificationId: string
): Promise<unknown> {
  return request(
    `/notifications?id=${notificationId}`,
    {
      method: 'PUT',
      body: JSON.stringify({ isRead: true }),
    },
    token
  );
}

export async function createNotification(
  token: string,
  data: Record<string, unknown>
): Promise<unknown> {
  return request(
    '/notifications',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token
  );
}

// ============ AI Agents ============
export async function getAgentSessions(token: string, agentType?: string): Promise<unknown[]> {
  const query = new URLSearchParams();
  if (agentType) query.set('agentType', agentType);
  return request(`/ai-agents?${query.toString()}`, {}, token);
}

export async function createAgentSession(
  token: string,
  data: { agentType: string; title?: string; context?: Record<string, unknown> }
): Promise<{ id: string }> {
  return request(
    '/ai-agents',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token
  );
}

export async function sendAgentMessage(
  token: string,
  data: { sessionId: string; message: string }
): Promise<{ response: string; sessionId: string }> {
  return request(
    '/ai-agents',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token
  );
}

// ============ BPM / Workflows ============
export async function getWorkflows(token: string): Promise<unknown[]> {
  return request('/bpm/workflows', {}, token);
}

export async function createWorkflow(
  token: string,
  data: Record<string, unknown>
): Promise<unknown> {
  return request(
    '/bpm/workflows',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token
  );
}

export async function getWorkflowInstances(token: string, params?: { status?: string; workflowId?: string }): Promise<unknown[]> {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.workflowId) query.set('workflowId', params.workflowId);
  return request(`/bpm/instances?${query.toString()}`, {}, token);
}

export async function createWorkflowInstance(
  token: string,
  data: Record<string, unknown>
): Promise<unknown> {
  return request(
    '/bpm/instances',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token
  );
}

export async function updateWorkflowInstance(
  token: string,
  instanceId: string,
  data: Record<string, unknown>
): Promise<unknown> {
  return request(
    `/bpm/instances?id=${instanceId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    token
  );
}

// ============ Invoices ============
export async function getInvoices(token: string, params?: { status?: string }): Promise<unknown[]> {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  return request(`/invoices?${query.toString()}`, {}, token);
}

export async function createInvoice(
  token: string,
  data: Record<string, unknown>
): Promise<unknown> {
  return request(
    '/invoices',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token
  );
}

export async function updateInvoice(
  token: string,
  invoiceId: string,
  data: Record<string, unknown>
): Promise<unknown> {
  return request(
    `/invoices?id=${invoiceId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    token
  );
}

// ============ Expenses ============
export async function getExpenses(token: string, params?: { category?: string; status?: string }): Promise<unknown[]> {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.status) query.set('status', params.status);
  return request(`/expenses?${query.toString()}`, {}, token);
}

export async function createExpense(
  token: string,
  data: Record<string, unknown>
): Promise<unknown> {
  return request(
    '/expenses',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token
  );
}

// ============ Budgets ============
export async function getBudgets(token: string): Promise<unknown[]> {
  return request('/budgets', {}, token);
}

export async function createBudget(
  token: string,
  data: Record<string, unknown>
): Promise<unknown> {
  return request(
    '/budgets',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token
  );
}

// ============ Admin ============
export async function getAdminOverview(token: string): Promise<unknown> {
  return request('/admin/overview', {}, token);
}

// ============ Phase 2: AI Chat with z-ai-web-dev-sdk ============
export async function chatWithAI(
  token: string,
  data: {
    messages: { role: string; content: string }[];
    agentType: string;
    sessionId?: string;
  }
): Promise<{ response: string; sessionId: string }> {
  return request(
    '/ai-agents',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token
  );
}

// ============ Phase 2: Predictions ============
export async function getPredictions(
  token: string,
  params?: { metric?: string; horizon?: string }
): Promise<unknown[]> {
  const query = new URLSearchParams();
  if (params?.metric) query.set('metric', params.metric);
  if (params?.horizon) query.set('horizon', params.horizon);
  return request(`/kpi?${query.toString()}`, {}, token);
}

// ============ Phase 2: Data Export ============
export async function exportData(
  token: string,
  data: { type: string; format: string; filters?: Record<string, unknown> }
): Promise<Blob> {
  const res = await fetch(`${API_BASE}/reports`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ ...data, export: true }),
  });
  if (!res.ok) throw new Error('خطا در خروجی‌گیری');
  return res.blob();
}
