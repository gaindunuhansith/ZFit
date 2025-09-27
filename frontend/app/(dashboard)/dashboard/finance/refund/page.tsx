"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  Plus,
  Edit,
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
import { getRefunds, approveRefund, denyRefund, deleteRefund, createRefund, updateRefund, type Refund } from "@/lib/api/refundApi"
import { generateRefundsReport } from "@/lib/api/reportApi"

// Mock refund data - REMOVED
// const refunds = [...]

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
  }
  return <Badge variant={variants[status] || "outline"}>{status}</Badge>
}

export default function RefundManagementPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null)
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [processingAction, setProcessingAction] = useState<"approve" | "deny" | "partial" | null>(null)
  const [partialAmount, setPartialAmount] = useState("")
  const [processingNotes, setProcessingNotes] = useState("")
  const [refunds, setRefunds] = useState<Refund[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [createFormErrors, setCreateFormErrors] = useState<{[key: string]: string}>({})
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingRefund, setEditingRefund] = useState<Refund | null>(null)
  const [editFormErrors, setEditFormErrors] = useState<{[key: string]: string}>({})
  const [editFormData, setEditFormData] = useState({
    paymentId: '',
    userId: '',
    refundAmount: '',
    originalAmount: '',
    reason: '' as 'customer_request' | 'duplicate' | 'fraud' | 'cancelled' | 'error' | '',
    notes: '',
    status: '' as 'pending' | 'completed' | 'failed'
  })
  const [createFormData, setCreateFormData] = useState({
    paymentId: '',
    userId: '',
    refundAmount: '',
    originalAmount: '',
    reason: '' as 'customer_request' | 'duplicate' | 'fraud' | 'cancelled' | 'error' | '',
    notes: ''
  })

  // Fetch refunds on component mount
  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        setLoading(true)
        const data = await getRefunds()
        setRefunds(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch refunds:', err)
        setError('Failed to load refunds')
      } finally {
        setLoading(false)
      }
    }

    fetchRefunds()
  }, [])

  const filteredRefunds = refunds.filter(refund => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = refund.refundId?.toLowerCase().includes(searchLower) ||
                         refund.userId?.toLowerCase().includes(searchLower) ||
                         refund.notes?.toLowerCase().includes(searchLower) ||
                         refund.reason?.toLowerCase().includes(searchLower) ||
                         refund.status?.toLowerCase().includes(searchLower)
    const matchesStatus = statusFilter === "all" || refund.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleProcessRefund = (refund: Refund, action: "approve" | "deny" | "partial") => {
    setSelectedRefund(refund)
    setProcessingAction(action)
    setPartialAmount(action === "partial" ? refund.refundAmount?.toString() || "" : "")
    setProcessingNotes("")
    setIsProcessingModalOpen(true)
  }

  const handleConfirmProcessing = async () => {
    if (!selectedRefund || !processingAction) return

    try {
      if (processingAction === 'approve') {
        await approveRefund(selectedRefund._id)
      } else if (processingAction === 'deny') {
        await denyRefund(selectedRefund._id)
      }
      // Refresh refunds list
      const updatedRefunds = await getRefunds()
      setRefunds(updatedRefunds)
    } catch (error) {
      console.error('Error processing refund:', error)
      // TODO: Show error toast
    }

    setIsProcessingModalOpen(false)
    setSelectedRefund(null)
    setProcessingAction(null)
  }

  const handleUpdateRefund = (refund: Refund) => {
    setEditingRefund(refund)
    setEditFormData({
      paymentId: refund.paymentId,
      userId: refund.userId,
      refundAmount: refund.refundAmount.toString(),
      originalAmount: refund.originalAmount.toString(),
      reason: refund.reason || '',
      notes: refund.notes,
      status: refund.status
    })
    setEditFormErrors({})
    setIsEditModalOpen(true)
  }

  const handleDeleteRefund = async (refund: Refund) => {
    if (!confirm(`Are you sure you want to delete refund ${refund.refundId}?`)) return

    try {
      await deleteRefund(refund._id)
      // Refresh refunds list
      const updatedRefunds = await getRefunds()
      setRefunds(updatedRefunds)
    } catch (error) {
      console.error('Error deleting refund:', error)
      // TODO: Show error toast
    }
  }

  const validateObjectId = (id: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    if (!createFormData.paymentId.trim()) {
      errors.paymentId = 'Payment ID is required';
    } else if (!validateObjectId(createFormData.paymentId)) {
      errors.paymentId = 'Payment ID must be a valid 24-character ObjectId';
    }

    if (!createFormData.userId.trim()) {
      errors.userId = 'User ID is required';
    } else if (!validateObjectId(createFormData.userId)) {
      errors.userId = 'User ID must be a valid 24-character ObjectId';
    }

    if (!createFormData.originalAmount.trim()) {
      errors.originalAmount = 'Original amount is required';
    } else {
      const amount = parseFloat(createFormData.originalAmount);
      if (isNaN(amount) || amount <= 0) {
        errors.originalAmount = 'Original amount must be a positive number';
      }
    }

    if (!createFormData.refundAmount.trim()) {
      errors.refundAmount = 'Refund amount is required';
    } else {
      const amount = parseFloat(createFormData.refundAmount);
      if (isNaN(amount) || amount <= 0) {
        errors.refundAmount = 'Refund amount must be a positive number';
      } else if (parseFloat(createFormData.originalAmount) > 0 && amount > parseFloat(createFormData.originalAmount)) {
        errors.refundAmount = 'Refund amount cannot exceed original amount';
      }
    }

    if (!createFormData.notes.trim()) {
      errors.notes = 'Notes are required';
    }

    setCreateFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleCreateRefund = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const refundData = {
        paymentId: createFormData.paymentId,
        userId: createFormData.userId,
        refundAmount: parseFloat(createFormData.refundAmount),
        originalAmount: parseFloat(createFormData.originalAmount),
        ...(createFormData.reason && { reason: createFormData.reason }),
        notes: createFormData.notes
      }

      await createRefund(refundData)

      // Reset form and close modal
      setCreateFormData({
        paymentId: '',
        userId: '',
        refundAmount: '',
        originalAmount: '',
        reason: '' as 'customer_request' | 'duplicate' | 'fraud' | 'cancelled' | 'error' | '',
        notes: ''
      })
      setIsCreateModalOpen(false)

      // Refresh refunds list
      const updatedRefunds = await getRefunds()
      setRefunds(updatedRefunds)
    } catch (error: unknown) {
      console.error('Error creating refund:', error)
      
      // Handle API validation errors
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('400') || errorMessage.includes('Bad Request')) {
        setCreateFormErrors({ general: 'Invalid data provided. Please check all fields and try again.' });
      } else {
        setCreateFormErrors({ general: 'Failed to create refund. Please try again.' });
      }
    }
  }

  // Edit form validation
  const validateEditForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    if (!editFormData.paymentId.trim()) {
      errors.paymentId = 'Payment ID is required';
    } else if (!validateObjectId(editFormData.paymentId)) {
      errors.paymentId = 'Payment ID must be a valid 24-character ObjectId';
    }

    if (!editFormData.userId.trim()) {
      errors.userId = 'User ID is required';
    } else if (!validateObjectId(editFormData.userId)) {
      errors.userId = 'User ID must be a valid 24-character ObjectId';
    }

    if (!editFormData.originalAmount.trim()) {
      errors.originalAmount = 'Original amount is required';
    } else {
      const amount = parseFloat(editFormData.originalAmount);
      if (isNaN(amount) || amount <= 0) {
        errors.originalAmount = 'Original amount must be a positive number';
      }
    }

    if (!editFormData.refundAmount.trim()) {
      errors.refundAmount = 'Refund amount is required';
    } else {
      const amount = parseFloat(editFormData.refundAmount);
      if (isNaN(amount) || amount <= 0) {
        errors.refundAmount = 'Refund amount must be a positive number';
      } else if (parseFloat(editFormData.originalAmount) > 0 && amount > parseFloat(editFormData.originalAmount)) {
        errors.refundAmount = 'Refund amount cannot exceed original amount';
      }
    }

    if (!editFormData.notes.trim()) {
      errors.notes = 'Notes are required';
    }

    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleEditRefund = async () => {
    if (!validateEditForm() || !editingRefund) {
      return;
    }

    try {
      const refundData = {
        paymentId: editFormData.paymentId,
        userId: editFormData.userId,
        refundAmount: parseFloat(editFormData.refundAmount),
        originalAmount: parseFloat(editFormData.originalAmount),
        ...(editFormData.reason && { reason: editFormData.reason }),
        status: editFormData.status,
        notes: editFormData.notes
      }

      await updateRefund(editingRefund._id, refundData)

      // Reset form and close modal
      setEditFormData({
        paymentId: '',
        userId: '',
        refundAmount: '',
        originalAmount: '',
        reason: '' as 'customer_request' | 'duplicate' | 'fraud' | 'cancelled' | 'error' | '',
        notes: '',
        status: '' as 'pending' | 'completed' | 'failed'
      })
      setIsEditModalOpen(false)
      setEditingRefund(null)

      // Refresh refunds list
      const updatedRefunds = await getRefunds()
      setRefunds(updatedRefunds)
    } catch (error: unknown) {
      console.error('Error updating refund:', error)
      
      // Handle API validation errors
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('400') || errorMessage.includes('Bad Request')) {
        setEditFormErrors({ general: 'Invalid data provided. Please check all fields and try again.' });
      } else {
        setEditFormErrors({ general: 'Failed to update refund. Please try again.' });
      }
    }
  }

  const handleGenerateReport = async () => {
    try {
      const reportBlob = await generateRefundsReport()

      // Create a download link and trigger download
      const url = window.URL.createObjectURL(reportBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'refunds-report.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating report:', error)
      // TODO: Show error toast
    }
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
          <Button onClick={handleGenerateReport}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button variant="outline" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Refund
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by refund ID, user ID, notes, reason, or status..."
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
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading refunds...
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
                <TableHead>Refund ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Refund Amount</TableHead>
                <TableHead>Original Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRefunds.length > 0 ? (
                filteredRefunds.map((refund) => (
                  <TableRow key={refund._id}>
                    <TableCell className="font-medium">{refund.refundId}</TableCell>
                    <TableCell>{refund.userId}</TableCell>
                    <TableCell>LKR {refund.refundAmount.toFixed(2)}</TableCell>
                    <TableCell>LKR {refund.originalAmount.toFixed(2)}</TableCell>
                    <TableCell>{refund.reason}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(refund.status)}
                        {getStatusBadge(refund.status)}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(refund.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProcessRefund(refund, 'approve')}
                          disabled={refund.status !== 'pending'}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProcessRefund(refund, 'deny')}
                          disabled={refund.status !== 'pending'}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateRefund(refund)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRefund(refund)}
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
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No refund requests found. Refunds will appear here when requested.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          )}
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
                <>Processing refund request for <strong>{selectedRefund.refundId}</strong> - LKR {selectedRefund.refundAmount.toFixed(2)}</>
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
                  Original amount: LKR {selectedRefund?.originalAmount?.toFixed(2)}
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

      {/* Create Refund Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Refund Request</DialogTitle>
            <DialogDescription>
              Create a new refund request for a member.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            {createFormErrors.general && (
              <div className="col-span-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{createFormErrors.general}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="refund-payment">Payment ID *</Label>
              <Input
                id="refund-payment"
                placeholder="Enter payment ID to refund"
                value={createFormData.paymentId}
                onChange={(e) => {
                  setCreateFormData(prev => ({ ...prev, paymentId: e.target.value }));
                  if (createFormErrors.paymentId) {
                    setCreateFormErrors(prev => ({ ...prev, paymentId: '' }));
                  }
                }}
                className={createFormErrors.paymentId ? 'border-red-500' : ''}
              />
              {createFormErrors.paymentId && (
                <p className="text-sm text-red-600">{createFormErrors.paymentId}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="refund-user">User ID *</Label>
              <Input
                id="refund-user"
                placeholder="Enter user ID"
                value={createFormData.userId}
                onChange={(e) => {
                  setCreateFormData(prev => ({ ...prev, userId: e.target.value }));
                  if (createFormErrors.userId) {
                    setCreateFormErrors(prev => ({ ...prev, userId: '' }));
                  }
                }}
                className={createFormErrors.userId ? 'border-red-500' : ''}
              />
              {createFormErrors.userId && (
                <p className="text-sm text-red-600">{createFormErrors.userId}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="original-amount">Original Amount *</Label>
              <Input
                id="original-amount"
                type="number"
                step="0.01"
                placeholder="Enter original payment amount"
                value={createFormData.originalAmount}
                onChange={(e) => {
                  setCreateFormData(prev => ({ ...prev, originalAmount: e.target.value }));
                  if (createFormErrors.originalAmount) {
                    setCreateFormErrors(prev => ({ ...prev, originalAmount: '' }));
                  }
                }}
                className={createFormErrors.originalAmount ? 'border-red-500' : ''}
              />
              {createFormErrors.originalAmount && (
                <p className="text-sm text-red-600">{createFormErrors.originalAmount}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="refund-amount">Refund Amount *</Label>
              <Input
                id="refund-amount"
                type="number"
                step="0.01"
                placeholder="Enter refund amount"
                value={createFormData.refundAmount}
                onChange={(e) => {
                  setCreateFormData(prev => ({ ...prev, refundAmount: e.target.value }));
                  if (createFormErrors.refundAmount) {
                    setCreateFormErrors(prev => ({ ...prev, refundAmount: '' }));
                  }
                }}
                className={createFormErrors.refundAmount ? 'border-red-500' : ''}
              />
              {createFormErrors.refundAmount && (
                <p className="text-sm text-red-600">{createFormErrors.refundAmount}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="refund-reason">Reason (Optional)</Label>
              <Select
                value={createFormData.reason}
                onValueChange={(value: 'customer_request' | 'duplicate' | 'fraud' | 'cancelled' | 'error') => setCreateFormData(prev => ({ ...prev, reason: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select refund reason (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer_request">Customer Request</SelectItem>
                  <SelectItem value="duplicate">Duplicate Payment</SelectItem>
                  <SelectItem value="fraud">Fraud</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="refund-notes">Notes *</Label>
              <Textarea
                id="refund-notes"
                placeholder="Additional notes about the refund..."
                rows={3}
                value={createFormData.notes}
                onChange={(e) => {
                  setCreateFormData(prev => ({ ...prev, notes: e.target.value }));
                  if (createFormErrors.notes) {
                    setCreateFormErrors(prev => ({ ...prev, notes: '' }));
                  }
                }}
                className={createFormErrors.notes ? 'border-red-500' : ''}
              />
              {createFormErrors.notes && (
                <p className="text-sm text-red-600">{createFormErrors.notes}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRefund}>
              Create Refund Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Refund Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Refund Request</DialogTitle>
            <DialogDescription>
              Update refund details for {editingRefund?.refundId}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            {editFormErrors.general && (
              <div className="col-span-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{editFormErrors.general}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-payment">Payment ID *</Label>
              <Input
                id="edit-payment"
                placeholder="Enter payment ID to refund"
                value={editFormData.paymentId}
                onChange={(e) => {
                  setEditFormData(prev => ({ ...prev, paymentId: e.target.value }));
                  if (editFormErrors.paymentId) {
                    setEditFormErrors(prev => ({ ...prev, paymentId: '' }));
                  }
                }}
                className={editFormErrors.paymentId ? 'border-red-500' : ''}
              />
              {editFormErrors.paymentId && (
                <p className="text-sm text-red-600">{editFormErrors.paymentId}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-user">User ID *</Label>
              <Input
                id="edit-user"
                placeholder="Enter user ID"
                value={editFormData.userId}
                onChange={(e) => {
                  setEditFormData(prev => ({ ...prev, userId: e.target.value }));
                  if (editFormErrors.userId) {
                    setEditFormErrors(prev => ({ ...prev, userId: '' }));
                  }
                }}
                className={editFormErrors.userId ? 'border-red-500' : ''}
              />
              {editFormErrors.userId && (
                <p className="text-sm text-red-600">{editFormErrors.userId}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-original-amount">Original Amount *</Label>
              <Input
                id="edit-original-amount"
                type="number"
                step="0.01"
                placeholder="Enter original payment amount"
                value={editFormData.originalAmount}
                onChange={(e) => {
                  setEditFormData(prev => ({ ...prev, originalAmount: e.target.value }));
                  if (editFormErrors.originalAmount) {
                    setEditFormErrors(prev => ({ ...prev, originalAmount: '' }));
                  }
                }}
                className={editFormErrors.originalAmount ? 'border-red-500' : ''}
              />
              {editFormErrors.originalAmount && (
                <p className="text-sm text-red-600">{editFormErrors.originalAmount}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-refund-amount">Refund Amount *</Label>
              <Input
                id="edit-refund-amount"
                type="number"
                step="0.01"
                placeholder="Enter refund amount"
                value={editFormData.refundAmount}
                onChange={(e) => {
                  setEditFormData(prev => ({ ...prev, refundAmount: e.target.value }));
                  if (editFormErrors.refundAmount) {
                    setEditFormErrors(prev => ({ ...prev, refundAmount: '' }));
                  }
                }}
                className={editFormErrors.refundAmount ? 'border-red-500' : ''}
              />
              {editFormErrors.refundAmount && (
                <p className="text-sm text-red-600">{editFormErrors.refundAmount}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-reason">Reason (Optional)</Label>
              <Select
                value={editFormData.reason}
                onValueChange={(value: 'customer_request' | 'duplicate' | 'fraud' | 'cancelled' | 'error') => setEditFormData(prev => ({ ...prev, reason: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select refund reason (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer_request">Customer Request</SelectItem>
                  <SelectItem value="duplicate">Duplicate Payment</SelectItem>
                  <SelectItem value="fraud">Fraud</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status *</Label>
              <Select
                value={editFormData.status}
                onValueChange={(value: 'pending' | 'completed' | 'failed') => setEditFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-notes">Notes *</Label>
              <Textarea
                id="edit-notes"
                placeholder="Additional notes about the refund..."
                rows={3}
                value={editFormData.notes}
                onChange={(e) => {
                  setEditFormData(prev => ({ ...prev, notes: e.target.value }));
                  if (editFormErrors.notes) {
                    setEditFormErrors(prev => ({ ...prev, notes: '' }));
                  }
                }}
                className={editFormErrors.notes ? 'border-red-500' : ''}
              />
              {editFormErrors.notes && (
                <p className="text-sm text-red-600">{editFormErrors.notes}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRefund}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}