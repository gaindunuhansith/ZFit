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
import { Plus, Edit, Trash2, Package2 } from 'lucide-react'
import { itemApiService } from '@/lib/api/itemApi'
import { supplierApiService } from '@/lib/api/supplierApi'
import type { ItemData } from '@/lib/api/itemApi'
import { ItemFormModal, ItemFormData, UpdateItemFormData } from '@/components/ItemFormModal'

interface Item {
  _id: string
  itemName: string
  itemDescription: string
  categoryID: "supplements" | "equipment"
  quantity: number
  price: number
  supplierID: {
    _id: string
    supplierName: string
  }
  lowStockThreshold: number
  maintenanceStatus: "good" | "maintenance_required" | "under_repair"
  lastMaintenanceDate?: string
  createdAt: string
  updatedAt?: string
}

interface Supplier {
  _id: string
  supplierName: string
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)

  useEffect(() => {
    Promise.all([
      fetchItems(),
      fetchSuppliers()
    ])
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const response = await itemApiService.getItems()
      // Filter out items with invalid data to prevent errors
      const validItems = (response.data as Item[]).filter(item => 
        item && item._id && item.itemName
      )
      setItems(validItems)
    } catch (error) {
      console.error('Error fetching items:', error)
      setError('Failed to load items')
    } finally {
      setLoading(false)
    }
  }



  const fetchSuppliers = async () => {
    try {
      const response = await supplierApiService.getSuppliers()
      setSuppliers(response.data as Supplier[])
    } catch (error) {
      console.error('Error fetching suppliers:', error)
    }
  }

  const handleAddItem = () => {
    setEditingItem(null)
    setModalOpen(true)
  }

  const handleEditItem = (item: Item) => {
    setEditingItem(item)
    setModalOpen(true)
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      await itemApiService.deleteItem(itemId)
      setItems(items.filter(item => item._id !== itemId))
    } catch (error) {
      console.error('Error deleting item:', error)
      setError('Failed to delete item')
    }
  }

  const handleModalSubmit = async (formData: ItemFormData | UpdateItemFormData) => {
    try {
      if (editingItem) {
        // Update existing item
        await itemApiService.updateItem(editingItem._id, formData)
      } else {
        // Create new item
        await itemApiService.createItem(formData as ItemData)
      }
      fetchItems() // Refresh the list
    } catch (error) {
      console.error('Error saving item:', error)
      setError('Failed to save item')
      throw error
    }
  }

  const getMaintenanceStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'good':
        return 'default'
      case 'maintenance_required':
        return 'secondary'
      case 'under_repair':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getMaintenanceStatusLabel = (status: string) => {
    switch (status) {
      case 'good':
        return 'Good'
      case 'maintenance_required':
        return 'Maintenance Required'
      case 'under_repair':
        return 'Under Repair'
      default:
        return status
    }
  }

  const isLowStock = (quantity: number, threshold: number) => {
    return quantity <= threshold
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Items</h2>
            <p className="text-muted-foreground">Manage inventory items</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading items...</p>
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
          <h2 className="text-3xl font-bold tracking-tight">Items</h2>
          <p className="text-muted-foreground">Manage inventory items</p>
        </div>
        <Button onClick={handleAddItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package2 className="h-5 w-5" />
            All Items
          </CardTitle>
          <CardDescription>
            View and manage all inventory items
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
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{item.itemName}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.itemDescription}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.categoryID === 'supplements' 
                      ? 'Supplements'
                      : item.categoryID === 'equipment'
                        ? 'Equipment'
                        : item.categoryID || 'No Category'}
                  </TableCell>
                  <TableCell>
                    {item.supplierID && typeof item.supplierID === 'object' 
                      ? item.supplierID.supplierName 
                      : item.supplierID || 'No Supplier'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{item.quantity}</span>
                      {isLowStock(item.quantity, item.lowStockThreshold) && (
                        <Badge variant="destructive" className="text-xs">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getMaintenanceStatusBadgeVariant(item.maintenanceStatus)}>
                      {getMaintenanceStatusLabel(item.maintenanceStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteItem(item._id)}
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

          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No items found</p>
              <p className="text-sm">Add your first item to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      <ItemFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        suppliers={suppliers}
        initialData={editingItem ? {
          itemName: editingItem.itemName,
          itemDescription: editingItem.itemDescription,
          categoryID: editingItem.categoryID as "supplements" | "equipment" | undefined,
          quantity: editingItem.quantity,
          price: editingItem.price,
          supplierID: editingItem.supplierID && typeof editingItem.supplierID === 'object' 
            ? editingItem.supplierID._id 
            : editingItem.supplierID || '',
          lowStockThreshold: editingItem.lowStockThreshold,
          maintenanceStatus: editingItem.maintenanceStatus,
          lastMaintenanceDate: editingItem.lastMaintenanceDate,
        } : undefined}
        mode={editingItem ? 'edit' : 'add'}
        title={editingItem ? 'Edit Item' : 'Add New Item'}
      />
    </div>
  )
}