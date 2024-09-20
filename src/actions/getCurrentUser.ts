"use server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return null;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }
    const decoded = await verifyAccessToken(token);

    const userId = decoded?.userId;
    const department = decoded?.department;
    const email = decoded?.email;

    return { userId, department, email };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
