import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { todos } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import { authServer } from '@/lib/auth/server'

export async function GET() {
  console.log('>>> [DEBUG] GET /api/todos handler started')
  console.log('>>> [DEBUG] DB Connection check:', process.env.DATABASE_URL ? 'URL PRESENT' : 'MISSING URL')
  
  try {
    const sessionResponse: any = await authServer.getSession()
    const session = sessionResponse?.data
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Direct check of the table content to see if it throws
    const data = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, session.user.id))
      .orderBy(desc(todos.createdAt))

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('>>> [CRITICAL] GET /api/todos failed:', error)
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        details: error?.message,
        table: 'todo_items',
        msg: 'Please check if the table was correctly migrated to the PUBLIC schema.'
      }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionResponse: any = await authServer.getSession()
    const session = sessionResponse?.data
    
    if (!session?.user?.id) {
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

    return NextResponse.json(newTodo[0], { status: 201 })
  } catch (error: any) {
    console.error('>>> [CRITICAL] POST /api/todos failed:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error?.message }, 
      { status: 500 }
    )
  }
}

