'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import { type Todo } from '@/lib/schema'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function TodoItem({ todo }: { todo: Todo }) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleToggle = async (checked: boolean) => {
    setIsPending(true)
    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: checked }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update task')
      }

      router.refresh()
    } catch (error: any) {
      console.error('[CLIENT] Error toggling todo:', error)
      toast.error(error.message)
    } finally {
      setIsPending(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    setIsPending(true)
    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete task')
      }

      router.refresh()
      toast.success('Task deleted')
    } catch (error: any) {
      console.error('[CLIENT] Error deleting todo:', error)
      toast.error(error.message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-card text-card-foreground shadow-sm group">
      <div className="flex items-center gap-3">
        <Checkbox 
          id={todo.id} 
          checked={todo.completed} 
          onCheckedChange={handleToggle}
          disabled={isPending}
        />
        <label 
          htmlFor={todo.id}
          className={`text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${todo.completed ? 'line-through opacity-50' : ''}`}
        >
          {todo.title}
        </label>
      </div>
      <div className="flex items-center gap-2">
        {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleDelete}
          disabled={isPending}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

