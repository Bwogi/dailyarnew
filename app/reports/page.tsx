"use client";
import { DutyTable } from "@/components/duty-table";
import React from "react";
import { useState } from "react";

const ReportsPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  //   const handleDutyUpdate = () => {
  setRefreshTrigger((prev) => prev + 1);
  //   };

  return (
    <div>
      <DutyTable refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default ReportsPage;
