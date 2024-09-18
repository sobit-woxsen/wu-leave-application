"use client";

import React, { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import toast from "react-hot-toast";
import { studentRegisterFormSchema } from "@/types/zod-schema";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { LoadingSpinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

const StudentRegisterForm = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [isOTPValid, setIsOTPValid] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof studentRegisterFormSchema>>({
    resolver: zodResolver(studentRegisterFormSchema),
    defaultValues: {
      studentemail: "",
      password: "",
      confirmpassword: "",
    },
  });

  const departments = ["BBA", "BCOM"];

  const watchDepartment = form.watch("department");
  const watchStudentEmail = form.watch("studentemail");
  const watchOtp = form.watch("otp");

  async function onSubmit(values: z.infer<typeof studentRegisterFormSchema>) {
    setIsFormSubmitting(true);
    try {
      const response = await fetch("/api/student/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const json = await response.json();

      if (!response.ok) {
        toast.error(json.error);
        return;
      }

      toast.success("Registration successful");
      router.push("/student/login");
      setIsFormSubmitting(false);
    } catch (error) {
      console.log("Error : ", error);
      setIsFormSubmitting(false);
      toast.error("Registration failed");
    } finally {
      setIsFormSubmitting(false);
    }
  }

  // Function to verify student email and send OTP
  const handleSendOTP = async () => {
    console.log(watchStudentEmail);

    setSendingOTP(true);

    try {
      if (!watchDepartment) {
        toast.error("Please select department");
        return;
      }

      const response = await fetch("/api/student/verifyemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: watchStudentEmail,
          department: watchDepartment,
        }),
      });
      const json = await response.json();
      if (!response.ok) {
        toast.error(json.error);
        setOtpSent(false);
        setSendingOTP(false);
        return;
      }

      setOtpSent(true);
      toast.success(`OTP send successfully to ${watchStudentEmail}`);
    } catch (error) {
      console.log("Failed to send otp");
      setSendingOTP(false);
    }
  };

  // Function to verify OTP
  const handleVerifyOTP = async () => {
    setVerifyingOTP(true);

    try {
      const response = await fetch("/api/student/verifyotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: watchStudentEmail,
          otp: parseInt(watchOtp),
          department: watchDepartment,
        }),
      });

      if (!response.ok) {
        toast.error("Invalid OTP");
        setVerifyingOTP(false);
        return;
      }

      const json = await response.json();
      setIsOTPValid(true);
      setVerifyingOTP(true);
      setIsEmailValid(true);
      toast.success("OTP Verification successful");
    } catch (error) {
      setIsOTPValid(false);
      setVerifyingOTP(false);
      setIsEmailValid(false);
      toast.error("OTP verification failed");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select department</FormLabel>
              <Select
                disabled={isEmailValid}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departments?.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="studentemail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student Email</FormLabel>
              <FormControl>
                <Input
                  disabled={isEmailValid}
                  placeholder="student@woxsen.edu.in"
                  {...field}
                />
              </FormControl>
              {isOTPValid ? (
                <FormDescription className="flex text-green-600 gap-1 items-center">
                  <CheckCircledIcon /> Email is valid
                </FormDescription>
              ) : null}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* some condition and OTP verify */}
        {watchStudentEmail?.endsWith("@woxsen.edu.in") && (
          <>
            {otpSent && !isOTPValid && (
              <>
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter OTP to verify your email</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  className="bg-brand/85  hover:bg-brand"
                  onClick={handleVerifyOTP}
                  type="button"
                  disabled={verifyingOTP}
                >
                  {!isOTPValid && verifyingOTP ? (
                    <LoadingSpinner />
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </>
            )}
            {!otpSent ? (
              <Button
                className="bg-brand/85  hover:bg-brand"
                onClick={handleSendOTP}
                type="button"
                disabled={sendingOTP}
              >
                {sendingOTP && watchDepartment ? (
                  <LoadingSpinner />
                ) : (
                  "Send OTP"
                )}
              </Button>
            ) : null}
          </>
        )}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmpassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={isEmailValid && isFormSubmitting}
          className="w-full  bg-brand/90 hover:bg-brand"
          type="submit"
        >
          {!isEmailValid && !isFormSubmitting ? (
            "Register"
          ) : isEmailValid && isFormSubmitting ? (
            <LoadingSpinner />
          ) : (
            "Register"
          )}
        </Button>
      </form>

      <section className="flex space-x-1  text-sm">
        <p>Already have an account? </p>
        <Link className="text-brand underline" href="/student/login">
          Log In
        </Link>
      </section>
    </Form>
  );
};

export default StudentRegisterForm;
