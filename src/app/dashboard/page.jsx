import Header from "@/components/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

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

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/planos"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-1">PLANOS DE UBICACIÓN</h2>
            <p className="text-gray-600 text-sm">
              Ver los planos de ubicación con los botones por cada ubicación de equipos.
            </p>
          </Link>

          <Link
            href="/equipos"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-emerald-500"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-1">EQUIPOS Y HOJAS DE VIDA</h2>
            <p className="text-gray-600 text-sm">
              Registrar equipos, ver su ficha e historial de mantenimientos.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}