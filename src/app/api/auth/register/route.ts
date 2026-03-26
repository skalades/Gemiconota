import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password, graduationYear } = await req.json();

    if (!name || !email || !password || !graduationYear) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = crypto.randomUUID();
    const profileId = crypto.randomUUID();

    // Create user and profile
    const user = await prisma.user.create({
      data: {
        id: userId,
        name,
        email,
        password: hashedPassword,
        profile: {
          create: {
            id: profileId,
            graduationYear: parseInt(graduationYear),
          },
        },
      },
    });

    return NextResponse.json({ message: "Pendaftaran berhasil", userId: user.id }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
