import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth/session";

const PUBLIC_PATHS = [
  "/",
  "/about",
  "/programmes",
  "/arabic-studies",
  "/islamic-studies",
  "/admissions",
  "/faculty",
  "/resources",
  "/news",
  "/events",
  "/contact",
];

const AUTH_PATHS = ["/login", "/forgot-password"];

const PROTECTED_PREFIXES = ["/student", "/teacher", "/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  const isAuthPath = AUTH_PATHS.some((path) => pathname.startsWith(path));

  const isProtectedPath = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  const isApiPath = pathname.startsWith("/api/");

  if (isPublicPath && !isProtectedPath) {
    return NextResponse.next();
  }

  const token = request.cookies.get("zia_session")?.value;

  if (isAuthPath) {
    if (token) {
      const session = await verifySession(token);
      if (session) {
        return NextResponse.redirect(
          new URL(getDashboardPath(session.role), request.url)
        );
      }
    }
    return NextResponse.next();
  }

  if (isProtectedPath || isApiPath) {
    if (!token) {
      if (isApiPath) {
        return NextResponse.json(
          { success: false, error: "Authentication required" },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const session = await verifySession(token);

    if (!session) {
      if (isApiPath) {
        return NextResponse.json(
          { success: false, error: "Invalid session" },
          { status: 401 }
        );
      }
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("zia_session");
      return response;
    }

    if (pathname.startsWith("/admin") && session.role === "student") {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }

    if (pathname.startsWith("/teacher") && session.role === "student") {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }

    if (pathname.startsWith("/student") && session.role === "teacher") {
      return NextResponse.redirect(new URL("/teacher/dashboard", request.url));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", session.userId);
    requestHeaders.set("x-user-role", session.role);
    requestHeaders.set("x-user-name", `${session.firstName} ${session.lastName}`);

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

function getDashboardPath(role: string): string {
  switch (role) {
    case "super_admin":
    case "academy_admin":
      return "/admin/dashboard";
    case "teacher":
      return "/teacher/dashboard";
    case "student":
      return "/student/dashboard";
    default:
      return "/login";
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};