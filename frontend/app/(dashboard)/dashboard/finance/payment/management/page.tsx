"use client"

import { useState } from "react"
import {
  CreditCard,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  RefreshCw,
  Download,
  Plus,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// Sample payment data
const payments = [
  {
    id: "TXN-001",
    member: "John Doe",
    amount: 50.00,
    currency: "USD",
    status: "completed",
    method: "Credit Card",
    date: "2025-09-26",
    gateway: "PayHere",
    transactionId: "PH-123456",
    refundHistory: [],
  },
  {
    id: "TXN-002",
    member: "Jane Smith",
    amount: 25.00,
    currency: "USD",
    status: "pending",
    method: "Bank Transfer",
    date: "2025-09-25",
    gateway: "PayHere",
    transactionId: "PH-123457",
    refundHistory: [],
  },
  {
    id: "TXN-003",
    member: "Bob Johnson",
    amount: 75.00,
    currency: "USD",
    status: "failed",
    method: "Credit Card",
    date: "2025-09-24",
    gateway: "PayHere",
    transactionId: "PH-123458",
    refundHistory: [],
  },
  {
    id: "TXN-004",
    member: "Alice Brown",
    amount: 100.00,
    currency: "USD",
    status: "completed",
    method: "PayPal",
    date: "2025-09-23",
    gateway: "PayHere",
    transactionId: "PH-123459",
    refundHistory: [
      {
        amount: 25.00,
        reason: "Partial refund",
        date: "2025-09-24",
        status: "completed"
      }
    ],
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "failed":
      return <XCircle className="h-4 w-4 text-red-600" />
    default:
      return <AlertCircle className="h-4 w-4 text-gray-600" />
  }
}

const getStatusBadge = (status: string) => {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    completed: "default",
    pending: "secondary",
    failed: "destructive",
    refunded: "outline",
  }
  return <Badge variant={variants[status] || "outline"}>{status}</Badge>
}

export default function PaymentManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")
  const [selectedPayments, setSelectedPayments] = useState<string[]>([])
  const [selectedPayment, setSelectedPayment] = useState<typeof payments[0] | null>(null)

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.member.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesMethod = methodFilter === "all" || payment.method === methodFilter
    return matchesSearch && matchesStatus && matchesMethod
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPayments(filteredPayments.map(p => p.id))
    } else {
      setSelectedPayments([])
    }
  }

  const handleSelectPayment = (paymentId: string, checked: boolean) => {
    if (checked) {
      setSelectedPayments(prev => [...prev, paymentId])
    } else {
      setSelectedPayments(prev => prev.filter(id => id !== paymentId))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payment Management</h2>
          <p className="text-muted-foreground">
            Manage and monitor all payment transactions.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Process Manual Payment
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Records
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
          <CardDescription>Filter payments by status, method, and search by member or transaction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by member, transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="PayPal">PayPal</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedPayments.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedPayments.length} payment{selectedPayments.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Selected
                </Button>
                <Button size="sm" variant="outline">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Processed
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
          <CardDescription>
            {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedPayments.length === filteredPayments.length && filteredPayments.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPayments.includes(payment.id)}
                      onCheckedChange={(checked) => handleSelectPayment(payment.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.member}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(payment.status)}
                      {getStatusBadge(payment.status)}
                    </div>
                  </TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setSelectedPayment(payment)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Retry Payment
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Initiate Refund
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          View Gateway Logs
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Details Modal */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Transaction information and history
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-6">
              {/* Transaction Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Transaction ID</label>
                  <p className="text-sm text-muted-foreground">{selectedPayment.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Gateway Transaction</label>
                  <p className="text-sm text-muted-foreground">{selectedPayment.transactionId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Amount</label>
                  <p className="text-sm text-muted-foreground">${selectedPayment.amount.toFixed(2)} {selectedPayment.currency}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedPayment.status)}
                    {getStatusBadge(selectedPayment.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Payment Method</label>
                  <p className="text-sm text-muted-foreground">{selectedPayment.method}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Gateway</label>
                  <p className="text-sm text-muted-foreground">{selectedPayment.gateway}</p>
                </div>
              </div>

              {/* Member Details */}
              <div>
                <h4 className="text-sm font-medium mb-2">Member Details</h4>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm"><strong>Name:</strong> {selectedPayment.member}</p>
                  <p className="text-sm"><strong>Date:</strong> {new Date(selectedPayment.date).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Gateway Response */}
              <div>
                <h4 className="text-sm font-medium mb-2">Gateway Response</h4>
                <div className="bg-muted p-3 rounded-lg font-mono text-xs">
                  <p>Status: {selectedPayment.status.toUpperCase()}</p>
                  <p>Transaction ID: {selectedPayment.transactionId}</p>
                  <p>Processed at: {new Date(selectedPayment.date).toISOString()}</p>
                </div>
              </div>

              {/* Refund History */}
              <div>
                <h4 className="text-sm font-medium mb-2">Refund History</h4>
                {selectedPayment.refundHistory.length > 0 ? (
                  <div className="space-y-2">
                    {selectedPayment.refundHistory.map((refund, index) => (
                      <div key={index} className="bg-muted p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">${refund.amount.toFixed(2)}</span>
                          <Badge variant="outline">{refund.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{refund.reason}</p>
                        <p className="text-xs text-muted-foreground">{new Date(refund.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No refunds for this payment</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedPayment(null)}>
                  Close
                </Button>
                <Button>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry Payment
                </Button>
                <Button variant="destructive">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Initiate Refund
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}