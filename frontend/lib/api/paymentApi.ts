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

  // Get token from localStorage
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

// Types based on backend model
export interface Payment {
  _id: string
  userId: string
  amount: number
  currency: string
  type: 'membership' | 'inventory' | 'booking' | 'other'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  method: 'card' | 'bank-transfer' | 'cash'
  relatedId: string
  transactionId: string
  gatewayTransactionId?: string
  gatewayPaymentId?: string
  gatewayResponse?: Record<string, unknown>
  failureReason?: string
  refundedAmount: number
  refundReason?: string
  date: string
  createdAt: string
  updatedAt: string
}

export interface CreatePaymentData {
  amount: number
  type: 'membership' | 'inventory' | 'booking' | 'other'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  method: 'card' | 'bank-transfer' | 'cash'
  relatedId: string
  transactionId: string
  date: string
  userId: string
  currency?: string
  description?: string
  metadata?: Record<string, unknown>
}

export interface UpdatePaymentData {
  amount?: number
  type?: 'membership' | 'inventory' | 'booking' | 'other'
  status?: 'pending' | 'completed' | 'failed' | 'refunded'
  method?: 'card' | 'bank-transfer' | 'cash'
  relatedId?: string
  transactionId?: string
  date?: string
  currency?: string
  description?: string
  metadata?: Record<string, unknown>
}

// API functions
export const getPayments = async (): Promise<Payment[]> => {
  try {
    const response = await apiRequest<Payment[]>('/payments')
    if (!response.data) {
      throw new Error('Failed to fetch payments')
    }
    return response.data
  } catch (error) {
    console.error('Error fetching payments:', error)
    throw error
  }
}

export const getPaymentById = async (id: string): Promise<Payment> => {
  try {
    const response = await apiRequest<Payment>(`/payments/${id}`)
    if (!response.data) {
      throw new Error('Failed to fetch payment')
    }
    return response.data
  } catch (error) {
    console.error('Error fetching payment:', error)
    throw error
  }
}

export const createPayment = async (paymentData: CreatePaymentData): Promise<Payment> => {
  try {
    const response = await apiRequest<Payment>('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    })
    if (!response.data) {
      throw new Error('Failed to create payment')
    }
    return response.data
  } catch (error) {
    console.error('Error creating payment:', error)
    throw error
  }
}

export const updatePayment = async (id: string, paymentData: UpdatePaymentData): Promise<Payment> => {
  try {
    const response = await apiRequest<Payment>(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    })
    if (!response.data) {
      throw new Error('Failed to update payment')
    }
    return response.data
  } catch (error) {
    console.error('Error updating payment:', error)
    throw error
  }
}

export const deletePayment = async (id: string): Promise<void> => {
  try {
    await apiRequest(`/payments/${id}`, {
      method: 'DELETE',
    })
  } catch (error) {
    console.error('Error deleting payment:', error)
    throw error
  }
}