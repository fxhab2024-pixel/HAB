import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const body = await request.json();
    const {
      name,
      industry,
      subIndustry,
      businessModel,
      stage,
      revenue,
      employees,
      region,
      country,
      foundedYear,
      website,
      description,
      targetCustomers,
      products,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    // Check if user already has a company
    const existingCompany = await db.company.findUnique({
      where: { userId: user!.id },
    });

    let company;
    if (existingCompany) {
      // Update existing company
      company = await db.company.update({
        where: { id: existingCompany.id },
        data: {
          name,
          industry,
          subIndustry,
          businessModel,
          stage,
          revenue,
          employees,
          region,
          country,
          foundedYear,
          website,
          description,
          targetCustomers,
          products,
        },
      });
    } else {
      // Create new company
      company = await db.company.create({
        data: {
          userId: user!.id,
          name,
          industry,
          subIndustry,
          businessModel,
          stage,
          revenue,
          employees,
          region,
          country,
          foundedYear,
          website,
          description,
          targetCustomers,
          products,
        },
      });
    }

    return NextResponse.json({ company });
  } catch (error) {
    console.error('Company create/update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const company = await db.company.findUnique({
      where: { userId: user!.id },
      include: {
        benchmarks: true,
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'No company profile found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ company });
  } catch (error) {
    console.error('Get company error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
