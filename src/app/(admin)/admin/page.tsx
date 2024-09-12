import AdminDashboard from "@/components/dashboads/admin-dashboard";
import AdminNavbar from "@/components/navbar/admin-navbar";
import React from "react";

const AdminPage = () => {
  return (
    <div className="w-full h-full">
      <AdminNavbar />
      <AdminDashboard />
    </div>
  );
};

export default AdminPage;
