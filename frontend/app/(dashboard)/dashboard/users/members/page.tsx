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
import { Plus, Edit, Trash2, User, Download } from 'lucide-react'
import { apiService } from '@/lib/api/userApi'
import type { MemberData } from '@/lib/api/userApi'
import { UserFormModal, UserFormData, UpdateUserFormData } from '@/components/UserFormModal'

interface Member {
  _id: string
  name: string
  email: string
  contactNo: string
  role: string
  status: string
  qrCode?: string
  createdAt: string
  updatedAt: string
  profile?: {
    address?: string
    emergencyContact?: string
  }
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const response = await apiService.getMembers()
      setMembers(response.data as Member[])
    } catch (error) {
      console.error('Error fetching members:', error)
      setError('Failed to load members')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return

    try {
      await apiService.deleteUser(memberId)
      setMembers(members.filter(member => member._id !== memberId))
    } catch (error) {
      console.error('Error deleting member:', error)
      setError('Failed to delete member')
    }
  }

  const handleEditMember = (member: Member) => {
    setEditingMember(member)
    setModalOpen(true)
  }

  const handleAddMember = () => {
    setEditingMember(null)
    setModalOpen(true)
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

  const handleDownloadReport = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/members/pdf`, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error('Failed to download report')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'members-report.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading report:', error)
      setError('Failed to download report')
    }
  }

  const handleModalSubmit = async (formData: UserFormData | UpdateUserFormData) => {
    try {
      if (editingMember) {
        // Update existing member - send only the fields that were provided
        const updateData: Partial<MemberData> = {}
        if (formData.name) updateData.name = formData.name
        if (formData.email) updateData.email = formData.email
        if (formData.contactNo) updateData.contactNo = formData.contactNo
        if (formData.role) updateData.role = formData.role
        if (formData.status) updateData.status = formData.status

        await apiService.updateUser(editingMember._id, updateData)
      } else {
        // Create new member - ensure all required fields are present
        const createData: MemberData = {
          name: formData.name as string,
          email: formData.email as string,
          contactNo: formData.contactNo as string,
          password: (formData as UserFormData).password,
          role: 'member',
          status: formData.status as 'active' | 'inactive' | 'expired',
          consent: {
            gdpr: true,
            marketing: false,
          }
        }
        await apiService.createUser(createData)
      }
      fetchMembers() // Refresh the list
    } catch (error) {
      console.error('Error saving member:', error)
      setError('Failed to save member')
      throw error
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Members</h2>
            <p className="text-muted-foreground">Manage gym members</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading members...</p>
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
          <h2 className="text-3xl font-bold tracking-tight">Members</h2>
          <p className="text-muted-foreground">Manage gym members</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleDownloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button onClick={handleAddMember}>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            All Members
          </CardTitle>
          <CardDescription>
            View and manage all gym members
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
              {members.map((member) => (
                <TableRow key={member._id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.contactNo}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(member.status)}>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(member.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditMember(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteMember(member._id)}
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

          {members.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No members found</p>
              <p className="text-sm">Add your first member to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      <UserFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingMember ? {
          name: editingMember.name,
          email: editingMember.email,
          contactNo: editingMember.contactNo,
          role: editingMember.role as 'member' | 'staff' | 'manager',
          status: editingMember.status as 'active' | 'inactive' | 'expired'
        } : undefined}
        mode={editingMember ? 'edit' : 'add'}
        title={editingMember ? 'Edit Member' : 'Add New Member'}
      />
    </div>
  )
}