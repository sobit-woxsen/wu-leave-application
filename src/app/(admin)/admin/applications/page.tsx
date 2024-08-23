import AdminNavbar from "@/components/navbar/admin-navbar";
import { LeaveApplicationTable } from "@/components/tables/leave-application-table";
import React from "react";

const applications = [{}];

const Applications = () => {
  return (
    <div className="w-full h-full">
      <AdminNavbar />

      <div className="mt-16">
        <h3 className="text-xl font-bold text-slate-800">
          Leave applications of BBA Students
        </h3>
        <section className="my-6">
          <p className="text-sm text-slate-700/85 mb-1">Applied on 28-09-24</p>
          <LeaveApplicationTable />
        </section>
      </div>
    </div>
  );
};

export default Applications;
