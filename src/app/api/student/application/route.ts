import { getCurrentUserId } from "@/actions/getCurrentUserId";
import prisma from "@/prisma";
import { leaveApplicationFormSchema } from "@/types/zod-schema";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userId = await getCurrentUserId();

    if (userId) {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      const applications = await prisma.leaveApplication.findUnique({
        where: {
          id: userId,
        },
      });

      console.log("USER ", user);
      console.log("APPLICATIONS ", applications);
    }

    console.log("FORMMDATA ", formData);
    console.log("USER ID ", userId);

    const body = {
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      reasonForLeave: JSON.parse(formData.get("reasonForLeave") as string),
    };

    const result = leaveApplicationFormSchema
      .omit({ video: true, document: true })
      .safeParse(body);

    if (!result.success) {
      console.log("FAILED SAFE PARSE");
      return NextResponse.json(
        {
          message: "Failed to apply for leave applications",
        },
        {
          status: 404,
        }
      );
    }

    const data = result.data;
    console.log("DATA ", data);

    // find the current user
    // update the applications for that user
    // success message

    return NextResponse.json({
      message: "Application Applied successfully",
      token: data,
    });
  } catch (error) {
    console.log("ERROR [/api/student/application] : ", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
