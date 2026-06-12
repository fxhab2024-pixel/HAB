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
    const priority = searchParams.get('priority');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = { userId: user!.id };
    if (status) {
      where.status = status;
    }
    if (priority) {
      where.priority = priority;
    }

    const [tasks, total] = await Promise.all([
      db.executionTask.findMany({
        where,
        orderBy: [
          { priority: 'desc' },
          { dueDate: 'asc' },
        ],
        take: limit,
        skip: offset,
        include: {
          phase: {
            select: {
              id: true,
              title: true,
              roadmap: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      }),
      db.executionTask.count({ where }),
    ]);

    // Group tasks by status
    const grouped: Record<string, typeof tasks> = {
      todo: [],
      in_progress: [],
      done: [],
      blocked: [],
    };
    for (const task of tasks) {
      if (!grouped[task.status]) {
        grouped[task.status] = [];
      }
      grouped[task.status].push(task);
    }

    return NextResponse.json({
      tasks,
      grouped,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('List tasks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const body = await request.json();
    const { taskId, status, priority } = body;

    if (!taskId) {
      return NextResponse.json(
        { error: 'taskId is required' },
        { status: 400 }
      );
    }

    // Verify task belongs to user
    const task = await db.executionTask.findFirst({
      where: { id: taskId, userId: user!.id },
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (status) {
      const validStatuses = ['todo', 'in_progress', 'done', 'blocked'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }
      updateData.status = status;
      if (status === 'done') {
        updateData.completedAt = new Date();
      }
    }
    if (priority) {
      const validPriorities = ['low', 'medium', 'high', 'critical'];
      if (!validPriorities.includes(priority)) {
        return NextResponse.json(
          { error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}` },
          { status: 400 }
        );
      }
      updateData.priority = priority;
    }

    const updatedTask = await db.executionTask.update({
      where: { id: taskId },
      data: updateData,
    });

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
