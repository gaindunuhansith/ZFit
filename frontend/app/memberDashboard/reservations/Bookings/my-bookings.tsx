"use client";
import { useState, useEffect } from "react";
import BookingForm, { BookingFormInput } from "@/components/bookingForm";
import CalendarView from "@/components/calendarView";
import BookingTable from "@/components/bookingTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Booking {
  _id: string;
  memberId: any;
  classId: any;
  trainerId: any;
  facilityId: any;
  classType: string;
  scheduledDate: string;
  fee: number;
  status: string;
}

export default function MemberBookings() {
  const { user, isAuthenticated, isLoading, isMember } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // ✅ Fetch bookings for the logged-in member
  useEffect(() => {
    if (!isLoading && isAuthenticated && isMember && user?._id) {
      fetch(`/api/v1/Booking/member/${user._id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch bookings");
          return res.json();
        })
        .then((data) => setBookings(data))
        .catch((err) => console.error("Error fetching bookings:", err));
    }
  }, [isLoading, isAuthenticated, isMember, user]);

  // ✅ Handle booking submission (create or reschedule)
  const handleSubmit = async (form: BookingFormInput) => {
    try {
      if (editingBooking) {
        // --- Reschedule Booking ---
        const res = await fetch(`/api/v1/Booking/${editingBooking._id}/reschedule`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scheduledDate: form.scheduledDate }),
        });

        if (!res.ok) throw new Error("Failed to reschedule booking");
        const updated = await res.json();

        setBookings((prev) =>
          prev.map((b) => (b._id === updated._id ? updated : b))
        );
      } else {
        // --- Create New Booking ---
        const res = await fetch("/api/v1/Booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memberId: user?._id,
            classId: form.classId,
            trainerId: form.trainerId,
            facilityId: form.facilityId,
            classType: form.classType,
            scheduledDate: form.scheduledDate,
            fee: Number(form.fee || 0),
          }),
        });

        if (!res.ok) throw new Error("Failed to create booking");
        const created = await res.json();

        setBookings((prev) => [...prev, created]);
      }

      setEditingBooking(null);
      setIsDialogOpen(false);
    } catch (err: any) {
      alert(err.message || "Booking failed. Please try again.");
    }
  };

  // ✅ Handle cancel booking (only if ≥ 1 day before)
  const handleCancel = async (b: Booking) => {
    const bookingDate = new Date(b.scheduledDate);
    const now = new Date();
    const diffDays = (bookingDate.getTime() - now.getTime()) / (1000 * 3600 * 24);

    if (diffDays < 1) {
      alert("❌ Bookings can only be cancelled at least one day before the class.");
      return;
    }

    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await fetch(`/api/v1/Booking/${b._id}/cancel`, { method: "PUT" });
      if (!res.ok) throw new Error("Failed to cancel booking");

      setBookings((prev) =>
        prev.map((x) => (x._id === b._id ? { ...x, status: "cancelled" } : x))
      );
    } catch (err) {
      console.error("Cancel booking error:", err);
      alert("Failed to cancel booking.");
    }
  };

  // ✅ Handle reschedule
  const handleReschedule = (b: Booking) => {
    setEditingBooking(b);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Reservations</h1>
          {user && (
            <p className="text-sm text-muted-foreground mt-1">
              Signed in as {user.name}
            </p>
          )}
        </div>

        {/* ✅ Dialog for Booking / Reschedule */}
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) setEditingBooking(null);
            setIsDialogOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              + {editingBooking ? "Reschedule Booking" : "New Booking"}
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg bg-[var(--color-background)] text-[var(--color-foreground)]">
            <DialogHeader>
              <DialogTitle>
                {editingBooking ? "Reschedule Booking" : "Book a Class"}
              </DialogTitle>
            </DialogHeader>

            <BookingForm
              onSubmit={handleSubmit}
              defaultValues={
                editingBooking
                  ? {
                      classId: (editingBooking.classId as any)?._id || "",
                      trainerId: (editingBooking.trainerId as any)?._id || "",
                      facilityId: (editingBooking.facilityId as any)?._id || "",
                      classType: editingBooking.classType || "",
                      scheduledDate: editingBooking.scheduledDate || "",
                      fee: editingBooking.fee || 0,
                    }
                  : undefined
              }
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Not logged in */}
      {!isAuthenticated && !isLoading && (
        <Card>
          <CardContent className="py-6 text-sm text-red-600">
            You must be logged in as a member to view bookings.
          </CardContent>
        </Card>
      )}

      

      {/* Booking Table */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming & Past Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingTable
            bookings={bookings}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}
