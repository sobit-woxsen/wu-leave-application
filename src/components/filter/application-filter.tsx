"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, ResetIcon } from "@radix-ui/react-icons";
import { FaFilter } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getFilterApplications } from "@/actions/filterApplications";
import { Department } from "@prisma/client";
import toast from "react-hot-toast";
import { TLeaveApplication } from "@/constant";
import { resetFilterApplications } from "@/actions/resetFilterApplication";

const formSchema = z.object({
  search: z.string().optional(),
  dateApplied: z.date().optional(),
  reasonType: z
    .enum(["REGULAR", "MEDICAL", "GOVERNMENT", "EMERGENCY", "OTHERS"])
    .optional(),
  status: z.enum(["ACCEPTED", "REJECTED", "PENDING"]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ApplicationFilter({
  department,
  setLeaveApplications,
}: {
  department: Department;
  setLeaveApplications: Dispatch<SetStateAction<TLeaveApplication[]>>;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showMobileCalendar, setShowMobileCalendar] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  });

  async function onSubmit(values: FormValues) {
    const result = await getFilterApplications(values as FormData, department);

    if (!result) {
      toast.error("Something went wrong");
      return;
    }

    console.log("RESULT ", result);

    if ("error" in result) {
      console.error(result.error);
    } else {
      setLeaveApplications(result);
    }
    setIsDialogOpen(false);
  }

  async function handleResetApplication(
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    form.reset();
    try {
      const result = await resetFilterApplications(department);
      if (!result) {
        toast.error("Something went wrong");
        return;
      }

      if ("error" in result) {
        console.error(result.error);
      } else {
        setLeaveApplications(result);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.log("ERROR : ", error);
      setIsDialogOpen(false);
      toast.error("Something went wrong");
    }
  }

  const DatePickerField = ({ field }: { field: any }) => (
    <FormItem>
      <FormLabel>Date Applied</FormLabel>
      {isMobile ? (
        <div>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-left font-normal"
            onClick={() => setShowMobileCalendar(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {field.value ? (
              format(field.value, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
          {showMobileCalendar && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded-lg">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    field.onChange(date);
                    setShowMobileCalendar(false);
                  }}
                  disabled={(date) => date < new Date("1900-01-01")}
                  initialFocus
                />
                <Button
                  type="button"
                  className="mt-4 w-full bg-brand/85 bg-brand"
                  onClick={() => setShowMobileCalendar(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  !field.value && "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
    </FormItem>
  );

  const FilterContent = () => (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 md:space-y-0 md:grid md:grid-cols-4 md:gap-4"
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search</FormLabel>
              <FormControl>
                <Input placeholder="Search..." {...field} autoFocus />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateApplied"
          render={({ field }) => <DatePickerField field={field} />}
        />

        <FormField
          control={form.control}
          name="reasonType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="REGULAR">Regular</SelectItem>
                  <SelectItem value="MEDICAL">Medical</SelectItem>
                  <SelectItem value="GOVERNMENT">Government</SelectItem>
                  <SelectItem value="EMERGENCY">Emergency</SelectItem>
                  <SelectItem value="OTHERS">Others</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <div className="md:col-span-2 flex space-x-2">
          <Button type="submit" className="flex-1 bg-brand/85 hover:bg-brand">
            Apply Filters
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={(e) => handleResetApplication(e)}
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );

  return (
    <>
      {isMobile ? (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <FaFilter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Application Filters</DialogTitle>
            </DialogHeader>
            <FilterContent />
          </DialogContent>
        </Dialog>
      ) : (
        <div className="p-4 bg-white rounded-lg w-full border-[1.5px] border-gray-200">
          <p className="flex items-center mb-6">
            <FaFilter className="mr-2 h-4 w-4 text-brand" />
            Filters
          </p>
          <FilterContent />
        </div>
      )}
    </>
  );
}
