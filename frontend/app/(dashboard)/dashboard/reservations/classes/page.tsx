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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import ClassFormModal from "@/components/classFormModal";
import { toast } from "sonner";

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

const CLASS_TYPES = ["yoga","pilates","zumba","spinning","crossfit","strength","cardio","other"];
const STATUS_TYPES = ["active","inactive"];

export default function ClassesPage() {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<IClass[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<IClass | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch all classes
  const fetchClasses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/bookings/classes");
      const data = await res.json();
      if (data.success) {
        setClasses(data.data);
        setFilteredClasses(data.data);
      }
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  useEffect(() => {
    fetchClasses();
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

  // Open modal
  const handleOpen = (cls?: IClass) => {
    setEditing(cls || null);
    setOpen(true);
  };

  // Save class from modal
  const handleSave = async (data: any) => {
    try {
      const url = editing
        ? `http://localhost:5000/api/v1/bookings/classes/${editing._id}`
        : "http://localhost:5000/api/v1/bookings/classes";

      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success) {
        if (editing) {
          setClasses((prev) =>
            prev.map((c) => (c._id === editing._id ? result.data : c))
          );
          toast.success("Class updated successfully!");
        } else {
          setClasses((prev) => [...prev, result.data]);
          toast.success("Class added successfully!");
        }
        setOpen(false);
      } else {
        toast.error("Failed to save class!");
      }

      await refreshData();
      
    } catch (err) {
      console.error(err);
      toast.error("Error saving class!");
    }
  };

  // Delete class
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/v1/bookings/classes/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setClasses((prev) => prev.filter((c) => c._id !== id));
        toast.success("Class deleted successfully!");
      }

      await refreshData();
      
    } catch (err) {
      console.error(err);
      toast.error("Error deleting class!");
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-card text-foreground border border-border rounded-md focus:ring-2 focus:ring-primary">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {STATUS_TYPES.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
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
                          : "bg-gray-400 text-white"
                      }`}
                    >
                      {cls.status}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(cls.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleOpen(cls)}>✏️</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(cls._id)}>🗑️</Button>
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

      {/* Modal */}
      <ClassFormModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSave}
        initialData={editing || undefined}
        mode={editing ? "edit" : "add"}
        title={editing ? "Edit Class" : "Add Class"}
      />
    </div>
  );
}
function refreshData() {
  throw new Error("Function not implemented.");
}

