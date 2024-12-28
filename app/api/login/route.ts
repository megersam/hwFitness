import connectDB from "@/lib/db";
import User from "@/Models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Check user status
    if (!user.status) {
      return NextResponse.json(
        { error: "Your account is inactive. Please contact support." },
        { status: 403 }
      );
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    // Send the full user data along with the token
    return NextResponse.json({
      message: "Login successful",
      token,
      role: user.role, // Include role
      firstName: user.firstName,  // Include user's name
      middleName: user.middleName, // Include user's middle name
      lastName: user.lastName, // Include user's last name
      sex: user.sex, // Include
      
      email: user.email, // Include user's email
      // Add any other fields you want to send, e.g., profile picture, etc.
    });
  } catch (error) {
    console.error("Error in login API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
