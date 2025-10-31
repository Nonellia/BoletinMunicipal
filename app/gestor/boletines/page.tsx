"use client";
import GenericForm from "@/components/gestorComp/genericForm";
import GenericTable from "@/components/gestorComp/genericTable";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function BoletinForm() {
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [editItem, setEditItem] = useState<any | null>(null);

  const handleFormSuccess = () => {
    setRefresh((prev) => !prev);
    setEditItem(null);
  };

  const handleEdit = (item: any) => {
    setEditItem({ ...item });
    setShowForm(true);
  };

  return (
    <div>
      <button
        type="button"
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? <EyeOff /> : <Eye />}
        {showForm ? "Ocultar Formulario" : "Mostrar Formulario"}
      </button>

      {showForm && (
        <GenericForm
          endpoint={
            editItem
              ? `http://127.0.0.1:8000/boletin/${editItem.id}/`
              : "http://127.0.0.1:8000/boletin/"
          }
          fields={[
            { name: "numero_edicion", label: "numero_edicion", type: "number" },
            { name: "fecha_publicacion", label: "fecha_publicacion", type: "date" },
            { name: "anio_publicacion", label: "Año de publicación", type: "number" },
            { name: "documentos", label: "Documentos", type: "text" },
            { name: "titulo_edicion", label: "Titulo edición", type: "text" },
            { name: "paginacion", label: "Paginación", type: "text" },
          ]}
          onSuccess={handleFormSuccess}
          initialData={editItem || {}}
          method={editItem ? "PUT" : "POST"}
        />
      )}

      <GenericTable
        endpoint="http://127.0.0.1:8000/boletin/"
        fields={[
          { key: "id", label: "ID" },
          { key: "numero_edicion", label: "Número de Edición" },
          { key: "fecha_publicacion", label: "Fecha de Publicación" },
          { key: "anio_publicacion", label: "Año de Publicación" },
          { key: "documentos", label: "Documentos" },
          { key: "titulo_edicion", label: "Título de Edición" },
          { key: "paginacion", label: "Paginación" },
        ]}
        refreshTrigger={refresh}
        onEdit={handleEdit}
      />
    </div>
  );
}
