"use client";
import { useState, useEffect } from "react";
import BookingForm, { BookingFormInput } from "@/components/bookingForm";
import BookingTable from "@/components/bookingTable";
import CalendarView from "@/components/calendarView";
import { bookingApi, Booking } from "@/services/bookingApi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MemberBookings() {
  const { user, isAuthenticated, isLoading, isMember } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchBookings = async () => {
    try {
      const mine = await bookingApi.getMyBookings();
      // ✅ Ensure objects are formatted safely for UI
      const safeBookings = mine.map((b) => ({
        ...b,
        className: b.classId?.name || "N/A",
        trainerName: b.trainerId?.name || "N/A",
        facilityName: b.facilityId?.name || "N/A",
        date: b.date || "",
        time: b.time || "",
      }));
      setBookings(safeBookings);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated && isMember) {
      fetchBookings();
    }
  }, [isLoading, isAuthenticated, isMember]);

  const handleCreate = async (form: BookingFormInput) => {
    try {
      const created = await bookingApi.createBooking({
        classId: form.classId,
        trainerId: form.trainerId,
        facilityId: form.facilityId,
        date: form.scheduledDate,
        time: form.scheduledTime,
      });

      const safeCreated = {
        ...created,
        className: created.classId?.name || "N/A",
        trainerName: created.trainerId?.name || "N/A",
        facilityName: created.facilityId?.name || "N/A",
      };

      setBookings((prev) => [...prev, safeCreated]);
      setIsDialogOpen(false);
    } catch (e: any) {
      alert(e.message || "Error creating booking");
    }
  };

  const handleCancel = async (b: Booking) => {
    try {
      const updated = await bookingApi.cancelBooking(b._id);

      const safeUpdated = {
        ...updated,
        className: updated.classId?.name || "N/A",
        trainerName: updated.trainerId?.name || "N/A",
        facilityName: updated.facilityId?.name || "N/A",
      };

      setBookings((prev) => prev.map((x) => (x._id === b._id ? safeUpdated : x)));
    } catch (e: any) {
      alert(e.message || "Unable to cancel");
    }
  };

  const handleReschedule = async (b: Booking) => {
    const date = prompt("New date (YYYY-MM-DD):");
    const time = prompt("New time (HH:MM):");
    if (!date || !time) return;
    try {
      const updated = await bookingApi.rescheduleBooking(b._id, { date, time });

      const safeUpdated = {
        ...updated,
        className: updated.classId?.name || "N/A",
        trainerName: updated.trainerId?.name || "N/A",
        facilityName: updated.facilityId?.name || "N/A",
      };

      setBookings((prev) => prev.map((x) => (x._id === b._id ? safeUpdated : x)));
    } catch (e: any) {
      alert(e.message || "Unable to reschedule");
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Reservations</h1>
          {user && (
            <p className="text-sm text-muted-foreground mt-1">
              Signed in as {user.name} ({user.email})
            </p>
          )}
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>+ New Booking</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Book a Class</DialogTitle>
            </DialogHeader>
            <BookingForm onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </div>

      {!isAuthenticated && !isLoading && (
        <Card>
          <CardContent className="py-6 text-sm text-red-600">
            You must be logged in as a member to view bookings.
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarView bookings={bookings} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming & Past Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center">
              No bookings yet. Click "New Booking" to get started.
            </div>
          ) : (
            <BookingTable
              bookings={bookings}
              onEdit={handleReschedule}
              onDelete={handleCancel}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
