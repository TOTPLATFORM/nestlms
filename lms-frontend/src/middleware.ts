import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  const is_super_admin = req.cookies.get("is_super_admin")?.value === "true";
  const is_admin = req.cookies.get("is_admin")?.value === "true";
  const is_instructor = req.cookies.get("is_instructor")?.value === "true";
  const userAndInstructorsRoutes = ["/instructor", "/user"];
  const adminRoutes = ["/admin"];
  const publicRoutes = ["/", "/login"];

  if (
    !token?.value &&
    (userAndInstructorsRoutes.includes(req.nextUrl.pathname) ||
      adminRoutes.includes(req.nextUrl.pathname))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (is_admin) {
    if (
      userAndInstructorsRoutes.some((path) =>
        req.nextUrl.pathname.startsWith(path)
      )
    ) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  } else {
    if (adminRoutes.some((path) => req.nextUrl.pathname.startsWith(path))) {
      if (req.nextUrl.pathname === "/admin/login") {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}
