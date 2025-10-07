// components/AddFacilityModal.tsx
"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface AddFacilityModalProps {
  onAdd: (data: { name: string; equipmentCount?: number }) => Promise<void>;
}

export default function AddFacilityModal({ onAdd }: AddFacilityModalProps) {
  const [name, setName] = useState("");
  const [equipmentCount, setEquipmentCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name) return alert("Facility name is required");
    if (equipmentCount < 0) return alert("Equipment count cannot be negative");

    setLoading(true);
    try {
      await onAdd({ name, equipmentCount });
      setName("");
      setEquipmentCount(0);
    } catch (err) {
      console.error("Failed to add facility", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Add Facility</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <Label>Equipment Count</Label>
          <Input
            type="number"
            value={equipmentCount}
            onChange={e => setEquipmentCount(Number(e.target.value))}
          />
        </div>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Adding..." : "Add Facility"}
        </Button>
      </CardContent>
    </Card>
  );
}
