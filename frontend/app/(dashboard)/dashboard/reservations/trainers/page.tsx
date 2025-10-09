"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type Trainer = {
  _id: string;
  name: string;
  specialization?: string;
  experience?: number;
  status?: string;
  createdAt: string;
};

export default function ManageTrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [filteredTrainers, setFilteredTrainers] = useState<Trainer[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Trainer | null>(null);
  const [form, setForm] = useState<Partial<Trainer>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Fetch trainers
  useEffect(() => {
    fetch("http://localhost:5000/api/v1/trainers")
      .then((res) => res.json())
      .then((data) => {
        setTrainers(data.data || []);
        setFilteredTrainers(data.data || []);
      })
      .catch((err) => console.error("Error fetching trainers:", err));
  }, []);

  // Filter & search logic
  useEffect(() => {
    let results = trainers;

    if (searchTerm.trim()) {
      results = results.filter(
        (t) =>
          t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (t.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      );
    }

    if (statusFilter !== "all") {
      results = results.filter((t) => t.status?.toLowerCase() === statusFilter);
    }

    setFilteredTrainers(results);
  }, [searchTerm, statusFilter, trainers]);

  // Open dialog for Add/Edit
  const handleOpen = (t?: Trainer) => {
    setEditing(t || null);
    setForm(t || {});
    setOpen(true);
  };

  // Save trainer
  const handleSave = async () => {
    try {
      const url = editing
        ? `http://localhost:5000/api/v1/trainers/${editing._id}`
        : "http://localhost:5000/api/v1/trainers";
      const method = editing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          createdAt: editing ? form.createdAt : new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (editing) {
          setTrainers((prev) =>
            prev.map((tr) => (tr._id === editing._id ? data.data : tr))
          );
        } else {
          setTrainers((prev) => [...prev, data.data]);
        }
        setOpen(false);
      }
    } catch (err) {
      console.error("Error saving trainer:", err);
    }
  };

  // Delete trainer
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/trainers/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setTrainers((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (err) {
      console.error("Error deleting trainer:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with search, filter, add button */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Manage Trainers</h1>
        <div className="flex items-center gap-3">
          <Input
            placeholder="🔍 Search by name or specialization..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => handleOpen()}>+ Add Trainer</Button>
        </div>
      </div>

      {/* Trainer Table */}
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrainers.length > 0 ? (
              filteredTrainers.map((t) => (
                <TableRow key={t._id}>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.specialization}</TableCell>
                  <TableCell>{t.experience}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        t.status === "active"
                          ? "bg-green-500 text-white"
                          : t.status === "inactive"
                          ? "bg-gray-400 text-white"
                          : "bg-yellow-500 text-white"
                      }`}
                    >
                      {t.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(t.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpen(t)}>
                      ✏️
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(t._id)}>
                      🗑️
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No trainers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Trainer Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Trainer" : "Add Trainer"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Name"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Specialization"
              value={form.specialization || ""}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Experience"
              min={0}
              value={form.experience || 0}
              onChange={(e) => setForm({ ...form, experience: Number(e.target.value) })}
            />
            <Input
              placeholder="Status"
              value={form.status || ""}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>{editing ? "Update" : "Save"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
