"use client";

import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const TIPOS_MANT = ["PREVENTIVO", "CORRECTIVO", "INSTALACIÓN / CONFIGURACIÓN", "LIMPIEZA", "OTRO"];

const formatFecha = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("es-CO");
};

export default function HojaDeVidaPage() {
  const { id } = useParams();
  const router = useRouter();
  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [mant, setMant] = useState({
    fecha: new Date().toISOString().slice(0, 10),
    tipo: "PREVENTIVO",
    responsable: "",
    observaciones: "",
    costo: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEquipo();
  }, [id]);

  const loadEquipo = async () => {
    try {
      const res = await fetch(`/api/equipo/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setEquipo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMantenimiento = async () => {
    if (!mant.fecha || !mant.tipo || !mant.responsable.trim()) {
      setError("Fecha, tipo y responsable son obligatorios");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/mantenimiento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipoId: id, ...mant }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");
      setShowForm(false);
      setMant({ fecha: new Date().toISOString().slice(0, 10), tipo: "PREVENTIVO", responsable: "", observaciones: "", costo: "" });
      await loadEquipo();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMantenimiento = async (mantId) => {
    if (!confirm("¿Eliminar este mantenimiento?")) return;
    await fetch(`/api/mantenimiento/${mantId}`, { method: "DELETE" });
    await loadEquipo();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto mt-10 p-6 text-center text-gray-500">Cargando hoja de vida...</main>
      </div>
    );
  }

  if (!equipo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto mt-10 p-6 text-center text-gray-500">{error || "Equipo no encontrado"}</main>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
      <div className="min-h-screen bg-gray-50">
        <div className="no-print">
          <Header />
        </div>
        <main className="max-w-7xl mx-auto mt-6 p-6">
          <div className="no-print flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Volver
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/equipos/editar/${equipo.id}`)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Editar equipo
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Imprimir / PDF
              </button>
            </div>
          </div>

          {error && <div className="mb-4 bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg px-4 py-2">{error}</div>}

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">HOJA DE VIDA DEL EQUIPO</h1>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Equipo</p>
                <p className="font-semibold text-gray-900">{equipo.nombre}</p>
              </div>
              <div>
                <p className="text-gray-500">Tipo</p>
                <p className="font-semibold text-gray-900">{equipo.tipo}</p>
              </div>
              <div>
                <p className="text-gray-500">Código / Placa / Serial</p>
                <p className="font-semibold text-gray-900">{equipo.serial || "-"}</p>
              </div>
              <div>
                <p className="text-gray-500">Marca</p>
                <p className="font-semibold text-gray-900">{equipo.marca || "-"}</p>
              </div>
              <div>
                <p className="text-gray-500">Modelo</p>
                <p className="font-semibold text-gray-900">{equipo.modelo || "-"}</p>
              </div>
              <div>
                <p className="text-gray-500">Estado</p>
                <p className="font-semibold text-gray-900">{equipo.estado}</p>
              </div>
              <div>
                <p className="text-gray-500">Ubicación</p>
                <p className="font-semibold text-gray-900">
                  {equipo.Ubicacion?.name || "-"}
                  {equipo.Ubicacion?.Plano?.name ? ` (${equipo.Ubicacion.Plano.name})` : ""}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Registrado</p>
                <p className="font-semibold text-gray-900">{formatFecha(equipo.createdAt)}</p>
              </div>
            </div>
            {equipo.observaciones && (
              <div className="mt-4">
                <p className="text-gray-500">Observaciones</p>
                <p className="text-gray-900">{equipo.observaciones}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">ESPECIFICACIONES TÉCNICAS</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                ["Procesador", equipo.procesador],
                ["Memoria RAM", equipo.memoriaRam],
                ["Tipo RAM", equipo.tipoRam],
                ["Disco duro", equipo.discoDuro],
                ["Tipo de disco", equipo.tipoDisco],
                ["Sistema operativo", equipo.sistemaOperativo],
                ["Tarjeta gráfica", equipo.tarjetaGrafica],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-gray-500">{label}</p>
                  <p className="font-semibold text-gray-900">{value || "-"}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                HISTORIAL DE MANTENIMIENTOS ({equipo.Mantenimiento?.length ?? 0})
              </h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="no-print px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {showForm ? "Cancelar" : "Registrar mantenimiento"}
              </button>
            </div>

            {showForm && (
              <div className="no-print border border-gray-200 rounded-lg p-4 mb-4">
                <h3 className="font-bold text-gray-800 mb-3">NUEVO MANTENIMIENTO</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                    <input
                      type="date"
                      value={mant.fecha}
                      onChange={(e) => setMant({ ...mant, fecha: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                    <select
                      value={mant.tipo}
                      onChange={(e) => setMant({ ...mant, tipo: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      {TIPOS_MANT.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsable *</label>
                    <input
                      type="text"
                      value={mant.responsable}
                      onChange={(e) => setMant({ ...mant, responsable: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Costo (opcional)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={mant.costo}
                      onChange={(e) => setMant({ ...mant, costo: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                    <textarea
                      value={mant.observaciones}
                      onChange={(e) => setMant({ ...mant, observaciones: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveMantenimiento}
                  disabled={saving}
                  className="mt-3 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-60"
                >
                  {saving ? "Guardando..." : "Guardar mantenimiento"}
                </button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsable</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
                    <th className="px-4 py-3 no-print"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(equipo.Mantenimiento || []).map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{formatFecha(m.fecha)}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{m.tipo}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{m.responsable}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{m.costo ? `$${Number(m.costo).toLocaleString('es-CO')}` : "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{m.observaciones || "-"}</td>
                      <td className="px-4 py-3 text-right no-print">
                        <button
                          onClick={() => handleDeleteMantenimiento(m.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(equipo.Mantenimiento || []).length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                        Sin mantenimientos registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}