"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Trainer = {
  _id: string;
  name: string;
  specialization?: string;
  experience?: number;
  status?: string;
  createdAt: string;
};

export default function ManageTrainersPage() {
  const [rows, setRows] = useState<Trainer[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Trainer | null>(null);
  const [form, setForm] = useState<Partial<Trainer>>({
    name: "",
    specialization: "",
    experience: 1,
    status: "active",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Load trainers
  async function loadTrainers() {
    try {
      const res = await fetch("http://localhost:5000/api/v1/trainers");
      const json = await res.json();
      setRows(json.data || []);
    } catch (err) {
      console.error("Error fetching trainers:", err);
    }
  }

  useEffect(() => {
    void loadTrainers();
  }, []);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name) e.name = "Name is required";
    if ((form.experience ?? 0) < 0) e.experience = "Experience must be 0 or more";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit() {
    if (!validate()) return;

    const payload = {
      name: form.name,
      specialization: form.specialization,
      experience: form.experience,
      status: form.status,
      createdAt: editing ? form.createdAt : new Date().toISOString(),
    };

    try {
      if (editing) {
        await fetch(`http://localhost:5000/api/v1/trainers/${editing._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("http://localhost:5000/api/v1/trainers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setOpen(false);
      setEditing(null);
      setForm({ name: "", specialization: "", experience: 1, status: "active" });

      // Force reload after small delay (to ensure backend sync)
      await loadTrainers();
      setTimeout(loadTrainers, 300);
    } catch (err) {
      console.error("Error saving trainer:", err);
    }
  }

  async function remove(id: string) {
    try {
      await fetch(`http://localhost:5000/api/v1/trainers/${id}`, {
        method: "DELETE",
      });
      await loadTrainers();
    } catch (err) {
      console.error("Error deleting trainer:", err);
    }
  }

  // Filtered & searched trainers
  const filteredRows = rows
    .filter((t) => statusFilter === "all" || t.status === statusFilter)
    .filter(
      (t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        (t.specialization?.toLowerCase().includes(search.toLowerCase()) ?? false)
    );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Manage Trainers</h1>

        <Input
          placeholder="Search by name or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />

        <select
          className="border rounded px-2 py-1"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <Button
          onClick={() => {
            setForm({ name: "", specialization: "", experience: 1, status: "active" });
            setEditing(null);
            setOpen(true);
          }}
        >
          + Add Trainer
        </Button>
      </div>

      {/* Trainer Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trainer List</CardTitle>
        </CardHeader>
        <CardContent>
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
              {filteredRows.map((t) => (
                <TableRow key={t._id}>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.specialization}</TableCell>
                  <TableCell>{t.experience}</TableCell>
                  <TableCell>{t.status}</TableCell>
                  <TableCell>{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditing(t);
                        setForm({
                          name: t.name,
                          specialization: t.specialization,
                          experience: t.experience,
                          status: t.status,
                          createdAt: t.createdAt,
                        });
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => remove(t._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Trainer" : "Add Trainer"}</DialogTitle>
            <p className="text-sm text-gray-500">
              Fill out the details below to {editing ? "update" : "create"} a trainer profile.
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div>
              <Label>Specialization</Label>
              <Input
                value={form.specialization || ""}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              />
            </div>
            <div>
              <Label>Experience (years)</Label>
              <Input
                type="number"
                value={form.experience ?? 1}
                onChange={(e) => setForm({ ...form, experience: Number(e.target.value) })}
              />
              {errors.experience && (
                <p className="text-red-500 text-sm">{errors.experience}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={submit}>{editing ? "Update" : "Create"}</Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
