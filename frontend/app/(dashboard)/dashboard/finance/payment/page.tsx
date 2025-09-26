import {
  Activity,
  CreditCard,
  DollarSign,
  AlertTriangle,
  FileText,
  BarChart3,
  RefreshCw,
  Plus,
  Eye,
  Settings,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function PaymentDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payment Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor revenue, payments, and financial activities.
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Last updated: {new Date().toLocaleDateString()}
        </Badge>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          Process Refund
        </Button>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Generate Invoice
        </Button>
        <Button variant="outline">
          <BarChart3 className="mr-2 h-4 w-4" />
          View Reports
        </Button>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Manage Methods
        </Button>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue (Today)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,847</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary">+12.5%</span> from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Successful Transactions
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">184</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary">+8.2%</span> from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Failed Payments
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Membership vs Inventory Revenue</CardTitle>
          <CardDescription>
            Breakdown of revenue sources for the current month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Membership Fees</span>
              </div>
              <div className="text-sm font-bold">$12,450 (65%)</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Inventory Sales</span>
              </div>
              <div className="text-sm font-bold">$6,780 (35%)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity Feed */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest payments, alerts, and refund requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Payment received from John Doe
                  </p>
                  <p className="text-sm text-muted-foreground">
                    $50.00 - Membership renewal
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  2 min ago
                </div>
              </div>
              <Separator />
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Failed payment alert
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Transaction ID: TXN-12345 - Card declined
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  15 min ago
                </div>
              </div>
              <Separator />
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Refund request submitted
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Jane Smith - $25.00 - Class cancellation
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  1 hour ago
                </div>
              </div>
              <Separator />
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Invoice generated
                  </p>
                  <p className="text-sm text-muted-foreground">
                    INV-2025-0001 - Sent to customer
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  2 hours ago
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Sidebar */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>
              Key metrics at a glance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">This Week</span>
              <span className="text-sm font-bold">$8,450</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">This Month</span>
              <span className="text-sm font-bold">$32,780</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Pending Refunds</span>
              <span className="text-sm font-bold">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Methods</span>
              <span className="text-sm font-bold">5</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}