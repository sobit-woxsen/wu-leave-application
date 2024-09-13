import prisma from "@/prisma";
import { studentLoginFormSchema } from "@/types/zod-schema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
          status: 404,
        }
      );
    }

    const { studentemail, password } = result.data;

    const user = await prisma.user.findUnique({
      where: { studentEmail: studentemail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user.id, email: user.studentEmail, department: user.department },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      message: "Login successful",
      userId: user.id,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    response.headers.set("token", token);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        message: "Failed to login",
        error: error,
      },
      {
        status: 500,
      }
    );
  }
}
