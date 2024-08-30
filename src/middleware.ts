import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import useAuthStore from "./stores/authStore";

const isLoggedIn: boolean = false;
const role: "ADMIN" | "STUDENT" = "STUDENT";

const privateUrls = {
  ADMIN: ["/student/applications"],
  STUDENT: [
    "/student/applications",
    "/student/application-status",
    "/student/apply-for-leave",
  ],
};
export async function middleware(request: NextRequest) {
  const authStore = await useAuthStore.getState();
  const isAuthenticated = await authStore.checkAuth();

  // if (!isAuthenticated && !request.nextUrl.pathname.startsWith("/login")) {
  //   return NextResponse.redirect(new URL("/student/login", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*"],
};
