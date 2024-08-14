import AdminRegisterForm from "@/components/forms/admin-register-form";
import Image from "next/image";
import React from "react";

const AdminRegister = () => {
  return (
    <>
      <Image
        src="/wu-logo.png"
        alt="Woxsen University Logo"
        width={100}
        height={24}
        priority
      />

      <div className="flex justify-between items-center flex-col space-y-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Register Admin
        </h2>
        <AdminRegisterForm />
      </div>
    </>
  );
};

export default AdminRegister;
