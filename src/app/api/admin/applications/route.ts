import { getCurrentAdmin } from "@/actions/getCurrentAdmin";
import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin();
  const { department } = await request.json();

  if (!admin) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const { userId, email } = admin;

  const applications = await prisma.leaveApplication.findMany({
    where: {
      department: department,
    },
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
