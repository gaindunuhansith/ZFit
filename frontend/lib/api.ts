const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

interface MemberData {
  name: string
  email: string
  phone: string
  password?: string
  role?: string
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
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

  // User/Member API methods
  async getMembers() {
    return this.request('/users/members')
  }

  async getMemberById(id: string) {
    return this.request(`/users/members/${id}`)
  }

  async createMember(memberData: MemberData) {
    return this.request('/users/members', {
      method: 'POST',
      body: JSON.stringify(memberData),
    })
  }

  async updateMember(id: string, memberData: Partial<MemberData>) {
    return this.request(`/users/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    })
  }

  async deleteMember(id: string) {
    return this.request(`/users/members/${id}`, {
      method: 'DELETE',
    })
  }

  // Staff API methods
  async getStaff() {
    return this.request('/users/staff')
  }

  // Manager API methods
  async getManagers() {
    return this.request('/users/managers')
  }

  // Attendance API methods
  async checkIn(qrToken: string, location?: string, notes?: string) {
    return this.request('/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify({ qrToken, location, notes }),
    })
  }

  async forceCheckIn(memberQrToken: string, staffQrToken: string, location?: string, notes?: string) {
    return this.request('/attendance/force-check-in', {
      method: 'POST',
      body: JSON.stringify({ memberQrToken, staffQrToken, location, notes }),
    })
  }
}

export const apiService = new ApiService()