import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "APPLICATION approved/rejected successfully",
  });
}
