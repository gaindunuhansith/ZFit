const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Base request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// Special request function for cart that handles 404 as empty cart
const cartApiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    // Handle 404 for cart not found - return empty cart instead of error
    if (response.status === 404 && data.message === "Cart not found") {
      return {
        success: true,
        data: {
          _id: '',
          memberId: '',
          items: [],
          createdAt: '',
          updatedAt: ''
        } as T
      }
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

export interface CartItem {
  itemId: {
    _id: string
    itemName: string
    itemDescription: string
    price: number
    quantity: number
    categoryID: string
    supplierID?: {
      _id: string
      supplierName: string
    }
    createdAt: string
    updatedAt: string
  }
  quantity: number
  _id: string
}

export interface Cart {
  _id: string
  memberId: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
}

export interface AddToCartData {
  memberId: string
  itemId: string
  quantity: number
}

export interface UpdateCartData {
  quantity: number
}

export const cartApi = {
  // Get cart by member ID
  getCartByMember: async (memberId: string): Promise<{ success: boolean; data: Cart }> => {
    const response = await cartApiRequest<Cart>(`/inventory/cart/${memberId}`)
    return response as { success: boolean; data: Cart }
  },

  // Add item to cart
  addToCart: async (data: AddToCartData): Promise<{ success: boolean; message: string; data: Cart }> => {
    const response = await apiRequest<Cart>('/inventory/cart/items', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response as { success: boolean; message: string; data: Cart }
  },

  // Update cart item quantity
  updateCartItem: async (
    memberId: string,
    itemId: string,
    data: UpdateCartData
  ): Promise<{ success: boolean; message: string; data: Cart }> => {
    const response = await apiRequest<Cart>(`/inventory/cart/${memberId}/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response as { success: boolean; message: string; data: Cart }
  },

  // Remove item from cart
  removeCartItem: async (
    memberId: string,
    itemId: string
  ): Promise<{ success: boolean; message: string; data: Cart }> => {
    const response = await apiRequest<Cart>(`/inventory/cart/${memberId}/items/${itemId}`, {
      method: 'DELETE',
    })
    return response as { success: boolean; message: string; data: Cart }
  },

  // Clear entire cart
  clearCart: async (memberId: string): Promise<{ success: boolean; message: string; data: Cart }> => {
    const response = await apiRequest<Cart>(`/inventory/cart/${memberId}/clear`, {
      method: 'DELETE',
    })
    return response as { success: boolean; message: string; data: Cart }
  },
}