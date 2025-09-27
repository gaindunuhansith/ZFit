const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

interface ItemData {
  itemName: string
  itemDescription: string
  categoryID: string
  quantity: number
  price?: number
  supplierID: string
  lowStockThreshold: number
  maintenanceStatus: "good" | "maintenance_required" | "under_repair"
  lastMaintenanceDate?: string
}

export type { ItemData }

// Base request function - EXACT SAME AS categoryApi.ts and supplierApi.ts
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

  // Add auth token if available
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      console.error('API Error Response:', data)
      throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('API request failed:', error)
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Network error: Unable to reach the server')
    }
    throw error
  }
}

// Item API functions
export const itemApiService = {
  // Get all items
  getItems: () => apiRequest('/inventory/items'),

  // Get item by ID
  getItem: (id: string) => apiRequest(`/inventory/items/${id}`),

  // Create new item
  createItem: (itemData: ItemData) =>
    apiRequest('/inventory/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    }),

  // Update item
  updateItem: (id: string, itemData: Partial<ItemData>) =>
    apiRequest(`/inventory/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    }),

  // Delete item
  deleteItem: (id: string) =>
    apiRequest(`/inventory/items/${id}`, {
      method: 'DELETE',
    }),
}