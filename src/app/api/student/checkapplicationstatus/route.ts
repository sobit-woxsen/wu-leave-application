import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const userId = await getCurrentUser();

  if (!userId?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const latestApplication = await prisma.leaveApplication.findFirst({
    where: {
      userId: userId?.userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(
    {
      message: "Success",
      data: { ...latestApplication },
    },
    { status: 200 }
  );
}
