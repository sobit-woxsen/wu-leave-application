import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { studentRegisterFormSchema } from "@/types/zod-schema";
import prisma from "@/prisma";
export async function GET() {
  return NextResponse.json({
    message: "USER REGISTERED successfully",
  });
}

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

    const token = jwt.sign(
      { email: studentemail, department: department },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const newUser = await prisma.user.create({
      data: {
        studentEmail: studentemail,
        department: department,
        password: hashedPassword,
      },
    });

    const response = NextResponse.json(
      {
        message: "User registered successfully",
        userId: newUser.id,
      },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error : ", error);
    return NextResponse.json(
      { message: "Failed to register" },
      { status: 500 }
    );
  }
}
