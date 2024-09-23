"use server";
import { PrismaClient, Department } from "@prisma/client";

const prisma = new PrismaClient();

export const checkEmailValid = async (
  email: string,
  department: Department
): Promise<boolean> => {
  try {
    const student = await prisma.studentData.findFirst({
      where: {
        studentEmail: {
          equals: email,
          mode: "insensitive",
        },
        department: department,
      },
    });

    const isValid = student !== null;
    console.log(
      `Validation result for email: ${email}, department: ${department} - ${
        isValid ? "Valid" : "Invalid"
      }`
    );

    return isValid;
  } catch (error) {
    console.error("Error checking student validity:", error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
};
