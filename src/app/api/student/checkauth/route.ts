import jwt from "jsonwebtoken";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const encryptedSession = cookieStore.get("token")?.value;

  const session = encryptedSession
    ? jwt.verify(encryptedSession, process.env.JWT_SECRET!)
    : null;

  return NextResponse.json({ session });
}
