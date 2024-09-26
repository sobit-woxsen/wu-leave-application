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
//   const userRefreshToken = request.cookies.get("refreshToken")?.value;
//   const adminRefreshToken = request.cookies.get("adminRefreshToken")?.value;
//   const path = request.nextUrl.pathname;

//   if (
//     path.startsWith("/student") &&
//     path !== "/student/login" &&
//     path !== "/student/register"
//   ) {
//     if (!userToken) {
//       return NextResponse.redirect(new URL("/student/login", request.url));
//     }

//     try {
//       const payload = verifyAccessToken(userToken);
//       if (!payload) {
//         // Token is invalid or expired, attempt to refresh
//         if (userRefreshToken) {
//           const response = await fetch("/api/student/refresh", {
//             method: "POST",
//           });
//           const newAccessToken = await response.text();
//           if (newAccessToken) {
//             // Refresh successful, update the token and continue
//             const nextResponse = NextResponse.next();
//             nextResponse.cookies.set("accessToken", newAccessToken, {
//               httpOnly: true,
//               secure: false,
//               sameSite: "lax",
//               maxAge: 15 * 60, // 15 minutes
//             });
//             return nextResponse;
//           }
//         }
//         // Refresh failed or no refresh token, redirect to login
//         const response = NextResponse.redirect(
//           new URL("/student/login", request.url)
//         );
//         response.cookies.delete("accessToken");
//         response.cookies.delete("refreshToken");
//         return response;
//       }
//     } catch (error) {
//       console.error("Token verification error:", error);
//       const response = NextResponse.redirect(
//         new URL("/student/login", request.url)
//       );
//       response.cookies.delete("accessToken");
//       response.cookies.delete("refreshToken");
//       return response;
//     }
//   } else if (path.startsWith("/admin") && path !== "/admin/login") {
//     if (!adminToken) {
//       return NextResponse.redirect(new URL("/admin/login", request.url));
//     }

//     try {
//       const payload = verifyAccessToken(adminToken);
//       if (!payload) {
//         // Token is invalid or expired, attempt to refresh
//         if (adminRefreshToken) {
//           const response = await fetch("/api/student/refresh", {
//             method: "POST",
//           });
//           const newAccessToken = await response.text();
//           if (newAccessToken) {
//             // Refresh successful, update the token and continue
//             const response = NextResponse.next();
//             response.cookies.set("adminAccessToken", newAccessToken, {
//               httpOnly: true,
//               secure: false,
//               sameSite: "lax",
//               maxAge: 15 * 60, // 15 minutes
//             });
//             return response;
//           }
//         }
//         // Refresh failed or no refresh token, redirect to login
//         const response = NextResponse.redirect(
//           new URL("/admin/login", request.url)
//         );
//         response.cookies.delete("adminAccessToken");
//         response.cookies.delete("adminRefreshToken");
//         return response;
//       }
//     } catch (error) {
//       console.error("Token verification error:", error);
//       const response = NextResponse.redirect(
//         new URL("/admin/login", request.url)
//       );
//       response.cookies.delete("adminAccessToken");
//       response.cookies.delete("adminRefreshToken");
//       return response;
//     }
//   }

//   return NextResponse.next();
// }

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

// async function refreshToken(userId: string, isAdmin: boolean) {
//   const response = await fetch(
//     `/api/${isAdmin ? "admin" : "student"}/refresh`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ userId }),
//     }
//   );

//   if (response.ok) {
//     const data = await response.json();
//     return data.accessToken;
//   }
//   return null;
// }

// export async function middleware(request: NextRequest) {
//   const userToken = request.cookies.get("accessToken")?.value;
//   const adminToken = request.cookies.get("adminAccessToken")?.value;
//   const path = request.nextUrl.pathname;

//   const isAdminRoute = path.startsWith("/admin");
//   const isProtectedRoute =
//     (isAdminRoute && path !== "/admin/login") ||
//     (!isAdminRoute &&
//       path.startsWith("/student") &&
//       path !== "/student/login" &&
//       path !== "/student/register");

//   if (isProtectedRoute) {
//     const token = isAdminRoute ? adminToken : userToken;

//     if (!token) {
//       return NextResponse.redirect(
//         new URL(isAdminRoute ? "/admin/login" : "/student/login", request.url)
//       );
//     }

//     try {
//       const payload = await verifyAccessToken(token);
//       if (!payload || !payload.userId) {
//         // Token is invalid or expired, attempt to refresh
//         const userId = payload?.userId;
//         if (userId) {
//           const newAccessToken = await refreshToken(userId, isAdminRoute);
//           if (newAccessToken) {
//             // Refresh successful, update the token and continue
//             const response = NextResponse.next();
//             response.cookies.set(
//               isAdminRoute ? "adminAccessToken" : "accessToken",
//               newAccessToken,
//               {
//                 httpOnly: true,
//                 secure: false,
//                 sameSite: "lax",
//                 maxAge: 60, // 15 minutes
//               }
//             );
//             return response;
//           }
//         }
//         // Refresh failed or no userId, redirect to login
//         return handleLogout(request, isAdminRoute);
//       }
//     } catch (error) {
//       console.error("Token verification error:", error);
//       return handleLogout(request, isAdminRoute);
//     }
//   }

//   return NextResponse.next();
// }
// function handleLogout(request: NextRequest, isAdmin: boolean) {
//   const response = NextResponse.redirect(
//     new URL(isAdmin ? "/admin/login" : "/student/login", request.url)
//   );
//   response.cookies.delete(isAdmin ? "adminAccessToken" : "accessToken");
//   return response;
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

async function refreshAccessToken(isAdmin: boolean) {
  const response = await fetch(
    `/api/${isAdmin ? "admin" : "student"}/refresh`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (response.ok) {
    const data = await response.json();
    return data.accessToken;
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const userToken = request.cookies.get("accessToken")?.value;
  const adminToken = request.cookies.get("adminAccessToken")?.value;
  const userRefreshToken = request.cookies.get("refreshToken")?.value;
  const adminRefreshToken = request.cookies.get("adminRefreshToken")?.value;
  const path = request.nextUrl.pathname;

  const isAdminRoute = path.startsWith("/admin");
  const isProtectedRoute =
    (isAdminRoute && path !== "/admin/login") ||
    (!isAdminRoute &&
      path.startsWith("/student") &&
      path !== "/student/login" &&
      path !== "/student/register");

  if (isProtectedRoute) {
    const token = isAdminRoute ? adminToken : userToken;
    const refreshToken = isAdminRoute ? adminRefreshToken : userRefreshToken;

    if (!token && !refreshToken) {
      return NextResponse.redirect(
        new URL(isAdminRoute ? "/admin/login" : "/student/login", request.url)
      );
    }

    try {
      let validToken = token;
      if (!token || !(await verifyAccessToken(token))) {
        if (refreshToken) {
          const newAccessToken = await refreshAccessToken(isAdminRoute);
          if (newAccessToken) {
            validToken = newAccessToken;
          } else {
            return handleLogout(request, isAdminRoute);
          }
        } else {
          return handleLogout(request, isAdminRoute);
        }
      }

      const response = NextResponse.next();
      if (validToken !== token && validToken !== undefined) {
        response.cookies.set(
          isAdminRoute ? "adminAccessToken" : "accessToken",
          validToken,
          {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60,
          }
        );
      }
      return response;
    } catch (error) {
      console.error("Token verification error:", error);
      return handleLogout(request, isAdminRoute);
    }
  }

  return NextResponse.next();
}
function handleLogout(request: NextRequest, isAdmin: boolean) {
  const response = NextResponse.redirect(
    new URL(isAdmin ? "/admin/login" : "/student/login", request.url)
  );
  response.cookies.delete(isAdmin ? "adminAccessToken" : "accessToken");
  response.cookies.delete(isAdmin ? "adminRefreshToken" : "refreshToken");
  return response;
}
