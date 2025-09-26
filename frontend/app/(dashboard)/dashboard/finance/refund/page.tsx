"use client"

import { useState } from "react"
import {
  RefreshCw,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  Eye,
  Mail,
  DollarSign,
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Mock refund data - REMOVED
// const refunds = [...]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "denied":
      return <XCircle className="h-4 w-4 text-red-600" />
    case "processed":
      return <RefreshCw className="h-4 w-4 text-blue-600" />
    default:
      return <AlertCircle className="h-4 w-4 text-gray-600" />
  }
}

const getStatusBadge = (status: string) => {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    approved: "default",
    pending: "secondary",
    denied: "destructive",
    processed: "outline",
  }
  return <Badge variant={variants[status] || "outline"}>{status}</Badge>
}

export default function RefundManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRefund, setSelectedRefund] = useState<any>(null)
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false)
  const [processingAction, setProcessingAction] = useState<"approve" | "deny" | "partial" | null>(null)
  const [partialAmount, setPartialAmount] = useState("")
  const [processingNotes, setProcessingNotes] = useState("")

  // Mock data removed - will be replaced with API data
  const refunds: any[] = []

  const filteredRefunds = refunds.filter(refund => {
    const matchesSearch = refund.member?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         refund.id?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || refund.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleProcessRefund = (refund: any, action: "approve" | "deny" | "partial") => {
    setSelectedRefund(refund)
    setProcessingAction(action)
    setPartialAmount(action === "partial" ? refund.amount?.toString() || "" : "")
    setProcessingNotes("")
    setIsProcessingModalOpen(true)
  }

  const handleConfirmProcessing = () => {
    // Here you would make API call to process the refund
    console.log("Processing refund:", {
      refund: selectedRefund,
      action: processingAction,
      partialAmount: processingAction === "partial" ? partialAmount : null,
      notes: processingNotes,
    })

    setIsProcessingModalOpen(false)
    setSelectedRefund(null)
    setProcessingAction(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Refund Management</h2>
          <p className="text-muted-foreground">
            Process and track refund requests from your members.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            Process Refund
          </Button>
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Notify Members
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search refunds..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="processed">Processed</SelectItem>
            <SelectItem value="denied">Denied</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Refund Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{refunds.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{refunds.filter(r => r.status === 'pending').length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed</CardTitle>
            <RefreshCw className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{refunds.filter(r => r.status === 'processed').length}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${refunds.reduce((sum, r) => sum + (r.amount || 0), 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Refunded this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Refund Queue Table */}
      <Card>
        <CardHeader>
          <CardTitle>Refund Requests Queue</CardTitle>
          <CardDescription>
            {filteredRefunds.length} refund{filteredRefunds.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRefunds.length > 0 ? (
                filteredRefunds.map((refund) => (
                  <TableRow key={refund.id}>
                    <TableCell className="font-medium">{refund.member}</TableCell>
                    <TableCell>${refund.amount?.toFixed(2)}</TableCell>
                    <TableCell>{refund.reason}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(refund.status)}
                        {getStatusBadge(refund.status)}
                      </div>
                    </TableCell>
                    <TableCell>{refund.requestedDate ? new Date(refund.requestedDate).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setSelectedRefund(refund)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {refund.status === 'pending' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleProcessRefund(refund, 'approve')}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve Refund
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleProcessRefund(refund, 'partial')}>
                                <DollarSign className="mr-2 h-4 w-4" />
                                Partial Refund
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleProcessRefund(refund, 'deny')}>
                                <XCircle className="mr-2 h-4 w-4" />
                                Deny Refund
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Notify Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No refund requests found. Refunds will appear here when requested.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Refund Processing Modal */}
      <Dialog open={isProcessingModalOpen} onOpenChange={setIsProcessingModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {processingAction === 'approve' && 'Approve Refund'}
              {processingAction === 'deny' && 'Deny Refund'}
              {processingAction === 'partial' && 'Process Partial Refund'}
            </DialogTitle>
            <DialogDescription>
              {selectedRefund && (
                <>Processing refund request for <strong>{selectedRefund.member}</strong> - ${selectedRefund.amount?.toFixed(2)}</>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {processingAction === 'partial' && (
              <div className="space-y-2">
                <Label htmlFor="partial-amount">Refund Amount</Label>
                <Input
                  id="partial-amount"
                  type="number"
                  step="0.01"
                  placeholder="Enter partial refund amount"
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Original amount: ${selectedRefund?.amount?.toFixed(2)}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="processing-notes">Processing Notes</Label>
              <Textarea
                id="processing-notes"
                placeholder="Add notes about this refund decision..."
                value={processingNotes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProcessingNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsProcessingModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmProcessing}>
                {processingAction === 'approve' && 'Approve Refund'}
                {processingAction === 'deny' && 'Deny Refund'}
                {processingAction === 'partial' && 'Process Partial Refund'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}