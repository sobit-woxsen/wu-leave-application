import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Application Applied successfully",
  });
}
