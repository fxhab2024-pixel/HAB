import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const metric = searchParams.get('metric');
    const period = searchParams.get('period');

    // If specific filters provided, return stored KPI records
    if (metric || (companyId && period)) {
      const where: Record<string, unknown> = {};
      if (companyId) where.companyId = companyId;
      if (metric) where.metric = metric;
      if (period) where.period = period;

      const records = await db.kPIRecord.findMany({
        where,
        orderBy: { periodStart: 'desc' },
      });

      return NextResponse.json({ records, computed: false });
    }

    // Otherwise, compute KPIs from existing data
    // Get the user's company if no companyId specified
    let targetCompanyId = companyId;
    if (!targetCompanyId) {
      const company = await db.company.findUnique({
        where: { userId: user!.id },
      });
      if (!company) {
        return NextResponse.json(
          { error: 'No company found for user' },
          { status: 404 }
        );
      }
      targetCompanyId = company.id;
    }

    // Compute conversion_rate: count of closed_won leads / total leads
    const [totalLeads, closedWonLeads] = await Promise.all([
      db.crmLead.count({ where: { companyId: targetCompanyId } }),
      db.crmLead.count({ where: { companyId: targetCompanyId, stage: 'closed_won' } }),
    ]);
    const conversionRate = totalLeads > 0 ? (closedWonLeads / totalLeads) * 100 : 0;

    // Compute CAC: total marketing expenses / new customers count
    const marketingExpenses = await db.expense.findMany({
      where: { companyId: targetCompanyId, category: 'marketing', status: 'approved' },
    });
    const totalMarketingSpend = marketingExpenses.reduce((sum, e) => sum + e.amount, 0);
    const newCustomers = closedWonLeads || 1; // avoid division by zero
    const cac = totalMarketingSpend / newCustomers;

    // Compute LTV: average revenue per customer
    const revenueRecords = await db.revenueRecord.findMany({
      where: { companyId: targetCompanyId },
    });
    const totalRevenue = revenueRecords.reduce((sum, r) => sum + r.amount, 0);
    const uniqueCustomerCount = closedWonLeads || 1;
    const ltv = totalRevenue / uniqueCustomerCount;

    // Churn rate: mock 15%
    const churnRate = 15;

    // Revenue growth: percentage change month over month
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [thisMonthRevenue, lastMonthRevenue] = await Promise.all([
      db.revenueRecord.findMany({
        where: {
          companyId: targetCompanyId,
          date: { gte: thisMonthStart },
        },
      }),
      db.revenueRecord.findMany({
        where: {
          companyId: targetCompanyId,
          date: { gte: lastMonthStart, lte: lastMonthEnd },
        },
      }),
    ]);

    const thisMonthTotal = thisMonthRevenue.reduce((sum, r) => sum + r.amount, 0);
    const lastMonthTotal = lastMonthRevenue.reduce((sum, r) => sum + r.amount, 0);
    const revenueGrowth =
      lastMonthTotal > 0
        ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
        : 0;

    // Strategy completion: completed tasks / total tasks
    const [totalTasks, completedTasks] = await Promise.all([
      db.executionTask.count(),
      db.executionTask.count({ where: { status: 'done' } }),
    ]);
    const strategyCompletion = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const computedKPIs = {
      conversion_rate: {
        value: Math.round(conversionRate * 100) / 100,
        unit: '%',
        label: 'نرخ تبدیل',
        details: { totalLeads, closedWonLeads },
      },
      cac: {
        value: Math.round(cac * 100) / 100,
        unit: 'currency',
        label: 'هزینه جذب مشتری',
        details: { totalMarketingSpend: Math.round(totalMarketingSpend * 100) / 100, newCustomers },
      },
      ltv: {
        value: Math.round(ltv * 100) / 100,
        unit: 'currency',
        label: 'ارزش طول عمر مشتری',
        details: { totalRevenue: Math.round(totalRevenue * 100) / 100, uniqueCustomerCount },
      },
      churn_rate: {
        value: churnRate,
        unit: '%',
        label: 'نرخ ریزش',
        details: { note: 'mock value' },
      },
      revenue_growth: {
        value: Math.round(revenueGrowth * 100) / 100,
        unit: '%',
        label: 'رشد درآمد',
        details: {
          thisMonthRevenue: Math.round(thisMonthTotal * 100) / 100,
          lastMonthRevenue: Math.round(lastMonthTotal * 100) / 100,
        },
      },
      strategy_completion: {
        value: Math.round(strategyCompletion * 100) / 100,
        unit: '%',
        label: 'تکمیل استراتژی',
        details: { totalTasks, completedTasks },
      },
    };

    return NextResponse.json({
      kpis: computedKPIs,
      companyId: targetCompanyId,
      computed: true,
      computedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get KPI error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
