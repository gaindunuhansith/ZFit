"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Search, Package, Store } from 'lucide-react'
import { itemApiService } from '@/lib/api/itemApi'
import { cartApi, type Cart } from '@/lib/api/cartApi'
import { useAuth } from '@/lib/auth-context'
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

export default function MemberStorePage() {
  const [supplements, setSupplements] = useState<SupplementItem[]>([])
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [cartLoading, setCartLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  const router = useRouter()
  const { user } = useAuth()

  const fetchSupplements = async () => {
    try {
      setLoading(true)
      const response = await itemApiService.getItems()
      
      // Filter only supplements (case-insensitive)
      const allItems = response.data as SupplementItem[]
      const supplementItems = allItems.filter(item => 
        item.categoryID && item.categoryID.toLowerCase().includes('supplement')
      )
      
      setSupplements(supplementItems)
    } catch (error) {
      console.error('Error fetching supplements:', error)
      setError('Failed to load supplements')
    } finally {
      setLoading(false)
    }
  }

  const fetchCart = useCallback(async () => {
    if (!user?._id) return
    
    try {
      const response = await cartApi.getCartByMember(user._id)
      setCart(response.data)
    } catch (error) {
      console.error('Error fetching cart:', error)
      // Don't show error for cart fetch failure - just keep cart as null
    }
  }, [user?._id])

  useEffect(() => {
    fetchSupplements()
  }, [])

  useEffect(() => {
    if (user?._id) {
      fetchCart()
    }
  }, [user?._id, fetchCart])

  // Filter supplements based on search term
  const filteredSupplements = supplements.filter(supplement => {
    const searchLower = searchTerm.toLowerCase()
    const supplierName = supplement.supplierID?.supplierName || ''
    const itemName = supplement.itemName || ''
    const itemDescription = supplement.itemDescription || ''
    
    return (
      itemName.toLowerCase().includes(searchLower) ||
      itemDescription.toLowerCase().includes(searchLower) ||
      supplierName.toLowerCase().includes(searchLower)
    )
  })

  const addToCart = async (supplement: SupplementItem) => {
    if (!user?._id) return
    
    try {
      setCartLoading(true)
      await cartApi.addToCart({
        memberId: user._id,
        itemId: supplement._id,
        quantity: 1
      })
      // Refresh cart after adding
      await fetchCart()
    } catch (error) {
      console.error('Error adding to cart:', error)
      setError('Failed to add item to cart')
    } finally {
      setCartLoading(false)
    }
  }

  const removeFromCart = async (supplementId: string) => {
    if (!user?._id || !cart) return
    
    try {
      setCartLoading(true)
      
      // Find the item in cart to determine current quantity
      const cartItem = cart.items.find(item => item.itemId._id === supplementId)
      if (!cartItem) return
      
      if (cartItem.quantity > 1) {
        // Update quantity if more than 1
        await cartApi.updateCartItem(user._id, supplementId, { quantity: cartItem.quantity - 1 })
      } else {
        // Remove item completely if quantity is 1
        await cartApi.removeCartItem(user._id, supplementId)
      }
      
      // Refresh cart after removing/updating
      await fetchCart()
    } catch (error) {
      console.error('Error removing from cart:', error)
      setError('Failed to remove item from cart')
    } finally {
      setCartLoading(false)
    }
  }

  const getCartQuantity = (supplementId: string) => {
    if (!cart?.items) return 0
    const cartItem = cart.items.find(item => item.itemId._id === supplementId)
    return cartItem ? cartItem.quantity : 0
  }

  const getTotalCartItems = () => {
    if (!cart?.items) return 0
    return cart.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    if (!cart?.items) return 0
    return cart.items.reduce((total, item) => total + (item.itemId.price || 0) * item.quantity, 0)
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
        
        {/* Cart Button */}
        <div className="flex items-center gap-4">
          {cart?.items && cart.items.length > 0 && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {getTotalCartItems()} items • LKR {getTotalPrice().toFixed(2)}
              </p>
            </div>
          )}
          <Button
            onClick={() => router.push('/memberDashboard/cart')}
            variant={cart?.items && cart.items.length > 0 ? 'default' : 'outline'}
            className="flex items-center gap-2"
            disabled={cartLoading}
          >
            <ShoppingCart className="h-4 w-4" />
            View Cart
            {cart?.items && cart.items.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {getTotalCartItems()}
              </Badge>
            )}
          </Button>
        </div>
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