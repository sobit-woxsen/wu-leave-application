import LoginRedirectButton from "@/components/buttons/login-redirect-button";
import LoginRedirect from "@/components/buttons/login-redirect-button";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center  space-y-40 pt-16 p-5 md:p-24">
      <Image
        src="/wu-logo.png"
        alt="Woxsen University Logo"
        width={100}
        height={24}
        priority
      />

      <div className="flex justify-between items-center flex-col space-y-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Welcome To <span className="text-brand">Woxsen University</span> Leave
          Application Portal
        </h2>
        <p className="text-slate-900 text-center leading-5">
          Manage your leave applications seamlessly
        </p>

        <section className="flex justify-center items-center gap-5">
          <LoginRedirectButton to="STUDENT" path="/student/login">
            Student Login
          </LoginRedirectButton>
          <LoginRedirectButton to="ADMIN" path="/admin/login">
            Admin Login
          </LoginRedirectButton>
        </section>
      </div>
    </main>
  );
}
