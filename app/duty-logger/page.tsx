// app/duty-logger/page.tsx
"use client";
import { DutyForm } from "@/components/duty-form";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, FileText, LayoutDashboard, Pen, Info } from "lucide-react";
import { StyledCard } from "@/components/ui/styled-card";

export default function DutyLoggerPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDutyUpdate = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-slide-in">
          <div className="flex items-center gap-2">
            <Pen className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold gradient-text">
              Duty & Activity Logger
            </h1>
          </div>
          <div className="flex gap-2">
            <Link href="/reports">
              <Button
                variant="outline"
                size="sm"
                className="button-hover focus-ring"
              >
                <FileText className="h-4 w-4 mr-2" />
                Reports
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

        {/* Quick Guide */}
        <StyledCard className="mb-8">
          <div className="flex items-start space-x-4">
            <div className="p-2 rounded-lg bg-blue-50">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2">Quick Guide</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Enter your details and select your assigned post to start duty
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Log any incidents during your active duty
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  End your duty when your shift is complete
                </li>
              </ul>
            </div>
          </div>
        </StyledCard>

        {/* Duty Form */}
        <div className="mb-8 animate-fade-in">
          <DutyForm onDutyUpdate={handleDutyUpdate} />
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          <StyledCard>
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-amber-50">
                <Info className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">
                  Important Note
                </h3>
                <p className="text-sm text-gray-600">
                  Ensure all incidents are logged before ending your duty shift.
                  You won't be able to add incidents after ending your shift.
                </p>
              </div>
            </div>
          </StyledCard>

          <StyledCard>
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-green-50">
                <Info className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Need Help?</h3>
                <p className="text-sm text-gray-600">
                  Contact your supervisor for assistance with logging duties or
                  managing incidents.
                </p>
              </div>
            </div>
          </StyledCard>
        </div>
      </div>
    </div>
  );
}
