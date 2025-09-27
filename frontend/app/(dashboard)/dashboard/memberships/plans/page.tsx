"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, CreditCard } from 'lucide-react'
import { membershipPlanApi } from '@/lib/api/membershipPlanApi'
import type { MembershipPlan } from '@/lib/api/membershipPlanApi'
import { MembershipPlanFormModal, MembershipPlanFormData, UpdateMembershipPlanFormData } from '@/components/MembershipPlanFormModal'

export default function MembershipPlansPage() {
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null)

  useEffect(() => {
    fetchMembershipPlans()
  }, [])

  const fetchMembershipPlans = async () => {
    try {
      setLoading(true)
      const response = await membershipPlanApi.getAllMembershipPlans()
      setMembershipPlans(response.data)
    } catch (error) {
      console.error('Error fetching membership plans:', error)
      setError('Failed to load membership plans')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMembershipPlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this membership plan?')) return

    try {
      await membershipPlanApi.deleteMembershipPlan(planId)
      setMembershipPlans(membershipPlans.filter(plan => plan._id !== planId))
    } catch (error) {
      console.error('Error deleting membership plan:', error)
      setError('Failed to delete membership plan')
    }
  }

  const handleEditMembershipPlan = (plan: MembershipPlan) => {
    setEditingPlan(plan)
    setModalOpen(true)
  }

  const handleAddMembershipPlan = () => {
    setEditingPlan(null)
    setModalOpen(true)
  }

  const getCategoryBadgeVariant = (category: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      weights: 'default',
      crossfit: 'secondary',
      yoga: 'outline',
      mma: 'destructive',
      other: 'secondary',
    }
    return variants[category] || 'secondary'
  }

  const formatPrice = (price: number, currency: string) => {
    return `${currency} ${price.toLocaleString()}`
  }

  const formatDuration = (days: number) => {
    if (days === 30) return '1 Month'
    if (days === 90) return '3 Months'
    if (days === 180) return '6 Months'
    if (days === 365) return '1 Year'
    return `${days} Days`
  }

  const handleModalSubmit = async (formData: MembershipPlanFormData | UpdateMembershipPlanFormData) => {
    try {
      if (editingPlan) {
        // Update existing plan - send only the fields that were provided
        const updateData: UpdateMembershipPlanFormData = {}
        if (formData.name) updateData.name = formData.name
        if (formData.description !== undefined) updateData.description = formData.description
        if (formData.price) updateData.price = formData.price
        if (formData.currency) updateData.currency = formData.currency as 'LKR' | 'USD'
        if (formData.durationInDays) updateData.durationInDays = formData.durationInDays
        if (formData.category) updateData.category = formData.category as 'weights' | 'crossfit' | 'yoga' | 'mma' | 'other'

        await membershipPlanApi.updateMembershipPlan(editingPlan._id, updateData)
      } else {
        // Create new plan - ensure all required fields are present
        const createData: MembershipPlanFormData = {
          name: formData.name as string,
          description: formData.description,
          price: formData.price as number,
          currency: formData.currency as 'LKR' | 'USD',
          durationInDays: formData.durationInDays as number,
          category: formData.category as 'weights' | 'crossfit' | 'yoga' | 'mma' | 'other',
        }
        await membershipPlanApi.createMembershipPlan(createData)
      }
      fetchMembershipPlans() // Refresh the list
    } catch (error) {
      console.error('Error saving membership plan:', error)
      setError('Failed to save membership plan')
      throw error
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Membership Plans</h2>
            <p className="text-muted-foreground">Manage gym membership plans</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading membership plans...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Membership Plans</h2>
          <p className="text-muted-foreground">Manage gym membership plans</p>
        </div>
        <Button onClick={handleAddMembershipPlan}>
          <Plus className="h-4 w-4 mr-2" />
          Add Plan
        </Button>
      </div>

      {/* Membership Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            All Membership Plans
          </CardTitle>
          <CardDescription>
            View and manage all gym membership plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mb-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {membershipPlans.map((plan) => (
                <TableRow key={plan._id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {plan.description || 'No description'}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatPrice(plan.price, plan.currency)}
                  </TableCell>
                  <TableCell>{formatDuration(plan.durationInDays)}</TableCell>
                  <TableCell>
                    <Badge variant={getCategoryBadgeVariant(plan.category)} className="capitalize">
                      {plan.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(plan.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditMembershipPlan(plan)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteMembershipPlan(plan._id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {membershipPlans.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No membership plans found</p>
              <p className="text-sm">Add your first membership plan to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      <MembershipPlanFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingPlan ? {
          name: editingPlan.name,
          description: editingPlan.description,
          price: editingPlan.price,
          currency: editingPlan.currency as 'LKR' | 'USD',
          durationInDays: editingPlan.durationInDays,
          category: editingPlan.category as 'weights' | 'crossfit' | 'yoga' | 'mma' | 'other',
        } : undefined}
        mode={editingPlan ? 'edit' : 'add'}
        title={editingPlan ? 'Edit Membership Plan' : 'Add New Membership Plan'}
      />
    </div>
  )
}