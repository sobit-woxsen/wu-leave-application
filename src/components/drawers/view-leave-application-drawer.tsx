"use client";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  CheckIcon,
  Cross1Icon,
  FileIcon,
  PlayIcon,
} from "@radix-ui/react-icons";

import toast from "react-hot-toast";
import { Department } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { applicationStatus } from "@/constant";
import { getApplicationAndUserInfo } from "@/actions/getApplicationAndUserInfo";

export function ViewLeaveApplicationDrawer({
  studentEmail,
  applicationId,
  department,
}: {
  studentEmail: string;
  applicationId: string;
  department: Department;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [studentData, setStudentData] = useState<any>({});
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // const getStudentInfo = async () => {
  //   try {
  //     const response = await fetch(`/api/admin/application`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ studentEmail, applicationId, department }),
  //     });

  //     const json = await response.json();

  //     if (!response.ok) {
  //       toast.error(json.error);
  //     }

  //     setStudentData(json.data);
  //   } catch (error) {
  //     console.log("ERROR :: ", error);
  //     if (error instanceof Error) {
  //       toast.error(error.message);
  //     } else {
  //       toast.error("An unknown error occurred");
  //     }
  //   }
  // };

  const getStudentInfo = async () => {
    try {
      const result = await getApplicationAndUserInfo(
        studentEmail,
        applicationId
      );
      if (result?.error) {
        toast.error(result?.error);
      } else {
        console.log("res", result);
        setStudentData(result.data);
      }
    } catch (error) {
      console.log("ERROR :: ", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };
  const handleApplication = async ({
    isApplicationAccepted,
  }: {
    isApplicationAccepted: boolean;
  }) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/sendmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isApplicationAccepted,
          parentEmail: studentData?.fatherEmail,
          studentEmail: studentData?.studentEmail,
          applicationId: studentData?.applicationId,
        }),
      });

      const json = await response.json();
      if (!response.ok) {
        toast.error(json.error);
      }

      toast.success(json.message);
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      console.log("Error : ", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudentInfo();
  }, [isOpen]);

  console.log("STDUENT", studentData);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button className="bg-brand/85 hover:bg-brand text-white">
          See Application
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle>Leave Application</DrawerTitle>
            <DrawerDescription>
              Leave application of {studentData?.fullName}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 pb-0">
            <ul className="flex flex-col items-start justify-center">
              <li>
                <span className="font-medium">Degree</span>{" "}
                <span className="text-sm text-slate-600">
                  {studentData?.degree}
                </span>
              </li>
              <li>
                <span className="font-medium">Program </span>{" "}
                <span className="text-sm text-slate-600">
                  {studentData?.program}
                </span>
              </li>
              <li>
                <span className="font-medium">Enrollment Number </span>{" "}
                <span className="text-sm text-slate-600">
                  {studentData?.rollNumber}
                </span>
              </li>
              <li>
                <span className="font-medium">Student Name </span>{" "}
                <span className="text-sm text-slate-600">
                  {studentData?.fullName}
                </span>
              </li>
              <li>
                <span className="font-medium">Student Email </span>{" "}
                <span className="text-sm text-slate-600">
                  {studentData?.studentEmail?.toLowerCase()}
                </span>
              </li>
              <li>
                <span className="font-medium">Semester </span>{" "}
                <span className="text-sm text-slate-600">
                  {studentData?.semester}
                </span>
              </li>
              <li>
                <span className="font-medium">Academic Year </span>{" "}
                <span className="text-sm text-slate-600">
                  {studentData?.academicYear}
                </span>
              </li>
              <li>
                <span className="font-medium">Section </span>{" "}
                <span className="text-sm text-slate-600">
                  {studentData?.section}
                </span>
              </li>
              <li>
                <span className="font-medium">Father Email </span>{" "}
                <span className="text-sm text-slate-600">
                  {studentData?.fatherEmail}
                </span>
              </li>
              <li>
                <span className="font-medium">Leave Reason </span>{" "}
                <span className="text-sm text-slate-600">
                  {studentData?.leaveReason}
                </span>
              </li>
              <li>
                <span className="font-medium">Application Status </span>{" "}
                <span className="text-sm text-slate-600">
                  {studentData?.status &&
                    applicationStatus[
                      studentData.status as keyof typeof applicationStatus
                    ]}
                </span>
              </li>
            </ul>

            <section className="flex gap-3">
              {studentData?.documentUrl && (
                <Link
                  className="border-[1.5px] p-3 rounded-md shadow-none text-xs flex gap-2 text-slate-600"
                  href={studentData?.documentUrl}
                  target="_blank"
                >
                  <FileIcon className="text-slate-400" /> Supporting Document
                </Link>
              )}

              {studentData?.videoUrl && (
                <Link
                  className="border-[1.5px] p-3 rounded-md shadow-none text-xs flex gap-2 text-slate-600"
                  href={studentData?.videoUrl}
                  target="_blank"
                >
                  <FileIcon className="text-slate-400" /> Supporting Video
                </Link>
              )}
            </section>
          </div>
          <DrawerFooter>
            {studentData.status === "PENDING" && (
              <>
                <Button
                  onClick={() =>
                    handleApplication({ isApplicationAccepted: true })
                  }
                  className="bg-green-600 text-white hover:bg-green-700"
                  disabled={loading}
                >
                  Accept
                </Button>
                <DrawerClose asChild>
                  <Button
                    onClick={() =>
                      handleApplication({ isApplicationAccepted: false })
                    }
                    className="bg-white text-black hover:bg-red-600 hover:text-white"
                    disabled={loading}
                  >
                    Reject
                  </Button>
                </DrawerClose>
              </>
            )}

            {studentData.status === "ACCEPTED" ? (
              <p className="text-green-600 flex justify-center items-center gap-1 bg-green-50 p-4 rounded-md">
                <CheckIcon /> Application Accepted
              </p>
            ) : studentData.status === "REJECTED" ? (
              <p className="text-red-600 flex justify-center items-center gap-1 bg-red-50 p-4 rounded-md">
                {" "}
                <Cross1Icon />
                Application Rejected
              </p>
            ) : null}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
