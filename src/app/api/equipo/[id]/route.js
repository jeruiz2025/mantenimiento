import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const equipo = await prisma.equipo.findUnique({
      where: { id: Number(id) },
      include: {
        Ubicacion: { include: { Plano: { select: { id: true, name: true } } } },
        Mantenimiento: { orderBy: { fecha: "desc" } },
      },
    });
    if (!equipo) {
      return NextResponse.json({ error: "Equipo no encontrado" }, { status: 404 });
    }
    return NextResponse.json(equipo, { status: 200 });
  } catch (error) {
    console.error("Error al obtener equipo:", error);
    return NextResponse.json({ error: "Error al obtener equipo" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const {
      nombre,
      serial,
      tipo,
      marca,
      modelo,
      estado,
      procesador,
      memoriaRam,
      tipoRam,
      discoDuro,
      tipoDisco,
      sistemaOperativo,
      tarjetaGrafica,
      ubicacionId,
      observaciones,
    } = await request.json();

    const optionalText = (value) => (value !== undefined ? value || null : undefined);

    const equipo = await prisma.equipo.update({
      where: { id: Number(id) },
      data: {
        nombre: nombre ?? undefined,
        serial: optionalText(serial),
        tipo: tipo ?? undefined,
        marca: optionalText(marca),
        modelo: optionalText(modelo),
        estado: estado ?? undefined,
        procesador: optionalText(procesador),
        memoriaRam: optionalText(memoriaRam),
        tipoRam: optionalText(tipoRam),
        discoDuro: optionalText(discoDuro),
        tipoDisco: optionalText(tipoDisco),
        sistemaOperativo: optionalText(sistemaOperativo),
        tarjetaGrafica: optionalText(tarjetaGrafica),
        ubicacionId: ubicacionId !== undefined ? Number(ubicacionId) : undefined,
        observaciones: optionalText(observaciones),
      },
    });
    return NextResponse.json(equipo, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar equipo:", error);
    return NextResponse.json({ error: "Error al actualizar equipo" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const equipoId = Number(id);
    await prisma.mantenimiento.deleteMany({ where: { equipoId } });
    await prisma.equipo.delete({ where: { id: equipoId } });
    return NextResponse.json({ message: "Equipo eliminado" }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar equipo:", error);
    return NextResponse.json({ error: "Error al eliminar equipo" }, { status: 500 });
  }
}