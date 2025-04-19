import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/lib/models/UserModel";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    // In the POST handler:
    const { name, email, password, phone, address } = await req.json();

    if (!name || !email || !password || !phone || !address) {
      return NextResponse.json(
        { message: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Validate Colombian phone format
    if (!/^\+57[0-9]{10}$/.test(phone)) {
      return NextResponse.json(
        { message: "Formato de teléfono inválido" },
        { status: 400 }
      );
    }

    // In user creation:
    const user = await UserModel.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      phone,
      address,
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: { name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
