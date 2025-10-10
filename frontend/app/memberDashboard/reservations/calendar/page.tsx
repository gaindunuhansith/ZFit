"use client";

import { useEffect, useState, useMemo } from "react";
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
  setMonth,
  setYear,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface Booking {
  _id: string;
  memberName: string;
  className: string;
  scheduledDate: string;
  fee?: number;
  status?: string;
}

export default function FullPageCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data || []))
      .catch((err) => console.error(err));
  }, []);

  const monthOptions = Array.from({ length: 12 }, (_, i) => i);
  const yearOptions = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  const handleReschedule = (b: Booking) => {
    const newDate = prompt("Enter new date (YYYY-MM-DD):", b.scheduledDate);
    if (!newDate) return;
    fetch(`/api/bookings/${b._id}/reschedule`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduledDate: newDate }),
    })
      .then(() => {
        setBookings((prev) =>
          prev.map((x) => (x._id === b._id ? { ...x, scheduledDate: newDate } : x))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleCancel = (b: Booking) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    fetch(`/api/bookings/${b._id}/cancel`, { method: "PATCH" })
      .then(() => {
        setBookings((prev) =>
          prev.map((x) => (x._id === b._id ? { ...x, status: "cancelled" } : x))
        );
      })
      .catch((err) => console.error(err));
  };

  const dateBookings = useMemo(
    () =>
      selectedDate
        ? bookings.filter((b) =>
            b.scheduledDate ? isSameDay(new Date(b.scheduledDate), selectedDate) : false
          )
        : [],
    [selectedDate, bookings]
  );

  const generateCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = [];
    let day = startDate;
    while (day <= endDate) {
      calendarDays.push(day);
      day = addDays(day, 1);
    }
    return calendarDays;
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 p-4 bg-card rounded-md">
        <div className="flex gap-2">
          <Button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            style={{ backgroundColor: "var(--accent)", color: "var(--foreground)" }}
          >
            Prev
          </Button>
          <Button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            style={{ backgroundColor: "var(--accent)", color: "var(--foreground)" }}
          >
            Next
          </Button>
        </div>
        <div className="flex gap-2">
          <select
            value={currentMonth.getMonth()}
            onChange={(e) =>
              setCurrentMonth(setMonth(currentMonth, Number(e.target.value)))
            }
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--foreground)",
              borderRadius: "var(--radius)",
              padding: "0.25rem 0.5rem",
            }}
          >
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {format(setMonth(new Date(), m), "MMMM")}
              </option>
            ))}
          </select>
          <select
            value={currentMonth.getFullYear()}
            onChange={(e) =>
              setCurrentMonth(setYear(currentMonth, Number(e.target.value)))
            }
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--foreground)",
              borderRadius: "var(--radius)",
              padding: "0.25rem 0.5rem",
            }}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center text-muted-foreground border-b border-border font-semibold">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-7 gap-1">
        {generateCalendar().map((day) => {
          const dayBookings = bookings.filter(
            (b) => b.scheduledDate && isSameDay(new Date(b.scheduledDate), day)
          );

          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const inMonth = isSameMonth(day, currentMonth);

          return (
            <div
              key={day.toString()}
              className={`flex flex-col justify-start items-center border border-border cursor-pointer p-1 rounded-md
                ${inMonth ? "bg-card text-card-foreground" : "bg-background text-muted-foreground"}
                ${isSelected ? "border-2 border-ring" : ""}`}
              style={{ minHeight: "100px" }}
              onClick={() => setSelectedDate(day)}
            >
              <span className="font-semibold">{format(day, "d")}</span>
              <div className="flex space-x-1 mt-1">
                {dayBookings.slice(0, 3).map((_, i) => (
                  <span
                    key={i}
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                ))}
                {dayBookings.length > 3 && (
                  <span className="h-3 w-3 rounded-full bg-muted" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Date Bookings */}
      {selectedDate && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>
              Bookings on {format(selectedDate, "MMMM d, yyyy")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dateBookings.length === 0 ? (
              <p>No bookings for this date.</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2">Member</th>
                    <th className="text-left p-2">Class</th>
                    <th className="text-left p-2">Fee</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dateBookings.map((b) => (
                    <tr key={b._id} className="border-b border-border">
                      <td className="p-2">{b.memberName}</td>
                      <td className="p-2">{b.className}</td>
                      <td className="p-2">{b.fee}</td>
                      <td className="p-2">{b.status}</td>
                      <td className="p-2 space-x-2">
                        <Button
                          size="sm"
                          style={{
                            backgroundColor: "var(--accent)",
                            color: "var(--foreground)",
                          }}
                          onClick={() => handleReschedule(b)}
                        >
                          Reschedule
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleCancel(b)}>
                          Cancel
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
