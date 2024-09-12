"use client";

import StudentNavbar from "@/components/navbar/student-navbar";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const applications = [
  {
    id: 1,
    title: "Leave Application for Festivals",
    isApproved: "ACCEPTED",
    dateApplied: new Date(),
  },
];

const applicationStatus = {
  PENDING: "Pending",
  REJECTED: "Rejected",
  ACCEPTED: "Accepted",
};

const ApplicationStatus = () => {
  const [application, setApplication] = useState<any>({});

  const getLatestApplication = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/student/checkapplicationstatus`
      );
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

  console.log("APPLICATION", application);
  return (
    <div className="w-full h-full">
      <StudentNavbar />
      <h1 className="text-lg font-medium text-slate-700  mt-10">
        Your Application Status
      </h1>

      {applications.length === 0 && <p>No Applications Found</p>}

      <ul className="flex flex-col gap-2 mt-3">
        <li key={application?.id} className="border-2 rounded p-2">
          <h3 className="font-medium">{application?.leaveReason}</h3>
          <p className="text-sm text-slate-600">{application?.createdAt}</p>
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
