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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import TrainerFormModal from "@/components/trainerFormModal";
import { toast } from "sonner";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Fetch trainers
  const refreshData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/bookings/trainers");
      const data = await res.json();
      if (data.success) {
        setTrainers(data.data);
        setFilteredTrainers(data.data);
      }
    } catch (err) {
      console.error("Error fetching trainers:", err);
    }
  };

  useEffect(() => {
    refreshData();
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

  // Open form for Add/Edit
  const handleOpen = (trainer?: Trainer) => {
    setEditing(trainer || null);
    setOpen(true);
  };

  // Delete trainer
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trainer?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/v1/bookings/trainers/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setTrainers((prev) => prev.filter((t) => t._id !== id));
        toast.success("Trainer deleted!");
      } else {
        toast.error(data.message || "Failed to delete trainer");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete trainer");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Manage Trainers</h1>
        <div className="flex items-center gap-3">
          <Input
            placeholder="🔍 Search by name or specialization..."
            className="w-56"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                          : "bg-gray-400 text-white"
                      }`}
                    >
                      {t.status}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(t.createdAt).toLocaleDateString()}</TableCell>
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

      {/* Add/Edit Trainer Modal */}
      <TrainerFormModal
        isOpen={open}
        onClose={() => setOpen(false)}
        initialData={editing || undefined}
        mode={editing ? "edit" : "add"}
        title={editing ? "Edit Trainer" : "Add Trainer"}
        onSubmit={async (data) => {
          try {
            const url = editing
              ? `http://localhost:5000/api/v1/bookings/trainers/${editing._id}`
              : "http://localhost:5000/api/v1/bookings/trainers";
            const method = editing ? "PATCH" : "POST";

            const res = await fetch(url, {
              method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...data,
                createdAt: editing ? data.createdAt : new Date().toISOString(),
              }),
            });

            const resData = await res.json();
            if (resData.success) {
              await refreshData();
              toast.success(editing ? "Trainer updated!" : "Trainer added!");
            } else {
              toast.error(resData.message || "Failed to save trainer");
            }
          } catch (err) {
            console.error(err);
            toast.error("Failed to save trainer");
          }
        }}
      />
    </div>
  );
}
