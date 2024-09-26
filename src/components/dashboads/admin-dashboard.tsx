import prisma from "@/prisma";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";

const AdminDashboard = async () => {
  const applications = await prisma.leaveApplication.findMany({});
  console.log(applications);

  const applicationsCardsInfo = [
    {
      id: 1,
      title: "Total Students Applied",
      length: applications.length,
      path: "/",
    },
    {
      id: 2,
      title: "Total Students Accepted",
      length: applications.filter(({ status }) => status === "ACCEPTED").length,
      path: "/",
    },
    {
      id: 3,
      title: "Total Students Rejected",
      length: applications.filter(({ status }) => status === "REJECTED").length,
      path: "/",
    },
    {
      id: 4,
      title: "Total Students Pending",
      length: applications.filter(({ status }) => status === "PENDING").length,
      path: "/",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl  font-semibold mb-6">Faculty Dashboard</h1>
      {/* <Link className="text-sm text-blue-600" href="/admin/applications">
        See all the applications
      </Link> */}

      <section className="flex gap-5 flex-wrap">
        {applicationsCardsInfo.map(({ id, title, length, path }) => (
          <DashboardCard key={id} title={title} length={length} path={path} />
        ))}
      </section>
    </div>
  );
};

export default AdminDashboard;

export function DashboardCard({
  title,
  length,
  path,
}: {
  title: string;
  length: number;
  path: string;
}) {
  return (
    <div className="border-2 border-slate-200 p-4 w-full md:max-w-max rounded-md hover:border-brand/20 ">
      <h3 className="text-lg font-semibold ">{title}</h3>
      <p className="flex items-center text-brand gap-2 text-4xl font-semibold">
        {length}
        <Link
          href={path}
          className="border-[1.8px] border-slate-200 hover:bg-brand/10 hover:cursor-pointer hover:border-brand/20  rounded-full p-1"
        >
          <ArrowTopRightIcon className="w-5 h-5 text-slate-400 hover:text-brand/50  " />
        </Link>{" "}
      </p>
    </div>
  );
}
