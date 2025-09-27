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



import { Input } from '@/components/ui/input'
import { Activity, Search } from 'lucide-react'
import { itemApiService } from '@/lib/api/itemApi'

interface StockItem {
  _id: string
  itemName: string
  itemDescription: string
  categoryID: string
  quantity: number
  price?: number
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')


  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const itemsResponse = await itemApiService.getItems()
      setItems(itemsResponse.data as StockItem[])
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load stock data')
    } finally {
      setLoading(false)
    }
  }

  // Filter items based on search term
  const filteredItems = items.filter(item => {
    const searchLower = searchTerm.toLowerCase()
    const supplierName = item.supplierID?.supplierName || ''
    
    return (
      item.itemName.toLowerCase().includes(searchLower) ||
      item.itemDescription.toLowerCase().includes(searchLower) ||
      item.categoryID.toLowerCase().includes(searchLower) ||
      supplierName.toLowerCase().includes(searchLower)
    )
  })

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

          {/* Search Bar */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search stock items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Current Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
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
                    {item.categoryID || 'No Category'}
                  </TableCell>
                  <TableCell>
                    {typeof item.supplierID === 'object' && item.supplierID !== null
                      ? item.supplierID.supplierName 
                      : item.supplierID || 'No Supplier'}
                  </TableCell>
                  <TableCell>
                    {item.quantity}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredItems.length === 0 && items.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No items found matching your search</p>
              <p className="text-sm">Try adjusting your search terms</p>
            </div>
          )}

          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No stock items found</p>
              <p className="text-sm">Items will appear here once created</p>
            </div>
          )}
        </CardContent>
      </Card>


    </div>
  )
}