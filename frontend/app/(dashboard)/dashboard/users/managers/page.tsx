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
import { Input } from '@/components/ui/input'
import { Plus, Edit, Trash2, Shield, Download, Search } from 'lucide-react'
import { apiService } from '@/lib/api/userApi'
import type { MemberData } from '@/lib/api/userApi'
import { UserFormModal, UserFormData, UpdateUserFormData } from '@/components/UserFormModal'

interface Manager {
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

export default function ManagersPage() {
  const [managers, setManagers] = useState<Manager[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingManager, setEditingManager] = useState<Manager | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredManagers = managers.filter(manager =>
    manager.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    manager.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    fetchManagers()
  }, [])

  const fetchManagers = async () => {
    try {
      setLoading(true)
      const response = await apiService.getManagers()
      setManagers(response.data as Manager[])
    } catch (error) {
      console.error('Error fetching managers:', error)
      setError('Failed to load managers')
    } finally {
      setLoading(false)
    }
  }

  const handleAddManager = () => {
    setEditingManager(null)
    setModalOpen(true)
  }

  const handleEditManager = (manager: Manager) => {
    setEditingManager(manager)
    setModalOpen(true)
  }

  const handleDeleteManager = async (managerId: string) => {
    if (!confirm('Are you sure you want to delete this manager?')) return

    try {
      await apiService.deleteUser(managerId)
      setManagers(managers.filter(manager => manager._id !== managerId))
    } catch (error) {
      console.error('Error deleting manager:', error)
      setError('Failed to delete manager')
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

  const handleDownloadReport = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/managers/pdf`, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error('Failed to download report')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'managers-report.pdf'
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
      if (editingManager) {
        // Update existing manager - send only the fields that were provided
        const updateData: Partial<MemberData> = {}
        if (formData.name) updateData.name = formData.name
        if (formData.email) updateData.email = formData.email
        if (formData.contactNo) updateData.contactNo = formData.contactNo
        if (formData.role) updateData.role = formData.role
        if (formData.status) updateData.status = formData.status

        await apiService.updateUser(editingManager._id, updateData)
      } else {
        // Create new manager - ensure all required fields are present
        const createData: MemberData = {
          name: formData.name as string,
          email: formData.email as string,
          contactNo: formData.contactNo as string,
          password: (formData as UserFormData).password,
          role: 'manager',
          status: formData.status as 'active' | 'inactive' | 'expired',
          consent: {
            gdpr: true,
            marketing: false,
          }
        }
        await apiService.createUser(createData)
      }
      fetchManagers() // Refresh the list
    } catch (error) {
      console.error('Error saving manager:', error)
      setError('Failed to save manager')
      throw error
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Managers</h2>
            <p className="text-muted-foreground">Manage gym managers</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading managers...</p>
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
          <h2 className="text-3xl font-bold tracking-tight">Managers</h2>
          <p className="text-muted-foreground">Manage gym managers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleDownloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button onClick={handleAddManager}>
            <Plus className="h-4 w-4 mr-2" />
            Add Manager
          </Button>
        </div>
      </div>

      {/* Managers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            All Managers
          </CardTitle>
          <CardDescription>
            View and manage all gym managers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mb-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search managers by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

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
              {filteredManagers.map((manager) => (
                <TableRow key={manager._id}>
                  <TableCell className="font-medium">{manager.name}</TableCell>
                  <TableCell>{manager.email}</TableCell>
                  <TableCell>{manager.contactNo}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(manager.status)}>
                      {manager.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(manager.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditManager(manager)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteManager(manager._id)}
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

          {filteredManagers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{searchQuery ? 'No managers found matching your search' : 'No managers found'}</p>
              <p className="text-sm">{searchQuery ? 'Try adjusting your search terms' : 'Add your first manager to get started'}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <UserFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingManager ? {
          name: editingManager.name,
          email: editingManager.email,
          contactNo: editingManager.contactNo,
          role: 'manager' as 'member' | 'staff' | 'manager',
          status: editingManager.status as 'active' | 'inactive' | 'expired'
        } : undefined}
        mode={editingManager ? 'edit' : 'add'}
        title={editingManager ? 'Edit Manager' : 'Add New Manager'}
      />
    </div>
  )
}