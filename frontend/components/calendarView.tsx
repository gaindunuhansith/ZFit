// components/CalendarView.tsx
"use client";
import { Booking } from "@/services/bookingApi";

interface CalendarViewProps {
  bookings: Booking[];
}

export default function CalendarView({ bookings }: CalendarViewProps) {
  const today = new Date().toISOString().slice(0, 10);
  const todayBookings = bookings.filter((b) => b.date === today);

  return (
    <div className="border p-4 rounded-md">
      <h2 className="font-bold mb-2">Today’s Bookings ({today})</h2>
      {todayBookings.length === 0 ? (
        <p className="text-sm text-muted-foreground">No bookings today</p>
      ) : (
        <ul className="list-disc pl-5">
          {todayBookings.map((b) => (
            <li key={b._id}>
              Class: {b.classId}, Trainer: {b.trainerId}, Facility: {b.facilityId}, Time: {b.time}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
