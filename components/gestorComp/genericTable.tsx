"use client";
import { useState, useEffect } from "react";

type TableField = {
  key: string;
  label: string;
  type?: "text" | "relation"; // Nuevo tipo para relaciones
  relationEndpoint?: string; // Endpoint para fetch de relación
  relationLabelKey?: string; // Campo a mostrar de la relación
  relationValueKey?: string; // Campo que matchea con el valor
};

type GenericTableProps = {
  endpoint: string;
  fields: TableField[];
  refreshTrigger?: any;
  onEdit?: (item: any) => void; // Nuevo prop opcional para editar
};

export default function GenericTable({
  endpoint,
  fields,
  refreshTrigger,
  onEdit, // Nuevo prop
}: GenericTableProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [relationData, setRelationData] = useState<Record<string, any>>({});

  // Función para cargar datos de relaciones
  const loadRelationData = async (field: TableField, foreignKeyValues: any[]) => {
    if (!field.relationEndpoint || !field.relationValueKey) return;

    try {
      const uniqueValues = [...new Set(foreignKeyValues.filter(val => val))];
      
      if (uniqueValues.length === 0) return;

      // Cargar todos los datos de la relación
      const res = await fetch(field.relationEndpoint);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const relationItems = await res.json();
      const itemsArray = Array.isArray(relationItems) ? relationItems : [relationItems];

      // Crear mapa de relación
      const relationMap: Record<string, any> = {};
      itemsArray.forEach((item: any) => {
        const key = item[field.relationValueKey!];
        relationMap[key] = item;
      });

      setRelationData(prev => ({
        ...prev,
        [field.key]: relationMap
      }));
    } catch (err) {
      console.error(`Error cargando relación para ${field.key}:`, err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const json = await res.json();
      const items = Array.isArray(json) ? json : [json];
      setData(items);

      // Cargar datos de relaciones para campos que lo necesiten
      fields.forEach(field => {
        if (field.type === "relation" && field.relationEndpoint) {
          const foreignKeyValues = items.map(item => item[field.key]);
          loadRelationData(field, foreignKeyValues);
        }
      });
    } catch (err) {
      console.error("Error cargando datos:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint, refreshTrigger]);

  // Función para obtener el valor de display de un campo
  const getDisplayValue = (field: TableField, value: any) => {
    if (field.type === "relation" && field.relationLabelKey) {
      const relationMap = relationData[field.key];
      if (relationMap && relationMap[value]) {
        return relationMap[value][field.relationLabelKey];
      }
      return "Cargando..."; // o algún valor por defecto
    }
    return value;
  };

  // Handler para borrar
  const handleDelete = async (id: any) => {
    if (!window.confirm("¿Está seguro que desea borrar este registro?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${endpoint}${id}/`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al borrar");
      fetchData();
    } catch (err) {
      alert("Error al borrar");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center py-4">Cargando...</p>;

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border border-gray-300">
        
        <thead className="bg-gray-100">
          <tr>
            {fields.map((field) => (
              <th
                key={field.key}
                className="px-4 py-2 border text-left font-medium"
              >
                {field.label}
              </th>
            ))}
            <th className="px-4 py-2 border text-left font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={fields.length + 1}
                className="px-4 py-2 text-center text-gray-500"
              >
                No hay registros
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {fields.map((field) => (
                  <td key={field.key} className="px-4 py-2 border">
                    {getDisplayValue(field, item[field.key])}
                  </td>
                ))}
                <td className="px-4 py-2 border flex gap-2">
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => onEdit && onEdit({ ...item })}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(item.id)}
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}