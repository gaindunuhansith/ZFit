export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Access your fitness center features from the sidebar.
        </p>
      </div>

      {/* Quick Reservation Links */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <a href="/dashboard/reservations/bookings" className="block rounded-lg border p-4 hover:shadow-sm transition-shadow">
          <div className="text-sm font-medium">Bookings</div>
          <div className="text-xs text-muted-foreground">View and manage all bookings</div>
        </a>
        <a href="/dashboard/reservations/classes" className="block rounded-lg border p-4 hover:shadow-sm transition-shadow">
          <div className="text-sm font-medium">Classes</div>
          <div className="text-xs text-muted-foreground">Create and edit classes</div>
        </a>
        <a href="/dashboard/reservations/trainers" className="block rounded-lg border p-4 hover:shadow-sm transition-shadow">
          <div className="text-sm font-medium">Trainers</div>
          <div className="text-xs text-muted-foreground">Manage trainers</div>
        </a>
        <a href="/dashboard/reservations/facilities" className="block rounded-lg border p-4 hover:shadow-sm transition-shadow">
          <div className="text-sm font-medium">Facilities</div>
          <div className="text-xs text-muted-foreground">Manage facilities</div>
        </a>
      </div>
    </div>
  )
}