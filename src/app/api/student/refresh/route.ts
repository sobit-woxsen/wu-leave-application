// import { generateAccessToken, verifyRefreshToken } from "@/lib/auth";
// import prisma from "@/prisma";
// import { Department } from "@prisma/client";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
//   try {
//     const refreshToken = request.cookies.get("refreshToken")?.value;

//     if (!refreshToken) {
//       return NextResponse.json(
//         { message: "No refresh token found" },
//         { status: 401 }
//       );
//     }

//     const payload = await verifyRefreshToken(refreshToken);

//     if (!payload) {
//       return NextResponse.json(
//         { message: "Invalid refresh token" },
//         { status: 401 }
//       );
//     }

//     const user = await prisma.studentData.findUnique({
//       where: { id: payload.userId },
//     });

//     if (!user || user.refreshToken !== refreshToken) {
//       return NextResponse.json(
//         { message: "Invalid refresh token" },
//         { status: 401 }
//       );
//     }

//     const newAccessToken = await generateAccessToken(
//       user.id,
//       user.studentEmail,
//       user.department as Department
//     );

//     const response = NextResponse.json({ accessToken: newAccessToken });

//     response.cookies.set("accessToken", newAccessToken, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//       maxAge: 15 * 60,
//       path: "/",
//     });

//     return response;
//   } catch (error) {
//     return NextResponse.json({
//       message: "Error refreshing token",
//       error: `Error in /api/student/refresh [POST] : ${
//         (error as Error).message
//       }`,
//     });
//   }
// }

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/lib/auth";
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
      // If the user is not found or the refresh token doesn't match, invalidate the token
      if (user) {
        await prisma.studentData.update({
          where: { id: user.id },
          data: { refreshToken: null },
        });
      }
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Generate new access and refresh tokens
    const newAccessToken = await generateAccessToken(
      user.id,
      user.studentEmail,
      user.department as Department
    );
    const newRefreshToken = await generateRefreshToken(
      user.id,
      user.studentEmail,
      user.department as Department
    );

    // Update the user's refresh token in the database
    await prisma.studentData.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    const response = NextResponse.json({ accessToken: newAccessToken });

    // Set the new access token in the cookie
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60, // 15 minutes
      path: "/",
    });

    // Set the new refresh token in the cookie
    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.json(
      {
        message: "Error refreshing token",
        error: `Error in /api/student/refresh [POST]: ${
          (error as Error).message
        }`,
      },
      { status: 500 }
    );
  }
}
