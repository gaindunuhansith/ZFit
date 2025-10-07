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
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<IClass | null>(null);
  const [form, setForm] = useState<Partial<IClass>>({});

  // Fetch classes
  useEffect(() => {
    fetch("http://localhost:5000/api/v1/classes")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setClasses(data.data);
      })
      .catch((err) => console.error("Error fetching classes:", err));
  }, []);

  const handleOpen = (cls?: IClass) => {
    setEditing(cls || null);
    setForm(cls || {});
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        // Update
        const res = await fetch(
          `http://localhost:5000/api/v1/classes/${editing._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          }
        );
        const data = await res.json();
        if (data.success) {
          setClasses((prev) =>
            prev.map((c) => (c._id === editing._id ? data.data : c))
          );
        }
      } else {
        // Create
        const res = await fetch("http://localhost:5000/api/v1/classes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          setClasses((prev) => [...prev, data.data]);
        }
      }
      setOpen(false);
    } catch (err) {
      console.error("Error saving class:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/classes/${id}`, {
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Classes</h1>
        <Button onClick={() => handleOpen()}>+ Add Class</Button>
      </div>

      {/* Table */}
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
          {classes.map((cls) => (
            <TableRow key={cls._id}>
              <TableCell>{cls.name}</TableCell>
              <TableCell>{cls.type}</TableCell>
              <TableCell>{cls.duration} min</TableCell>
              <TableCell>{cls.maxCapacity}</TableCell>
              <TableCell>LKR {cls.price}</TableCell>
              <TableCell>
                <span className="px-2 py-1 rounded bg-green-600 text-white text-xs">
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
          ))}
        </TableBody>
      </Table>

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
