"use client";

import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const TIPOS = ["COMPUTADOR", "IMPRESORA", "VIDEO BEAM", "MONITOR", "TELÉFONO", "RED / SWITCH", "CAMARA", "OTRO"];
const ESTADOS = ["OPERATIVO", "EN REPARACIÓN", "EN MANTENIMIENTO", "DETERIORADO", "DADO DE BAJA"];

export default function EditarEquipoPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ubicaciones, setUbicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [eqRes, ubRes] = await Promise.all([
          fetch(`/api/equipo/${id}`),
          fetch("/api/ubicacion"),
        ]);
        const eq = await eqRes.json();
        const ub = await ubRes.json();
        if (!eqRes.ok) throw new Error(eq.error || "Error");
        setForm({
          nombre: eq.nombre || "",
          serial: eq.serial || "",
          tipo: eq.tipo || "COMPUTADOR",
          marca: eq.marca || "",
          modelo: eq.modelo || "",
          estado: eq.estado || "OPERATIVO",
          ubicacionId: eq.ubicacionId || "",
          observaciones: eq.observaciones || "",
        });
        setUbicaciones(Array.isArray(ub) ? ub : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.nombre.trim() || !form.ubicacionId) {
      setError("El nombre del equipo y la ubicación son obligatorios");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/equipo/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al guardar");
        return;
      }
      router.push(`/equipos/${id}`);
    } catch (err) {
      setError("Error al guardar el equipo");
    } finally {
      setSaving(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto mt-10 p-6 text-center text-gray-500">Cargando...</main>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto mt-10 p-6 text-center text-gray-500">{error || "Equipo no encontrado"}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto mt-10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">EDITAR EQUIPO</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Volver
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del equipo *</label>
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Serial</label>
              <input type="text" name="serial" value={form.serial} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
              <select name="tipo" value={form.tipo} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
              <input type="text" name="marca" value={form.marca} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
              <input type="text" name="modelo" value={form.modelo} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación *</label>
              <select name="ubicacionId" value={form.ubicacionId} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="">Seleccione una ubicación</option>
                {ubicaciones.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                    {u.Plano?.name ? ` — ${u.Plano.name}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
              <textarea name="observaciones" value={form.observaciones} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>

          {error && <div className="mt-4 bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg px-4 py-2">{error}</div>}

          <button onClick={handleSave} disabled={saving} className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-60">
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </main>
    </div>
  );
}