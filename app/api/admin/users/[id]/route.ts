import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/lib/models/UserModel";

// DELETE - Eliminar un usuario por ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  // Verificar si el usuario está autenticado y es administrador
  if (!session || !session.user || !session.user.isAdmin) {
    return NextResponse.json(
      { message: "Unauthorized - Admin access required" },
      { status: 401 }
    );
  }

  const userId = params.id;

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
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  // Verificar si el usuario está autenticado y es administrador
  if (!session || !session.user || !session.user.isAdmin) {
    return NextResponse.json(
      { message: "Unauthorized - Admin access required" },
      { status: 401 }
    );
  }

  const userId = params.id;

  try {
    await dbConnect();

    // Ensure we can parse the request body
    const data = await req.json();
    const { name, email, isAdmin, phone, address } = data;

    // Verificar si el usuario existe
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Verificar si el email ya está en uso por otro usuario
    if (email !== user.email) {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return NextResponse.json(
          { message: "Email already in use" },
          { status: 400 }
        );
      }
    }

    // Actualizar el usuario
    user.name = name;
    user.email = email;
    user.isAdmin = isAdmin;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    // Devolver el usuario actualizado sin la contraseña
    const updatedUser = await UserModel.findById(userId).select("-password");

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}
