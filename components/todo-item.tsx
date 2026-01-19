'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { toggleTodo, deleteTodo } from '@/app/actions/todos'
import { type Todo } from '@/lib/schema'
import { toast } from 'sonner'

export function TodoItem({ todo }: { todo: Todo }) {
  const [isPending, setIsPending] = useState(false)

  const handleToggle = async (checked: boolean) => {
    setIsPending(true)
    const result = await toggleTodo(todo.id, checked)
    if (result.success === false) {
      toast.error(result.error)
    }
    setIsPending(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure?')) return
    setIsPending(true)
    const result = await deleteTodo(todo.id)
    if (result.success === false) {
      toast.error(result.error)
    }
    setIsPending(false)
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
      <div className="flex items-center gap-3">
        <Checkbox 
          id={todo.id} 
          checked={todo.completed} 
          onCheckedChange={handleToggle}
          disabled={isPending}
        />
        <label 
          htmlFor={todo.id}
          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${todo.completed ? 'line-through opacity-50' : ''}`}
        >
          {todo.title}
        </label>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleDelete}
        disabled={isPending}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

