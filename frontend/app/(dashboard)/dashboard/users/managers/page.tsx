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
import { Plus, Edit, Trash2, Shield } from 'lucide-react'
import { apiService } from '@/lib/api'
import { UserFormModal } from '@/components/UserFormModal'
import { UserFormData } from '@/lib/validations/user'

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

  const handleModalSubmit = async (formData: UserFormData) => {
    try {
      if (editingManager) {
        // Update existing manager
        await apiService.updateUser(editingManager._id, formData)
      } else {
        // Create new manager
        await apiService.createUser({ ...formData, role: 'manager' })
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
        <Button onClick={handleAddManager}>
          <Plus className="h-4 w-4 mr-2" />
          Add Manager
        </Button>
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
              {managers.map((manager) => (
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

          {managers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No managers found</p>
              <p className="text-sm">Add your first manager to get started</p>
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