"use client";

import React, { useEffect, useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "../../lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  reasonForLeave: z.object({
    reason: z.string().min(2).max(50, {
      message: "Reason must be between 2 and 50 characters",
    }),
    type: z.string().min(2),
  }),
  document: z.string().min(2).max(50),
  video: z.string().min(2).max(50),
});

// LEAVE REASONS
const reasons = [
  { reason: "Long leave for the student's medical issue", type: "LONG" },
  {
    reason:
      "Long leave for the medical issue of a student's parents or grandparents",
    type: "LONG",
  },
  { reason: "Short leave for festivals", type: "FESTIVE" },
  {
    reason: "Short leave for government office appointments",
    type: "GOVERMENT",
  },
  { reason: "Short leave for doctor's appointments", type: "MEDICAL" },
  { reason: "Other reasons", type: "OTHER" },
];

const LeaveApplicationForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const reasonForLeave = form.watch("reasonForLeave");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("VALUES");
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-lg mx-auto space-y-4 md:mt-20"
      >
        <h2 className="text-xl font-medium">Leave Application Form</h2>

        {/* Start and End Date of Leave */}
        <section className="flex-col space-y-5 md:flex md:flex-row md:space-y-0  justify-between items-center">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Pick start date of leave</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full md:w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Pick last date of leave</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full md:w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Reason for Leave */}
        <FormField
          control={form.control}
          name="reasonForLeave"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select your reason for leave</FormLabel>
              <Select
                onValueChange={(value) =>
                  field.onChange({
                    reason: JSON.parse(value)?.reason,
                    type: JSON.parse(value)?.type,
                  })
                }
                defaultValue={field.value?.reason}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason " />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {reasons.map((reason, index) => (
                    <SelectItem key={index} value={JSON.stringify(reason)}>
                      {reason?.reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* If reason is of type OTHERS */}
        {reasonForLeave?.type === "OTHER" && (
          <FormField
            control={form.control}
            name="reasonForLeave"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mention your reason</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Briefly mention your reason for leave..."
                    className="resize-none"
                    {...field}
                    value={
                      reasonForLeave.reason === "Other reasons"
                        ? ""
                        : form.getValues("reasonForLeave")?.reason
                    }
                    onChange={(e) => {
                      const reasonType = form.getValues("reasonForLeave")?.type;
                      form.setValue("reasonForLeave", {
                        type: reasonType,
                        reason: e.target.value,
                      });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Supporting Document for Leave */}
        <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supporting Document</FormLabel>
              <FormControl>
                <Input
                  placeholder="Choose supporting document"
                  {...field}
                  type="file"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Supporting Video  */}
        <FormField
          control={form.control}
          name="video"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supporting video from your parents</FormLabel>
              <FormControl>
                <Input
                  placeholder="Choose supporting document"
                  {...field}
                  type="file"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full  bg-brand/90 hover:bg-brand" type="submit">
          Apply for Leave
        </Button>
      </form>
    </Form>
  );
};

export default LeaveApplicationForm;
