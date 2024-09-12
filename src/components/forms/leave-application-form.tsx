"use client";

import React, { useEffect, useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, isWeekend } from "date-fns";
import { cn, getTotalLeaveDays, isHoliday } from "../../lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import toast from "react-hot-toast";
import { leaveApplicationFormSchema } from "@/types/zod-schema";
import { holidayDates, leaveReasonsData } from "@/constant";
import { uploadFile } from "@/actions/uploadFile";
import { useRouter } from "next/navigation";

// LEAVE REASONS
const LeaveApplicationForm = () => {
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [totalLeaveDays, setTotalLeaveDays] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [leaveReasons, setLeaveReasons] = useState(leaveReasonsData);
  const router = useRouter();

  const form = useForm<z.infer<typeof leaveApplicationFormSchema>>({
    resolver: zodResolver(leaveApplicationFormSchema),
  });

  const reasonForLeave = form.watch("reasonForLeave");
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  async function onSubmit(values: z.infer<typeof leaveApplicationFormSchema>) {
    setFormSubmitting(true);
    const formData = new FormData();

    formData.append("startDate", values.startDate.toISOString());
    formData.append("endDate", values.endDate.toISOString());
    formData.append("reasonForLeave", JSON.stringify(values.reasonForLeave));

    const documentFile = values?.document;
    const videoFile = values?.video;

    if (documentFile) {
      const docFileUrl = await uploadFile(documentFile);
      if (docFileUrl) {
        formData.append("documentUrl", docFileUrl);
      }
    }

    if (videoFile) {
      const videoFileUrl = await uploadFile(videoFile);
      if (videoFileUrl) {
        formData.append("videoUrl", videoFileUrl);
      }
    }

    if (startDate && endDate) {
      formData.append("totalLeaves", totalLeaveDays.toString());
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/student/application`,
        {
          method: "POST",
          body: formData,
        }
      );

      const json = await response.json();
      console.log("APPLIJSON", json);

      if (!response.ok) {
        toast.error(json.error);
        return;
      }

      toast.success(json.message);
      router.push("/student/application-status");
    } catch (error) {
      console.log("ERROR : ", error);
    } finally {
      setFormSubmitting(false);
    }
  }

  useEffect(() => {
    if (startDate && endDate) {
      const totalLeaves = getTotalLeaveDays(startDate, endDate);
      setTotalLeaveDays(totalLeaves);
    }
  }, [startDate, endDate]);

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
                        date < new Date() ||
                        isWeekend(date) ||
                        isHoliday(date, holidayDates)
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
                        date < form.getValues("startDate") ||
                        isWeekend(date) ||
                        isHoliday(date, holidayDates)
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
        <FormLabel className="">Select your reason for leave</FormLabel>
        <Select onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select leave category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Regular">Regular</SelectItem>
            <SelectItem value="Medical">Medical</SelectItem>
            <SelectItem value="Emergency">Emergency</SelectItem>
          </SelectContent>
        </Select>

        {selectedCategory ? (
          <>
            <FormField
              control={form.control}
              name="reasonForLeave"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Select your reason for leave</FormLabel> */}
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
                      {leaveReasons[
                        selectedCategory as keyof typeof leaveReasons
                      ]?.map((reason, index) => (
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
          </>
        ) : null}

        {/* If reason is of type OTHERS */}
        {reasonForLeave?.type === "OTHERS" && (
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
        {selectedCategory === "Regular" &&
          reasonForLeave?.type === "GOVERNMENT" && (
            <FormField
              control={form.control}
              name="document"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Supporting Document</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Choose supporting document"
                      type="file"
                      accept=".png,.jpeg,.jpg,.pdf"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                          const file = files[0];
                          onChange(file);
                        }
                      }}
                      {...rest}
                      // value={value instanceof File ? value.name : undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

        {selectedCategory === "Medical" && (
          <FormField
            control={form.control}
            name="document"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel>Supporting Document</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Choose supporting document"
                    type="file"
                    accept=".png,.jpeg,.jpg,.pdf"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        const file = files[0];
                        onChange(file);
                      }
                    }}
                    {...rest}
                    // value={value instanceof File ? value.name : undefined}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {selectedCategory === "Emergency" && (
          <FormField
            control={form.control}
            name="document"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel>Supporting Document</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Choose supporting document"
                    type="file"
                    accept=".png,.jpeg,.jpg,.pdf"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        const file = files[0];
                        onChange(file);
                      }
                    }}
                    {...rest}
                    // value={value instanceof File ? value.name : undefined}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Supporting Video  */}
        {selectedCategory === "Emergency" ? (
          <FormField
            control={form.control}
            name="video"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel>Supporting video from your parents</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Choose supporting video"
                    type="file"
                    accept="video/mp4,video/webm,video/ogg"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        const file = files[0];
                        onChange(file);
                      }
                    }}
                    {...rest}
                    // value={value instanceof File ? value : undefined}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        <Button
          disabled={formSubmitting}
          className="w-full  bg-brand/90 hover:bg-brand"
          type="submit"
        >
          Apply for Leave
        </Button>
      </form>
    </Form>
  );
};

export default LeaveApplicationForm;
