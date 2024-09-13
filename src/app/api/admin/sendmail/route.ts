import { getCurrentAdmin } from "@/actions/getCurrentAdmin";
import { leaveApprovalTemplate } from "@/components/email-templates/email-accepted-template";
import { leaveRejectionTemplate } from "@/components/email-templates/email-rejected-template";
import prisma from "@/prisma";
import { NextResponse, NextRequest } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin();

  if (!admin || !admin.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { isApplicationAccepted, parentEmail, studentEmail, applicationId } =
    await request.json();

  const application = await prisma.leaveApplication.findFirst({
    where: {
      studentEmail: studentEmail,
      id: applicationId,
    },
  });

  if (application) {
    await prisma.leaveApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        status: isApplicationAccepted ? "ACCEPTED" : "REJECTED",
      },
    });
  } else {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 }
    );
  }

  const username = process.env.NEXT_PUBLIC_BBA_ADMIN_USERNAME;

  const password = process.env.NEXT_PUBLIC_BBA_ADMIN_PASSWORD;

  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
      user: username as string,
      pass: password as string,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `Woxsen University - Leave Application" <${username}>`,
      to: `${studentEmail}, ${parentEmail}`,
      cc: isApplicationAccepted ? "cso@woxsen.edu.in" : "",
      subject: "Leave Application Status - Woxsen University",
      html: isApplicationAccepted
        ? leaveApprovalTemplate
        : leaveRejectionTemplate,
    });

    return NextResponse.json(
      { message: "Email send successfully", data: info },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email to the candidate" },
      { status: 500 }
    );
  }
}
