import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Facebook Scraper Fix for /article
  if (pathname.startsWith("/article")) {
    const userAgent = request.headers.get("user-agent");
    
    if (userAgent?.includes("facebookexternalhit")) {
      const headers = new Headers(request.headers);
      headers.delete("range"); 
      return NextResponse.next({ request: { headers } });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/article/:path*"],
};