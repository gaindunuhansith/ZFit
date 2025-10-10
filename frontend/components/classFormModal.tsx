"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { z, ZodError } from "zod";

// Zod Validation schema
const classFormSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  type: z.string().min(1, "Class type is required"),
  duration: z.number().min(40, "Duration must be at least 40 minutes").max(180, "Duration cannot exceed 180 minutes"),
  maxCapacity: z.number().min(1, "Capacity must be at least 1").max(20, "Capacity cannot exceed 20"),
  price: z.number().min(0, "Price cannot be negative"),
  status: z.enum(["active", "inactive"]),
  notes: z.string().max(1000).optional(),
});

type ClassFormData = z.infer<typeof classFormSchema>;

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClassFormData) => Promise<void>;
  initialData?: Partial<ClassFormData>;
  mode: "add" | "edit";
  title: string;
}

const CLASS_TYPES = ["yoga", "pilates", "zumba", "spinning", "crossfit", "strength", "cardio", "other"];
const STATUS_TYPES = ["active", "inactive"];

export default function ClassFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  title,
}: ClassFormModalProps) {
  const [formData, setFormData] = useState<ClassFormData>({
    name: "",
    type: "",
    duration: 40,
    maxCapacity: 20,
    price: 0,
    status: "active",
    notes: "",
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) setFormData((prev) => ({ ...prev, ...initialData }));
    setErrors({});
  }, [initialData, isOpen]);

  const handleInputChange = (field: keyof ClassFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    try {
      classFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        const zodErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          const path = issue.path.join(".");
          zodErrors[path] = issue.message;
        });
        setErrors(zodErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error("Failed to submit class form", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Fill in the details to create a new class." : "Update the class information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Class Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Class Name</Label>
            <div className="col-span-3">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>
          </div>

          {/* Class Type */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <div className="col-span-3">
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger className={`w-full border rounded-md p-2 ${errors.type ? "border-red-500 bg-red-50 text-red-700" : "bg-white text-gray-900"}`}>
                  <SelectValue placeholder="Select Class Type" />
                </SelectTrigger>
                <SelectContent>
                  {CLASS_TYPES.map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="hover:bg-blue-500 hover:text-white"
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type}</p>}
            </div>
          </div>

          {/* Duration */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">Duration (minutes)</Label>
            <div className="col-span-3">
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", Number(e.target.value))}
                className={errors.duration ? "border-red-500" : ""}
              />
              {errors.duration && <p className="text-sm text-red-500 mt-1">{errors.duration}</p>}
            </div>
          </div>

          {/* Max Capacity */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maxCapacity" className="text-right">Max Capacity</Label>
            <div className="col-span-3">
              <Input
                id="maxCapacity"
                type="number"
                value={formData.maxCapacity}
                onChange={(e) => handleInputChange("maxCapacity", Number(e.target.value))}
                className={errors.maxCapacity ? "border-red-500" : ""}
              />
              {errors.maxCapacity && <p className="text-sm text-red-500 mt-1">{errors.maxCapacity}</p>}
            </div>
          </div>

          {/* Price */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Fee (LKR)</Label>
            <div className="col-span-3">
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", Number(e.target.value))}
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <div className="col-span-3">
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value as "active" | "inactive")}>
                <SelectTrigger className="w-full border rounded-md p-2 bg-white text-gray-900">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_TYPES.map((status) => (
                    <SelectItem key={status} value={status} className={`px-2 py-1 rounded text-sm ${status === "active" ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">Notes</Label>
            <div className="col-span-3">
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : mode === "add" ? "Create" : "Update"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
