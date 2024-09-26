import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const payload = await getCurrentUser();

    if (!payload?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const latestApplication = await prisma.leaveApplication.findFirst({
      where: {
        studentId: payload?.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        message: "Success",
        data: latestApplication,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(
      `Error in /api/student.checkapplicationstatus : ${
        (error as Error).message
      }`
    );
    return NextResponse.json(
      {
        message: "Failed to get application",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
