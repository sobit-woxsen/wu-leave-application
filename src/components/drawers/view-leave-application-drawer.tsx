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
import { FileIcon, PlayIcon } from "@radix-ui/react-icons";
import bcomStudents from "@/data/bba.json";

import BackgroundPlayer from "next-video/background-player";
import toast from "react-hot-toast";
import { Department } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

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

  const [isDocumentOpen, setIsDocumentOpen] = useState(false);
  const [isVideoPLayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [studentData, setStudentData] = useState<any>({});

  const handleToggleView = ({
    fileType,
  }: {
    fileType: "VIDEO" | "DOCUMENT";
  }) => {
    if (fileType === "VIDEO") {
      setIsVideoPlayerOpen((prev) => !prev);
      setIsDocumentOpen(false);
    } else {
      setIsDocumentOpen((prev) => !prev);
      setIsVideoPlayerOpen(false);
    }
  };

  const getStudentInfo = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/application`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentEmail, applicationId, department }),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        toast.error(json.error);
      }

      setStudentData(json.data);
    } catch (error) {
      console.log("ERROR :: ", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    getStudentInfo();
  }, [isOpen]);

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
                  {studentData?.degree === "UG" ? "yes" : "no"}
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
            </ul>

            <section className="my-5">
              {isVideoPLayerOpen ? (
                <BackgroundPlayer src={studentData?.videoUrl} />
              ) : null}
              {isDocumentOpen ? (
                // <div style={{ width: "100%", height: "500px" }}>
                //   <iframe
                //     src={studentData?.documentUrl}
                //     width="100%"
                //     height="100%"
                //     title="document viewer"
                //   />
                // </div>
                <Image
                  alt="doc"
                  src={studentData?.documentUrl}
                  width={0}
                  height={0}
                  className="w-[100%]"
                />
              ) : null}
            </section>

            <section className="flex gap-3">
              {studentData?.documentUrl && (
                <Link
                  className="border-[1.5px] p-3 rounded-md shadow-none text-xs flex gap-2 text-slate-600"
                  href={studentData?.documentUrl}
                  target="_blank"
                >
                  <FileIcon className="text-slate-400" />{" "}
                  {isDocumentOpen ? "Close" : "View"} Supporting Document
                </Link>
              )}

              {studentData?.videoUrl && (
                <Link
                  className="border-[1.5px] p-3 rounded-md shadow-none text-xs flex gap-2 text-slate-600"
                  href={studentData?.videoUrl}
                  target="_blank"
                >
                  <FileIcon className="text-slate-400" />{" "}
                  {isDocumentOpen ? "Close" : "View"} Supporting Video
                </Link>
              )}
            </section>
          </div>
          <DrawerFooter>
            <Button className="bg-green-600 text-white hover:bg-green-700">
              Accept
            </Button>
            <DrawerClose asChild>
              <Button className="bg-white text-black hover:bg-red-600 hover:text-white">
                Reject
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
