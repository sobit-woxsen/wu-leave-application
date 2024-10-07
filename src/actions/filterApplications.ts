"use server";

import prisma from "@/prisma";
import { Department, ApplicationStatus } from "@prisma/client";
import { z } from "zod";

const filterSchema = z.object({
  search: z.string().optional(),
  dateApplied: z.date().optional(),
  reasonType: z
    .enum(["REGULAR", "MEDICAL", "GOVERNMENT", "EMERGENCY", "OTHERS"])
    .optional(),
  status: z.enum(["ACCEPTED", "REJECTED", "PENDING"]).optional(),
});

export async function getFilterApplications(
  formData: FormData,
  department: Department
) {
  const validatedFields = filterSchema.safeParse(formData);

  // console.

  if (!validatedFields.success) {
    return { error: "Invalid form data" };
  }

  const { search, dateApplied, reasonType, status } = validatedFields.data;

  const whereConditions: any = {
    department: department,
  };

  if (search) {
    whereConditions.OR = [
      { StudentData: { fullName: { contains: search, mode: "insensitive" } } },
      {
        StudentData: { fatherName: { contains: search, mode: "insensitive" } },
      },
      {
        StudentData: { motherName: { contains: search, mode: "insensitive" } },
      },
      { studentEmail: { contains: search, mode: "insensitive" } },
    ];
  }

  if (dateApplied) {
    const date = new Date(dateApplied);
    whereConditions.startDate = {
      equals: date,
    };
  }

  if (reasonType) {
    whereConditions.leaveType = reasonType;
  }

  if (status) {
    whereConditions.status = status;
  }

  const filteredApplications = await prisma.leaveApplication.findMany({
    where: whereConditions,
    include: {
      StudentData: {
        select: {
          password: false,
          refreshToken: false,
          studentEmail: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    search,
    dateApplied: dateApplied ? new Date(dateApplied) : undefined,
    reasonType,
    status,
    department,
    filteredApplications,
  };
}
