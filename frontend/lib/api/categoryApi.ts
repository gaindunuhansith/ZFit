const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

interface CategoryData {
  categoryName: string
  categoryDescription: string
}

export type { CategoryData }

// Base request function - EXACT SAME AS userApi.ts
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
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// Category API functions - SAME PATTERN AS userApi.ts
export const getCategories = () => apiRequest('/inventory/categories')

export const createCategory = (categoryData: CategoryData) => {
  console.log('API createCategory called with:', categoryData)
  return apiRequest('/inventory/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  })
}

export const updateCategory = (id: string, categoryData: Partial<CategoryData>) =>
  apiRequest(`/inventory/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  })

export const deleteCategory = (id: string) =>
  apiRequest(`/inventory/categories/${id}`, {
    method: 'DELETE',
  })

// Combined API service - SAME PATTERN AS userApi.ts
export const categoryApiService = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
}