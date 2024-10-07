"use client";

import { format } from "date-fns";
import StudentNavbar from "@/components/navbar/student-navbar";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const applicationStatus = {
  PENDING: "Pending",
  REJECTED: "Rejected",
  ACCEPTED: "Accepted",
};

const ApplicationStatus = () => {
  const [application, setApplication] = useState<any>({});

  const getLatestApplication = async () => {
    try {
      const response = await fetch(`/api/student/checkapplicationstatus`);
      const json = await response.json();

      if (!response.ok) {
        toast.error(json.error);
      }

      setApplication(json.data);
    } catch (error) {
      console.log("ERROR : ", error);
      toast.error(error instanceof Error ? error.message : String(error));
    }
  };

  useEffect(() => {
    getLatestApplication();
  }, []);

  const date = new Date("2024-10-07T04:33:20.936Z");
  const formattedDate = format(date, "do MMM yyyy");

  return (
    <div className="w-full h-full">
      <StudentNavbar />
      <h1 className="text-lg font-medium text-slate-700  mt-10">
        Your Application Status
      </h1>

      {Object.keys(application).length === 0 && <p>No Application Found</p>}

      <ul className="flex flex-col gap-2 mt-3">
        <li key={application?.id} className="border-2 rounded p-2">
          <h3 className="font-medium">{application?.leaveReason}</h3>
          <p className="text-sm text-slate-600">
            {application?.createdAt?.split("T")[0]}
          </p>
          <p
            className={
              application?.status === "PENDING"
                ? "text-yellow-600"
                : application?.status === "REJECTED"
                ? "text-red-600"
                : application?.status === "ACCEPTED"
                ? "text-green-600"
                : ""
            }
          >
            {
              applicationStatus[
                application?.status as keyof typeof applicationStatus
              ]
            }
          </p>
        </li>
      </ul>
    </div>
  );
};

export default ApplicationStatus;
