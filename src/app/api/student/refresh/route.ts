import { generateAccessToken, verifyRefreshToken } from "@/lib/auth";
import prisma from "@/prisma";
import { Department } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "No refresh token found" },
        { status: 401 }
      );
    }

    const payload = await verifyRefreshToken(refreshToken);

    if (!payload) {
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const user = await prisma.studentData.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const newAccessToken = await generateAccessToken(
      user.id,
      user.studentEmail,
      user.department as Department
    );

    const response = NextResponse.json({ accessToken: newAccessToken });

    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({
      message: "Error refreshing token",
      error: `Error in /api/student/refresh [POST] : ${
        (error as Error).message
      }`,
    });
  }
}
