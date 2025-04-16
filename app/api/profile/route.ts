import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/lib/models/UserModel";
import bcrypt from "bcryptjs";

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, email, password, phone, address } = await req.json();

    if (!phone || !address) {
      return NextResponse.json(
        { message: "Teléfono y dirección son requeridos" },
        { status: 400 }
      );
    }

    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and email are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await UserModel.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if email is being changed and if it already exists for another user
    if (email !== user.email) {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return NextResponse.json(
          { message: "Email already in use" },
          { status: 400 }
        );
      }
    }

    user.name = name;
    user.email = email;
    user.phone = phone;
    user.address = address;

    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { message: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }
      user.password = bcrypt.hashSync(password, 10);
    }

    console.log("User before saving:", user);

    await user.save();

    const updatedUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      isAdmin: user.isAdmin,
    };

    return NextResponse.json(
      { message: "Profile updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Server error during profile update" },
      { status: 500 }
    );
  }
}
