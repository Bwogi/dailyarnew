// app/reports/page.tsx
"use client";
import { DutyTable } from "@/components/duty-table";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Home,
  LayoutDashboard,
  Pen,
  FileText,
  Users,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import { StyledCard } from "@/components/ui/styled-card";
import { DutyLog } from "@/types";

export default function ReportsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats] = useState({
    activeDuties: 0,
    todayIncidents: 0,
    completedShifts: 0,
  });

  const calculateStats = async () => {
    try {
      const response = await fetch("/api/log");
      const data = (await response.json()) as {
        success: boolean;
        logs: DutyLog[];
      };

      if (data.success) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activeDuties = data.logs.filter(
          (log) => log.status === "active"
        ).length;

        const todayIncidents = data.logs.reduce((count, log) => {
          const incidentsToday =
            log.incidents?.filter((incident) => {
              const incidentDate = new Date(incident.time);
              incidentDate.setHours(0, 0, 0, 0);
              return incidentDate.getTime() === today.getTime();
            }).length || 0;
          return count + incidentsToday;
        }, 0);

        const completedShifts = data.logs.filter((log) => {
          if (log.endTime) {
            const endDate = new Date(log.endTime);
            endDate.setHours(0, 0, 0, 0);
            return endDate.getTime() === today.getTime();
          }
          return false;
        }).length;

        setStats({
          activeDuties,
          todayIncidents,
          completedShifts,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    calculateStats();
  }, [refreshTrigger]);

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-slide-in">
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold gradient-text">
              Duty & Activity Reports
            </h1>
          </div>
          <div className="flex gap-2">
            <Link href="/duty-logger">
              <Button
                variant="outline"
                size="sm"
                className="button-hover focus-ring"
              >
                <Pen className="h-4 w-4 mr-2" />
                Duty & Activity Logger
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="button-hover focus-ring"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="button-hover focus-ring"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fade-in">
          <StyledCard>
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-blue-50">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.activeDuties}
                </div>
                <div className="text-sm text-gray-600">Active Duties</div>
              </div>
            </div>
          </StyledCard>

          <StyledCard>
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-amber-50">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.todayIncidents}
                </div>
                <div className="text-sm text-gray-600">Today's Incidents</div>
              </div>
            </div>
          </StyledCard>

          <StyledCard>
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.completedShifts}
                </div>
                <div className="text-sm text-gray-600">Completed Shifts</div>
              </div>
            </div>
          </StyledCard>
        </div>

        {/* Table */}
        <div className="animate-fade-in">
          <StyledCard noPadding>
            <DutyTable refreshTrigger={refreshTrigger} />
          </StyledCard>
        </div>

        {/* Helper Text */}
        <div className="mt-6 animate-fade-in">
          <StyledCard>
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">
                Use the search and date filters above to find specific records.
                Click the eye icon to view complete details of any duty record.
              </p>
            </div>
          </StyledCard>
        </div>
      </div>
    </div>
  );
}
