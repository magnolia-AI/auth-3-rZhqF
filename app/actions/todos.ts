'use server'

import db from '@/lib/db'
import { todos } from '@/lib/schema'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { authServer } from '@/lib/auth/server'

export type ActionResult<T = any> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

// Programmatic action for creating a todo
export async function createTodo(title: string): Promise<ActionResult> {
  const result: any = await authServer.getSession()
  const session = result?.data
  
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }
  if (!title.trim()) return { success: false, error: 'Title is required' }

  try {
    const todo = await db.insert(todos).values({
      title: title.trim(),
      userId: session.user.id,
    }).returning()
    revalidatePath('/todos')
    return { success: true, data: todo[0] }
  } catch (error) {
    console.error('Error creating todo:', error)
    return { success: false, error: 'Failed to create todo' }
  }
}

// Form action for creating a todo
export async function createTodoFormAction(prevState: any, formData: FormData) {
  const title = formData.get('title') as string
  const result = await createTodo(title)
  
  if (result.success === false) {
    return { error: result.error }
  }
  
  return { success: true }
}

export async function toggleTodo(id: string, completed: boolean): Promise<ActionResult> {
  const result: any = await authServer.getSession()
  const session = result?.data
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

  try {
    await db.update(todos)
      .set({ completed, updatedAt: new Date() })
      .where(and(eq(todos.id, id), eq(todos.userId, session.user.id)))
    
    revalidatePath('/todos')
    return { success: true, data: null }
  } catch (error) {
    console.error('Error toggling todo:', error)
    return { success: false, error: 'Failed to update todo' }
  }
}

export async function deleteTodo(id: string): Promise<ActionResult> {
  const result: any = await authServer.getSession()
  const session = result?.data
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

  try {
    await db.delete(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, session.user.id)))
    
    revalidatePath('/todos')
    return { success: true, data: null }
  } catch (error) {
    console.error('Error deleting todo:', error)
    return { success: false, error: 'Failed to delete todo' }
  }
}

