import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Fetch the "user" cookie
  const userCookie = req.cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie.value) : null;

  // Logging for debugging
  console.log("Middleware Cookie:", userCookie);
  console.log("Middleware User:", user);

  // Protected routes
  const protectedRoutes = [
    "/Admin", 
    "/Admin/customers",
    "/Admin/employee",
    "/Admin/Home",
    "/Admin/Plan",
    "/Admin/Price",
    "/Employee",
    "/Reception",
  ];

  // If user is not logged in and accesses protected routes, redirect to login
  if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route)) && !user) {
    return NextResponse.redirect(new URL("/Login", req.url));
  }

  // If logged in user accesses login page, redirect to their dashboard
  if (req.nextUrl.pathname.startsWith("/Login") && user) {
    if (user.role === "Admin") {
      return NextResponse.redirect(new URL("/Admin", req.url));
    }
    if (user.role === "Reception") {
      return NextResponse.redirect(new URL("/Reception", req.url));
    }
  }

  // If user role is not Admin and tries to access Admin pages, redirect to unauthorized page
  if (req.nextUrl.pathname.startsWith("/Admin") && user && user.role !== "Admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // If user role is not Reception and tries to access Employee pages, redirect to unauthorized page
  if (req.nextUrl.pathname.startsWith("/Reception") && user && user.role !== "Reception") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/Admin", 
    "/Employee", 
    "/unauthorized", 
    "/Login", 
    "/Admin/customers",
    "/Admin/employee",
    "/Admin/Home",
    "/Admin/Plan",
    "/Admin/Price",
    "/Reception",
  ], // Define protected routes
};