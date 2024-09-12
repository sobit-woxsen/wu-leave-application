import StudentDashboard from "@/components/dashboads/student-dashbaord";
import StudentNavbar from "@/components/navbar/student-navbar";
import React from "react";

const StudentPage = () => {
  return (
    <div className="w-full h-full">
      <StudentNavbar />
      <StudentDashboard />
    </div>
  );
};

export default StudentPage;
