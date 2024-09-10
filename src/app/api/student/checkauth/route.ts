import jwt from "jsonwebtoken";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const encryptedSession = cookieStore.get("token")?.value;

  console.log("TOKEN ", encryptedSession);

  const session = encryptedSession
    ? jwt.verify(encryptedSession, process.env.JWT_SECRET!)
    : null;

  console.log("session here ", session);

  return NextResponse.json({ session });
}
