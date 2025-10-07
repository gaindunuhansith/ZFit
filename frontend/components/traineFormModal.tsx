// components/AddTrainerModal.tsx
"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface AddTrainerModalProps {
  onAdd: (data: { name: string; experience: number }) => Promise<void>;
}

export default function AddTrainerModal({ onAdd }: AddTrainerModalProps) {
  const [name, setName] = useState("");
  const [experience, setExperience] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name) return alert("Trainer name is required");
    if (experience <= 0) return alert("Experience must be greater than 0");

    setLoading(true);
    try {
      await onAdd({ name, experience });
      setName("");
      setExperience(1);
    } catch (err) {
      console.error("Failed to add trainer", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Add Trainer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <Label>Experience (years)</Label>
          <Input
            type="number"
            value={experience}
            onChange={e => setExperience(Number(e.target.value))}
          />
        </div>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Adding..." : "Add Trainer"}
        </Button>
      </CardContent>
    </Card>
  );
}
