import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Check if all the fileds are there
  if (!email || !password) {
    return NextResponse.json(
      {
        error: "All fields are required",
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
    return NextResponse.json({ error: "No user found" }, { status: 404 });
  }

  // Check for password
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const adminToken = jwt.sign(
    { id: user.id, email: user.adminEmail },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  const response = NextResponse.json(
    {
      message: "Login successful",
      data: {
        userId: user.id,
      },
    },
    { status: 200 }
  );

  response.cookies.set("adminToken", adminToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  response.headers.set("adminToken", adminToken);

  return response;
}
