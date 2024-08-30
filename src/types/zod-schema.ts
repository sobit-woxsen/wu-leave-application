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
