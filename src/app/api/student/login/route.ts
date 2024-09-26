import prisma from "@/prisma";
import { studentLoginFormSchema } from "@/types/zod-schema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth";
import { Department } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = studentLoginFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Failed to login",
        },
        {
          status: 400,
        }
      );
    }

    const { studentemail, password } = result.data;

    const user = await prisma.studentData.findUnique({
      where: { studentEmail: studentemail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    if (!user.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const accessToken = await generateAccessToken(
      user.id,
      user.studentEmail,
      user.department as Department
    );

    const refreshToken = await generateRefreshToken(
      user.id,
      user.studentEmail,
      user.department as Department
    );

    await prisma.studentData.update({
      where: { id: user.id },
      data: { refreshToken: String(refreshToken) },
    });

    const response = NextResponse.json({
      message: "Login successful",
      userId: user.id,
      accessToken,
    });

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 20 * 24 * 60 * 60,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Login error:", (error as Error).message);
    return NextResponse.json(
      {
        message: "Failed to login",
        error: `Error in /api/student/login ${(error as Error).message}`,
      },
      {
        status: 500,
      }
    );
  }
}
