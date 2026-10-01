import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const plano = await prisma.plano.findUnique({
      where: { id: Number(id) },
      include: {
        Ubicacion: {
          include: { _count: { select: { Equipo: true } } },
          orderBy: { name: "asc" },
        },
      },
    });
    if (!plano) {
      return NextResponse.json({ error: "Plano no encontrado" }, { status: 404 });
    }
    return NextResponse.json(plano, { status: 200 });
  } catch (error) {
    console.error("Error al obtener plano:", error);
    return NextResponse.json({ error: "Error al obtener plano" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { name, imageData } = await request.json();
    const plano = await prisma.plano.update({
      where: { id: Number(id) },
      data: {
        name: name ?? undefined,
        imageData: imageData !== undefined ? imageData : undefined,
      },
    });
    return NextResponse.json(plano, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar plano:", error);
    return NextResponse.json({ error: "Error al actualizar plano" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.plano.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Plano eliminado" }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar plano:", error);
    return NextResponse.json({ error: "Error al eliminar plano" }, { status: 500 });
  }
}