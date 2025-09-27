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
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Minus, Wrench, AlertTriangle, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { stockApiService } from '@/lib/api/stockApi'
import { itemApiService } from '@/lib/api/itemApi'
import type { StockUpdateData, MaintenanceUpdateData } from '@/lib/api/stockApi'

interface StockItem {
  _id: string
  itemName: string
  itemDescription: string
  categoryID: string
  quantity: number
  price: number
  supplierID: {
    _id: string
    supplierName: string
  } | null
  lowStockThreshold: number
  maintenanceStatus: "good" | "maintenance_required" | "under_repair"
  lastMaintenanceDate?: string
  createdAt: string
}

export default function StockManagementPage() {
  const [items, setItems] = useState<StockItem[]>([])
  const [lowStockItems, setLowStockItems] = useState<StockItem[]>([])
  const [maintenanceAlerts, setMaintenanceAlerts] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  
  // Modal states
  const [stockModalOpen, setStockModalOpen] = useState(false)
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null)
  
  // Form states
  const [stockQuantity, setStockQuantity] = useState<number>(1)
  const [stockOperation, setStockOperation] = useState<"increment" | "decrement">("increment")
  const [maintenanceStatus, setMaintenanceStatus] = useState<"good" | "maintenance_required" | "under_repair">("good")
  const [maintenanceDate, setMaintenanceDate] = useState<string>('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [itemsResponse, lowStockResponse, maintenanceResponse] = await Promise.all([
        itemApiService.getItems(),
        stockApiService.getLowStockItems(),
        stockApiService.getMaintenanceAlerts()
      ])
      
      setItems(itemsResponse.data as StockItem[])
      setLowStockItems(lowStockResponse.data as StockItem[])
      setMaintenanceAlerts(maintenanceResponse.data as StockItem[])
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load stock data')
    } finally {
      setLoading(false)
    }
  }

  const handleStockUpdate = (item: StockItem) => {
    console.log('Stock update button clicked for item:', item.itemName)
    setSelectedItem(item)
    setStockQuantity(1)
    setStockOperation("increment")
    setStockModalOpen(true)
  }

  const handleMaintenanceUpdate = (item: StockItem) => {
    console.log('Maintenance update button clicked for item:', item.itemName)
    setSelectedItem(item)
    setMaintenanceStatus(item.maintenanceStatus)
    setMaintenanceDate(item.lastMaintenanceDate || '')
    setMaintenanceModalOpen(true)
  }

  const submitStockUpdate = async () => {
    if (!selectedItem) return

    try {
      console.log('Updating stock for item:', selectedItem._id)
      console.log('Stock data:', { quantity: stockQuantity, operation: stockOperation })
      
      const stockData: StockUpdateData = {
        quantity: stockQuantity,
        operation: stockOperation
      }
      
      const response = await stockApiService.updateStock(selectedItem._id, stockData)
      console.log('Stock update response:', response)
      
      setStockModalOpen(false)
      fetchData() // Refresh data
    } catch (error) {
      console.error('Error updating stock:', error)
      setError(`Failed to update stock: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const submitMaintenanceUpdate = async () => {
    if (!selectedItem) return

    try {
      console.log('Updating maintenance for item:', selectedItem._id)
      console.log('Maintenance data:', { maintenanceStatus, lastMaintenanceDate: maintenanceDate })
      
      const maintenanceData: MaintenanceUpdateData = {
        maintenanceStatus,
        lastMaintenanceDate: maintenanceDate || undefined
      }
      
      const response = await stockApiService.updateMaintenance(selectedItem._id, maintenanceData)
      console.log('Maintenance update response:', response)
      
      setMaintenanceModalOpen(false)
      fetchData() // Refresh data
    } catch (error) {
      console.error('Error updating maintenance:', error)
      setError(`Failed to update maintenance: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
            <h2 className="text-3xl font-bold tracking-tight">Stock Management</h2>
            <p className="text-muted-foreground">Manage inventory stock levels and maintenance</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading stock data...</p>
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
          <h2 className="text-3xl font-bold tracking-tight">Stock Management</h2>
          <p className="text-muted-foreground">Manage inventory stock levels and maintenance</p>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Low Stock Alert */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Items below threshold</p>
          </CardContent>
        </Card>

        {/* Maintenance Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Alerts</CardTitle>
            <Wrench className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{maintenanceAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Items needing attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Management Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            All Stock Items
          </CardTitle>
          <CardDescription>
            View and manage stock levels for all inventory items
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
                <TableHead>Current Stock</TableHead>
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
                        : item.categoryID}
                  </TableCell>
                  <TableCell>
                    {typeof item.supplierID === 'object' && item.supplierID !== null
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
                        onClick={() => handleStockUpdate(item)}
                      >
                        <TrendingUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMaintenanceUpdate(item)}
                      >
                        <Wrench className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No stock items found</p>
              <p className="text-sm">Items will appear here once created</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stock Update Modal */}
      <Dialog open={stockModalOpen} onOpenChange={setStockModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock - {selectedItem?.itemName}</DialogTitle>
            <DialogDescription>
              Adjust the stock quantity for this item
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="operation" className="text-right">Operation</Label>
              <div className="col-span-3">
                <Select value={stockOperation} onValueChange={(value: "increment" | "decrement") => setStockOperation(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increment">
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Stock
                      </div>
                    </SelectItem>
                    <SelectItem value="decrement">
                      <div className="flex items-center gap-2">
                        <Minus className="h-4 w-4" />
                        Remove Stock
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(parseInt(e.target.value) || 1)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStockModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitStockUpdate}>
              {stockOperation === 'increment' ? 'Add Stock' : 'Remove Stock'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Maintenance Update Modal */}
      <Dialog open={maintenanceModalOpen} onOpenChange={setMaintenanceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Maintenance - {selectedItem?.itemName}</DialogTitle>
            <DialogDescription>
              Update the maintenance status and date for this item
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <div className="col-span-3">
                <Select value={maintenanceStatus} onValueChange={(value: "good" | "maintenance_required" | "under_repair") => setMaintenanceStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="maintenance_required">Maintenance Required</SelectItem>
                    <SelectItem value="under_repair">Under Repair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">Last Maintenance</Label>
              <Input
                id="date"
                type="date"
                value={maintenanceDate}
                onChange={(e) => setMaintenanceDate(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMaintenanceModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitMaintenanceUpdate}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}