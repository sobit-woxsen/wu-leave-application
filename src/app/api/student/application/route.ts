import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/prisma";
import { Department } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET() {
  const userId = await getCurrentUser();

  if (!userId?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const applications = await prisma.leaveApplication.findMany({
    where: {
      userId: userId?.userId,
    },
  });

  return NextResponse.json(
    {
      message: "Success",
      data: { applications: applications },
    },
    { status: 200 }
  );
}

export async function DELETE() {
  try {
    const admin = await getCurrentUser();

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.leaveApplication.deleteMany();

    return NextResponse.json(
      { message: "All leave applications deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting leave applications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const user = await getCurrentUser();

    console.log("USER ", user);

    if (!user?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // startdate
    const startDate = formData.get("startDate");
    const endDate = formData.get("endDate");
    const reasonForLeave = formData.get("reasonForLeave");
    const documentUrl = formData.get("documentUrl");
    const videoUrl = formData.get("videoUrl");
    const totalLeaves = formData.get("totalLeaves");

    const { reason: leaveReason, type: leaveType } = reasonForLeave
      ? JSON.parse(reasonForLeave.toString())
      : null;

    console.log("FORMDATA ", formData);

    if (!startDate) {
      return NextResponse.json(
        { error: "Start Date is required" },
        { status: 400 }
      );
    }

    if (!endDate) {
      return NextResponse.json(
        { error: "End Date is required" },
        { status: 400 }
      );
    }

    if (!leaveType) {
      return NextResponse.json(
        { error: "Please select your reson for leave" },
        { status: 400 }
      );
    }

    if (!leaveReason) {
      return NextResponse.json(
        { error: "Please select your reson for leave" },
        { status: 400 }
      );
    }

    if (leaveReason === "Other reasons") {
      return NextResponse.json(
        { error: "Please mention your reason for leave" },
        { status: 400 }
      );
    }

    if (
      (leaveType === "GOVERNMENT" ||
        leaveType === "EMERGENCY" ||
        leaveType === "MEDICAL" ||
        leaveType === "OTHERS") &&
      !documentUrl
    ) {
      return NextResponse.json(
        { error: "Please add supporting document" },
        { status: 400 }
      );
    }

    if ((leaveType === "EMERGENCY" || leaveType === "OTHERS") && !videoUrl) {
      return NextResponse.json(
        { error: "Please add supporting video" },
        { status: 400 }
      );
    }

    // find the current user
    // update the applications for that user
    await prisma.leaveApplication.create({
      data: {
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
        totalLeaves: parseInt(totalLeaves as string),
        leaveReason,
        leaveType,
        documentUrl: documentUrl as string | null,
        videoUrl: videoUrl as string | null,
        userId: user.userId,
        department: user.department as Department,
        studentEmail: user.email as string | null,
      },
    });

    // success message

    return NextResponse.json(
      {
        message: "Application Applied successfully",
        data: {
          startDate,
          endDate,
          leaveReason,
          leaveType,
          videoUrl: videoUrl || null,
          documentUrl: documentUrl || null,
          totalLeaves,
          userId: user.userId,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("ERROR [/api/student/application] : ", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
