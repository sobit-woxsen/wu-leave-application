import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const bbaStudents = await prisma.bBAStudentData.findMany({
      where: {
        id: "66c870922d4a485fcf416a5e",
      },
    });

    return NextResponse.json({
      message: "BBA student data fetched successfully",
      data: bbaStudents,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch BBA student data",
        error: error,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
