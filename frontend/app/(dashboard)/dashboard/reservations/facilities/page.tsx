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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Facility | null>(null);
  const [form, setForm] = useState<Partial<Facility>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch facilities
  useEffect(() => {
    fetch("http://localhost:5000/api/v1/bookings/facilities")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFacilities(data.data);
          setFilteredFacilities(data.data);
        }
      })
      .catch((err) => console.error("Error fetching facilities:", err));
  }, []);

  // Filter + Search logic
  useEffect(() => {
    let filtered = facilities;

    if (searchTerm.trim()) {
      filtered = filtered.filter((f) =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (f) => f.status.toLowerCase() === statusFilter
      );
    }

    setFilteredFacilities(filtered);
  }, [searchTerm, statusFilter, facilities]);

  // Open Add/Edit dialog
  const handleOpen = (facility?: Facility) => {
    setEditing(facility || null);
    setForm(facility || {});
    setOpen(true);
  };

  // Save Facility
  const handleSave = async () => {
    try {
      const url = editing
        ? `http://localhost:5000/api/v1/bookings/facilities/${editing._id}`
        : "http://localhost:5000/api/v1/bookings/facilities";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        if (editing) {
          setFacilities((prev) =>
            prev.map((f) => (f._id === editing._id ? data.data : f))
          );
        } else {
          setFacilities((prev) => [...prev, data.data]);
        }
        setOpen(false);
      }
    } catch (err) {
      console.error("Error saving facility:", err);
    }
  };

  // Delete Facility
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/bookings/facilities/${id}`,
        { method: "DELETE" }
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
    <div className="p-6 space-y-6">
      {/* --- Header Section --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Manage Facilities</h1>

        <div className="flex items-center gap-3">
          <Input
            placeholder="🔍 Search by name..."
            className="w-56"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-40 bg-card text-foreground border border-border rounded-md focus:ring-2 focus:ring-primary">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => handleOpen()}>+ Add Facility</Button>
        </div>
      </div>

      {/* --- Table Section --- */}
      <div className="rounded-lg border shadow-sm overflow-hidden">
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
            {filteredFacilities.length > 0 ? (
              filteredFacilities.map((f) => (
                <TableRow key={f._id}>
                  <TableCell>{f.name}</TableCell>
                  <TableCell>{f.capacity}</TableCell>
                  <TableCell>{f.equipmentCount}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        f.status === "available"
                          ? "bg-green-500 text-white"
                          : f.status === "unavailable"
                          ? "bg-red-500 text-white"
                          : "bg-gray-400 text-white"
                      }`}
                    >
                      {f.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(f.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpen(f)}
                    >
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No facilities found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Dialog (Add/Edit Form) --- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Facility" : "Add Facility"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Facility Name"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Capacity"
              min={1}
              value={form.capacity || ""}
              onChange={(e) =>
                setForm({ ...form, capacity: Number(e.target.value) })
              }
            />
            <Input
              type="number"
              placeholder="Equipment Count"
              min={0}
              value={form.equipmentCount || ""}
              onChange={(e) =>
                setForm({ ...form, equipmentCount: Number(e.target.value) })
              }
            />

            <Select
              value={form.status || ""}
              onValueChange={(v) => setForm({ ...form, status: v })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>

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
