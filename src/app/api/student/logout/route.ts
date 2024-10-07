import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();

  cookieStore.set("accessToken", "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );
}
