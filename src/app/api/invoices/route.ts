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
    const status = searchParams.get('status');
    const companyId = searchParams.get('companyId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (companyId) where.companyId = companyId;

    const [invoices, total] = await Promise.all([
      db.invoice.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          company: { select: { id: true, name: true, industry: true } },
          creator: { select: { id: true, name: true, email: true } },
          payments: true,
        },
      }),
      db.invoice.count({ where }),
    ]);

    return NextResponse.json({ invoices, total, limit, offset });
  } catch (error) {
    console.error('List invoices error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const body = await request.json();
    const {
      companyId,
      invoiceNumber,
      type,
      status,
      issueDate,
      dueDate,
      items,
      subtotal,
      taxRate,
      taxAmount,
      discount,
      total,
      paidAmount,
      notes,
    } = body;

    if (!companyId || !issueDate || !dueDate) {
      return NextResponse.json(
        { error: 'companyId, issueDate, and dueDate are required' },
        { status: 400 }
      );
    }

    // Auto-generate invoice number if not provided
    const finalInvoiceNumber = invoiceNumber || `INV-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Check for duplicate invoice number
    const existing = await db.invoice.findUnique({
      where: { invoiceNumber: finalInvoiceNumber },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Invoice number already exists' },
        { status: 409 }
      );
    }

    const invoice = await db.invoice.create({
      data: {
        companyId,
        creatorId: user!.id,
        invoiceNumber: finalInvoiceNumber,
        type: type || 'sales',
        status: status || 'draft',
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        items: typeof items === 'string' ? items : JSON.stringify(items || []),
        subtotal: subtotal || 0,
        taxRate: taxRate || 0,
        taxAmount: taxAmount || 0,
        discount: discount || 0,
        total: total || 0,
        paidAmount: paidAmount || 0,
        notes,
      },
      include: {
        company: { select: { id: true, name: true, industry: true } },
        creator: { select: { id: true, name: true, email: true } },
        payments: true,
      },
    });

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error) {
    console.error('Create invoice error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
