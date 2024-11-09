// components/incident-list.tsx
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { Incident } from "@/types";

interface IncidentListProps {
  incidents: Incident[];
  onRemove: (id: string) => void;
}

export function IncidentList({ incidents, onRemove }: IncidentListProps) {
  if (incidents.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-4">
        No incidents reported
      </div>
    );
  }

  return (
    <ScrollArea className="h-[200px] w-full rounded-md border">
      <div className="p-4 space-y-4">
        {incidents.map((incident) => (
          <div
            key={incident.id}
            className="flex items-start justify-between space-x-4 p-4 border rounded-lg"
          >
            <div className="flex-1 space-y-2">
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
              size="icon"
              onClick={() => onRemove(incident.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
