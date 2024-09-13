import { checkEmailValid } from "@/actions/checkEmailValid";
import { updateOTP } from "@/actions/updateOTP";
import { generateOTP } from "@/lib/utils";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "woxsenailab@gmail.com",
    pass: "ycoviljsqtfrtoul",
  },
});

export async function POST(request: Request) {
  try {
    const { department, email } = await request.json();

    const isEmailValid = await checkEmailValid(department, email);

    if (!isEmailValid) {
      return NextResponse.json({
        message: "Invalid email address",
        status: 404,
      });
    }

    const OTP = generateOTP();
    await updateOTP(department, email, OTP);

    const currentYear = new Date().getFullYear();

    const sendingEmail = await transporter.sendMail({
      from: '"Woxsen University" <woxsenailab@gmail.com>',
      to: `${email}`,
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
              <p>© ${currentYear} Woxsen University. All rights reserved.</p>
          </footer>
      </div>
  </body>
  </html>
  `,
    });

    if (!sendingEmail) {
      return NextResponse.json({ message: "Failed to send OTP", statu: 400 });
    }

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
