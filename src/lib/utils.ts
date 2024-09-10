import { holidayDates } from "@/constant";
import { type ClassValue, clsx } from "clsx";
import { eachDayOfInterval } from "date-fns";
import { cookies } from "next/headers";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isHoliday(date: Date, holidays: string[]): boolean {
  return holidays.some((holiday) => {
    const holidayDate = new Date(holiday);
    return (
      holidayDate.getDate() === date.getDate() &&
      holidayDate.getMonth() === date.getMonth() &&
      holidayDate.getFullYear() === date.getFullYear()
    );
  });
}

export function getTotalLeaveDays(startDate: Date, endDate: Date) {
  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const workingDays = days.filter(
    (day) => !isWeekend(day) && !isHoliday(day, holidayDates)
  );
  const totalLeaveDays = workingDays.length;

  return totalLeaveDays;
}
