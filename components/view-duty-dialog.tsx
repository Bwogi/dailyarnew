// components/view-duty-dialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DutyLog } from "@/types";

interface ViewDutyDialogProps {
  duty: DutyLog;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewDutyDialog({
  duty,
  open,
  onOpenChange,
}: ViewDutyDialogProps) {
  const formatDateTime = (dateString: string | Date) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateDuration = (
    start: string | Date,
    end: string | Date | null
  ) => {
    if (!end) return "In progress";

    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = endDate.getTime() - startDate.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Duty Record Details</DialogTitle>
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
                  {formatDateTime(duty.startTime)}
                </p>
                <p>
                  <span className="font-medium">End Time:</span>{" "}
                  {duty.endTime ? formatDateTime(duty.endTime) : "-"}
                </p>
                <p>
                  <span className="font-medium">Duration:</span>{" "}
                  {calculateDuration(duty.startTime, duty.endTime)}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      duty.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {duty.status === "active" ? "Active" : "Completed"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">
              Incident Reports ({duty.incidents?.length || 0})
            </h3>
            {duty.incidents?.length > 0 ? (
              <ScrollArea className="h-[300px] w-full rounded-md border">
                <div className="p-4 space-y-4">
                  {duty.incidents.map((incident) => (
                    <div
                      key={incident.id}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <div>
                        <span className="font-medium">Time:</span>{" "}
                        {formatDateTime(incident.time)}
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
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-muted-foreground">No incidents reported</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
