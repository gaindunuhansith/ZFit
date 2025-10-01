"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Search, Package, Store } from 'lucide-react'
import { itemApiService, type Item } from '@/lib/api/itemApi'

interface StoreItem extends Item {
  // Store-specific properties if needed
}

interface CartItem extends StoreItem {
  cartQuantity: number
}

export default function UserStorePage() {
  const [items, setItems] = useState<StoreItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const response = await itemApiService.getItems()
      
      // Filter only sellable items
      const allItems = response.data as StoreItem[]
      const sellableItems = allItems.filter(item => 
        item.type === 'sellable' && item.isActive && item.stock && item.stock > 0
      )
      
      setItems(sellableItems)
    } catch (error) {
      console.error('Error fetching items:', error)
      setError('Failed to load store items')
    } finally {
      setLoading(false)
    }
  }

  // Filter items based on search term
  const filteredItems = items.filter(item => {
    const searchLower = searchTerm.toLowerCase()
    const supplierName = typeof item.supplierID === 'object' ? item.supplierID?.supplierName || '' : ''
    const categoryName = typeof item.categoryID === 'object' ? item.categoryID?.name || '' : ''
    
    return (
      item.name.toLowerCase().includes(searchLower) ||
      supplierName.toLowerCase().includes(searchLower) ||
      categoryName.toLowerCase().includes(searchLower)
    )
  })

  const addToCart = (item: StoreItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem._id === item._id)
      
      if (existingItem) {
        // Check if we can add more (don't exceed available quantity)
        if (existingItem.cartQuantity < (item.stock || 0)) {
          return prevCart.map(cartItem =>
            cartItem._id === item._id
              ? { ...cartItem, cartQuantity: cartItem.cartQuantity + 1 }
              : cartItem
          )
        }
        return prevCart // Don't add if already at max quantity
      } else {
        // Add new item to cart
        return [...prevCart, { ...item, cartQuantity: 1 }]
      }
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      return prevCart.reduce((acc, item) => {
        if (item._id === itemId) {
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

  const getCartQuantity = (itemId: string) => {
    const cartItem = cart.find(item => item._id === itemId)
    return cartItem ? cartItem.cartQuantity : 0
  }

  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.cartQuantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price || 0) * item.cartQuantity, 0)
  }

  const isOutOfStock = (item: StoreItem) => {
    return (item.stock || 0) === 0
  }

  const getAvailableQuantity = (item: StoreItem) => {
    const cartQuantity = getCartQuantity(item._id)
    return (item.stock || 0) - cartQuantity
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Store</h2>
            <p className="text-muted-foreground">Browse and purchase sellable items</p>
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
          <h2 className="text-3xl font-bold tracking-tight">Store</h2>
          <p className="text-muted-foreground">Browse and purchase sellable items</p>
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
                      <p className="text-sm font-medium truncate">{item.name}</p>
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
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => (
          <Card key={item._id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Item Info */}
                <div>
                  <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {typeof item.categoryID === 'object' ? item.categoryID.name : 'No category'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Available: {getAvailableQuantity(item)} / {item.stock || 0}
                  </p>
                </div>
                
                {/* Price */}
                <div className="text-xl font-bold text-primary">
                  LKR {item.price?.toFixed(2) || '0.00'}
                </div>
                
                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  {getAvailableQuantity(item) === 0 ? (
                    <Badge variant="destructive">No More Available</Badge>
                  ) : getAvailableQuantity(item) <= (item.lowStockAlert || 5) ? (
                    <Badge variant="secondary">Low Available</Badge>
                  ) : (
                    <Badge variant="default">Available</Badge>
                  )}
                  {getCartQuantity(item._id) > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {getCartQuantity(item._id)} in cart
                    </Badge>
                  )}
                </div>
                
                {/* Cart Controls */}
                <div className="flex items-center justify-between">
                  {getCartQuantity(item._id) > 0 ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromCart(item._id)}
                      >
                        -
                      </Button>
                      <span className="text-sm font-medium px-2">
                        {getCartQuantity(item._id)}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToCart(item)}
                        disabled={getCartQuantity(item._id) >= (item.stock || 0)}
                      >
                        +
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => addToCart(item)}
                      disabled={isOutOfStock(item)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && items.length > 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No items found</h3>
          <p>Try adjusting your search terms</p>
        </div>
      )}

      {items.length === 0 && !loading && (
        <div className="text-center py-12 text-muted-foreground">
          <Store className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No sellable items available</h3>
          <p>Check back later for new products</p>
        </div>
      )}
    </div>
  )
}