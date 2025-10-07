"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Calendar,
  Download,
  Filter,
  Search,
  ArrowLeft,
  User,
  Mail,
  Phone,
  CreditCard,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye
} from "lucide-react"
import { getPaymentsByUserId, getUserById } from "@/lib/api/paymentApi"
import { Payment, User as UserType } from "@/lib/api/paymentApi"

export default function PaymentHistoryPage() {
  const router = useRouter()
  // Get userId from sessionStorage instead of URL params
  const userId = typeof window !== 'undefined' ? sessionStorage.getItem('paymentHistoryUserId') : null

  const [user, setUser] = useState<UserType | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Detail modal states
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        console.error('No userId found in sessionStorage')
        router.push('/dashboard/finance/overview')
        return
      }

      try {
        setLoading(true)
        console.log("Fetching data for userId:", userId)

        // Fetch user details and payment history
        const [userResponse, paymentsResponse] = await Promise.all([
          getUserById(userId),
          getPaymentsByUserId(userId)
        ])

        setUser(userResponse.data || null)
        setPayments(paymentsResponse.data || [])
        setFilteredPayments(paymentsResponse.data || [])
      } catch (error) {
        console.error("Error fetching payment history:", error)
        setPayments([])
        setFilteredPayments([])
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchData()
    } else {
      // If no userId in sessionStorage, redirect back
      router.push('/dashboard/finance/overview')
    }
  }, [userId, router])

  useEffect(() => {
    let filtered = [...payments]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.method?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.type?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(payment => payment.status === statusFilter)
    }

    // Apply method filter
    if (methodFilter !== "all") {
      filtered = filtered.filter(payment => payment.method === methodFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "date":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case "amount":
          comparison = a.amount - b.amount
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        case "method":
          comparison = (a.method || "").localeCompare(b.method || "")
          break
        default:
          comparison = 0
      }

      return sortOrder === "desc" ? -comparison : comparison
    })

    setFilteredPayments(filtered)
  }, [payments, searchTerm, statusFilter, methodFilter, sortBy, sortOrder])

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "membership":
        return <User className="h-4 w-4 text-blue-500" />
      case "booking":
        return <Calendar className="h-4 w-4 text-green-500" />
      case "inventory":
      case "other":
        return <DollarSign className="h-4 w-4 text-purple-500" />
      default:
        return <CreditCard className="h-4 w-4 text-gray-500" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleExportData = () => {
    const csvContent = [
      ['Date', 'Transaction ID', 'User ID', 'Amount', 'Currency', 'Type', 'Status', 'Method'],
      ...filteredPayments.map(payment => [
        formatDate(payment.createdAt),
        payment.transactionId || 'N/A',
        // Extract user name properly from populated user object
        typeof payment.userId === 'object' && payment.userId !== null 
          ? (payment.userId as any).name || 'N/A'
          : payment.userId || 'N/A',
        payment.amount.toString(),
        payment.currency || 'LKR',
        payment.type === 'other' ? 'inventory' : (payment.type || 'N/A'),
        payment.status,
        payment.method || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payment-history-${user?.name || 'user'}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment)
    setShowDetailModal(true)
  }

  // Payment Details Modal Component
  const PaymentDetailsModal = () => {
    if (!selectedPayment) return null

    return (
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Payment Details</span>
            </DialogTitle>
            <DialogDescription>
              Complete information for transaction {selectedPayment.transactionId}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Transaction Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
                <p className="text-sm font-mono bg-muted p-2 rounded">{selectedPayment.transactionId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Amount</label>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(selectedPayment.amount)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusIcon(selectedPayment.status)}
                  <Badge variant={getStatusBadgeVariant(selectedPayment.status)}>
                    {selectedPayment.status}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                <p className="text-sm capitalize">{selectedPayment.method}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <div className="flex items-center space-x-2 mt-1">
                  {getTypeIcon(selectedPayment.type)}
                  <span className="text-sm capitalize">{selectedPayment.type === 'other' ? 'inventory' : selectedPayment.type}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date</label>
                <p className="text-sm">{formatDate(selectedPayment.createdAt)}</p>
              </div>
            </div>

            {/* Additional Information */}
            {selectedPayment.gatewayTransactionId && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Gateway Transaction ID</label>
                <p className="text-sm font-mono bg-muted p-2 rounded">{selectedPayment.gatewayTransactionId}</p>
              </div>
            )}

            {selectedPayment.failureReason && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Failure Reason</label>
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{selectedPayment.failureReason}</p>
              </div>
            )}

            {selectedPayment.refundedAmount > 0 && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Refunded Amount</label>
                  <p className="text-sm font-bold text-red-600">{formatCurrency(selectedPayment.refundedAmount)}</p>
                </div>
                {selectedPayment.refundReason && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Refund Reason</label>
                    <p className="text-sm">{selectedPayment.refundReason}</p>
                  </div>
                )}
              </div>
            )}

            {/* Development Note */}
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-1">Development Note</p>
                  <p className="text-sm text-blue-700">
                    Membership and inventory item details will be added when the store is complete.
                    This will include detailed information about purchased memberships, specific inventory items,
                    quantities, and related product information.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg">Loading payment history...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Payment History</h1>
            <p className="text-muted-foreground">
              Complete payment history for {user?.name || 'User'}
            </p>
          </div>
        </div>
        <Button onClick={handleExportData} className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-')
              setSortBy(field)
              setSortOrder(order as "asc" | "desc")
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Date (Newest)</SelectItem>
                <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
                <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
                <SelectItem value="status-asc">Status (A-Z)</SelectItem>
                <SelectItem value="method-asc">Method (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payment History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History ({filteredPayments.length} transactions)</CardTitle>
          <CardDescription>
            Complete transaction history with detailed information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px] w-full">
            <div className="p-6">
              {filteredPayments.length > 0 ? (
                <div className="space-y-3">
                  {filteredPayments.map((payment) => (
                    <div
                      key={payment._id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                          {/* Date and Transaction ID */}
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-sm">{formatDate(payment.createdAt)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground font-mono">
                              {payment.transactionId || 'No Transaction ID'}
                            </p>
                          </div>

                          {/* Type and Method */}
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(payment.type)}
                              <span className="font-medium text-sm capitalize">
                                {payment.type === 'other' ? 'inventory' : payment.type}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground capitalize">
                              {payment.method || 'Unknown Method'}
                            </p>
                          </div>

                          {/* Amount */}
                          <div className="space-y-1">
                            <div className="font-bold text-lg text-green-600">
                              {formatCurrency(payment.amount)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {payment.currency || 'USD'}
                            </p>
                          </div>

                          {/* Status */}
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(payment.status)}
                              <Badge variant={getStatusBadgeVariant(payment.status)}>
                                {payment.status}
                              </Badge>
                            </div>
                            {payment.refundedAmount > 0 && (
                              <p className="text-xs text-red-600">
                                Refunded: {formatCurrency(payment.refundedAmount)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(payment)}
                            className="flex items-center space-x-2"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View Details</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Payment History</h3>
                  <p className="text-muted-foreground">
                    No payments found for the selected filters.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Payment Details Modal */}
      <PaymentDetailsModal />
    </div>
  )
}