"use server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Department } from "@prisma/client";

export async function getCurrentAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get("adminToken")?.value;
  console.log(token);

  if (!token) {
    return null;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }
    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      department: Department;
      email: string;
    };
    const userId = decoded.id;
    const email = decoded.email;

    return { userId, email };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
