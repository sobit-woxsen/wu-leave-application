"use server";

import prisma from "@/prisma";
import { Department } from "@prisma/client";

export async function updateOTP(
  department: Department,
  email: string,
  otp: string
) {
  try {
    const student =
      department === "BBA"
        ? await prisma.bBAStudentData.findFirst({
            where: { studentEmail: email },
          })
        : department === "BCOM"
        ? await prisma.bCOMStudentData.findFirst({
            where: {
              studentEmail: email,
            },
          })
        : null;

    if (!student) {
      return false;
    }

    await prisma.oTPVerify.upsert({
      where: { studentId: student.id },
      update: {
        otp: parseInt(otp),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      create: {
        id: student.id, // Add this line
        studentId: student.id,
        otp: parseInt(otp),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        createdAt: new Date(), // Add this line
      },
    });

    return true;
  } catch (error) {
    console.error("Error updating OTP:", error);
    return false;
  }
}
