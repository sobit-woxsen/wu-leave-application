"use server";

import prisma from "@/prisma";
import { Department } from "@prisma/client";

export async function resetFilterApplications(department: Department) {
  const filteredApplications = await prisma.leaveApplication.findMany({
    where: {
      department: department,
    },
    include: {
      StudentData: {
        select: {
          fullName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return filteredApplications;
}
