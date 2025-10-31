"use client";
import { useEffect, useState } from "react";

interface BoletinesListProps {
  onEdit: (boletin: any) => void;
  onDelete: (boletin: any) => void;
  reload: boolean;
}

export default function BoletinesList({ onEdit, onDelete, reload }: BoletinesListProps) {
  const [boletines, setBoletines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Recarga cada vez que reload cambia
  useEffect(() => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/boletin")
      .then((res) => res.json())
      .then((data) => {
        setBoletines(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [reload]);

  if (loading) return <div className="p-8 text-center">Cargando boletines...</div>;
  if (!boletines.length) return <div className="p-8 text-center">No hay boletines disponibles.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {boletines.map((boletin) => (
        <div key={boletin.idboletin} className="bg-white rounded shadow p-4 relative">
          <h3 className="font-bold text-lg mb-2">{boletin.numero_string}</h3>
          <p className="text-gray-600 mb-2">{boletin.nombre}</p>
          <a
            href={boletin.archivo ? `http://127.0.0.1:8000/items/${boletin.archivo}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-blue-600 underline ${!boletin.archivo ? "pointer-events-none opacity-50" : ""}`}
          >
            Ver archivo
          </a>
          <div className="mt-2 text-xs text-gray-400">Descripción: {boletin.descripcion}</div>
          <div className="mt-2 text-xs text-gray-400">Fecha creación: {boletin.fecha_creacion}</div>
          <div className="mt-2 text-xs text-gray-400">Fecha publicación: {boletin.fecha_publicacion}</div>

          <div className="flex gap-2 mt-4">
            <button
              className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-xs"
              onClick={() => onEdit(boletin)}
            >
              Editar
            </button>
            <button
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
              onClick={() => onDelete(boletin)}
            >
              Borrar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
