"use server";

import prisma from "@/prisma";

export async function getApplicationAndUserInfo(
  studentEmail: string,
  applicationId: string
) {
  if (!studentEmail || !applicationId) {
    return { error: "Student Email and Application ID are required" };
  }

  try {
    const [applicationData, userData] = await Promise.all([
      prisma.leaveApplication.findFirst({
        where: {
          studentEmail: studentEmail,
          id: applicationId,
        },
      }),
      prisma.studentData.findUnique({
        where: { studentEmail: studentEmail },
      }),
    ]);

    if (!applicationData) {
      return { error: "Application not found" };
    }

    if (!userData) {
      return { error: "User not found" };
    }

    const updatedApplicationData = {
      ...applicationData,
      applicationId: applicationData.id,
    };

    // Convert BigInt to string to avoid JSON serialization issues
    const serializedData = JSON.parse(
      JSON.stringify({ ...updatedApplicationData, ...userData }, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      )
    );

    return {
      message: "Success",
      data: serializedData,
    };
  } catch (error) {
    console.error("Error fetching application and user data:", error);
    return { error: "An error occurred while fetching the data" };
  }
}
