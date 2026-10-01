"use client";

import Header from "@/components/Header";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const TIPOS = ["COMPUTADOR", "IMPRESORA", "VIDEO BEAM", "MONITOR", "TELÉFONO", "RED / SWITCH", "CAMARA", "OTRO"];
const ESTADOS = ["OPERATIVO", "EN REPARACIÓN", "EN MANTENIMIENTO", "DETERIORADO", "DADO DE BAJA"];

function EquiposPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ubicIdFromQuery = searchParams.get("ubicacionId");

  const [equipos, setEquipos] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [ubicacionFilter, setUbicacionFilter] = useState(ubicIdFromQuery || "");

  useEffect(() => {
    const load = async () => {
      try {
        const [eqRes, ubRes] = await Promise.all([
          fetch("/api/equipo"),
          fetch("/api/ubicacion"),
        ]);
        const eqData = await eqRes.json();
        const ubData = await ubRes.json();
        setEquipos(Array.isArray(eqData) ? eqData : []);
        setUbicaciones(Array.isArray(ubData) ? ubData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const applyFilters = async (params) => {
    const qs = new URLSearchParams();
    if (params.search) qs.set("search", params.search);
    if (params.tipo) qs.set("tipo", params.tipo);
    if (params.estado) qs.set("estado", params.estado);
    if (params.ubicacion) qs.set("ubicacionId", params.ubicacion);
    const q = qs.toString();
    const res = await fetch(`/api/equipo${q ? `?${q}` : ""}`);
    const data = await res.json();
    setEquipos(Array.isArray(data) ? data : []);
  };

  const handleApply = () => {
    applyFilters({ search, tipo: tipoFilter, estado: estadoFilter, ubicacion: ubicacionFilter });
  };

  const handleClear = () => {
    setSearch("");
    setTipoFilter("");
    setEstadoFilter("");
    setUbicacionFilter("");
    applyFilters({});
  };

  const handleDelete = async (equipoId) => {
    if (!confirm("¿Eliminar este equipo? Se eliminará también su historial.")) return;
    const res = await fetch(`/api/equipo/${equipoId}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Error al eliminar");
      return;
    }
    const qs = new URLSearchParams();
    if (search) qs.set("search", search);
    if (tipoFilter) qs.set("tipo", tipoFilter);
    if (estadoFilter) qs.set("estado", estadoFilter);
    if (ubicacionFilter) qs.set("ubicacionId", ubicacionFilter);
    await applyFilters({ search, tipo: tipoFilter, estado: estadoFilter, ubicacion: ubicacionFilter });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto mt-6 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">EQUIPOS</h1>
          <button
            onClick={() => router.push("/equipos/nuevo")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Nuevo equipo
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 mb-6 grid md:grid-cols-5 gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, serial, marca o tipo"
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Todos los tipos</option>
            {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Todos los estados</option>
            {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={ubicacionFilter}
            onChange={(e) => setUbicacionFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Todas las ubicaciones</option>
            {ubicaciones.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex-1"
            >
              Filtrar
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Limpiar
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando equipos...</div>
        ) : equipos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No hay equipos con los criterios seleccionados.</div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mant.</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {equipos.map((eq) => (
                  <tr key={eq.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{eq.nombre}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{eq.tipo}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{eq.serial || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{eq.estado}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{eq.Ubicacion?.name || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{eq._count?.Mantenimiento ?? 0}</td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => router.push(`/equipos/${eq.id}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Hoja de vida
                      </button>
                      <button
                        onClick={() => router.push(`/equipos/editar/${eq.id}`)}
                        className="text-emerald-600 hover:text-emerald-800 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(eq.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default function EquiposPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-7xl mx-auto mt-6 p-6 text-center text-gray-500">Cargando...</main>
        </div>
      }
    >
      <EquiposPageContent />
    </Suspense>
  );
}