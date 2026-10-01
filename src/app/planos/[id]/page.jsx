"use client";

import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PlanoDetallePage() {
  const { id } = useParams();
  const router = useRouter();
  const [plano, setPlano] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [placing, setPlacing] = useState(null);
  const [nombreUbicacion, setNombreUbicacion] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/plano/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error");
        setPlano(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleImageClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10;
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10;
    setPlacing({ x, y });
    setNombreUbicacion("");
  };

  const handleSaveUbicacion = async () => {
    if (!nombreUbicacion.trim() || !placing) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/ubicacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planoId: id, name: nombreUbicacion, x: placing.x, y: placing.y }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");
      setPlacing(null);
      setNombreUbicacion("");
      router.refresh();
      const reload = await fetch(`/api/plano/${id}`);
      setPlano(await reload.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUbicacion = async (ubicacionId) => {
    if (!confirm("¿Eliminar esta ubicación?")) return;
    const res = await fetch(`/api/ubicacion/${ubicacionId}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Error al eliminar");
      return;
    }
    router.refresh();
    const reload = await fetch(`/api/plano/${id}`);
    setPlano(await reload.json());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto mt-10 p-6 text-center text-gray-500">Cargando plano...</main>
      </div>
    );
  }

  if (!plano) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto mt-10 p-6 text-center text-gray-500">{error || "Plano no encontrado"}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto mt-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{plano.name}</h1>
            <p className="text-sm text-gray-500">
              Haz clic sobre el plano para agregar una ubicación.
            </p>
          </div>
          <button
            onClick={() => router.push("/planos")}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Volver
          </button>
        </div>

        {error && <div className="mb-4 bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg px-4 py-2">{error}</div>}

        <div className="bg-white rounded-xl shadow-md p-4">
          {plano.imageData ? (
            <div className="relative w-full select-none">
              <img
                src={plano.imageData}
                alt={plano.name}
                onClick={handleImageClick}
                className="w-full h-auto rounded-lg"
                draggable={false}
              />
              {plano.Ubicacion.map((ub) => (
                <button
                  key={ub.id}
                  onClick={() => router.push(`/ubicaciones/${ub.id}`)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow hover:bg-blue-700"
                  style={{ left: `${ub.x}%`, top: `${ub.y}%` }}
                >
                  {ub.name}
                </button>
              ))}
              {placing && (
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 bg-emerald-600 text-white text-xs font-medium px-2 py-1 rounded-full"
                  style={{ left: `${placing.x}%`, top: `${placing.y}%` }}
                >
                  {placing.x}%, {placing.y}%
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              Este plano no tiene imagen. Sube la imagen desde la lista de planos.
            </div>
          )}
        </div>

        {placing && (
          <div className="bg-white rounded-xl shadow-md p-4 mt-4 flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la ubicación</label>
              <input
                type="text"
                value={nombreUbicacion}
                onChange={(e) => setNombreUbicacion(e.target.value)}
                placeholder="Ej: Oficina 1 - Piso 1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                autoFocus
              />
            </div>
            <div className="text-sm text-gray-500 pb-2">
              Posición: {placing.x}%, {placing.y}%
            </div>
            <button
              onClick={handleSaveUbicacion}
              disabled={saving || !nombreUbicacion.trim()}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar ubicación"}
            </button>
            <button
              onClick={() => setPlacing(null)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        )}

        <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">
          UBICACIONES ({plano.Ubicacion?.length ?? 0})
        </h2>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posición</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipos</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(plano.Ubicacion || []).map((ub) => (
                <tr key={ub.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{ub.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {ub.x}%, {ub.y}%
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{ub._count?.Equipo ?? 0}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => router.push(`/ubicaciones/${ub.id}`)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Ver equipos
                    </button>
                    <button
                      onClick={() => handleDeleteUbicacion(ub.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {(plano.Ubicacion || []).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                    Sin ubicaciones. Haz clic sobre el plano para agregar la primera.
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