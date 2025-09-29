"use client"

import { useState, useEffect } from "react"
import {
  RefreshCw,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { getRefundRequests, approveRefundRequest, declineRefundRequest, deleteRefundRequest, getPendingRequestsCount, type RefundRequest } from "@/lib/api/refundRequestApi"

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "declined":
      return <XCircle className="h-4 w-4 text-red-600" />
    default:
      return <AlertCircle className="h-4 w-4 text-gray-600" />
  }
}

const getStatusBadge = (status: string) => {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    approved: "default",
    pending: "secondary",
    declined: "destructive",
  }
  return <Badge variant={variants[status] || "outline"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
}

export default function RefundRequestsManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [requests, setRequests] = useState<RefundRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false)
  const [processingAction, setProcessingAction] = useState<"approve" | "decline" | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [pendingCount, setPendingCount] = useState(0)

  // Fetch requests on component mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true)
        const [requestsData, countData] = await Promise.all([
          getRefundRequests(),
          getPendingRequestsCount()
        ])
        setRequests(requestsData)
        setPendingCount(countData)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch refund requests:', err)
        setError('Failed to load refund requests')
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const filteredRequests = requests.filter(request => {
    const searchLower = searchTerm.toLowerCase()
    const userName = typeof request.userId === 'object' ? request.userId?.name : ''
    const userEmail = typeof request.userId === 'object' ? request.userId?.email : ''

    const matchesSearch = request.requestId?.toLowerCase().includes(searchLower) ||
                         userName?.toLowerCase().includes(searchLower) ||
                         userEmail?.toLowerCase().includes(searchLower) ||
                         request.notes?.toLowerCase().includes(searchLower) ||
                         request.status?.toLowerCase().includes(searchLower)
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (request: RefundRequest) => {
    setSelectedRequest(request)
    setIsViewModalOpen(true)
  }

  const handleProcessRequest = (request: RefundRequest, action: "approve" | "decline") => {
    setSelectedRequest(request)
    setProcessingAction(action)
    setAdminNotes("")
    setIsProcessingModalOpen(true)
  }

  const handleConfirmProcessing = async () => {
    if (!selectedRequest || !processingAction) return

    try {
      if (processingAction === 'approve') {
        await approveRefundRequest(selectedRequest._id, adminNotes || undefined)
      } else if (processingAction === 'decline') {
        await declineRefundRequest(selectedRequest._id, adminNotes || undefined)
      }

      // Refresh requests list and count
      const [updatedRequests, newCount] = await Promise.all([
        getRefundRequests(),
        getPendingRequestsCount()
      ])
      setRequests(updatedRequests)
      setPendingCount(newCount)
    } catch (error) {
      console.error('Error processing refund request:', error)
      // TODO: Show error toast
    }

    setIsProcessingModalOpen(false)
    setSelectedRequest(null)
    setProcessingAction(null)
    setAdminNotes("")
  }

  const handleDeleteRequest = async (request: RefundRequest) => {
    if (!confirm(`Are you sure you want to delete refund request ${request.requestId}?`)) return

    try {
      await deleteRefundRequest(request._id)
      // Refresh requests list and count
      const [updatedRequests, newCount] = await Promise.all([
        getRefundRequests(),
        getPendingRequestsCount()
      ])
      setRequests(updatedRequests)
      setPendingCount(newCount)
    } catch (error) {
      console.error('Error deleting refund request:', error)
      // TODO: Show error toast
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Refund Requests</h2>
          <p className="text-muted-foreground">
            Review and process refund requests from members.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by request ID, user name, email, notes..."
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
            <SelectItem value="declined">Declined</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Refund Requests Queue</CardTitle>
          <CardDescription>
            {filteredRequests.length} refund request{filteredRequests.length !== 1 ? 's' : ''} found
            {pendingCount > 0 && (
              <span className="ml-2 text-sm text-orange-600">
                ({pendingCount} pending)
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading refund requests...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-red-600">
              <AlertCircle className="h-6 w-6 mr-2" />
              {error}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell className="font-medium">{request.requestId}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {typeof request.userId === 'object' ? request.userId?.name : 'Unknown User'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {typeof request.userId === 'object' ? request.userId?.email : request.userId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>LKR {request.requestedAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(request.status)}
                          {getStatusBadge(request.status)}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(request)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {request.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleProcessRequest(request, 'approve')}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleProcessRequest(request, 'decline')}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRequest(request)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No refund requests found. Requests will appear here when submitted.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Refund Request Details</DialogTitle>
            <DialogDescription>
              {selectedRequest && `Request ID: ${selectedRequest.requestId}`}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">User Information</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p className="font-medium">
                      {typeof selectedRequest.userId === 'object' ? selectedRequest.userId?.name : 'Unknown User'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {typeof selectedRequest.userId === 'object' ? selectedRequest.userId?.email : selectedRequest.userId}
                    </p>
                    {typeof selectedRequest.userId === 'object' && selectedRequest.userId?.contactNo && (
                      <p className="text-sm text-gray-600">{selectedRequest.userId.contactNo}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Payment Information</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p className="font-medium">LKR {selectedRequest.requestedAmount.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">
                      Status: {getStatusBadge(selectedRequest.status)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Request Notes</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm">{selectedRequest.notes}</p>
                </div>
              </div>

              {selectedRequest.adminNotes && (
                <div>
                  <Label className="text-sm font-medium">Admin Notes</Label>
                  <div className="mt-1 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm">{selectedRequest.adminNotes}</p>
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-500">
                Created: {new Date(selectedRequest.createdAt).toLocaleString()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Processing Modal */}
      <Dialog open={isProcessingModalOpen} onOpenChange={setIsProcessingModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {processingAction === 'approve' && 'Approve Refund Request'}
              {processingAction === 'decline' && 'Decline Refund Request'}
            </DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <>Processing refund request <strong>{selectedRequest.requestId}</strong> - LKR {selectedRequest.requestedAmount.toFixed(2)}</>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-notes">Admin Notes (Optional)</Label>
              <Textarea
                id="admin-notes"
                placeholder="Add any notes for this decision..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsProcessingModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={handleConfirmProcessing}
                className={processingAction === 'approve' ? 'text-green-600 hover:text-green-700 border-green-600 hover:border-green-700' : 'text-red-600 hover:text-red-700 border-red-600 hover:border-red-700'}
              >
                {processingAction === 'approve' && 'Approve Request'}
                {processingAction === 'decline' && 'Decline Request'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}