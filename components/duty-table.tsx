// components/duty-table.tsx
"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Search, CalendarIcon, X, ClipboardEdit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { DutyLog } from "@/types";
import { ManageDutyDialog } from "./manage-duty-dialog";
import { ViewDutyDialog } from "@/components/view-duty-dialog";

interface DutyTableProps {
  refreshTrigger: number;
}

export function DutyTable({ refreshTrigger }: DutyTableProps) {
  const [logs, setLogs] = useState<DutyLog[]>([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<DateRange | undefined>();
  const [selectedLog, setSelectedLog] = useState<DutyLog | null>(null);
  const [selectedDutyToManage, setSelectedDutyToManage] =
    useState<DutyLog | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/log");
      const data = (await response.json()) as {
        success: boolean;
        logs: DutyLog[];
      };
      if (data.success) {
        setLogs(data.logs);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch logs",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch logs",
      });
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [refreshTrigger]);

  const filteredLogs = logs.filter((log) => {
    // Text search filter
    const searchMatches =
      !search.trim() ||
      (log.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (log.badgeNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      (log.post || "").toLowerCase().includes(search.toLowerCase());

    // Date range filter
    let dateMatches = true;
    if (date?.from || date?.to) {
      const startDate = new Date(log.startTime);

      if (date.from) {
        const fromDate = new Date(date.from);
        fromDate.setHours(0, 0, 0, 0);
        dateMatches = dateMatches && startDate >= fromDate;
      }

      if (date.to) {
        const toDate = new Date(date.to);
        toDate.setHours(23, 59, 59, 999);
        dateMatches = dateMatches && startDate <= toDate;
      }
    }

    return searchMatches && dateMatches;
  });

  const formatDateTime = (dateString: string | Date) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return String(dateString);
    }
  };

  const calculateDuration = (
    start: string | Date,
    end: string | Date | null
  ) => {
    if (!end) return "In progress";

    try {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const diff = endDate.getTime() - startDate.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      return `${hours}h ${minutes}m`;
    } catch {
      return "Invalid duration";
    }
  };

  const handleDutyUpdate = () => {
    fetchLogs();
  };

  return (
    <>
      <Card className="glass-card shadow-lg hover-scale">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Duty Logs
            </CardTitle>
            <div className="flex space-x-3">
              <div className="relative w-72">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, badge, or post"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 transition-all duration-200 hover:ring-2 hover:ring-blue-200"
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal transition-all duration-200",
                      !date?.from &&
                        "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      "Pick a date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
              {(date?.from || date?.to) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDate(undefined)}
                  className="transition-all duration-200 hover:bg-red-100 hover:text-red-600"
                  title="Clear date range"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Badge Number</TableHead>
                  <TableHead className="font-semibold">Post</TableHead>
                  <TableHead className="font-semibold">Start Time</TableHead>
                  <TableHead className="font-semibold">End Time</TableHead>
                  <TableHead className="font-semibold">Duration</TableHead>
                  <TableHead className="font-semibold">Incidents</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center h-32 text-muted-foreground"
                    >
                      {search || date?.from || date?.to
                        ? "No matching records found"
                        : "No logs found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow
                      key={log._id}
                      className="hover:bg-gray-50/50 transition-colors duration-200"
                    >
                      <TableCell className="font-medium">{log.name}</TableCell>
                      <TableCell>{log.badgeNumber}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100">
                          {log.post}
                        </span>
                      </TableCell>
                      <TableCell>{formatDateTime(log.startTime)}</TableCell>
                      <TableCell>
                        {log.endTime ? formatDateTime(log.endTime) : "-"}
                      </TableCell>
                      <TableCell>
                        {calculateDuration(log.startTime, log.endTime)}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-medium">
                          {log.incidents?.length || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            log.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          )}
                        >
                          {log.status === "active" ? "Active" : "Completed"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedLog(log);
                              setIsViewDialogOpen(true);
                            }}
                            className="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {log.status === "active" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedDutyToManage(log)}
                              className="hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                              title="Manage Active Duty"
                            >
                              <ClipboardEdit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedLog && (
        <ViewDutyDialog
          duty={selectedLog}
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
        />
      )}

      {selectedDutyToManage && (
        <ManageDutyDialog
          duty={selectedDutyToManage}
          open={!!selectedDutyToManage}
          onOpenChange={(open) => {
            if (!open) setSelectedDutyToManage(null);
          }}
          onDutyUpdate={handleDutyUpdate}
        />
      )}
    </>
  );
}
