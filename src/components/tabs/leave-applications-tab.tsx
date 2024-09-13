"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ViewLeaveApplicationDrawer } from "../drawers/view-leave-application-drawer";
import { Department } from "@prisma/client";

export default function LeaveApplicationsTab() {
  const [department, setDepartment] = useState<Department>("BBA");

  return (
    <Tabs defaultValue={department} className="w-[100%]">
      <TabsList className="grid w-full grid-cols-2 h-[20]">
        <TabsTrigger
          className="p-3"
          onClick={() => setDepartment("BBA")}
          value="BBA"
        >
          BBA Applications
        </TabsTrigger>
        <TabsTrigger
          className="p-3"
          onClick={() => setDepartment("BCOM")}
          value="BCOM"
        >
          BCOM Applications
        </TabsTrigger>
      </TabsList>
      <TabsContent value="BBA">
        <DepartmentalApplications department={department} />
      </TabsContent>
      <TabsContent value="BCOM">
        <DepartmentalApplications department={department} />
      </TabsContent>
    </Tabs>
  );
}

const DepartmentalApplications = ({
  department,
}: {
  department: Department;
}) => {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const getApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ department }),
      });

      const json = await response.json();

      if (!response.ok) {
        toast.error(json.error);
      }

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
  }, [department]);

  return (
    <section className="my-6">
      {loading && leaveApplications.length > 1 && <p>Loading...</p>}
      {leaveApplications.length === 0 && !loading && (
        <p>No applications find for {department}</p>
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
            studentEmail,
            department,
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
  );
};
