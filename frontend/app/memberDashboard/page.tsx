"use client"

import { useAuth } from "@/lib/auth-context"

export default function MemberDashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name?.split(' ')[0] || 'Member'}!
        </h2>
        <p className="text-muted-foreground">
          Here&apos;s your quick access to important features.
        </p>
      </div>

      {/* Build your dashboard here */}
    </div>
  )
}