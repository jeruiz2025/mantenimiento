import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const planos = await prisma.plano.findMany({
      orderBy: { id: "desc" },
      include: {
        _count: { select: { Ubicacion: true } },
      },
    });
    return NextResponse.json(planos, { status: 200 });
  } catch (error) {
    console.error("Error al obtener planos:", error);
    return NextResponse.json({ error: "Error al obtener planos" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, imageData } = await request.json();
    if (!name) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }
    const plano = await prisma.plano.create({
      data: {
        name,
        imageData: imageData || null,
      },
    });
    return NextResponse.json(plano, { status: 201 });
  } catch (error) {
    console.error("Error al crear plano:", error);
    return NextResponse.json({ error: "Error al crear plano" }, { status: 500 });
  }
}