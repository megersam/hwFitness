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
     "/Employee"
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
      return NextResponse.redirect(new URL("/Employee", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Admin", "/Employee", "/unauthorized", "/Login", "/Admin/customers",
    "/Admin/employee",
    "/Admin/Home",
    "/Admin/Plan",
    "/Admin/Price"], // Define protected routes
};
