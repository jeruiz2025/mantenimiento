import Header from "@/components/Header";
import HomeCards from "./HomeCards";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [planos, equipos, mantenimientos] = await Promise.all([
    prisma.plano.count(),
    prisma.equipo.count(),
    prisma.mantenimiento.count(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto mt-10 p-6">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Bienvenido, {session.user.name}
          </h1>
          <p className="text-gray-600">
            Sistema de mantenimiento de equipos y hojas de vida con plano de ubicación.
          </p>
        </div>

        <HomeCards planos={planos} equipos={equipos} mantenimientos={mantenimientos} />
      </main>
    </div>
  );
}