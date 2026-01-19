'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function TodoForm() {
  const [isPending, setIsPending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create task')
      }

      formRef.current?.reset()
      router.refresh()
      toast.success('Task added!')
    } catch (error: any) {
      console.error('[CLIENT] Error creating todo:', error)
      toast.error(error.message || 'Something went wrong')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} ref={formRef} className="space-y-2">
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
    </form>
  )
}

