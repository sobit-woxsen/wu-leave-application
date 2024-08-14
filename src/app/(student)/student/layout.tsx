import React from "react";

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen flex-col items-center  space-y-40 pt-16 p-5 md:p-24">
      {children}
    </main>
  );
};

export default StudentLayout;
