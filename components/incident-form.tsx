// components/incident-form.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { X } from "lucide-react";
import { Incident } from "@/types";

interface IncidentFormProps {
  onAdd: (incident: Incident) => void;
}

export function IncidentForm({ onAdd }: IncidentFormProps) {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [action, setAction] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !location || !time || !action) return;

    onAdd({
      id: crypto.randomUUID(),
      description,
      location,
      time,
      action,
    });

    // Reset form
    setDescription("");
    setLocation("");
    setTime("");
    setAction("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the incident"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Incident location"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Time</label>
          <Input
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Action Taken</label>
        <Textarea
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="Describe the action taken"
          required
        />
      </div>

      <Button type="submit">Add Incident</Button>
    </form>
  );
}
