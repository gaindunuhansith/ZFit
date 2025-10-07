"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Facility {
  _id: string;
  name: string;
  capacity: number;
  equipmentCount: number;
  status: string;
  createdAt: string;
}

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Facility | null>(null);
  const [form, setForm] = useState<Partial<Facility>>({});

  // Fetch facilities
  useEffect(() => {
    fetch("http://localhost:5000/api/v1/bookings/facilities")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setFacilities(data.data);
      })
      .catch((err) => console.error("Error fetching facilities:", err));
  }, []);

  const handleOpen = (facility?: Facility) => {
    setEditing(facility || null);
    setForm(facility || {});
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        // Update
        const res = await fetch(
          `http://localhost:5000/api/v1/bookings/facilities/${editing._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          }
        );
        const data = await res.json();
        if (data.success) {
          setFacilities((prev) =>
            prev.map((f) => (f._id === editing._id ? data.data : f))
          );
        }
      } else {
        // Create
        const res = await fetch("http://localhost:5000/api/v1/bookings/facilities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          setFacilities((prev) => [...prev, data.data]);
        }
      }
      setOpen(false);
    } catch (err) {
      console.error("Error saving facility:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/bookings/facilities/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) {
        setFacilities((prev) => prev.filter((f) => f._id !== id));
      }
    } catch (err) {
      console.error("Error deleting facility:", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Facilities</h1>
        <Button onClick={() => handleOpen()}>+ Add Facility</Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Equipment Count</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {facilities.map((f) => (
            <TableRow key={f._id}>
              <TableCell>{f.name}</TableCell>
              <TableCell>{f.capacity}</TableCell>
              <TableCell>{f.equipmentCount}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-white text-xs ${
                    f.status === "available" ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  {f.status}
                </span>
              </TableCell>
              <TableCell>{new Date(f.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => handleOpen(f)}>
                  ✏️
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(f._id)}
                >
                  🗑️
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Facility" : "Add Facility"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Facility Name"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Capacity"
              type="number"
              min={1}
              value={form.capacity || ""}
              onChange={(e) =>
                setForm({ ...form, capacity: Number(e.target.value) })
              }
            />
            <Input
              placeholder="Equipment Count"
              type="number"
              min={0}
              value={form.equipmentCount || ""}
              onChange={(e) =>
                setForm({ ...form, equipmentCount: Number(e.target.value) })
              }
            />
            <Input
              placeholder="Status (available/unavailable)"
              value={form.status || ""}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editing ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
