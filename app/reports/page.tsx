// app/reports/page.tsx
"use client";
import { DutyTable } from "@/components/duty-table";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileText } from "lucide-react";

export default function ReportsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Duty Reports</h1>
          <div className="flex gap-2">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
        <DutyTable refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}
