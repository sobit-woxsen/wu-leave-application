import Link from "next/link";
import React from "react";

const StudentDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl  font-semibold mb-6">Student Dashboard</h1>
      <Link
        className="text-sm text-blue-600"
        href="/student/application-status"
      >
        Check your application status
      </Link>
    </div>
  );
};

export default StudentDashboard;
