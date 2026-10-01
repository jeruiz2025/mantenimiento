import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const parseDateValue = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export async function POST(request) {
  try {
    const { equipoId, fecha, tipo, responsable, observaciones, costo } = await request.json();
    const parsedFecha = parseDateValue(fecha);

    if (!equipoId || !parsedFecha || !tipo || !responsable) {
      return NextResponse.json({ error: "Equipo, fecha, tipo y responsable son obligatorios" }, { status: 400 });
    }

    const mantenimiento = await prisma.mantenimiento.create({
      data: {
        equipoId: Number(equipoId),
        fecha: parsedFecha,
        tipo,
        responsable,
        observaciones: observaciones || null,
        costo: costo ? Number(costo) : null,
      },
    });
    return NextResponse.json(mantenimiento, { status: 201 });
  } catch (error) {
    console.error("Error al crear mantenimiento:", error);
    return NextResponse.json({ error: "Error al crear mantenimiento" }, { status: 500 });
  }
}