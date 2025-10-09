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

interface IClass {
  _id: string;
  name: string;
  type: string;
  duration: number;
  maxCapacity: number;
  price: number;
  status: string;
  createdAt: string;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<IClass[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<IClass | null>(null);
  const [form, setForm] = useState<Partial<IClass>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch all classes
  useEffect(() => {
    fetch("http://localhost:5000/api/v1/Booking/class")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setClasses(data.data);
          setFilteredClasses(data.data);
        }
      })
      .catch((err) => console.error("Error fetching classes:", err));
  }, []);

  // Filtering logic
  useEffect(() => {
    let results = classes;

    if (searchTerm.trim()) {
      results = results.filter(
        (cls) =>
          cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cls.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      results = results.filter(
        (cls) => cls.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredClasses(results);
  }, [searchTerm, statusFilter, classes]);

  // Open form for Add/Edit
  const handleOpen = (cls?: IClass) => {
    setEditing(cls || null);
    setForm(cls || {});
    setOpen(true);
  };

  // Save class
  const handleSave = async () => {
    try {
      const url = editing
        ? `http://localhost:5000/api/v1/Booking/class/${editing._id}`
        : "http://localhost:5000/api/v1/Booking/class";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        if (editing) {
          setClasses((prev) =>
            prev.map((c) => (c._id === editing._id ? data.data : c))
          );
        } else {
          setClasses((prev) => [...prev, data.data]);
        }
        setOpen(false);
      }
    } catch (err) {
      console.error("Error saving class:", err);
    }
  };

  // Delete class
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/Booking/class/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setClasses((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      console.error("Error deleting class:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Classes</h1>
        <div className="flex items-center gap-3">
          <Input
            placeholder="🔍 Search by name or type..."
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
  <SelectContent >
    <SelectItem value="all" className="text-foreground">All</SelectItem>
    <SelectItem value="active" className="text-foreground">Active</SelectItem>
    <SelectItem value="inactive" className="text-foreground">Inactive</SelectItem>
  </SelectContent>
</Select>

          <Button onClick={() => handleOpen()}>+ Add Class</Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Fee (LKR)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClasses.length > 0 ? (
              filteredClasses.map((cls) => (
                <TableRow key={cls._id}>
                  <TableCell>{cls.name}</TableCell>
                  <TableCell>{cls.type}</TableCell>
                  <TableCell>{cls.duration} min</TableCell>
                  <TableCell>{cls.maxCapacity}</TableCell>
                  <TableCell>LKR {cls.price}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        cls.status === "active"
                          ? "bg-green-500 text-white"
                          : cls.status === "inactive"
                          ? "bg-gray-400 text-white"
                          : "bg-yellow-500 text-white"
                      }`}
                    >
                      {cls.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(cls.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpen(cls)}
                    >
                      ✏️
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(cls._id)}
                    >
                      🗑️
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  No classes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Class" : "Add Class"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Class Name"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Type"
              value={form.type || ""}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />
            <Input
              placeholder="Duration (minutes)"
              type="number"
              min={40}
              max={180}
              value={form.duration || ""}
              onChange={(e) =>
                setForm({ ...form, duration: Number(e.target.value) })
              }
            />
            <Input
              placeholder="Max Capacity"
              type="number"
              min={1}
              max={20}
              value={form.maxCapacity || ""}
              onChange={(e) =>
                setForm({ ...form, maxCapacity: Number(e.target.value) })
              }
            />
            <Input
              placeholder="Fee (LKR)"
              type="number"
              min={0}
              value={form.price || ""}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
            />
            <Input
              placeholder="Status"
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
