"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
type LoginRedirectButtonProps = {
  children: React.ReactNode;
  to: "STUDENT" | "ADMIN";
  path: string;
};

const LoginRedirectButton = ({
  to,
  children,
  path,
}: LoginRedirectButtonProps) => {
  const router = useRouter();

  const handleRedirect = (path: string) => {
    router.push(path);
  };

  return to === "STUDENT" ? (
    <Button
      className="bg-brand hover:bg-brand/80"
      onClick={() => handleRedirect(path)}
    >
      {children}
    </Button>
  ) : (
    <Button
      className="outline bg-transparent text-brand hover:text-white hover:bg-brand"
      onClick={() => handleRedirect(path)}
    >
      {children}
    </Button>
  );
};

export default LoginRedirectButton;
