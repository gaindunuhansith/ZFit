"use client"

import { useAuth } from "@/lib/auth-context"
import { MemberTrackingWidget } from "@/components/member-tracking-widget"

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
          Access your membership features from the sidebar.
        </p>
      </div>

      {/* Dashboard Widgets */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MemberTrackingWidget />
        
        {/* Placeholder for other widgets */}
        <div className="md:col-span-2 lg:col-span-2">
          <div className="text-center py-12 text-muted-foreground">
            <p>Additional dashboard widgets can be added here</p>
          </div>
        </div>
      </div>
    </div>
  )
}