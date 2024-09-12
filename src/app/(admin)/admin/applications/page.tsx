"use client";

import { ViewLeaveApplicationDrawer } from "@/components/drawers/view-leave-application-drawer";
import AdminNavbar from "@/components/navbar/admin-navbar";

import { format } from "date-fns";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Applications = () => {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/applications`
      );

      const json = await response.json();

      if (!response.ok) {
        toast.error(json.error);
      }

      console.log("JSON", json.data);

      setLeaveApplications(json?.data?.applications);
    } catch (error) {
      console.log("Error : ", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApplications();
  }, []);

  return (
    <div className="w-full h-full">
      <AdminNavbar />

      <div className="mt-16">
        <h3 className="text-xl font-bold text-slate-800">Leave applications</h3>
        <section className="my-6">
          <p className="text-sm text-slate-700/85 mb-1">Applied on 28-09-24</p>
          {/* <LeaveApplicationTable /> */}
          <ul className="flex flex-col gap-2 mt-3">
            {leaveApplications?.map(
              ({
                id,
                leaveReason,
                status,
                videoUrl,
                documentUrl,
                totalLeaves,
                createdAt,
                startDate,
                endDate,
                leaveType,
                studentEmail,
                department,
              }) => (
                <li
                  key={id}
                  className="border-2 rounded p-2 flex justify-between"
                >
                  <section>
                    <h3 className="font-medium">{leaveReason}</h3>

                    <p className="text-sm text-slate-600">
                      Applied On{" "}
                      <span className="font-medium">
                        {format(new Date(createdAt), "d MMMM yyyy")}
                      </span>
                    </p>
                    <p className="text-sm text-slate-600">
                      Total leaves{" "}
                      <span className="font-medium">{totalLeaves}</span>
                    </p>
                    <p className="text-sm text-slate-600">
                      From{" "}
                      <span className="font-medium">
                        {format(new Date(startDate), "d MMMM yyyy")}
                      </span>
                    </p>
                    <p className="text-sm text-slate-600">
                      To{" "}
                      <span className="font-medium">
                        {format(new Date(endDate), "d MMMM yyyy")}
                      </span>
                    </p>
                    <p className="text-sm text-slate-600">
                      Leave Type{" "}
                      <span className="font-medium">
                        {leaveType
                          ? String(leaveType)?.charAt(0).toUpperCase() +
                            String(leaveType)?.slice(1).toLowerCase()
                          : ""}
                      </span>
                    </p>
                  </section>

                  <section className="flex gap-2">
                    <ViewLeaveApplicationDrawer
                      studentEmail={studentEmail}
                      applicationId={id}
                      department={department}
                    />
                  </section>
                </li>
              )
            )}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Applications;
