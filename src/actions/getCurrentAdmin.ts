"use server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";

export async function getCurrentAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get("adminAccessToken")?.value;

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
    const email = decoded?.email;
    const department = decoded?.department;

    return { userId, email, department };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
