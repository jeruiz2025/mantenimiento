import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ubicacionId = searchParams.get("ubicacionId");
    const tipo = searchParams.get("tipo");
    const estado = searchParams.get("estado");
    const search = searchParams.get("search");

    const where = {};
    if (ubicacionId) where.ubicacionId = Number(ubicacionId);
    if (tipo) where.tipo = tipo;
    if (estado) where.estado = estado;
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: "insensitive" } },
        { serial: { contains: search, mode: "insensitive" } },
        { marca: { contains: search, mode: "insensitive" } },
        { tipo: { contains: search, mode: "insensitive" } },
      ];
    }

    const equipos = await prisma.equipo.findMany({
      where,
      orderBy: { id: "desc" },
      include: {
        Ubicacion: { include: { Plano: { select: { id: true, name: true } } } },
        _count: { select: { Mantenimiento: true } },
      },
    });

    return NextResponse.json(equipos, { status: 200 });
  } catch (error) {
    console.error("Error al obtener equipos:", error);
    return NextResponse.json({ error: "Error al obtener equipos" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const {
      nombre,
      serial,
      tipo,
      marca,
      modelo,
      estado,
      ubicacionId,
      observaciones,
    } = await request.json();

    if (!nombre || !tipo || !ubicacionId) {
      return NextResponse.json({ error: "Nombre, tipo y ubicación son obligatorios" }, { status: 400 });
    }

    const equipo = await prisma.equipo.create({
      data: {
        nombre,
        serial: serial || null,
        tipo,
        marca: marca || null,
        modelo: modelo || null,
        estado: estado || "OPERATIVO",
        ubicacionId: Number(ubicacionId),
        observaciones: observaciones || null,
      },
    });

    return NextResponse.json(equipo, { status: 201 });
  } catch (error) {
    console.error("Error al crear equipo:", error);
    return NextResponse.json({ error: "Error al crear equipo" }, { status: 500 });
  }
}