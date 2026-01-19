import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { todos } from '@/lib/schema'
import { eq, and } from 'drizzle-orm'
import { authServer } from '@/lib/auth/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  console.log(`[API] PATCH /api/todos/${id} - Updating todo`)

  try {
    const result: any = await authServer.getSession()
    const session = result?.data
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const updateData: any = { updatedAt: new Date() }
    
    if (typeof body.completed === 'boolean') {
      updateData.completed = body.completed
    }
    if (body.title) {
      updateData.title = body.title.trim()
    }

    const updated = await db.update(todos)
      .set(updateData)
      .where(and(eq(todos.id, id), eq(todos.userId, session.user.id)))
      .returning()

    if (updated.length === 0) {
      console.warn(`[API] PATCH /api/todos/${id} - Todo not found or unauthorized`)
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    console.log(`[API] PATCH /api/todos/${id} - Success`)
    return NextResponse.json(updated[0])
  } catch (error) {
    console.error(`[API] PATCH /api/todos/${id} - Critical Error:`, error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  console.log(`[API] DELETE /api/todos/${id} - Deleting todo`)

  try {
    const result: any = await authServer.getSession()
    const session = result?.data
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const deleted = await db.delete(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, session.user.id)))
      .returning()

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    console.log(`[API] DELETE /api/todos/${id} - Success`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`[API] DELETE /api/todos/${id} - Critical Error:`, error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

