import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { todos } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import { authServer } from '@/lib/auth/server'

export async function GET() {
  console.log('[API] GET /api/todos - Fetching todos')
  try {
    const result: any = await authServer.getSession()
    const session = result?.data
    
    if (!session?.user?.id) {
      console.warn('[API] GET /api/todos - Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, session.user.id))
      .orderBy(desc(todos.createdAt))

    console.log(`[API] GET /api/todos - Success: Found ${data.length} todos`)
    return NextResponse.json(data)
  } catch (error) {
    console.error('[API] GET /api/todos - Critical Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log('[API] POST /api/todos - Creating new todo')
  try {
    const result: any = await authServer.getSession()
    const session = result?.data
    
    if (!session?.user?.id) {
      console.warn('[API] POST /api/todos - Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title } = await request.json()
    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const newTodo = await db.insert(todos).values({
      title: title.trim(),
      userId: session.user.id,
    }).returning()

    console.log(`[API] POST /api/todos - Success: Created todo ${newTodo[0].id}`)
    return NextResponse.json(newTodo[0], { status: 201 })
  } catch (error) {
    console.error('[API] POST /api/todos - Critical Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

