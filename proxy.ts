import { auth } from "@/app/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (
    !req.auth &&
    req.nextUrl.pathname !== "/admin/login"
  ) {
    return NextResponse.redirect(
      new URL("/admin/login", req.url)
    );
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};