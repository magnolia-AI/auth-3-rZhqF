import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2, ListTodo, ShieldCheck } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="p-3 bg-primary/10 rounded-full mb-4">
              <ListTodo className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
              Stay Focused, <span className="text-primary">Stay Productive</span>
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl lg:text-2xl mt-4">
              A simple yet powerful todo application built with Next.js, Neon Auth, and PostgreSQL. 
              Organize your life in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button asChild size="lg" className="px-8 text-lg font-semibold">
                <Link href="/todos">Get Started Free</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="px-8 text-lg font-semibold">
                <Link href="https://neon.tech" target="_blank" rel="noopener noreferrer">Powered by Neon</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24 px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-xl border bg-card transition-shadow hover:shadow-md">
            <div className="p-3 bg-blue-500/10 rounded-full">
              <ShieldCheck className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold">Secure Auth</h3>
            <p className="text-muted-foreground">
              Simple and secure authentication powered by Neon Auth. Your data stays yours.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-xl border bg-card transition-shadow hover:shadow-md">
            <div className="p-3 bg-green-500/10 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-xl font-bold tracking-tight">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Built with Next.js 16 and Server Actions for near-instant responsiveness.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-xl border bg-card transition-shadow hover:shadow-md">
            <div className="p-3 bg-primary/10 rounded-full">
              <ListTodo className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold tracking-tight">Cloud Persistence</h3>
            <p className="text-muted-foreground tracking-tight">
              Stored in a high-performance Neon PostgreSQL database with automatic syncing.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

