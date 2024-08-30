import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const bbaStudents = await prisma.bBAStudentData.findMany({});

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
