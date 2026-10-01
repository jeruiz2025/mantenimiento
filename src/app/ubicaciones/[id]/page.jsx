"use client";

import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function UbicacionEquiposPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ubicacion, setUbicacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/ubicacion/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error");
        setUbicacion(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDeleteEquipo = async (equipoId) => {
    if (!confirm("¿Eliminar este equipo? Se eliminará también su historial de mantenimientos.")) return;
    const res = await fetch(`/api/equipo/${equipoId}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Error al eliminar");
      return;
    }
    router.refresh();
    const reload = await fetch(`/api/ubicacion/${id}`);
    setUbicacion(await reload.json());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto mt-10 p-6 text-center text-gray-500">Cargando...</main>
      </div>
    );
  }

  if (!ubicacion) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto mt-10 p-6 text-center text-gray-500">{error || "No encontrado"}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto mt-6 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{ubicacion.name}</h1>
            <p className="text-sm text-gray-500">
              Plano: {ubicacion.Plano?.name} · {ubicacion.Equipo?.length ?? 0} equipo(s)
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/planos/${ubicacion.Plano?.id}`)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Ver plano
            </button>
            <button
              onClick={() => router.push(`/equipos/nuevo?ubicacionId=${ubicacion.id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Nuevo equipo
            </button>
          </div>
        </div>

        {error && <div className="mb-4 bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg px-4 py-2">{error}</div>}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mantenimientos</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(ubicacion.Equipo || []).map((eq) => (
                <tr key={eq.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{eq.nombre}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{eq.tipo}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{eq.serial || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{eq.estado}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">-</td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => router.push(`/equipos/${eq.id}`)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Hoja de vida
                    </button>
                    <button
                      onClick={() => handleDeleteEquipo(eq.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {(ubicacion.Equipo || []).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No hay equipos en esta ubicación.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}