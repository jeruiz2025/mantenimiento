"use client";

import Header from "@/components/Header";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PlanosPage() {
  const router = useRouter();
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/plano");
        const data = await res.json();
        setPlanos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("El nombre del plano es obligatorio");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/plano", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, imageData: imagePreview }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al guardar");
        return;
      }
      setShowForm(false);
      setName("");
      setImagePreview(null);
      router.refresh();
      const reload = await fetch("/api/plano");
      setPlanos(await reload.json());
    } catch (err) {
      setError("Error al guardar el plano");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto mt-10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">PLANOS DE UBICACIÓN</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showForm ? "Cancelar" : "Nuevo plano"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">NUEVO PLANO</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del plano</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen del plano</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Previsualización"
                className="mt-4 max-h-64 border rounded-lg"
              />
            )}
            {error && <div className="mt-4 bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg px-4 py-2">{error}</div>}
            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar plano"}
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando planos...</div>
        ) : planos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No hay planos. Crea uno nuevo para empezar.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {planos.map((plano) => (
              <Link
                key={plano.id}
                href={`/planos/${plano.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-44 bg-gray-100 flex items-center justify-center">
                  {plano.imageData ? (
                    <img src={plano.imageData} alt={plano.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-sm">Sin imagen</span>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-bold text-gray-800">{plano.name}</h2>
                  <p className="text-sm text-gray-500">
                    {plano._count?.Ubicacion ?? 0} ubicacion(es)
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}