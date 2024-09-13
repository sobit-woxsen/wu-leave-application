"use client";

import AdminNavbar from "@/components/navbar/admin-navbar";
import LeaveApplicationsTab from "@/components/tabs/leave-applications-tab";

import React from "react";

const Applications = () => {
  return (
    <div className="w-full h-full">
      <AdminNavbar />

      <div className="mt-16">
        <h3 className="text-xl font-bold text-slate-800 mb-4">
          Leave applications
        </h3>
        <LeaveApplicationsTab />
      </div>
    </div>
  );
};

export default Applications;
