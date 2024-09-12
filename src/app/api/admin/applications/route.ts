import { getCurrentAdmin } from "@/actions/getCurrentAdmin";
import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const { userId, department, email } = admin;

  const applications = await prisma.leaveApplication.findMany({
    where: {
      department: department,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({
    message: "APPLICATION approved/rejected successfully",
    data: {
      applications,
      userId,
      department,
      email,
    },
  });
}
