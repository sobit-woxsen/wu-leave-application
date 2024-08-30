"use client";
import React, { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { studentLoginFormSchema } from "@/types/zod-schema";
import toast from "react-hot-toast";
import { LoadingSpinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

const StudentLoginForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof studentLoginFormSchema>>({
    resolver: zodResolver(studentLoginFormSchema),
    defaultValues: {
      studentemail: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof studentLoginFormSchema>) {
    setLoading(true);
    try {
      const response = await fetch("/api/student/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("Invalid credentials");
      }
      const json = await response.json();
      console.log(json.data);
      setLoading(false);
      toast.success("Logged in successfully");
      router.push("/student");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Failed to login");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="studentemail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student Email</FormLabel>
              <FormControl>
                <Input placeholder="student@woxsen.edu.in" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Link
          href={"/student/forget-password"}
          className="text-xs flex justify-end text-brand"
        >
          Forget Password?
        </Link>
        <Button
          disabled={loading}
          className="w-full  bg-brand/90 hover:bg-brand"
          type="submit"
        >
          {loading ? <LoadingSpinner /> : "Login"}
        </Button>
      </form>

      <section className="flex space-x-1  text-sm">
        <p>Don't have an account yet? </p>
        <Link className="text-brand underline" href="/student/register">
          Create One
        </Link>
      </section>
    </Form>
  );
};

export default StudentLoginForm;
