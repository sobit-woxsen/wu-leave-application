"use client";
import React from "react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
const formSchema = z.object({
  adminemail: z
    .string()
    .refine((studentemail) => studentemail.endsWith("@woxsen.edu.in"), {
      message: "Email must be in the @woxsen.edu.in format",
    }),
  password: z
    .string()
    .min(8, {
      message: "Password should be greater than 8",
    })
    .max(50, {
      message: "Password is required",
    }),
});

const departments = ["BBA", "BCOM"];

const AdminLoginForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adminemail: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...values, email: values.adminemail }),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        toast.error(json.error);
      } else {
        toast.success(json.message);

        router.push("/admin");
      }
    } catch (error) {
      toast.error("Something went wrong! Please try after sometime");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        {/* <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select department</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        /> */}

        <FormField
          control={form.control}
          name="adminemail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Email</FormLabel>
              <FormControl>
                <Input placeholder="admin@woxsen.edu.in" {...field} />
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
              <FormLabel>Enter Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <Link
          href={"/admin/forget-password"}
          className="text-xs flex justify-end text-brand"
        >
          Forget Password?
        </Link> */}
        <Button className="w-full  bg-brand/90 hover:bg-brand" type="submit">
          Login
        </Button>
      </form>

      {/* <section className="flex space-x-1  text-sm">
        <p>Don't have an account yet? </p>
        <Link className="text-brand underline" href="/admin/register">
          Create One
        </Link>
      </section> */}
    </Form>
  );
};

export default AdminLoginForm;
