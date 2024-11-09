// app/dashboard/page.tsx
"use client";
import { DutyForm } from "@/components/duty-form";
import { DutyTable } from "@/components/duty-table";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, FileText, LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDutyUpdate = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Duty Management Dashboard
          </h1>
          <div className="flex gap-2">
            <Link href="/reports">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Reports
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
        <div className="space-y-8">
          <DutyForm onDutyUpdate={handleDutyUpdate} />
          <DutyTable refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}
