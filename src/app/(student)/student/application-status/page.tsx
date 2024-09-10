import StudentNavbar from "@/components/navbar/student-navbar";
import React from "react";

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
  return (
    <div className="w-full h-full">
      <StudentNavbar />
      <h1 className="text-lg font-medium text-slate-700  mt-10">
        Your Application Status
      </h1>

      {applications.length === 0 && <p>No Applications Found</p>}

      <ul className="flex flex-col gap-2 mt-3">
        {applications.map(({ id, title, isApproved, dateApplied }) => (
          <li key={id} className="border-2 rounded p-2">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-slate-600">{dateApplied.toString()}</p>
            <p
              className={
                isApproved === "PENDING"
                  ? "text-yellow-600"
                  : isApproved === "REJECTED"
                  ? "text-red-600"
                  : isApproved === "ACCEPTED"
                  ? "text-green-600"
                  : ""
              }
            >
              {applicationStatus[isApproved as keyof typeof applicationStatus]}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApplicationStatus;
