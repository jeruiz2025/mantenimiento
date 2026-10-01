import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const ubicacion = await prisma.ubicacion.findUnique({
      where: { id: Number(id) },
      include: {
        Plano: { select: { id: true, name: true } },
        Equipo: { orderBy: { id: "desc" } },
      },
    });
    if (!ubicacion) {
      return NextResponse.json({ error: "Ubicación no encontrada" }, { status: 404 });
    }
    return NextResponse.json(ubicacion, { status: 200 });
  } catch (error) {
    console.error("Error al obtener ubicación:", error);
    return NextResponse.json({ error: "Error al obtener ubicación" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { name, x, y } = await request.json();
    const ubicacion = await prisma.ubicacion.update({
      where: { id: Number(id) },
      data: {
        name: name ?? undefined,
        x: x !== undefined ? Number(x) : undefined,
        y: y !== undefined ? Number(y) : undefined,
      },
    });
    return NextResponse.json(ubicacion, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar ubicación:", error);
    return NextResponse.json({ error: "Error al actualizar ubicación" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const hasEquipos = await prisma.equipo.count({ where: { ubicacionId: Number(id) } });
    if (hasEquipos > 0) {
      return NextResponse.json(
        { error: "No se puede eliminar: la ubicación tiene equipos asociados" },
        { status: 400 }
      );
    }
    await prisma.ubicacion.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Ubicación eliminada" }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar ubicación:", error);
    return NextResponse.json({ error: "Error al eliminar ubicación" }, { status: 500 });
  }
}