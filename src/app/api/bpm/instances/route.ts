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
    const workflowId = searchParams.get('workflowId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (workflowId) where.workflowId = workflowId;

    const [instances, total] = await Promise.all([
      db.workflowInstance.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          workflow: { select: { id: true, name: true, type: true, steps: true } },
          actions: {
            orderBy: { createdAt: 'desc' },
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
      }),
      db.workflowInstance.count({ where }),
    ]);

    return NextResponse.json({ instances, total, limit, offset });
  } catch (error) {
    console.error('List workflow instances error:', error);
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
    const { workflowId, entityId, entityType, advance, instanceId, action, comment, stepIndex } = body;

    // Advance an existing instance's step
    if (advance && instanceId) {
      const instance = await db.workflowInstance.findFirst({
        where: { id: instanceId },
        include: { workflow: true },
      });

      if (!instance) {
        return NextResponse.json(
          { error: 'Workflow instance not found' },
          { status: 404 }
        );
      }

      // Determine the step index for the action
      const actionStepIndex = stepIndex !== undefined ? stepIndex : instance.currentStep;

      // Create workflow action record
      if (action) {
        await db.workflowAction.create({
          data: {
            instanceId: instance.id,
            userId: user!.id,
            stepIndex: actionStepIndex,
            action,
            comment,
          },
        });
      }

      // Advance step if action is approve or review
      let newStep = instance.currentStep;
      let newStatus = instance.status;

      if (action === 'approve') {
        newStep = instance.currentStep + 1;
        // Check if we've reached the end of the workflow
        try {
          const steps = JSON.parse(instance.workflow.steps);
          if (newStep >= steps.length) {
            newStatus = 'completed';
          } else {
            newStatus = 'in_progress';
          }
        } catch {
          newStatus = 'in_progress';
        }
      } else if (action === 'reject') {
        newStatus = 'rejected';
      }

      const updatedInstance = await db.workflowInstance.update({
        where: { id: instance.id },
        data: {
          currentStep: newStep,
          status: newStatus,
          updatedAt: new Date(),
        },
        include: {
          workflow: { select: { id: true, name: true, type: true, steps: true } },
          actions: {
            orderBy: { createdAt: 'desc' },
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
      });

      return NextResponse.json({ instance: updatedInstance });
    }

    // Create a new instance
    if (!workflowId || !entityId || !entityType) {
      return NextResponse.json(
        { error: 'workflowId, entityId, and entityType are required' },
        { status: 400 }
      );
    }

    const workflow = await db.workflow.findUnique({
      where: { id: workflowId },
    });

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    const instance = await db.workflowInstance.create({
      data: {
        workflowId,
        entityId,
        entityType,
        status: 'pending',
        currentStep: 0,
        initiatorId: user!.id,
      },
      include: {
        workflow: { select: { id: true, name: true, type: true, steps: true } },
        actions: true,
      },
    });

    return NextResponse.json({ instance }, { status: 201 });
  } catch (error) {
    console.error('Create/advance workflow instance error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const body = await request.json();
    const { id, status, currentStep } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Instance id is required' },
        { status: 400 }
      );
    }

    const instance = await db.workflowInstance.findUnique({
      where: { id },
    });

    if (!instance) {
      return NextResponse.json(
        { error: 'Workflow instance not found' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (status) {
      const validStatuses = ['pending', 'in_progress', 'completed', 'rejected', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }
      updateData.status = status;
    }
    if (currentStep !== undefined) {
      updateData.currentStep = currentStep;
    }

    const updatedInstance = await db.workflowInstance.update({
      where: { id },
      data: updateData,
      include: {
        workflow: { select: { id: true, name: true, type: true, steps: true } },
        actions: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    return NextResponse.json({ instance: updatedInstance });
  } catch (error) {
    console.error('Update workflow instance error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
