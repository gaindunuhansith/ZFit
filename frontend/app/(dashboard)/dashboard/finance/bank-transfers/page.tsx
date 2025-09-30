"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Eye, Loader2, AlertCircle } from "lucide-react"
import { getPendingBankTransfers, approveBankTransfer, declineBankTransfer, type BankTransferAdmin } from "@/lib/api/paymentApi"

export default function BankTransfersPage() {
  const [transfers, setTransfers] = useState<BankTransferAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [selectedTransfer, setSelectedTransfer] = useState<BankTransferAdmin | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [actionType, setActionType] = useState<'approve' | 'decline' | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetchPendingTransfers()
  }, [])

  const fetchPendingTransfers = async () => {
    try {
      setLoading(true)
      const response = await getPendingBankTransfers()
      setTransfers(response.payments)
    } catch (error) {
      console.error('Error fetching pending transfers:', error)
      alert('Failed to load pending bank transfers')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (transfer: BankTransferAdmin, action: 'approve' | 'decline') => {
    setSelectedTransfer(transfer)
    setActionType(action)
    setAdminNotes("")
    setDialogOpen(true)
  }

  const confirmAction = async () => {
    if (!selectedTransfer || !actionType) return

    try {
      setProcessing(selectedTransfer._id)

      const actionFunction = actionType === 'approve' ? approveBankTransfer : declineBankTransfer
      const result = await actionFunction(selectedTransfer._id, { adminNotes: adminNotes.trim() || undefined })

      alert(`Success: ${result.message}`)

      // Remove the processed transfer from the list
      setTransfers(prev => prev.filter(t => t._id !== selectedTransfer._id))
      setDialogOpen(false)
      setSelectedTransfer(null)
      setActionType(null)
    } catch (error) {
      console.error(`Error ${actionType}ing transfer:`, error)
      alert(`Error: Failed to ${actionType} bank transfer`)
    } finally {
      setProcessing(null)
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: currency === 'LKR' ? 'LKR' : 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bank Transfer Management</h1>
        <p className="text-muted-foreground">
          Review and manage pending bank transfer payments from members
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Bank Transfers</CardTitle>
          <CardDescription>
            {transfers.length} pending transfer{transfers.length !== 1 ? 's' : ''} requiring approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transfers.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No pending transfers</h3>
              <p className="text-muted-foreground">
                All bank transfers have been processed
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Membership Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfers.map((transfer) => (
                  <TableRow key={transfer._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {transfer.userId?.name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transfer.userId?.email || 'No email'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transfer.membershipId?.name || 'Unknown Plan'}</div>
                        <div className="text-sm text-muted-foreground">
                          {transfer.membershipId ? formatCurrency(transfer.membershipId.price, transfer.currency) : 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {formatCurrency(transfer.amount, transfer.currency)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(transfer.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`http://localhost:5000${transfer.receiptImageUrl}`, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAction(transfer, 'approve')}
                          disabled={processing === transfer._id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {processing === transfer._id && actionType === 'approve' ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAction(transfer, 'decline')}
                          disabled={processing === transfer._id}
                        >
                          {processing === transfer._id && actionType === 'decline' ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-2" />
                          )}
                          Decline
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve' : 'Decline'} Bank Transfer
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? 'Are you sure you want to approve this bank transfer payment?'
                : 'Are you sure you want to decline this bank transfer payment?'
              }
            </DialogDescription>
          </DialogHeader>

          {selectedTransfer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Member</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedTransfer.userId?.name || 'Unknown User'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Amount</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(selectedTransfer.amount, selectedTransfer.currency)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Plan</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedTransfer.membershipId?.name || 'Unknown Plan'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Submitted</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedTransfer.createdAt)}
                  </p>
                </div>
              </div>

              {selectedTransfer.notes && (
                <div>
                  <Label className="text-sm font-medium">Member Notes</Label>
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {selectedTransfer.notes}
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="admin-notes" className="text-sm font-medium">
                  Admin Notes (Optional)
                </Label>
                <Textarea
                  id="admin-notes"
                  placeholder="Add any notes about this decision..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              disabled={processing !== null}
              variant={actionType === 'approve' ? 'default' : 'destructive'}
            >
              {processing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {actionType === 'approve' ? 'Approve' : 'Decline'} Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
