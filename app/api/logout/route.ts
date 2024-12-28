import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { serialize } from "cookie";

export function GET(req: NextRequest) {
  // Clear the "user" cookie
  const clearCookie = serialize("user", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Ensure it works in production
    sameSite: "strict",
    expires: new Date(0), // Expire immediately
    path: "/", // Apply to all paths
  });

  const response = NextResponse.redirect(new URL("/Login", req.url));
  response.headers.set("Set-Cookie", clearCookie); // Set the expired cookie

  return response;
}
