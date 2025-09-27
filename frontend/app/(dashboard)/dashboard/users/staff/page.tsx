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
import { Plus, Edit, Trash2, UserCheck } from 'lucide-react'
import { apiService } from '@/lib/api/userApi'
import type { MemberData } from '@/lib/api/userApi'
import { UserFormModal, UserFormData, UpdateUserFormData } from '@/components/UserFormModal'

interface Staff {
  _id: string
  name: string
  email: string
  contactNo: string
  status: 'active' | 'inactive' | 'expired'
  createdAt: string
  qrCode?: string
  profile?: {
    emergencyContact?: string
    medicalConditions?: string
  }
  consent?: {
    termsAccepted: boolean
    marketingEmails: boolean
  }
}

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const response = await apiService.getStaff()
      setStaff(response.data as Staff[])
    } catch (error) {
      console.error('Error fetching staff:', error)
      setError('Failed to load staff')
    } finally {
      setLoading(false)
    }
  }

  const handleAddStaff = () => {
    setEditingStaff(null)
    setModalOpen(true)
  }

  const handleEditStaff = (staffMember: Staff) => {
    setEditingStaff(staffMember)
    setModalOpen(true)
  }

  const handleDeleteStaff = async (staffId: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return

    try {
      await apiService.deleteUser(staffId)
      setStaff(staff.filter(member => member._id !== staffId))
    } catch (error) {
      console.error('Error deleting staff:', error)
      setError('Failed to delete staff member')
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'inactive':
        return 'secondary'
      case 'expired':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const handleModalSubmit = async (formData: UserFormData | UpdateUserFormData) => {
    try {
      if (editingStaff) {
        // Update existing staff - send only the fields that were provided
        const updateData: Partial<MemberData> = {}
        if (formData.name) updateData.name = formData.name
        if (formData.email) updateData.email = formData.email
        if (formData.contactNo) updateData.contactNo = formData.contactNo
        if (formData.role) updateData.role = formData.role
        if (formData.status) updateData.status = formData.status

        await apiService.updateUser(editingStaff._id, updateData)
      } else {
        // Create new staff - ensure all required fields are present
        const createData: MemberData = {
          name: formData.name as string,
          email: formData.email as string,
          contactNo: formData.contactNo as string,
          password: (formData as UserFormData).password,
          role: 'staff',
          status: formData.status as 'active' | 'inactive' | 'expired',
          consent: {
            gdpr: true,
            marketing: false,
          }
        }
        console.log('Form data received:', formData)
        console.log('Form data has password:', 'password' in formData)
        if ('password' in formData) {
          console.log('Password value:', formData.password)
          console.log('Password type:', typeof formData.password)
          console.log('Password length:', formData.password.length)
        }
        await apiService.createUser(createData)
      }
      fetchStaff() // Refresh the list
    } catch (error) {
      console.error('Error saving staff:', error)
      setError('Failed to save staff member')
      throw error
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Staff</h2>
            <p className="text-muted-foreground">Manage gym staff</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading staff...</p>
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
          <h2 className="text-3xl font-bold tracking-tight">Staff</h2>
          <p className="text-muted-foreground">Manage gym staff members</p>
        </div>
        <Button onClick={handleAddStaff}>
          <Plus className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </div>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            All Staff
          </CardTitle>
          <CardDescription>
            View and manage all gym staff members
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
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((staffMember) => (
                <TableRow key={staffMember._id}>
                  <TableCell className="font-medium">{staffMember.name}</TableCell>
                  <TableCell>{staffMember.email}</TableCell>
                  <TableCell>{staffMember.contactNo}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(staffMember.status)}>
                      {staffMember.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(staffMember.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditStaff(staffMember)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteStaff(staffMember._id)}
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

          {staff.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No staff found</p>
              <p className="text-sm">Add your first staff member to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      <UserFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingStaff ? {
          name: editingStaff.name,
          email: editingStaff.email,
          contactNo: editingStaff.contactNo,
          role: 'staff' as 'member' | 'staff' | 'manager',
          status: editingStaff.status as 'active' | 'inactive' | 'expired'
        } : undefined}
        mode={editingStaff ? 'edit' : 'add'}
        title={editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
      />
    </div>
  )
}