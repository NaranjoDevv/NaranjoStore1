import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/lib/models/UserModel";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "User registered successfully", user: { name: user.name, email: user.email } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}