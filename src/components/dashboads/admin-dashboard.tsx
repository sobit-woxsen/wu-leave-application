import Link from "next/link";
import React from "react";

const AdminDashboard = () => {
  return (
    <div>
      <h1>Faculty Dashboard</h1>
      <Link className="text-sm text-blue-600" href="/admin/applications">
        See all the applications
      </Link>
    </div>
  );
};

export default AdminDashboard;
