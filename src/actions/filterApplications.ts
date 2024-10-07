"use server";

import prisma from "@/prisma";
import { Department } from "@prisma/client";
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

  if (!validatedFields.success) {
    return { error: "Invalid form data" };
  }

  const { search, dateApplied, reasonType, status } = validatedFields.data;

  const whereConditions: any = {
    department: department,
    ...(search && {
      OR: [
        {
          StudentData: { fullName: { contains: search, mode: "insensitive" } },
        },
        {
          StudentData: {
            fatherName: { contains: search, mode: "insensitive" },
          },
        },
        {
          StudentData: {
            motherName: { contains: search, mode: "insensitive" },
          },
        },
        { studentEmail: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(dateApplied && {
      startDate: {
        equals: new Date(dateApplied),
      },
    }),
    ...(reasonType && { leaveType: reasonType }),
    ...(status && { status: status }),
  };

  const filteredApplications = await prisma.leaveApplication.findMany({
    where: whereConditions,
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
