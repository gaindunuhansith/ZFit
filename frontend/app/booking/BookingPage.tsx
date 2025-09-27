"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Booking {
  _id: string;
  memberId: string;
  classId: string;
  trainerId: string;
  facilityId: string;
  scheduledDate: string;
  status: string;
}

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [form, setForm] = useState({
    memberId: "",
    classId: "",
    trainerId: "",
    facilityId: "",
    scheduledDate: "",
  });
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");

  // Fetch all bookings
  useEffect(() => {
    fetch("/api/bookings")
      .then(res => res.json())
      .then(data => setBookings(data.data || []))
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const newBooking = await res.json();
      setBookings([...bookings, newBooking.data]);
      setForm({ memberId: "", classId: "", trainerId: "", facilityId: "", scheduledDate: "" });
    }
  };

  const handleCancel = async (id: string) => {
    const res = await fetch(`/api/bookings/${id}/cancel`, { method: "PATCH" });
    if (res.ok) {
      const updated = await res.json();
      setBookings(bookings.map(b => (b._id === id ? updated.data : b)));
    }
  };

  const handleReschedule = async (id: string) => {
    if (!rescheduleDate) return;
    const res = await fetch(`/api/bookings/${id}/reschedule`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduledDate: rescheduleDate }),
    });
    if (res.ok) {
      const updated = await res.json();
      setBookings(bookings.map(b => (b._id === id ? updated.data : b)));
      setRescheduleId(null);
      setRescheduleDate("");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Booking Form */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-primary">Create Booking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="memberId">Member ID</Label>
            <Input id="memberId" name="memberId" value={form.memberId} onChange={handleChange} className="bg-input text-foreground" />
          </div>
          <div>
            <Label htmlFor="classId">Class ID</Label>
            <Input id="classId" name="classId" value={form.classId} onChange={handleChange} className="bg-input text-foreground" />
          </div>
          <div>
            <Label htmlFor="trainerId">Trainer ID</Label>
            <Input id="trainerId" name="trainerId" value={form.trainerId} onChange={handleChange} className="bg-input text-foreground" />
          </div>
          <div>
            <Label htmlFor="facilityId">Facility ID</Label>
            <Input id="facilityId" name="facilityId" value={form.facilityId} onChange={handleChange} className="bg-input text-foreground" />
          </div>
          <div>
            <Label htmlFor="scheduledDate">Scheduled Date</Label>
            <Input type="date" id="scheduledDate" name="scheduledDate" value={form.scheduledDate} onChange={handleChange} className="bg-input text-foreground" />
          </div>
          <Button onClick={handleCreate} className="bg-primary text-primary-foreground hover:opacity-90">
            Create Booking
          </Button>
        </CardContent>
      </Card>

      {/* Booking List */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-primary">Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left border-collapse">
            <thead className="text-muted-foreground">
              <tr>
                <th className="p-2 border-b border-border">Member</th>
                <th className="p-2 border-b border-border">Class</th>
                <th className="p-2 border-b border-border">Trainer</th>
                <th className="p-2 border-b border-border">Facility</th>
                <th className="p-2 border-b border-border">Date</th>
                <th className="p-2 border-b border-border">Status</th>
                <th className="p-2 border-b border-border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id} className="hover:bg-muted/50">
                  <td className="p-2">{b.memberId}</td>
                  <td className="p-2">{b.classId}</td>
                  <td className="p-2">{b.trainerId}</td>
                  <td className="p-2">{b.facilityId}</td>
                  <td className="p-2">{new Date(b.scheduledDate).toLocaleDateString()}</td>
                  <td className="p-2 text-primary">{b.status}</td>
                  <td className="p-2 space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleCancel(b._id)}
                      className="bg-destructive text-white hover:opacity-90"
                    >
                      Cancel
                    </Button>
                    {rescheduleId === b._id ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="date"
                          value={rescheduleDate}
                          onChange={(e) => setRescheduleDate(e.target.value)}
                          className="bg-input text-foreground"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleReschedule(b._id)}
                          className="bg-primary text-primary-foreground hover:opacity-90"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRescheduleId(null)}
                          className="border-border text-muted-foreground"
                        >
                          X
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setRescheduleId(b._id)}
                        className="bg-primary text-primary-foreground hover:opacity-90"
                      >
                        Reschedule
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
