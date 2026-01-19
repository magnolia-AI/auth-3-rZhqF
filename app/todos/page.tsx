import db from '@/lib/db'
import { todos } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import { authServer } from '@/lib/auth/server'
import { TodoForm } from '@/components/todo-form'
import { TodoItem } from '@/components/todo-item'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ListTodo } from 'lucide-react'

export default async function TodosPage() {
  const result: any = await authServer.getSession()
  const session = result?.data
  
  if (!session?.user) {
    redirect('/auth/sign-in')
  }

  const userTodos = await db
    .select()
    .from(todos)
    .where(eq(todos.userId, session.user.id))
    .orderBy(desc(todos.createdAt))

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <div className="flex flex-col gap-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage your daily tasks and stay productive.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <ListTodo className="h-5 w-5" />
              New Task
            </CardTitle>
            <CardDescription>
              What needs to be done today?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TodoForm />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Tasks ({userTodos.length})</h2>
          {userTodos.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-10 flex flex-col items-center justify-center text-center">
                <p className="text-muted-foreground mb-1">No tasks yet.</p>
                <p className="text-sm text-muted-foreground/60">
                  Add your first task using the form above.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {userTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

