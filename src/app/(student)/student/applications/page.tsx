"use client";
import StudentNavbar from "@/components/navbar/student-navbar";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { FileIcon, PlayIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { applicationStatus } from "@/constant";

const ApplicationStatus = () => {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/student/application`
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
      <StudentNavbar />
      <h1 className="text-lg font-medium text-slate-700  mt-10">
        Your Applications
      </h1>
      {loading && <p>Loading...</p>}
      {leaveApplications.length === 0 && !loading && (
        <p>No Applications Found</p>
      )}

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
          }) => (
            <li key={id} className="border-2 rounded p-2 flex justify-between">
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
                <p
                  className={
                    status === "PENDING"
                      ? "text-yellow-600"
                      : status === "REJECTED"
                      ? "text-red-600"
                      : status === "ACCEPTED"
                      ? "text-green-600"
                      : ""
                  }
                >
                  {applicationStatus[status as keyof typeof applicationStatus]}
                </p>
              </section>

              <section className="flex gap-2">
                {documentUrl && (
                  <div className="w-10 h-10 bg-slate-100  rounded-lg flex justify-center items-center">
                    <Link target="_blank" href={documentUrl}>
                      <FileIcon style={{ fontSize: "30px" }} />
                    </Link>
                  </div>
                )}
                {videoUrl && (
                  <div className="w-10 h-10 bg-slate-100  rounded-lg flex justify-center items-center">
                    <Link target="_blank" href={videoUrl || ""}>
                      <PlayIcon />
                    </Link>
                  </div>
                )}
              </section>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default ApplicationStatus;
