"use client";

import AdminNavbar from "@/components/navbar/admin-navbar";
import dynamic from "next/dynamic";

const DynamicLeaveApplicationsTab = dynamic(
  () => import("@/components/tabs/leave-applications-tab"),
  {
    loading: () => <p>Loading...</p>,
  }
);

import React from "react";

const Applications = () => {
  return (
    <div className="w-full h-full">
      <AdminNavbar />

      <div className="mt-16">
        <h3 className="text-xl font-bold text-slate-800 mb-4">
          Leave applications
        </h3>

        <DynamicLeaveApplicationsTab />
      </div>
    </div>
  );
};

export default Applications;
