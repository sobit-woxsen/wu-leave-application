import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json(
      { isAuthenticated: true, token: token },
      { status: 200 }
    );
  } catch (error) {
    console.error("ERROR ", error);

    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }
}
