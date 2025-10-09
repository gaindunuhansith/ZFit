"use client";

import { useState, useEffect, useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
  format,
  addMonths,
  subMonths,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface Booking {
  _id: string;
  memberName: string;
  className: string;
  scheduledDate: string; // ISO string
  status: string;
}

export default function FullPageCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState<Booking[]>([]);

  // Fetch bookings
  useEffect(() => {
    setLoading(true);
    fetch("/api/bookings") // adjust your API endpoint
      .then((res) => res.json())
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  // Map bookings by date for easy access
  const dateBookings = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    (bookings || []).forEach((b) => {
      if (!b.scheduledDate) return;
      const date = b.scheduledDate.split("T")[0];
      if (!map[date]) map[date] = [];
      map[date].push(b);
    });
    return map;
  }, [bookings]);

  const handleDateClick = (day: Date) => {
    const key = format(day, "yyyy-MM-dd");
    setSelectedBookings(dateBookings[key] || []);
    setSelectedDate(day);
    setDialogOpen(true);
  };

  const handleReschedule = (booking: Booking) => {
    const newDate = prompt("Enter new date (YYYY-MM-DD):", booking.scheduledDate.slice(0,10));
    if (!newDate) return;
    fetch(`/api/bookings/${booking._id}/reschedule`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduledDate: newDate }),
    }).then(() => {
      setBookings((prev) =>
        prev.map((b) =>
          b._id === booking._id ? { ...b, scheduledDate: newDate } : b
        )
      );
      alert("Rescheduled successfully");
    });
  };

  const handleCancel = (booking: Booking) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    fetch(`/api/bookings/${booking._id}/cancel`, { method: "PATCH" }).then(() => {
      setBookings((prev) =>
        prev.map((b) =>
          b._id === booking._id ? { ...b, status: "cancelled" } : b
        )
      );
      alert("Booking cancelled");
    });
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center p-4 bg-card text-card-foreground">
      <Button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>Prev</Button>
      <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
      <Button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>Next</Button>
    </div>
  );

  const renderWeekDays = () => (
    <div className="grid grid-cols-7 text-center text-muted-foreground border-b border-border">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day} className="py-2 font-semibold">{day}</div>
      ))}
    </div>
  );

  const generateCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    const totalRows = 6;
    const headerHeight = 64;
    const weekdaysHeight = 32;
    const dayHeight = `calc((100vh - ${headerHeight + weekdaysHeight}px) / ${totalRows})`;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const key = format(day, "yyyy-MM-dd");
        const dayBookings = dateBookings[key] || [];

        days.push(
          <div
            key={day.toString()}
            className={`flex flex-col justify-center items-center border border-border cursor-pointer
              ${isSameMonth(day, monthStart) ? "bg-card text-card-foreground" : "bg-background text-muted-foreground"}
              ${selectedDate && isSameDay(day, selectedDate) ? "border-2 border-ring" : ""}`}
            style={{ height: dayHeight, borderRadius: "var(--radius)" }}
            onClick={() => handleDateClick(day)}
          >
            <span className="text-lg font-semibold">{format(day, "d")}</span>
            <div className="flex space-x-1 mt-1">
              {dayBookings.slice(0, 3).map((b, i) => (
                <span key={i} className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
              ))}
              {dayBookings.length > 3 && <span className="h-3 w-3 rounded-full bg-muted" />}
            </div>
          </div>
        );

        day = addDays(day, 1);
      }
      rows.push(<div key={day.toString()} className="flex w-full">{days}</div>);
      days = [];
    }

    return rows;
  };

  return (
    <div className="min-h-screen min-w-screen bg-background text-foreground flex flex-col p-4">
      {renderHeader()}
      {renderWeekDays()}
      <div className="flex-1">{loading ? <p>Loading...</p> : generateCalendar()}</div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              Bookings on {selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
            </DialogTitle>
          </DialogHeader>
          <Card>
            <CardHeader>
              <CardTitle>Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedBookings.length === 0 ? (
                <p>No bookings on this date.</p>
              ) : (
                <table className="w-full table-auto border border-border">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1">Member</th>
                      <th className="border px-2 py-1">Class</th>
                      <th className="border px-2 py-1">Date</th>
                      <th className="border px-2 py-1">Status</th>
                      <th className="border px-2 py-1">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBookings.map((b) => (
                      <tr key={b._id}>
                        <td className="border px-2 py-1">{b.memberName}</td>
                        <td className="border px-2 py-1">{b.className}</td>
                        <td className="border px-2 py-1">{b.scheduledDate.slice(0,10)}</td>
                        <td className="border px-2 py-1">{b.status}</td>
                        <td className="border px-2 py-1 space-x-2">
                          {b.status !== "cancelled" && (
                            <>
                              <Button size="sm" onClick={() => handleReschedule(b)}>Reschedule</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleCancel(b)}>Cancel</Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
