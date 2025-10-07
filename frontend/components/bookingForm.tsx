// components/BookingForm.tsx
"use client";
import { useState, useEffect } from "react";
import { ClassItem, Trainer, Facility } from "@/services/bookingApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface BookingFormInput {
  classId: string;
  trainerId: string;
  facilityId: string;
  scheduledDate: string;
  scheduledTime: string;
}

interface BookingFormProps {
  onSubmit: (data: BookingFormInput) => void;
}

export default function BookingForm({ onSubmit }: BookingFormProps) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [form, setForm] = useState<BookingFormInput>({
    classId: "",
    trainerId: "",
    facilityId: "",
    scheduledDate: "",
    scheduledTime: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/bookings/classes").then(res => res.json()).then(data => setClasses(data.data || []));
    fetch("http://localhost:5000/api/v1/bookings/trainers").then(res => res.json()).then(data => setTrainers(data.data || []));
    fetch("http://localhost:5000/api/v1/bookings/facilities").then(res => res.json()).then(data => setFacilities(data.data || []));
  }, []);

  const validate = () => {
    const err: Record<string, string> = {};
    const selectedClass = classes.find(c => c._id === form.classId);
    if (!form.classId) err.classId = "Select class";
    // Class validations
    if (selectedClass) {
      if (typeof selectedClass.maxCapacity === "number") {
        if (selectedClass.maxCapacity <= 0) err.classId = "Seats must be > 0";
        if (selectedClass.maxCapacity > 20) err.classId = "Seats cannot exceed 20";
      }
      if (typeof selectedClass.duration === "number" && selectedClass.duration < 40) {
        err.classId = "Duration must be ≥ 40 minutes";
      }
      if (typeof selectedClass.price === "number" && selectedClass.price <= 0) {
        err.classId = "Fee must be > 0";
      }
    }

    const selectedTrainer = trainers.find(t => t._id === form.trainerId);
    if (!form.trainerId) err.trainerId = "Select trainer";
    if (selectedTrainer && typeof (selectedTrainer as any).experience === "number" && (selectedTrainer as any).experience <= 0) {
      err.trainerId = "Trainer experience must be > 0";
    }

    const selectedFacility = facilities.find(f => f._id === form.facilityId);
    if (!form.facilityId) err.facilityId = "Select facility";
    const equipmentCount = selectedFacility ? ("equipmentCount" in selectedFacility ? (selectedFacility as any).equipmentCount : (selectedFacility.equipments?.length ?? 0)) : 0;
    if (selectedFacility && equipmentCount < 0) {
      err.facilityId = "Equipment count cannot be negative";
    }

    if (!form.scheduledDate) err.scheduledDate = "Select date";
    if (!form.scheduledTime) err.scheduledTime = "Select time";
    const scheduled = new Date(`${form.scheduledDate}T${form.scheduledTime}`);
    if (isFinite(scheduled.getTime()) && scheduled <= new Date()) err.scheduledDate = "Booking must be in future";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <Card>
      <CardHeader><CardTitle>Book a Class</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Class</Label>
            <select value={form.classId} onChange={e => setForm({ ...form, classId: e.target.value })} className="w-full border rounded px-3 py-2">
              <option value="">Select Class</option>
              {classes.map(c => <option key={c._id} value={c._id}>{c.name} (Seats: {c.maxCapacity})</option>)}
            </select>
            {form.classId && <p className="text-xs text-muted-foreground mt-1">Selected Class ID: {form.classId}</p>}
            {errors.classId && <p className="text-red-500 text-sm">{errors.classId}</p>}
          </div>

          <div>
            <Label>Trainer</Label>
            <select value={form.trainerId} onChange={e => setForm({ ...form, trainerId: e.target.value })} className="w-full border rounded px-3 py-2">
              <option value="">Select Trainer</option>
              {trainers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
            {form.trainerId && <p className="text-xs text-muted-foreground mt-1">Selected Trainer ID: {form.trainerId}</p>}
            {errors.trainerId && <p className="text-red-500 text-sm">{errors.trainerId}</p>}
          </div>

          <div>
            <Label>Facility</Label>
            <select value={form.facilityId} onChange={e => setForm({ ...form, facilityId: e.target.value })} className="w-full border rounded px-3 py-2">
              <option value="">Select Facility</option>
              {facilities.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
            </select>
            {form.facilityId && <p className="text-xs text-muted-foreground mt-1">Selected Facility ID: {form.facilityId}</p>}
            {errors.facilityId && <p className="text-red-500 text-sm">{errors.facilityId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <Input type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: (e.target as HTMLInputElement).value })} />
              {errors.scheduledDate && <p className="text-red-500 text-sm">{errors.scheduledDate}</p>}
              {form.scheduledDate && (
                <p className="text-xs text-muted-foreground mt-1">Cancellation deadline: {new Date(`${form.scheduledDate}T00:00:00`).toISOString().slice(0,16).replace("T"," ")}</p>
              )}
            </div>
            <div>
              <Label>Time</Label>
              <Input type="time" value={form.scheduledTime} onChange={(e) => setForm({ ...form, scheduledTime: (e.target as HTMLInputElement).value })} />
              {errors.scheduledTime && <p className="text-red-500 text-sm">{errors.scheduledTime}</p>}
            </div>
          </div>

          <Button type="submit">Book Class</Button>
        </form>
      </CardContent>
    </Card>
  );
}
