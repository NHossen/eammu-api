import { NextResponse } from "next/server";

export function middleware(request) {
  const response = NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/api/v1/")) {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "x-api-key, Content-Type");
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};