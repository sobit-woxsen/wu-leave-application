import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth";
import { Department } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Check if all the fileds are there
    if (!email || !password) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    // Check for department and email
    const user = await prisma.admin.findFirst({
      where: {
        adminEmail: email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Check for password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const accessToken = await generateAccessToken(
      user.id,
      user.adminEmail,
      user.department as Department
    );
    const refreshToken = await generateRefreshToken(
      user.id,
      user.adminEmail,
      user.department as Department
    );

    const response = NextResponse.json({ accessToken, refreshToken });

    response.cookies.set("adminAccessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3 * 24 * 60 * 60,
      path: "/",
    });

    response.cookies.set("adminRefreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error logging in",
        error: `Error in /api/admin/login [POST] : ${(error as Error).message}`,
      },
      { status: 400 }
    );
  }
}
