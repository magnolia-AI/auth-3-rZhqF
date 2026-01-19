'use client'

import { useActionState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createTodoFormAction } from '@/app/actions/todos'
import { PlusCircle, Loader2 } from 'lucide-react'

export function TodoForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, action, isPending] = useActionState(createTodoFormAction, null)

  if (state?.success && formRef.current) {
    formRef.current.reset()
  }

  return (
    <form action={action} ref={formRef} className="space-y-2">
      <div className="flex gap-2">
        <Input 
          name="title" 
          placeholder="What needs to be done?" 
          required 
          disabled={isPending}
          className="flex-1"
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle className="h-4 w-4 mr-2" />
          )}
          Add
        </Button>
      </div>
      {state?.error && (
        <p className="text-sm font-medium text-destructive">{state.error}</p>
      )}
    </form>
  )
}

