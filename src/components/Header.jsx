"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-bold text-gray-800 text-sm whitespace-nowrap">
            MANTENIMIENTO DE EQUIPOS
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
              Inicio
            </Link>
            <Link href="/planos" className="text-gray-600 hover:text-blue-600">
              Planos de ubicación
            </Link>
            <Link href="/equipos" className="text-gray-600 hover:text-blue-600">
              Equipos
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {session?.user?.name && (
            <span className="text-sm text-gray-700 hidden sm:inline">
              {session.user.name}
            </span>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}