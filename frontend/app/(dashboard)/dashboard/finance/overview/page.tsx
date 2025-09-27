"use client"

import { useState, useEffect } from "react"
import {
  CreditCard,
  FileText,
  RefreshCw,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  Eye,
  Plus,
  Download,
  BarChart3,
  AlertTriangle,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation"

// Sample data - will be replaced with API calls
const recentPayments = [
  {
    id: "TXN-001",
    member: "John Doe",
    amount: 150.00,
    status: "completed",
    date: "2025-09-26",
    type: "Membership",
  },
  {
    id: "TXN-002",
    member: "Jane Smith",
    amount: 75.00,
    status: "pending",
    date: "2025-09-25",
    type: "Booking",
  },
  {
    id: "TXN-003",
    member: "Bob Johnson",
    amount: 200.00,
    status: "completed",
    date: "2025-09-24",
    type: "Inventory",
  },
]

const recentInvoices = [
  {
    id: "INV-001",
    member: "John Doe",
    amount: 150.00,
    status: "paid",
    dueDate: "2025-09-30",
  },
  {
    id: "INV-002",
    member: "Jane Smith",
    amount: 75.00,
    status: "pending",
    dueDate: "2025-09-28",
  },
  {
    id: "INV-003",
    member: "Alice Brown",
    amount: 300.00,
    status: "sent",
    dueDate: "2025-10-05",
  },
]

const recentRefunds = [
  {
    id: "REF-001",
    member: "John Doe",
    amount: 25.00,
    status: "approved",
    reason: "Customer request",
  },
  {
    id: "REF-002",
    member: "Bob Johnson",
    amount: 50.00,
    status: "pending",
    reason: "Duplicate payment",
  },
]

// Recent transactions for detailed table
const recentTransactions = [
  {
    id: "TXN-001",
    member: "John Doe",
    type: "Membership Payment",
    amount: 150.00,
    status: "completed",
    date: "2025-09-26",
    method: "Credit Card",
  },
  {
    id: "TXN-002",
    member: "Jane Smith",
    type: "Class Booking",
    amount: 75.00,
    status: "pending",
    date: "2025-09-25",
    method: "Cash",
  },
  {
    id: "TXN-003",
    member: "Bob Johnson",
    type: "Equipment Purchase",
    amount: 200.00,
    status: "completed",
    date: "2025-09-24",
    method: "Bank Transfer",
  },
  {
    id: "TXN-004",
    member: "Alice Brown",
    type: "Personal Training",
    amount: 120.00,
    status: "completed",
    date: "2025-09-23",
    method: "Digital Wallet",
  },
  {
    id: "TXN-005",
    member: "Charlie Wilson",
    type: "Membership Renewal",
    amount: 150.00,
    status: "failed",
    date: "2025-09-22",
    method: "Credit Card",
  },
]

const getStatusBadge = (status: string) => {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    completed: "default",
    paid: "default",
    approved: "default",
    pending: "secondary",
    sent: "secondary",
    failed: "destructive",
    denied: "destructive",
    draft: "outline",
  }
  return <Badge variant={variants[status] || "outline"}>{status}</Badge>
}

export default function FinanceOverviewPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    activeInvoices: 0,
    pendingRefunds: 0,
    monthlyGrowth: 0,
    totalExpenses: 0,
    netProfit: 0,
    overdueInvoices: 0,
  })

  // Calculate stats from sample data
  useEffect(() => {
    const totalRevenue = recentPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0)

    const pendingPayments = recentPayments
      .filter(p => p.status === 'pending')
      .length

    const activeInvoices = recentInvoices
      .filter(i => i.status !== 'paid')
      .length

    const pendingRefunds = recentRefunds
      .filter(r => r.status === 'pending')
      .length

    const totalExpenses = 0 // Placeholder - will be calculated from API
    const netProfit = totalRevenue - totalExpenses
    const monthlyGrowth = 12.5 // Sample growth percentage
    const overdueInvoices = 3 // Sample overdue count

    setStats({
      totalRevenue,
      pendingPayments,
      activeInvoices,
      pendingRefunds,
      monthlyGrowth,
      totalExpenses,
      netProfit,
      overdueInvoices,
    })
  }, [])

  const handleExportReport = () => {
    // TODO: Implement export functionality
    console.log("Exporting financial report...")
  }

  const handleGenerateReport = () => {
    // TODO: Implement report generation
    console.log("Generating detailed report...")
  }

  const handleViewAnalytics = () => {
    router.push('/dashboard/analytics')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Finance Overview</h2>
          <p className="text-muted-foreground">
            Comprehensive view of all financial activities and management.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleViewAnalytics}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          <Button variant="outline" onClick={handleGenerateReport}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => router.push('/dashboard/finance/invoice/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">LKR {stats.totalRevenue.toFixed(2)}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +{stats.monthlyGrowth}% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">LKR {stats.netProfit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">After expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Items</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPayments + stats.pendingRefunds}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingPayments} payments, {stats.pendingRefunds} refunds
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdueInvoices}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest financial transactions across all categories</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/finance/payment')}>
              <Eye className="mr-2 h-4 w-4" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{transaction.member}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>LKR {transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>{transaction.method}</TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detailed Payments Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Payment Transactions</CardTitle>
            <CardDescription>Complete list of all payment transactions</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/finance/refund')}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Process Refund
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.member}</TableCell>
                  <TableCell>{payment.type}</TableCell>
                  <TableCell>LKR {payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common financial management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => router.push('/dashboard/finance/invoice/create')}
            >
              <Plus className="h-6 w-6 mb-2" />
              Create Invoice
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => router.push('/dashboard/finance/refund')}
            >
              <RefreshCw className="h-6 w-6 mb-2" />
              Process Refunds
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => router.push('/dashboard/finance/invoice')}
            >
              <FileText className="h-6 w-6 mb-2" />
              Manage Invoices
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => router.push('/dashboard/users')}
            >
              <Users className="h-6 w-6 mb-2" />
              Manage Members
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => router.push('/dashboard/analytics')}
            >
              <BarChart3 className="h-6 w-6 mb-2" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}