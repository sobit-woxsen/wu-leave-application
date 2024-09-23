import prisma from "@/prisma";
import { NextResponse } from "next/server";

const verifyOTP = async (otp: number, studentId: string) => {
  const otpRecord = await prisma.oTPVerify.findFirst({
    where: {
      otp: otp,
      studentId: studentId,
      expiresAt: {
        gte: new Date(), // Check if OTP hasn't expired
      },
    },
  });

  const isOTPValid = otpRecord !== null;

  return isOTPValid;
};

export async function POST(request: Request) {
  try {
    const { otp, email } = await request.json();

    const student = await prisma.studentData.findFirst({
      where: {
        studentEmail: email,
      },
    });

    if (!student) {
      return NextResponse.json({
        message: "User not found",
        status: 404,
      });
    }

    const isOTPValid = await verifyOTP(otp, student?.id);

    if (!isOTPValid) {
      return NextResponse.json(
        { error: "Invalid OTP. Please enter correct OTP" },
        { status: 404 }
      );
    } else {
      return NextResponse.json(
        {
          message: "OTP verification successful",
          data: {
            isOTPValid: true,
          },
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json({
      message: "OTP verification failed",
      status: 400,
      error: error,
    });
  }
}
