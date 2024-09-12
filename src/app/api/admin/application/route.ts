import { getCurrentAdmin } from "@/actions/getCurrentAdmin";
import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { studentEmail, applicationId, department } = await request.json();

  if (!studentEmail) {
    return NextResponse.json(
      {
        message: "Student Email is required",
      },
      { status: 401 }
    );
  }

  const applicationData = await prisma.leaveApplication.findFirst({
    where: {
      studentEmail: studentEmail,
      id: applicationId,
    },
  });

  const studentInfo =
    department === "BBA"
      ? await prisma.bBAStudentData.findFirst({
          where: {
            studentEmail: studentEmail,
          },
        })
      : department === "BCOM"
      ? await prisma.bCOMStudentData.findFirst({
          where: {
            studentEmail: studentEmail,
          },
        })
      : null;

  const studentData = JSON.stringify(studentInfo, (_, v) =>
    typeof v === "bigint" ? v.toString() : v
  );

  const updatedApplicationData = {
    ...applicationData,
    applicationId: applicationData?.id,
  };

  const data = { ...updatedApplicationData, ...JSON.parse(studentData) };

  return NextResponse.json({
    message: "Success",
    data: {
      ...data,
    },
  });
}
