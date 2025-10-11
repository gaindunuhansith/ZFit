"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarView } from "@/components/CalendarView"
import { BookingTable } from "@/components/BookingTable"
import { BookingFormModal } from "@/components/BookingFormModal"
import { ClassModal } from "@/components/ClassModal"
import { TrainerFormModal } from "@/components/TrainerFormModal"
import { FacilityFormModal } from "@/components/FacilityFormModal"
import { 
  Plus, 
  Calendar, 
  Users, 
  Dumbbell, 
  MapPin,
  BookOpen
} from "lucide-react"
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

export default function ReservationsPage() {
  const { isManager } = useAuth()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedBookings, setSelectedBookings] = useState<Booking[]>([])
  const [activeTab, setActiveTab] = useState("calendar")
  
  // Modal states
  const [bookingModal, setBookingModal] = useState<{ isOpen: boolean; booking: Booking | null }>({
    isOpen: false,
    booking: null
  })
  const [classModal, setClassModal] = useState<{ isOpen: boolean; classData: any }>({
    isOpen: false,
    classData: null
  })
  const [trainerModal, setTrainerModal] = useState<{ isOpen: boolean; trainerData: any }>({
    isOpen: false,
    trainerData: null
  })
  const [facilityModal, setFacilityModal] = useState<{ isOpen: boolean; facilityData: any }>({
    isOpen: false,
    facilityData: null
  })

  const handleDateSelect = (date: Date, bookings: Booking[]) => {
    setSelectedDate(date)
    setSelectedBookings(bookings)
    setActiveTab("bookings")
  }

  const handleRefresh = () => {
    // This will trigger a re-render and refetch data
    setSelectedDate(undefined)
    setSelectedBookings([])
  }

  const handleEditBooking = (booking: Booking) => {
    setBookingModal({ isOpen: true, booking })
  }

  if (!isManager) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="bg-[#202022] border-gray-700">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
            <p className="text-gray-400">You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Reservations Management</h1>
          <p className="text-gray-400">Manage classes, trainers, facilities, and bookings</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setBookingModal({ isOpen: true, booking: null })}
            className="bg-[#AAFF69] text-black hover:bg-[#AAFF69]/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-[#202022] border-gray-700">
          <TabsTrigger 
            value="calendar" 
            className="data-[state=active]:bg-[#AAFF69] data-[state=active]:text-black"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </TabsTrigger>
          <TabsTrigger 
            value="bookings" 
            className="data-[state=active]:bg-[#AAFF69] data-[state=active]:text-black"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Bookings
          </TabsTrigger>
          <TabsTrigger 
            value="classes" 
            className="data-[state=active]:bg-[#AAFF69] data-[state=active]:text-black"
          >
            <Dumbbell className="h-4 w-4 mr-2" />
            Classes
          </TabsTrigger>
          <TabsTrigger 
            value="trainers" 
            className="data-[state=active]:bg-[#AAFF69] data-[state=active]:text-black"
          >
            <Users className="h-4 w-4 mr-2" />
            Trainers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <CalendarView 
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
          />
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Bookings</h2>
              {selectedDate && (
                <p className="text-gray-400">
                  Bookings for {selectedDate.toLocaleDateString()}
                </p>
              )}
            </div>
            <Button
              onClick={() => setBookingModal({ isOpen: true, booking: null })}
              className="bg-[#AAFF69] text-black hover:bg-[#AAFF69]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </div>
          
          <BookingTable
            bookings={selectedBookings}
            onRefresh={handleRefresh}
            onEdit={handleEditBooking}
          />
        </TabsContent>

        <TabsContent value="classes" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Classes</h2>
              <p className="text-gray-400">Manage fitness classes</p>
            </div>
            <Button
              onClick={() => setClassModal({ isOpen: true, classData: null })}
              className="bg-[#AAFF69] text-black hover:bg-[#AAFF69]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Button>
          </div>
          
          <Card className="bg-[#202022] border-gray-700">
            <CardContent className="p-6">
              <p className="text-gray-400 text-center">Class management interface will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trainers" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Trainers</h2>
              <p className="text-gray-400">Manage fitness trainers</p>
            </div>
            <Button
              onClick={() => setTrainerModal({ isOpen: true, trainerData: null })}
              className="bg-[#AAFF69] text-black hover:bg-[#AAFF69]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Trainer
            </Button>
          </div>
          
          <Card className="bg-[#202022] border-gray-700">
            <CardContent className="p-6">
              <p className="text-gray-400 text-center">Trainer management interface will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <BookingFormModal
        isOpen={bookingModal.isOpen}
        onClose={() => setBookingModal({ isOpen: false, booking: null })}
        onSuccess={handleRefresh}
        bookingData={bookingModal.booking}
      />

      <ClassFormModal
        isOpen={classModal.isOpen}
        onClose={() => setClassModal({ isOpen: false, classData: null })}
        onSuccess={handleRefresh}
        classData={classModal.classData}
      />

      <TrainerFormModal
        isOpen={trainerModal.isOpen}
        onClose={() => setTrainerModal({ isOpen: false, trainerData: null })}
        onSuccess={handleRefresh}
        trainerData={trainerModal.trainerData}
      />

      <FacilityFormModal
        isOpen={facilityModal.isOpen}
        onClose={() => setFacilityModal({ isOpen: false, facilityData: null })}
        onSuccess={handleRefresh}
        facilityData={facilityModal.facilityData}
      />
    </div>
  )
}
