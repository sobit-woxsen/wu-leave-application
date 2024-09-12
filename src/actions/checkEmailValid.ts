"use server";
import prisma from "@/prisma";
import { Department } from "@prisma/client";

export const checkEmailValid = async (
  department: Department,
  email: string
): Promise<boolean> => {
  const student = await (department === "BBA"
    ? prisma.bBAStudentData.findFirst({
        where: {
          studentEmail: {
            equals: email,
            mode: "insensitive",
          },
        },
      })
    : department === "BCOM"
    ? prisma.bCOMStudentData.findFirst({
        where: {
          studentEmail: {
            equals: email,
            mode: "insensitive",
          },
        },
      })
    : null);

  return student !== null;
};
