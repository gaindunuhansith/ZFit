"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export interface BookingFormInput {
  classId: string;
  trainerId: string;
  facilityId: string;
  classType: string;
  scheduledDate: string;
  fee: number;
}

interface ClassItem { _id: string; name: string; classTypes: string[]; price: number; }
interface Trainer { _id: string; name: string; }
interface Facility { _id: string; name: string; }

interface Props {
  onSubmit: (form: BookingFormInput) => void;
  defaultValues?: Partial<BookingFormInput>;
}

export default function BookingForm({ onSubmit, defaultValues }: Props) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [form, setForm] = useState<BookingFormInput>({
    classId: defaultValues?.classId || "",
    trainerId: defaultValues?.trainerId || "",
    facilityId: defaultValues?.facilityId || "",
    classType: defaultValues?.classType || "",
    scheduledDate: defaultValues?.scheduledDate || "",
    fee: defaultValues?.fee || 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const [clsRes, trnRes, facRes] = await Promise.all([
          fetch("http://localhost:5000/api/v1/classes"),
          fetch("http://localhost:5000/api/v1/trainers"),
          fetch("http://localhost:5000/api/v1/facilities"),
        ]);
        const [cls, trn, fac] = await Promise.all([clsRes.json(), trnRes.json(), facRes.json()]);
        setClasses(cls.data || []);
        setTrainers(trn.data || []);
        setFacilities(fac.data || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    })();
  }, []);

  const handleClassChange = (id: string) => {
    const selected = classes.find(c => c._id === id);
    setForm(prev => ({
      ...prev,
      classId: id,
      classType: selected?.classTypes[0] || "",
      fee: selected?.price || 0
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Class</Label>
        <Select value={form.classId} onValueChange={handleClassChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Class Type</Label>
        <Select value={form.classType} onValueChange={v => setForm({...form, classType: v})}>
          <SelectTrigger><SelectValue placeholder="Select class type" /></SelectTrigger>
          <SelectContent>
            {classes.find(c => c._id === form.classId)?.classTypes.map(ct => <SelectItem key={ct} value={ct}>{ct}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Trainer</Label>
        <Select value={form.trainerId} onValueChange={v => setForm({...form, trainerId: v})}>
          <SelectTrigger><SelectValue placeholder="Select trainer" /></SelectTrigger>
          <SelectContent>
            {trainers.map(t => <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Facility</Label>
        <Select value={form.facilityId} onValueChange={v => setForm({...form, facilityId: v})}>
          <SelectTrigger><SelectValue placeholder="Select facility" /></SelectTrigger>
          <SelectContent>
            {facilities.map(f => <SelectItem key={f._id} value={f._id}>{f.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Date</Label>
        <Input type="date" value={form.scheduledDate.split("T")[0] || ""} onChange={e => {
          const time = form.scheduledDate.split("T")[1] || "00:00";
          setForm({...form, scheduledDate: `${e.target.value}T${time}`});
        }} />
      </div>

      <div>
        <Label>Time</Label>
        <Input type="time" value={form.scheduledDate.split("T")[1]?.slice(0,5) || ""} onChange={e => {
          const datePart = form.scheduledDate.split("T")[0] || new Date().toISOString().split("T")[0];
          setForm({...form, scheduledDate: `${datePart}T${e.target.value}`});
        }} />
      </div>

      <div>
        <Label>Fee</Label>
        <Input type="number" value={form.fee} readOnly className="bg-gray-100" />
      </div>

      <Button type="submit" className="w-full">{defaultValues ? "Update Booking" : "Book Class"}</Button>
    </form>
  );
}
