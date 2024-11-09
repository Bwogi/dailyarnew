// components/active-duties.tsx
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LogEntry {
  _id: string;
  name: string;
  badgeNumber: string;
  post: string;
  startTime: string;
  endTime: string | null;
  status: "active" | "completed";
}

interface ActiveDutiesProps {
  onDutyUpdate: () => void;
}

export function ActiveDuties({ onDutyUpdate }: ActiveDutiesProps) {
  const [activeDuties, setActiveDuties] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const fetchActiveDuties = async () => {
    try {
      const response = await fetch("/api/log");
      const data = (await response.json()) as {
        success: boolean;
        logs: LogEntry[];
      };
      if (data.success) {
        const active = data.logs.filter((log) => log.status === "active");
        setActiveDuties(active);
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch active duties",
      });
    }
  };

  useEffect(() => {
    fetchActiveDuties();
  }, []);

  const handleEndDuty = async (name: string) => {
    setLoading((prev) => ({ ...prev, [name]: true }));
    try {
      const response = await fetch("/api/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          type: "end",
        }),
      });

      const data = (await response.json()) as { success: boolean };

      if (data.success) {
        toast({
          title: "Success",
          description: `Ended duty for ${name}`,
        });
        fetchActiveDuties();
        onDutyUpdate();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to end duty for ${name}`,
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [name]: false }));
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateDuration = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = now.getTime() - start.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  if (activeDuties.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Duties</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Badge Number</TableHead>
                <TableHead>Post</TableHead>
                <TableHead>Started At</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeDuties.map((duty) => (
                <TableRow key={duty._id}>
                  <TableCell className="font-medium">{duty.name}</TableCell>
                  <TableCell>{duty.badgeNumber}</TableCell>
                  <TableCell>{duty.post}</TableCell>
                  <TableCell>{formatDateTime(duty.startTime)}</TableCell>
                  <TableCell>{calculateDuration(duty.startTime)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleEndDuty(duty.name)}
                      disabled={loading[duty.name]}
                    >
                      {loading[duty.name] ? "Ending..." : "End Duty"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
