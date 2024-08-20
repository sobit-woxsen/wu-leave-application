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
import { Input } from "@/components/ui/input";
import Link from "next/link";
const formSchema = z.object({
  studentemail: z.string().min(2).max(50),
  verificationCode: z.string().min(2).max(50),
});
const StudentForgetPasswordForm = () => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentemail: "",
      verificationCode: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="studentemail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Please enter your email</FormLabel>
              <FormControl>
                <Input placeholder="admin@woxsen.edu.in" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isOpen ? (
          <FormField
            control={form.control}
            name="verificationCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        <Button className="w-full  bg-brand/90 hover:bg-brand" type="submit">
          {isOpen ? "Send Verification Code" : "Verify"}
        </Button>
      </form>

      <section className="flex space-x-1  text-sm">
        <p>Don't have an account yet? </p>
        <Link className="text-brand underline" href="/admin/register">
          Create One
        </Link>
      </section>
    </Form>
  );
};

export default StudentForgetPasswordForm;
