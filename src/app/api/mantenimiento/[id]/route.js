import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const parseDateValue = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { fecha, tipo, responsable, observaciones, costo } = await request.json();
    const parsedFecha = parseDateValue(fecha || undefined);

    const mantenimiento = await prisma.mantenimiento.update({
      where: { id: Number(id) },
      data: {
        fecha: parsedFecha ?? undefined,
        tipo: tipo ?? undefined,
        responsable: responsable ?? undefined,
        observaciones: observaciones !== undefined ? observaciones : undefined,
        costo: costo !== undefined ? Number(costo) : undefined,
      },
    });
    return NextResponse.json(mantenimiento, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar mantenimiento:", error);
    return NextResponse.json({ error: "Error al actualizar mantenimiento" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.mantenimiento.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Mantenimiento eliminado" }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar mantenimiento:", error);
    return NextResponse.json({ error: "Error al eliminar mantenimiento" }, { status: 500 });
  }
}