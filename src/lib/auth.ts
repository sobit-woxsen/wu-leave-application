// import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { jwtVerify, SignJWT } from "jose";
import { Department } from "@prisma/client";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const JWT_REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET!
);

export function generateAccessToken(
  userId: string,
  email: string,
  department: Department
): Promise<string> {
  return new SignJWT({ userId, email, department })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .sign(JWT_SECRET);
}

export function generateRefreshToken(
  userId: string,
  email: string,
  department: Department
): Promise<string> {
  return new SignJWT({ userId, email, department })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_REFRESH_SECRET);
}

export async function verifyAccessToken(
  token: string
): Promise<{ userId: string; email: string; department: Department } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; email: string; department: Department };
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(
  token: string
): Promise<{ userId: string; email: string; department: Department } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET);
    return payload as { userId: string; email: string; department: Department };
  } catch {
    return null;
  }
}

// get token from cookies
export function getTokenFromCookies(): {
  accessToken: string | null;
  refreshToken: string | null;
} {
  const cookieStore = cookies();
  return {
    accessToken: cookieStore.get("accessToken")?.value || null,
    refreshToken: cookieStore.get("refreshToken")?.value || null,
  };
}
