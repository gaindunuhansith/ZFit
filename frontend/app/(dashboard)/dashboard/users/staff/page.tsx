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
import { apiService } from '@/lib/api'

interface Staff {
  _id: string
  name: string
  email: string
  phone: string
  role: string
  status: 'active' | 'inactive'
  joinDate: string
  qrCode?: string
}

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      setLoading(true)
      // TODO: Implement API call to fetch staff
      // const response = await apiService.getStaff()
      // setStaff(response.data)

      // For now, using mock data
      const mockStaff: Staff[] = [
        {
          _id: '1',
          name: 'Alice Johnson',
          email: 'alice@zfit.com',
          phone: '+1234567893',
          role: 'Trainer',
          status: 'active',
          joinDate: '2024-01-10',
        },
        {
          _id: '2',
          name: 'Mike Wilson',
          email: 'mike@zfit.com',
          phone: '+1234567894',
          role: 'Receptionist',
          status: 'active',
          joinDate: '2024-02-15',
        },
        {
          _id: '3',
          name: 'Sarah Davis',
          email: 'sarah@zfit.com',
          phone: '+1234567895',
          role: 'Cleaner',
          status: 'inactive',
          joinDate: '2023-11-20',
        },
      ]
      setStaff(mockStaff)
    } catch (error) {
      console.error('Error fetching staff:', error)
      setError('Failed to load staff')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStaff = async (staffId: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return

    try {
      // TODO: Implement API call to delete staff
      // await apiService.deleteStaff(staffId)
      setStaff(staff.filter(member => member._id !== staffId))
    } catch (error) {
      console.error('Error deleting staff:', error)
      setError('Failed to delete staff member')
    }
  }

  const handleEditStaff = (staffMember: Staff) => {
    // TODO: Implement edit functionality
    console.log('Edit staff:', staffMember)
  }

  const handleAddStaff = () => {
    // TODO: Implement add staff functionality
    console.log('Add new staff member')
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
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((staffMember) => (
                <TableRow key={staffMember._id}>
                  <TableCell className="font-medium">{staffMember.name}</TableCell>
                  <TableCell>{staffMember.email}</TableCell>
                  <TableCell>{staffMember.phone}</TableCell>
                  <TableCell>{staffMember.role}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(staffMember.status)}>
                      {staffMember.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(staffMember.joinDate).toLocaleDateString()}</TableCell>
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
    </div>
  )
}