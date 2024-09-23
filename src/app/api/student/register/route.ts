import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { studentRegisterFormSchema } from "@/types/zod-schema";
import prisma from "@/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = studentRegisterFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({
        message: "Validation failed",
        errors: result.error.errors,
        status: 400,
      });
    }

    const { studentemail, department, password } = result.data;

    const studentInfo = await prisma.studentData.findUnique({
      where: { studentEmail: studentemail, department },
    });

    console.log("STUDENT INFO ", studentInfo);

    if (!studentInfo) {
      return NextResponse.json(
        { message: "No student found" },
        { status: 400 }
      );
    }

    const isEmailAlreadyRegistered = studentInfo.isRegistered;

    // const studentData = await prisma.studentData.findFirst({
    //   where: {
    //     studentEmail: studentemail,
    //     department: department,
    //   },
    //   select: {
    //     isRegistered: true,
    //   },
    // });

    if (isEmailAlreadyRegistered) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await prisma.studentData.update({
      where: {
        studentEmail: studentemail,
      },
      data: {
        password: hashedPassword,
        isRegistered: true,
      },
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        userId: student.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error : ", error);
    return NextResponse.json(
      {
        message: "Failed to register",
        error: `Error in /api/student/register [POST] : ${
          (error as Error).message
        }`,
      },
      { status: 500 }
    );
  }
}
