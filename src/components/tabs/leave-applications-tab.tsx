"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ViewLeaveApplicationDrawer } from "../drawers/view-leave-application-drawer";
import { Department } from "@prisma/client";
import {
  CalendarIcon,
  DotFilledIcon,
  IdCardIcon,
  PieChartIcon,
} from "@radix-ui/react-icons";

import { applicationStatus, TLeaveApplication } from "@/constant";
import { Input } from "../ui/input";
import ApplicationFilter from "../filter/application-filter";
import { useSearchParams } from "next/navigation";

const applicationStatusStyle = {
  PENDING: "text-yellow-500 bg-yellow-50",
  ACCEPTED: "text-green-500 bg-green-50",
  REJECTED: "text-red-500 bg-red-50",
};

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
  return (
    <section className="my-6">
      <FilterApplications department={department} />
    </section>
  );
};

export function FilterApplications({ department }: { department: Department }) {
  const [leaveApplications, setLeaveApplications] = useState<
    TLeaveApplication[]
  >([]);
  const [loading, setLoading] = useState(false);
  // const searchParams = useSearchParams();
  // const status = searchParams.get("status");

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
    <div className="mb-5">
      {/* Filter logic should be here */}

      <div className="flex items-center gap-2 ">
        <ApplicationFilter
          department={department}
          setLeaveApplications={setLeaveApplications}
        />
      </div>

      {leaveApplications.length === 0 && (
        <p className="text-2xl font-bold text-center my-20">
          No applications found
        </p>
      )}

      <ul className="flex flex-col gap-4 mt-8">
        {leaveApplications?.map(
          ({
            id,
            leaveReason,
            status,
            totalLeaves,
            createdAt,
            leaveType,
            studentEmail,
            department,
            StudentData,
          }) => (
            <li
              key={id}
              className="border-2 rounded p-2 flex flex-col justify-between"
            >
              <section className="flex flex-col gap-3">
                <div className="flex justify-between flex-start">
                  <section className="leading-4">
                    <h3 className="font-semibold text-xl">
                      {StudentData?.fullName}
                    </h3>
                    <p className="text-sm text-slate-500">{leaveReason}</p>
                  </section>
                  <p
                    className={`flex items-center lowercase text-sm px-4 rounded-full py-1 max-h-max ${
                      applicationStatusStyle[
                        status as keyof typeof applicationStatusStyle
                      ]
                    }`}
                  >
                    <DotFilledIcon />
                    {
                      applicationStatus[
                        status as keyof typeof applicationStatus
                      ]
                    }
                  </p>
                </div>

                <section className="flex justify-between items-end">
                  <section className="flex flex-col gap-1">
                    <p className="flex items-center gap-2">
                      <CalendarIcon className="bg-slate-100 text-slate-600 w-7 h-7 p-1 rounded-sm" />
                      <span className=" text-slate-600">Applied on </span>
                      <span className="text-sm font-medium">
                        {format(new Date(createdAt), "d MMMM yyyy")}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <PieChartIcon className="bg-slate-100 text-slate-600 w-7 h-7 p-1 rounded-sm" />
                      <span className=" text-slate-600">Leaves (in days) </span>
                      <span className="text-sm font-medium">{totalLeaves}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <IdCardIcon className="bg-slate-100 text-slate-600 w-7 h-7 p-1 rounded-sm" />
                      <span className=" text-slate-600">Leave type </span>
                      <span className="text-sm font-medium">
                        {leaveType
                          ? String(leaveType)?.charAt(0).toUpperCase() +
                            String(leaveType)?.slice(1).toLowerCase()
                          : ""}
                      </span>
                    </p>
                  </section>

                  <section className="flex">
                    {studentEmail && (
                      <ViewLeaveApplicationDrawer
                        studentEmail={studentEmail}
                        applicationId={id}
                        department={department as Department}
                      />
                    )}
                  </section>
                </section>
              </section>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
