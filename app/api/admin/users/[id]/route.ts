import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/lib/models/UserModel";

// DELETE - Eliminar un usuario por ID
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  // Verificar si el usuario está autenticado y es administrador
  if (!session || !session.user || !session.user.isAdmin) {
    return NextResponse.json(
      { message: "Unauthorized - Admin access required" },
      { status: 401 }
    );
  }

  const userId = context.params.id;

  try {
    await dbConnect();

    // No permitir que un administrador se elimine a sí mismo
    if (userId === session.user.id) {
      return NextResponse.json(
        { message: "Cannot delete your own admin account" },
        { status: 400 }
      );
    }

    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un usuario por ID
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  // Verificar si el usuario está autenticado y es administrador
  if (!session || !session.user || !session.user.isAdmin) {
    return NextResponse.json(
      { message: "Unauthorized - Admin access required" },
      { status: 401 }
    );
  }

  const userId = context.params.id;

  try {
    await dbConnect();

    // Ensure we can parse the request body
    const data = await req.json();
    const { name, email, isAdmin, phone, address } = data;

    // No permitir que un administrador se elimine a sí mismo
    if (userId === session.user.id) {
      return NextResponse.json(
        { message: "Cannot delete your own admin account" },
        { status: 400 }
      );
    }

    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
