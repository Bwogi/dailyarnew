// app/dashboard/page.tsx
"use client";
import { StyledCard } from "@/components/ui/styled-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Home,
  FileText,
  Pen,
  LayoutDashboard,
  Users,
  Shield,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DutyLog } from "@/types";

interface DashboardStats {
  activeOfficers: number;
  postsCovered: number;
  pendingIncidents: number;
  shiftsToday: number;
}

interface RecentActivity {
  _id: string;
  type: "duty_start" | "duty_end" | "incident_reported";
  officerName: string;
  timestamp: string;
  details: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    activeOfficers: 0,
    postsCovered: 0,
    pendingIncidents: 0,
    shiftsToday: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

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

        // Active officers (current active duties)
        const activeOfficers = data.logs.filter(
          (log) => log.status === "active"
        ).length;

        // Posts currently covered (unique posts with active duties)
        const activePosts = new Set(
          data.logs
            .filter((log) => log.status === "active")
            .map((log) => log.post)
        );

        // Pending incidents (incidents from active duties)
        const pendingIncidents = data.logs
          .filter((log) => log.status === "active")
          .reduce((total, log) => total + (log.incidents?.length || 0), 0);

        // Shifts today (started or ended today)
        const shiftsToday = data.logs.filter((log) => {
          const startDate = new Date(log.startTime);
          startDate.setHours(0, 0, 0, 0);
          return startDate.getTime() === today.getTime();
        }).length;

        setStats({
          activeOfficers,
          postsCovered: activePosts.size,
          pendingIncidents,
          shiftsToday,
        });

        // Generate recent activity
        const activities: RecentActivity[] = [];

        // Add duty starts
        data.logs.forEach((log) => {
          // Duty start
          activities.push({
            _id: `start_${log._id}`,
            type: "duty_start",
            officerName: log.name,
            timestamp: log.startTime,
            details: `Started duty at ${log.post}`,
          });

          // Duty end
          if (log.endTime) {
            activities.push({
              _id: `end_${log._id}`,
              type: "duty_end",
              officerName: log.name,
              timestamp: log.endTime,
              details: `Ended duty with ${
                log.incidents?.length || 0
              } incident(s)`,
            });
          }

          // Incidents
          log.incidents?.forEach((incident, index) => {
            activities.push({
              _id: `incident_${log._id}_${index}`,
              type: "incident_reported",
              officerName: log.name,
              timestamp: incident.time,
              details: `Reported incident at ${incident.location}`,
            });
          });
        });

        // Sort by timestamp descending and take latest 10
        activities.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setRecentActivity(activities.slice(0, 10));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    calculateStats();
    const interval = setInterval(calculateStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-slide-in">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          </div>
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/duty-logger" className="block">
            <StyledCard className="h-full">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-blue-50">
                  <Pen className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    Duty & Activity Logger
                  </h3>
                  <p className="text-gray-600">
                    Start a new duty shift, log incidents, and manage active
                    duties.
                  </p>
                </div>
              </div>
            </StyledCard>
          </Link>

          <Link href="/reports" className="block">
            <StyledCard className="h-full">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-indigo-50">
                  <FileText className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    Reports
                  </h3>
                  <p className="text-gray-600">
                    View duty logs, analyze incidents, and generate reports.
                  </p>
                </div>
              </div>
            </StyledCard>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StyledCard>
            <div className="text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stats.activeOfficers}
              </div>
              <div className="text-sm text-gray-600">Active Officers</div>
            </div>
          </StyledCard>

          <StyledCard>
            <div className="text-center">
              <Shield className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stats.postsCovered}
              </div>
              <div className="text-sm text-gray-600">Posts Covered</div>
            </div>
          </StyledCard>

          <StyledCard>
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stats.pendingIncidents}
              </div>
              <div className="text-sm text-gray-600">Pending Incidents</div>
            </div>
          </StyledCard>

          <StyledCard>
            <div className="text-center">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stats.shiftsToday}
              </div>
              <div className="text-sm text-gray-600">Shifts Today</div>
            </div>
          </StyledCard>
        </div>

        {/* Recent Activity */}
        <StyledCard title="Recent Activity">
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No recent activity to display
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity._id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        activity.type === "duty_start"
                          ? "bg-green-50 text-green-600"
                          : activity.type === "duty_end"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {activity.type === "duty_start" ? (
                        <Clock className="h-5 w-5" />
                      ) : activity.type === "duty_end" ? (
                        <Shield className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.officerName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.details}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </StyledCard>
      </div>
    </div>
  );
}
