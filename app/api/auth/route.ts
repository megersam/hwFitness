import connectDB from "@/lib/db"; 
import User from "@/Models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// Connect to the database
connectDB();

// POST API to create a new user
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { firstName, lastName, sex, phoneNumber, role,  email, password } = await req.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "First name, last name, email, and password are required." },
        { status: 400 }
      );
    }

    // Check if the email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return NextResponse.json(
        { error: "This email is already registered." },
        { status: 400 }
      );
    }

    // Check if the phone number already exists
    const phoneExists = await User.findOne({ phoneNumber });
    if (phoneExists) {
      return NextResponse.json(
        { error: "This phone number is already registered." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create and save the new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      sex,
      role,
      password: hashedPassword,
      status: true,
    });
    await newUser.save();

    return NextResponse.json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
