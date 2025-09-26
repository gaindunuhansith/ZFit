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

interface Manager {
  _id: string
  name: string
  email: string
  phone: string
  department: string
  status: 'active' | 'inactive'
  joinDate: string
  qrCode?: string
}

export default function ManagersPage() {
  const [managers, setManagers] = useState<Manager[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchManagers()
  }, [])

  const fetchManagers = async () => {
    try {
      setLoading(true)
      // TODO: Implement API call to fetch managers
      // const response = await apiService.getManagers()
      // setManagers(response.data)

      // For now, using mock data
      const mockManagers: Manager[] = [
        {
          _id: '1',
          name: 'David Brown',
          email: 'david@zfit.com',
          phone: '+1234567896',
          department: 'Operations',
          status: 'active',
          joinDate: '2023-06-15',
        },
        {
          _id: '2',
          name: 'Emma Taylor',
          email: 'emma@zfit.com',
          phone: '+1234567897',
          department: 'Finance',
          status: 'active',
          joinDate: '2023-08-20',
        },
      ]
      setManagers(mockManagers)
    } catch (error) {
      console.error('Error fetching managers:', error)
      setError('Failed to load managers')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteManager = async (managerId: string) => {
    if (!confirm('Are you sure you want to delete this manager?')) return

    try {
      // TODO: Implement API call to delete manager
      // await apiService.deleteManager(managerId)
      setManagers(managers.filter(manager => manager._id !== managerId))
    } catch (error) {
      console.error('Error deleting manager:', error)
      setError('Failed to delete manager')
    }
  }

  const handleEditManager = (manager: Manager) => {
    // TODO: Implement edit functionality
    console.log('Edit manager:', manager)
  }

  const handleAddManager = () => {
    // TODO: Implement add manager functionality
    console.log('Add new manager')
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'inactive':
        return 'secondary'
      default:
        return 'secondary'
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
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {managers.map((manager) => (
                <TableRow key={manager._id}>
                  <TableCell className="font-medium">{manager.name}</TableCell>
                  <TableCell>{manager.email}</TableCell>
                  <TableCell>{manager.phone}</TableCell>
                  <TableCell>{manager.department}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(manager.status)}>
                      {manager.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(manager.joinDate).toLocaleDateString()}</TableCell>
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
    </div>
  )
}