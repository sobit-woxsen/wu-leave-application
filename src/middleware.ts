import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import useAuthStore from "./stores/authStore";

export async function middleware(request: NextRequest) {
  const authStore = useAuthStore.getState();

  const token = request.cookies.get("token")!.value;

  const isAuth = await fetch("http://localhost:3000/api/student/checkauth", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
  const da = await isAuth.json();

  const status = da.isAuthenticated ? true : false;
  authStore.setAuthStatus(status);

  const isAuthenticated = authStore.isAuthenticated;

  if (!isAuthenticated && !request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/student/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student",
    "/student/applications",
    "/student/apply-for-leave",
    "/student/application-status",
  ],
};
