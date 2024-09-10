import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const userToken = request.cookies.get("token");
  const adminToken = request.cookies.get("adminToken");

  if (request.nextUrl.pathname.startsWith("/student")) {
    if (!userToken) {
      return NextResponse.redirect(new URL("/student/login", request.url));
    }
  } else if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student",
    "/student/applications",
    "/student/apply-for-leave",
    "/student/application-status",
    "/admin",
    "/admin/applications",
  ],
};
