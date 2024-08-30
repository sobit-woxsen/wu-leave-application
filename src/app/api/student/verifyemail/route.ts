import prisma from "@/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "sobit.prasad@woxsen.edu.in",
    pass: "sobit@wu1999",
  },
});
const checkEmailValid = async (
  department: string,
  email: string
): Promise<boolean> => {
  const student = await (department === "BBA"
    ? prisma.bBAStudentData.findFirst({
        where: {
          studentEmail: {
            equals: email,
            mode: "insensitive",
          },
        },
      })
    : department === "B.Com"
    ? prisma.bCOMStudentData.findFirst({
        where: {
          studentEmail: {
            equals: email,
            mode: "insensitive",
          },
        },
      })
    : null);

  return student !== null;
};

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function updateOTP(
  department: string,
  email: string,
  otp: string
) {
  try {
    const student =
      department === "BBA"
        ? await prisma.bBAStudentData.findFirst({
            where: { studentEmail: email },
          })
        : department === "B.Com"
        ? await prisma.bCOMStudentData.findFirst({
            where: {
              studentEmail: email,
            },
          })
        : null;

    if (!student) {
      return false;
    }

    await prisma.oTPVerify.upsert({
      where: { studentId: student.id },
      update: {
        otp: parseInt(otp),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      create: {
        studentId: student.id,
        otp: parseInt(otp),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    return true;
  } catch (error) {
    console.error("Error updating OTP:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { department, email } = await request.json();

    console.log(email);

    // verify email
    const isEmailValid = await checkEmailValid(department, email);

    if (!isEmailValid) {
      return NextResponse.json({
        message: "Invalid email address",
        status: 404,
      });
    }

    const OTP = generateOTP();
    await updateOTP(department, email, OTP);

    await transporter.sendMail({
      from: '"Woxsen University" <sobit.prasad@woxsen.edu.in>',
      to: "sobit.prasad@woxsen.edu.in, sobitp59@gmail.com",
      subject: "Verify Your Email - Woxsen University",
      html: `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - Woxsen University</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <header style="text-align: center; margin-bottom: 20px;">
              <img src="/wu-logo.png" alt="Woxsen University Logo" style="max-width: 200px;">
          </header>
          <main>
              <h1 style="color: #003366;">Verify Your Email</h1>
              <p>Dear Student,</p>
              <p>Thank you for registering with Woxsen University. To complete your registration, please use the following One-Time Password (OTP) to verify your email address:</p>
              <div style="background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
                  ${OTP}
              </div>
              <p>This OTP is valid for 10 minutes. If you didn't request this verification, please ignore this email.</p>
              <p>If you have any questions, please don't hesitate to contact our support team.</p>
          </main>
          <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #666;">
              <p>© 2023 Woxsen University. All rights reserved.</p>
          </footer>
      </div>
  </body>
  </html>
  `, // html body
    });

    return NextResponse.json({
      message: "OTP Send successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Failed to send OTP",
      status: 400,
      error: error,
    });
  }
}
