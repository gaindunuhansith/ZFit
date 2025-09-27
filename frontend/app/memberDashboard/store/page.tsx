"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Search, Package, Store } from 'lucide-react'
import { itemApiService } from '@/lib/api/itemApi'
import { SupplementCard } from '@/components/SupplementCard'

interface SupplementItem {
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

interface CartItem extends SupplementItem {
  cartQuantity: number
}

export default function MemberStorePage() {
  const [supplements, setSupplements] = useState<SupplementItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchSupplements()
  }, [])

  const fetchSupplements = async () => {
    try {
      setLoading(true)
      const response = await itemApiService.getItems()
      
      // Filter only supplements (case-insensitive)
      const allItems = response.data as SupplementItem[]
      const supplementItems = allItems.filter(item => 
        item.categoryID.toLowerCase().includes('supplement')
      )
      
      setSupplements(supplementItems)
    } catch (error) {
      console.error('Error fetching supplements:', error)
      setError('Failed to load supplements')
    } finally {
      setLoading(false)
    }
  }

  // Filter supplements based on search term
  const filteredSupplements = supplements.filter(supplement => {
    const searchLower = searchTerm.toLowerCase()
    const supplierName = supplement.supplierID?.supplierName || ''
    
    return (
      supplement.itemName.toLowerCase().includes(searchLower) ||
      supplement.itemDescription.toLowerCase().includes(searchLower) ||
      supplierName.toLowerCase().includes(searchLower)
    )
  })

  const addToCart = (supplement: SupplementItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === supplement._id)
      
      if (existingItem) {
        // Check if we can add more (don't exceed available quantity)
        if (existingItem.cartQuantity < supplement.quantity) {
          return prevCart.map(item =>
            item._id === supplement._id
              ? { ...item, cartQuantity: item.cartQuantity + 1 }
              : item
          )
        }
        return prevCart // Don't add if already at max quantity
      } else {
        // Add new item to cart
        return [...prevCart, { ...supplement, cartQuantity: 1 }]
      }
    })
  }

  const removeFromCart = (supplementId: string) => {
    setCart(prevCart => {
      return prevCart.reduce((acc, item) => {
        if (item._id === supplementId) {
          if (item.cartQuantity > 1) {
            acc.push({ ...item, cartQuantity: item.cartQuantity - 1 })
          }
          // If cartQuantity is 1, don't add it back (remove from cart)
        } else {
          acc.push(item)
        }
        return acc
      }, [] as CartItem[])
    })
  }

  const getCartQuantity = (supplementId: string) => {
    const cartItem = cart.find(item => item._id === supplementId)
    return cartItem ? cartItem.cartQuantity : 0
  }

  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.cartQuantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price || 0) * item.cartQuantity, 0)
  }

  const isOutOfStock = (supplement: SupplementItem) => {
    return supplement.quantity === 0
  }

  const getAvailableQuantity = (supplement: SupplementItem) => {
    const cartQuantity = getCartQuantity(supplement._id)
    return supplement.quantity - cartQuantity
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Supplement Store</h2>
            <p className="text-muted-foreground">Browse and purchase supplements</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading supplements...</p>
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
          <h2 className="text-3xl font-bold tracking-tight">Supplement Store</h2>
          <p className="text-muted-foreground">Browse and purchase supplements</p>
        </div>
        
        {/* Cart Summary */}
        {cart.length > 0 && (
          <Card className="w-80">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="h-5 w-5" />
                Shopping Cart
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items List */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.itemName}</p>
                      <p className="text-xs text-muted-foreground">
                        LKR {item.price?.toFixed(2) || '0.00'} × {item.cartQuantity}
                      </p>
                    </div>
                    <div className="text-sm font-semibold ml-2">
                      LKR {((item.price || 0) * item.cartQuantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Cart Summary */}
              <div className="border-t pt-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Total Items:</span>
                  <span className="font-medium">{getTotalCartItems()}</span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-primary">LKR {getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
              
              <Button className="w-full" size="sm">
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search supplements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Supplements Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredSupplements.map((supplement) => (
          <SupplementCard
            key={supplement._id}
            supplement={supplement}
            cartQuantity={getCartQuantity(supplement._id)}
            availableQuantity={getAvailableQuantity(supplement)}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredSupplements.length === 0 && supplements.length > 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No supplements found</h3>
          <p>Try adjusting your search terms</p>
        </div>
      )}

      {supplements.length === 0 && !loading && (
        <div className="text-center py-12 text-muted-foreground">
          <Store className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No supplements available</h3>
          <p>Check back later for new products</p>
        </div>
      )}
    </div>
  )
}