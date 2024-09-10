import StudentNavbar from "@/components/navbar/student-navbar";
import React from "react";

const StudentPage = () => {
  return (
    <div className="w-full h-full">
      <StudentNavbar />
      <h1 className="text-lg font-medium text-slate-700  mt-10">
        Student Page
      </h1>
    </div>
  );
};

export default StudentPage;
