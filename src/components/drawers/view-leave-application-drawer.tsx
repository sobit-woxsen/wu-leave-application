"use client";
import React, { useState } from "react";

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
import bcomStudents from "@/data/bcom.json";

import BackgroundPlayer from "next-video/background-player";

export function ViewLeaveApplicationDrawer({
  studentEmail,
}: {
  studentEmail: string;
}) {
  const [isDocumentOpen, setIsDocumentOpen] = useState(false);
  const [isVideoPLayerOpen, setIsVideoPlayerOpen] = useState(false);

  const studentInfo = bcomStudents.find(
    (student) =>
      student.studentEmail.toLowerCase() === studentEmail.toLowerCase()
  );

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

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="bg-brand/85 hover:bg-brand text-white">
          Open Application
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle>Leave Application</DrawerTitle>
            <DrawerDescription>
              Leave application description here
            </DrawerDescription>
          </DrawerHeader>

          {/* TODO :  */}

          {/* {
    "degree": "UG",
    "admissionNumber": "WOU/2023/BBA/44210",
    "rollNumber": "23WU0201123",
    "academicYear": "2023-24",
    "sessionAcademicYear": "2023-24",
    "program": "Bachelor of Business Administration (Honours)- General",
    "semester": "Semester 2",
    "section": "Rhinoceros",
    "fullName": "Kanika Goyal",
    "DOB": "2004-08-29",
    "gender": "Female",
    "motherTongue": "Hindi",
    "religion": "Hindu",
    "smsPhoneNumber": 9012013031,
    "studentEmail": "kanika.goyal_2026@woxsen.edu.in",
    "country": "India",
    "fatherName": "Anuj Goyal",
    "fatherMobileNumber": 9837662702,
    "fatherEmail": "Goyalanuj588@gmail.com",
    "motherName": "Rachita Goyal",
    "motherMobileNumber": 8384811205,
    "admissionStatus": "Withdrawn"
  }, */}

          <div className="p-4 pb-0">
            <ul className="flex flex-col items-start justify-center">
              <li>
                <span className="font-medium">Degree </span>{" "}
                <span className="text-sm text-slate-600">
                  {studentInfo?.degree}
                </span>
              </li>
              <li>
                <span className="font-medium">Program </span>{" "}
                <span className="text-sm text-slate-600">
                  {studentInfo?.program}
                </span>
              </li>
              <li>
                <span className="font-medium">Enrollment Number </span>{" "}
                <span className="text-sm text-slate-600">
                  {studentInfo?.rollNumber}
                </span>
              </li>
              <li>
                <span className="font-medium">Student Name </span>{" "}
                <span className="text-sm text-slate-600">
                  {studentInfo?.fullName}
                </span>
              </li>
              <li>
                <span className="font-medium">Student Email </span>{" "}
                <span className="text-sm text-slate-600">
                  {studentInfo?.studentEmail.toLowerCase()}
                </span>
              </li>
              <li>
                <span className="font-medium">Semester </span>{" "}
                <span className="text-sm text-slate-600">
                  {studentInfo?.semester}
                </span>
              </li>
              <li>
                <span className="font-medium">Academic Year </span>{" "}
                <span className="text-sm text-slate-600">
                  {studentInfo?.academicYear}
                </span>
              </li>
              <li>
                <span className="font-medium">Section </span>{" "}
                <span className="text-sm text-slate-600">
                  {studentInfo?.section}
                </span>
              </li>
              <li>
                <span className="font-medium">Father Email </span>{" "}
                <span className="text-sm text-slate-600">
                  {studentInfo?.fatherEmail}
                </span>
              </li>
              <li>
                <span className="font-medium">Leave Reason </span>{" "}
                <span className="text-sm text-slate-600">
                  Lorem ipsum dolor sit amet.
                </span>
              </li>
            </ul>

            <section className="my-5">
              {isVideoPLayerOpen ? (
                <BackgroundPlayer src={`/videos/temp-video.mp4`} />
              ) : null}
              {isDocumentOpen ? (
                <div style={{ width: "100%", height: "500px" }}>
                  <iframe
                    src="/documents/temp-pdf.pdf"
                    width="100%"
                    height="100%"
                    title="document viewer"
                  />
                </div>
              ) : null}
            </section>

            <section className="flex gap-3">
              <Button
                variant={"outline"}
                className="shadow-none text-xs flex gap-2 text-slate-600"
                onClick={() => handleToggleView({ fileType: "DOCUMENT" })}
              >
                <FileIcon className="text-slate-400" />{" "}
                {isDocumentOpen ? "Close" : "View"} Document
              </Button>
              <Button
                variant={"outline"}
                className="shadow-none text-xs flex gap-2 text-slate-600"
                onClick={() => handleToggleView({ fileType: "VIDEO" })}
              >
                <PlayIcon className="text-slate-400" />{" "}
                {isVideoPLayerOpen ? "Close" : "Play"} Video
              </Button>
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
