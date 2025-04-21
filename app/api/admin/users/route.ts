import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/lib/models/UserModel";
import bcrypt from "bcryptjs";

// GET - Obtener todos los usuarios
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // Verificar si el usuario está autenticado y es administrador
  if (!session || !session.user || !session.user.isAdmin) {
    return NextResponse.json(
      { message: "Unauthorized - Admin access required" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    // Obtener todos los usuarios, excluyendo la contraseña
    const users = await UserModel.find({}).select("-password");

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo usuario
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Verificar si el usuario está autenticado y es administrador
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Validate request body
    const data = await req.json();
    if (!data.email || !data.password || !data.name) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      password,
      isAdmin = false,
      phone = "",
      address = "",
    } = data;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if email exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with validated data
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      isAdmin,
      phone,
      address,
    });

    // Return user without password
    const userResponse = await UserModel.findById(newUser._id)
      .select("-password")
      .lean();

    return NextResponse.json({
      message: "User created successfully",
      user: userResponse,
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        message: "Failed to create user: " + error.message,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
