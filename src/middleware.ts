// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";
// import { verifyAccessToken } from "./lib/auth";

// export const config = {
//   matcher: [
//     "/student/login",
//     "/admin/login",
//     "/student",
//     "/student/applications",
//     "/student/apply-for-leave",
//     "/student/application-status",
//     "/admin",
//     "/admin/applications",
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };

// export async function middleware(request: NextRequest) {
//   const userToken = request.cookies.get("accessToken")?.value;
//   const adminToken = request.cookies.get("adminAccessToken")?.value;
//   const path = request.nextUrl.pathname;

//   // Prevent redirect loops for refresh endpoints
//   if (
//     path.includes("/api/student/refresh") ||
//     path.includes("/api/admin/refresh")
//   ) {
//     return NextResponse.next();
//   }

//   if (path.startsWith("/student") && path !== "/student/login") {
//     if (!userToken) {
//       return NextResponse.redirect(new URL("/student/login", request.url));
//     }

//     try {
//       const payload = verifyAccessToken(userToken);
//       if (!payload) {
//         const response = NextResponse.redirect(
//           new URL("/student/login", request.url)
//         );
//         response.cookies.delete("accessToken");
//         return response;
//       }
//     } catch (error) {
//       console.error("Token verification error:", error);
//       const response = NextResponse.redirect(
//         new URL("/student/login", request.url)
//       );
//       response.cookies.delete("accessToken");
//       return response;
//     }
//   } else if (path.startsWith("/admin") && path !== "/admin/login") {
//     if (!adminToken) {
//       return NextResponse.redirect(new URL("/admin/login", request.url));
//     }

//     try {
//       const payload = verifyAccessToken(adminToken);
//       if (!payload) {
//         const response = NextResponse.redirect(
//           new URL("/admin/login", request.url)
//         );
//         response.cookies.delete("adminAccessToken");
//         return response;
//       }
//     } catch (error) {
//       console.error("Token verification error:", error);
//       const response = NextResponse.redirect(
//         new URL("/admin/login", request.url)
//       );
//       response.cookies.delete("adminAccessToken");
//       return response;
//     }
//   }

//   return NextResponse.next();
// }

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyAccessToken } from "./lib/auth";

export const config = {
  matcher: [
    "/student/login",
    "/admin/login",
    "/student",
    "/student/applications",
    "/student/apply-for-leave",
    "/student/application-status",
    "/admin",
    "/admin/applications",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

export async function middleware(request: NextRequest) {
  const userToken = request.cookies.get("accessToken")?.value;
  const adminToken = request.cookies.get("adminAccessToken")?.value;
  const userRefreshToken = request.cookies.get("refreshToken")?.value;
  const adminRefreshToken = request.cookies.get("adminRefreshToken")?.value;
  const path = request.nextUrl.pathname;

  if (path.startsWith("/student") && path !== "/student/login") {
    if (!userToken) {
      return NextResponse.redirect(new URL("/student/login", request.url));
    }

    try {
      const payload = verifyAccessToken(userToken);
      if (!payload) {
        // Token is invalid or expired, attempt to refresh
        if (userRefreshToken) {
          const response = await fetch("/api/student/refresh", {
            method: "POST",
          });
          const newAccessToken = await response.text();
          if (newAccessToken) {
            // Refresh successful, update the token and continue
            const nextResponse = NextResponse.next();
            nextResponse.cookies.set("accessToken", newAccessToken, {
              httpOnly: true,
              secure: false,
              sameSite: "lax",
              maxAge: 15 * 60, // 15 minutes
            });
            return nextResponse;
          }
        }
        // Refresh failed or no refresh token, redirect to login
        const response = NextResponse.redirect(
          new URL("/student/login", request.url)
        );
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
      }
    } catch (error) {
      console.error("Token verification error:", error);
      const response = NextResponse.redirect(
        new URL("/student/login", request.url)
      );
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }
  } else if (path.startsWith("/admin") && path !== "/admin/login") {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const payload = verifyAccessToken(adminToken);
      if (!payload) {
        // Token is invalid or expired, attempt to refresh
        if (adminRefreshToken) {
          const response = await fetch("/api/student/refresh", {
            method: "POST",
          });
          const newAccessToken = await response.text();
          if (newAccessToken) {
            // Refresh successful, update the token and continue
            const response = NextResponse.next();
            response.cookies.set("adminAccessToken", newAccessToken, {
              httpOnly: true,
              secure: false,
              sameSite: "lax",
              maxAge: 15 * 60, // 15 minutes
            });
            return response;
          }
        }
        // Refresh failed or no refresh token, redirect to login
        const response = NextResponse.redirect(
          new URL("/admin/login", request.url)
        );
        response.cookies.delete("adminAccessToken");
        response.cookies.delete("adminRefreshToken");
        return response;
      }
    } catch (error) {
      console.error("Token verification error:", error);
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      response.cookies.delete("adminAccessToken");
      response.cookies.delete("adminRefreshToken");
      return response;
    }
  }

  return NextResponse.next();
}
