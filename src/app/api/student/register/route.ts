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

    const isEmailAlreadyRegistered = await prisma.user.findFirst({
      where: {
        studentEmail: studentemail,
        department: department,
      },
    });

    if (isEmailAlreadyRegistered) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        studentEmail: studentemail,
        department: department,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        userId: newUser.id,
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
