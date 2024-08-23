import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "USER REGISTERED successfully",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log(body);

    return NextResponse.json({
      message: "Data fetched successfully",
    });
  } catch (error) {
    return NextResponse.json({
      message: "Failed to register",
    });
  }
}
