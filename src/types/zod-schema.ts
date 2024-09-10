import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEOS_TYPES,
  holidayDates,
  MAX_FILE_SIZE,
  MAX_VIDEO_SIZE,
} from "@/constant";

import { z } from "zod";

export type LeaveReasonType =
  | "SHORT"
  | "LONG"
  | "MEDICAL"
  | "GOVERNMENT"
  | "FESTIVE";

export const studentRegisterFormSchema = z
  .object({
    studentemail: z
      .string()
      .refine((studentemail) => studentemail.endsWith("@woxsen.edu.in"), {
        message: "Email must be in the @woxsen.edu.in format",
      }),
    otp: z.string().min(1, {
      message: "OTP is required",
    }),
    department: z.enum(["BBA", "BCOM"]),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(50, { message: "Password must not exceed 50 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).*$/,
        {
          message: "Use A-Z, a-z, 0-9, and special characters",
        }
      ),
    confirmpassword: z.string().min(2, {
      message: "Confirm Password is required",
    }),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  });

export const studentLoginFormSchema = z.object({
  studentemail: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
});

export const leaveApplicationFormSchema = z.object({
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  reasonForLeave: z.object({
    reason: z.string().min(2).max(500, {
      message: "Reason must be between 2 and 500 characters",
    }),
    type: z.string().min(2),
  }),
  document: z
    .any()
    .refine((files) => files?.size <= MAX_FILE_SIZE, "Max file size is 5MB")
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.type),
      ".jpg, .jpeg, .png, and .webp files are accepted"
    )
    .optional(),
  video: z
    .any()
    .refine((files) => files.size <= MAX_VIDEO_SIZE, "Max file size is 10MB")
    .refine(
      (files) => ACCEPTED_VIDEOS_TYPES.includes(files?.type),
      ".mp4, .webm, .ogg, and .quicktime videos are accepted"
    )
    .optional(),
});
