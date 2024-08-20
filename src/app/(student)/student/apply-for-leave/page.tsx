import LeaveApplication from "@/components/forms/leave-application-form";
import StudentNavbar from "@/components/navbar/student-navbar";
import React from "react";

const ApplyForLeave = () => {
  return (
    <div className="w-full h-full ">
      <StudentNavbar />
      <LeaveApplication />
    </div>
  );
};

export default ApplyForLeave;
