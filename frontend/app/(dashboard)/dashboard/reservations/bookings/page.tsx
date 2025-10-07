"use client";

import { useEffect, useMemo, useState } from "react";
import {
  bookingApi,
  Booking,
  ClassItem,
  Trainer,
  Facility,
} from "@/services/bookingApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BookingTable from "@/components/bookingTable";
import CalendarView from "@/components/calendarView";
import BookingForm, {BookingFormInput } from "@/components/bookingForm";

export default function AdminBookingsPage() {
  const [rows, setRows] = useState<Booking[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filter, setFilter] = useState("");
  const [date, setDate] = useState<string>("");

  // Modal state for Add Booking
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Fetch all data
  useEffect(() => {
    async function prime() {
      try {
        const [c, t, f, b] = await Promise.all([
          bookingApi.getClasses(),
          bookingApi.getTrainers(),
          bookingApi.getFacilities(),
          bookingApi.getAllBookings(),
        ]);
        setClasses(c);
        setTrainers(t);
        setFacilities(f);
        setRows(b);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    }
    void prime();
  }, []);

  // Filtered bookings
  const filtered = useMemo(() => {
    if (!filter && !date) return rows;
    const f = filter.toLowerCase();
    const classById = new Map(classes.map((c) => [c._id, c] as const));
    return rows.filter((b) => {
      const cn = classById.get(b.classId)?.name?.toLowerCase() || "";
      const matchText = !f || cn.includes(f) || b.time.includes(filter);
      const matchDate = !date || b.date === date;
      return matchText && matchDate;
    });
  }, [rows, classes, filter, date]);

  // Delete booking
  async function onDelete(b: Booking) {
    try {
      await bookingApi.deleteBooking(b._id);
      setRows((prev) => prev.filter((x) => x._id !== b._id));
    } catch (err) {
      console.error("Failed to delete booking", err);
    }
  }

  // Edit booking
  async function onEdit(b: Booking) {
    const nd = prompt("New date (YYYY-MM-DD)", b.date) || b.date;
    const nt = prompt("New time (HH:MM)", b.time) || b.time;
    try {
      const updated = await bookingApi.updateBooking(b._id, { date: nd, time: nt });
      setRows((prev) => prev.map((x) => (x._id === b._id ? updated : x)));
    } catch (err) {
      console.error("Failed to update booking", err);
    }
  }

  // Refresh bookings by date
  async function refreshByDate() {
    if (!date) return;
    try {
      const b = await bookingApi.getBookingsByDate(date);
      setRows(b);
    } catch (err) {
      console.error("Failed to fetch bookings by date", err);
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => { setFilter(""); setDate(""); }}>Reset</Button>
          <Button onClick={refreshByDate} disabled={!date}>Filter by date</Button>
          <Button onClick={() => setIsAddOpen(true)}>Add Booking</Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label>Search</Label>
              <Input
                placeholder="Search by class name or time"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader><CardTitle>All Bookings</CardTitle></CardHeader>
        <CardContent>
          <BookingTable bookings={filtered} onEdit={onEdit} onDelete={onDelete} />
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardHeader><CardTitle>Calendar</CardTitle></CardHeader>
        <CardContent>
          <CalendarView bookings={rows} />
        </CardContent>
      </Card>

      {/* Add Booking Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Add Booking</h2>
            <BookingForm
              onSubmit={async (data: BookingFormInput) => {
                try {
                  const newBooking = await bookingApi.addBooking(data);
                  setRows((prev) => [...prev, newBooking]);
                  setIsAddOpen(false);
                } catch (err) {
                  console.error("Failed to add booking", err);
                  alert("Failed to add booking");
                }
              }}
            />
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="mt-4">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
