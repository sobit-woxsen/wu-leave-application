"use server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getCurrentUserId() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  console.log(token);

  if (!token) {
    return null;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }
    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    const userId = decoded.id;

    return userId;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
