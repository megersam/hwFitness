import connectDB from "@/lib/db";
import User from "@/Models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

connectDB();

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { email, password } = await req.json();

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Check if the account is active
    if (!user.status) {
      return NextResponse.json(
        { error: "Your account is inactive. Contact support." },
        { status: 403 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    // Prepare user data for the response
    const userData = {
      id: user._id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    // Serialize the cookie
    const cookie = serialize("user", JSON.stringify({ ...userData, token }), {
      httpOnly: false, // Set to false to allow access via document.cookie
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 1 day
      path: "/", // Cookie available across the entire app
    });

    console.log("Generated Cookie:", cookie); // Debugging the cookie generation

    // Create response and attach cookie
    const response = NextResponse.json({
      message: "Login successful",
      ...userData,
    });
    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
