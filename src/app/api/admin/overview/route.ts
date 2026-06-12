import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAdmin(request);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    // Get overall stats
    const [
      totalUsers,
      totalDiagnostics,
      completedDiagnostics,
      totalCompanies,
      totalReports,
      totalRecommendations,
      totalChatSessions,
      totalKnowledgeArticles,
      recentUsers,
      recentDiagnostics,
    ] = await Promise.all([
      db.user.count(),
      db.diagnostic.count(),
      db.diagnostic.count({ where: { status: 'completed' } }),
      db.company.count(),
      db.report.count(),
      db.strategyRecommendation.count(),
      db.chatSession.count(),
      db.knowledgeArticle.count(),
      db.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
            select: { diagnostics: true, reports: true },
          },
        },
      }),
      db.diagnostic.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          company: { select: { id: true, name: true, industry: true } },
        },
      }),
    ]);

    // Get average scores across all diagnostics
    const diagnostics = await db.diagnostic.findMany({
      where: { status: 'completed' },
      select: {
        overallScore: true,
        riskScore: true,
        growthPotential: true,
        investmentReady: true,
        businessModel: true,
        market: true,
        product: true,
        customers: true,
        marketing: true,
        sales: true,
        operations: true,
        financial: true,
        team: true,
        growth: true,
      },
    });

    const avgScores = diagnostics.length > 0
      ? {
          overallScore: Math.round(diagnostics.reduce((s, d) => s + d.overallScore, 0) / diagnostics.length * 100) / 100,
          riskScore: Math.round(diagnostics.reduce((s, d) => s + d.riskScore, 0) / diagnostics.length * 100) / 100,
          growthPotential: Math.round(diagnostics.reduce((s, d) => s + d.growthPotential, 0) / diagnostics.length * 100) / 100,
          investmentReady: Math.round(diagnostics.reduce((s, d) => s + d.investmentReady, 0) / diagnostics.length * 100) / 100,
          businessModel: Math.round(diagnostics.reduce((s, d) => s + d.businessModel, 0) / diagnostics.length * 100) / 100,
          market: Math.round(diagnostics.reduce((s, d) => s + d.market, 0) / diagnostics.length * 100) / 100,
          product: Math.round(diagnostics.reduce((s, d) => s + d.product, 0) / diagnostics.length * 100) / 100,
          customers: Math.round(diagnostics.reduce((s, d) => s + d.customers, 0) / diagnostics.length * 100) / 100,
          marketing: Math.round(diagnostics.reduce((s, d) => s + d.marketing, 0) / diagnostics.length * 100) / 100,
          sales: Math.round(diagnostics.reduce((s, d) => s + d.sales, 0) / diagnostics.length * 100) / 100,
          operations: Math.round(diagnostics.reduce((s, d) => s + d.operations, 0) / diagnostics.length * 100) / 100,
          financial: Math.round(diagnostics.reduce((s, d) => s + d.financial, 0) / diagnostics.length * 100) / 100,
          team: Math.round(diagnostics.reduce((s, d) => s + d.team, 0) / diagnostics.length * 100) / 100,
          growth: Math.round(diagnostics.reduce((s, d) => s + d.growth, 0) / diagnostics.length * 100) / 100,
        }
      : null;

    // Get user role distribution
    const userRoleDistribution = await db.user.groupBy({
      by: ['role'],
      _count: { role: true },
    });

    // Get recommendation status distribution
    const recommendationStatusDist = await db.strategyRecommendation.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    // Get all users with their diagnostics
    const allUsers = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        company: { select: { name: true, industry: true, stage: true } },
        _count: {
          select: { diagnostics: true, reports: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalDiagnostics,
        completedDiagnostics,
        totalCompanies,
        totalReports,
        totalRecommendations,
        totalChatSessions,
        totalKnowledgeArticles,
        completionRate: totalDiagnostics > 0
          ? Math.round((completedDiagnostics / totalDiagnostics) * 100)
          : 0,
      },
      avgScores,
      userRoleDistribution: userRoleDistribution.map((r) => ({
        role: r.role,
        count: r._count.role,
      })),
      recommendationStatusDistribution: recommendationStatusDist.map((r) => ({
        status: r.status,
        count: r._count.status,
      })),
      recentUsers,
      recentDiagnostics,
      allUsers,
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
