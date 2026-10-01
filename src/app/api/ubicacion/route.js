import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ubicaciones = await prisma.ubicacion.findMany({
      orderBy: { name: "asc" },
      include: {
        Plano: { select: { id: true, name: true } },
      },
    });
    return NextResponse.json(ubicaciones, { status: 200 });
  } catch (error) {
    console.error("Error al obtener ubicaciones:", error);
    return NextResponse.json({ error: "Error al obtener ubicaciones" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { planoId, name, x, y } = await request.json();
    if (!planoId || !name || x === undefined || y === undefined) {
      return NextResponse.json({ error: "Faltan datos de la ubicación" }, { status: 400 });
    }
    const ubicacion = await prisma.ubicacion.create({
      data: {
        planoId: Number(planoId),
        name,
        x: Number(x),
        y: Number(y),
      },
    });
    return NextResponse.json(ubicacion, { status: 201 });
  } catch (error) {
    console.error("Error al crear ubicación:", error);
    return NextResponse.json({ error: "Error al crear ubicación" }, { status: 500 });
  }
}