"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { apiRequest } from "@/lib/apiRequest"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

interface Booking {
  _id: string
  memberId: string
  classId: string
  trainerId: string
  facilityId: string
  classType: string
  scheduledDate: string
  fee: number
  status: string
  member?: {
    name: string
    email: string
  }
  class?: {
    name: string
    type: string
  }
  trainer?: {
    name: string
    specialization: string
  }
  facility?: {
    name: string
  }
}

interface CalendarViewProps {
  onDateSelect: (date: Date, bookings: Booking[]) => void
  selectedDate?: Date
}

export function CalendarView({ onDateSelect, selectedDate }: CalendarViewProps) {
  const { user, isManager } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [currentDate])

  const fetchBookings = async () => {
    setIsLoading(true)
    try {
      const response = await apiRequest("/bookings")
      setBookings(response.data || [])
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
      toast.error("Failed to load bookings")
    } finally {
      setIsLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getBookingsForDate = (date: Date) => {
    if (!date) return []
    
    const dateStr = date.toISOString().split('T')[0]
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.scheduledDate).toISOString().split('T')[0]
      return bookingDate === dateStr && (
        isManager || booking.memberId === user?._id
      )
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-500"
      case "pending": return "bg-yellow-500"
      case "cancelled": return "bg-red-500"
      case "completed": return "bg-blue-500"
      case "rescheduled": return "bg-purple-500"
      default: return "bg-gray-500"
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }

  const days = getDaysInMonth(currentDate)
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <Card className="bg-[#202022] border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-[#AAFF69]" />
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-400 p-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="h-16" />
            }
            
            const dayBookings = getBookingsForDate(date)
            const hasBookings = dayBookings.length > 0
            
            return (
              <div
                key={index}
                className={`
                  h-16 border border-gray-700 rounded cursor-pointer transition-colors
                  ${isToday(date) ? 'bg-[#AAFF69]/20 border-[#AAFF69]' : ''}
                  ${isSelected(date) ? 'bg-[#AAFF69]/30 border-[#AAFF69]' : ''}
                  ${hasBookings ? 'hover:bg-gray-800' : 'hover:bg-gray-800/50'}
                `}
                onClick={() => onDateSelect(date, dayBookings)}
              >
                <div className="p-1 h-full flex flex-col">
                  <div className={`
                    text-sm font-medium
                    ${isToday(date) ? 'text-[#AAFF69]' : 'text-white'}
                    ${isSelected(date) ? 'text-[#AAFF69]' : ''}
                  `}>
                    {date.getDate()}
                  </div>
                  
                  {hasBookings && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dayBookings.slice(0, 2).map((booking, idx) => (
                        <div
                          key={idx}
                          className={`w-2 h-2 rounded-full ${getStatusColor(booking.status)}`}
                          title={`${booking.class?.name || 'Class'} - ${booking.status}`}
                        />
                      ))}
                      {dayBookings.length > 2 && (
                        <div className="text-xs text-gray-400">
                          +{dayBookings.length - 2}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-400">Confirmed</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-400">Pending</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-400">Cancelled</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-400">Completed</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-gray-400">Rescheduled</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
