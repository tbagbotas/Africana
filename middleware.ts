import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent');
  
  // If Facebook crawler is requesting, strip the Range header
  if (userAgent?.includes('facebookexternalhit')) {
    const headers = new Headers(request.headers);
    headers.delete('range');
    return NextResponse.next({ request: { headers } });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/article/:path*', // Apply this to your article routes
};