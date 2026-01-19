import db from '@/lib/db'
import { todos } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import { authServer } from '@/lib/auth/server'
import { redirect } from 'next/navigation'
import { TodoItem } from '@/components/todo-item'
import { TodoForm } from '@/components/todo-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function TodosPage() {
  const result: any = await authServer.getSession()
  const dbUrl = process.env.DATABASE_URL || 'NOT SET'
  console.log('DB URL Host:', dbUrl.split('@')[1]?.split('/')[0])
  const session = result?.data

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  try {
    const userTodos = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, session.user.id))
      .orderBy(desc(todos.createdAt))

    return (
      <div className="container max-w-2xl py-10 mx-auto px-4">
        <Card className="shadow-lg border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight">Todo List</CardTitle>
            <CardDescription>
              Manage your daily tasks efficiently.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <TodoForm />
            
            <div className="space-y-3 mt-6">
              {userTodos.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">No tasks found. Add your first todo above!</p>
                </div>
              ) : (
                userTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error('TODOS_PAGE_ERROR:', error)
    return (
      <div className="p-10 text-destructive">
        <h1>Failed to load todos</h1>
        <pre className="mt-4 p-4 bg-muted rounded overflow-auto">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      </div>
    )
  }
}



