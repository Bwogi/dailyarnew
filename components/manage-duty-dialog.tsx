// components/manage-duty-dialog.tsx
"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { DutyLog, Incident } from "@/types";

interface ManageDutyDialogProps {
  duty: DutyLog;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onDutyUpdate: () => void;
}

export function ManageDutyDialog({
  duty,
  open,
  onOpenChange,
  onDutyUpdate,
}: ManageDutyDialogProps) {
  const [incidents, setIncidents] = useState<Incident[]>(duty.incidents || []);
  const [isLoading, setIsLoading] = useState(false);
  const [incidentData, setIncidentData] = useState({
    description: "",
    location: "",
    time: new Date().toISOString().slice(0, 16), // Set current date/time as default
    action: "",
  });
  const { toast } = useToast();

  // Update local incidents when duty.incidents changes
  useEffect(() => {
    setIncidents(duty.incidents || []);
  }, [duty.incidents]);

  const handleAddIncident = async () => {
    if (
      !incidentData.description ||
      !incidentData.location ||
      !incidentData.time ||
      !incidentData.action
    ) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all incident fields",
      });
      return;
    }

    setIsLoading(true);
    const newIncident: Incident = {
      id: crypto.randomUUID(),
      ...incidentData,
    };

    try {
      const response = await fetch("/api/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: duty.name,
          type: "add-incident",
          incident: newIncident,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIncidentData({
          description: "",
          location: "",
          time: new Date().toISOString().slice(0, 16),
          action: "",
        });

        toast({
          title: "Success",
          description: "Incident added successfully",
        });

        onDutyUpdate(); // Refresh the table to show updated incident count
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add incident",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveIncident = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: duty.name,
          type: "remove-incident",
          incidentId: id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Incident removed successfully",
        });
        onDutyUpdate();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to remove incident",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndDuty = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: duty.name,
          type: "end",
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: `Duty ended with ${incidents.length} incident(s) recorded`,
        });
        onDutyUpdate();
        onOpenChange(false);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to end duty",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage Active Duty</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Officer Information</h3>
              <div className="mt-2 space-y-1">
                <p>
                  <span className="font-medium">Name:</span> {duty.name}
                </p>
                <p>
                  <span className="font-medium">Badge Number:</span>{" "}
                  {duty.badgeNumber}
                </p>
                <p>
                  <span className="font-medium">Post:</span> {duty.post}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Duty Information</h3>
              <div className="mt-2 space-y-1">
                <p>
                  <span className="font-medium">Start Time:</span>{" "}
                  {new Date(duty.startTime).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Duration:</span>{" "}
                  {(() => {
                    const start = new Date(duty.startTime);
                    const now = new Date();
                    const diff = now.getTime() - start.getTime();
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor(
                      (diff % (1000 * 60 * 60)) / (1000 * 60)
                    );
                    return `${hours}h ${minutes}m`;
                  })()}
                </p>
                <p>
                  <span className="font-medium">Status:</span> {duty.status}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Add Incident Report</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={incidentData.location}
                  onChange={(e) =>
                    setIncidentData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="Incident location"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Input
                  type="datetime-local"
                  value={incidentData.time}
                  onChange={(e) =>
                    setIncidentData((prev) => ({
                      ...prev,
                      time: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={incidentData.description}
                onChange={(e) =>
                  setIncidentData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe the incident"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Action Taken</label>
              <Textarea
                value={incidentData.action}
                onChange={(e) =>
                  setIncidentData((prev) => ({
                    ...prev,
                    action: e.target.value,
                  }))
                }
                placeholder="Describe the action taken"
              />
            </div>

            <Button
              onClick={handleAddIncident}
              disabled={
                isLoading ||
                !incidentData.description ||
                !incidentData.location ||
                !incidentData.time ||
                !incidentData.action
              }
            >
              {isLoading ? "Adding..." : "Add Incident"}
            </Button>
          </div>

          <div>
            <h3 className="font-semibold mb-3">
              Current Incidents ({incidents.length})
            </h3>
            {incidents.length > 0 ? (
              <ScrollArea className="h-[200px] w-full rounded-md border">
                <div className="p-4 space-y-4">
                  {incidents.map((incident) => (
                    <div
                      key={incident.id}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium">Time:</span>{" "}
                            {new Date(incident.time).toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span>{" "}
                            {incident.location}
                          </div>
                          <div>
                            <span className="font-medium">Description:</span>{" "}
                            {incident.description}
                          </div>
                          <div>
                            <span className="font-medium">Action Taken:</span>{" "}
                            {incident.action}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveIncident(incident.id)}
                          className="text-red-500 hover:text-red-700"
                          disabled={isLoading}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-muted-foreground">No incidents reported</p>
            )}
          </div>

          <Button
            className="w-full bg-red-500 hover:bg-red-600"
            disabled={isLoading}
            onClick={handleEndDuty}
          >
            {isLoading ? "Processing..." : "End Duty"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
