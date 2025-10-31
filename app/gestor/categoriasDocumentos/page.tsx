"use client";
import GenericForm from "@/components/gestorComp/genericForm";
import GenericTable from "@/components/gestorComp/genericTable";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function CategoriaDocumentoForm() {
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [editItem, setEditItem] = useState<any | null>(null);

  const handleFormSuccess = () => {
    setRefresh((prev) => !prev);
    setEditItem(null);
  };

  const handleEdit = (item: any) => {
    setEditItem({ ...item }); // Asegura un nuevo objeto
    setShowForm(true);
  };

  return (
    <div>
      {/* Botón para mostrar/ocultar formulario */}
      <button
        type="button"
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Ocultar Formulario" : "Mostrar Formulario"}
      </button>

      {showForm && (
        <GenericForm
          endpoint={
            editItem
              ? `http://127.0.0.1:8000/categoriadocumento/${editItem.id}/?CategoriaDocumento_id=${editItem.id}`
              : "http://127.0.0.1:8000/categoriadocumento/"
          }
          fields={[
            { name: "codigo", label: "Código de la categoría", type: "text" },
            { name: "nombre", label: "Nombre de la categoría", type: "text" },
            {
              name: "prefijo_numero",
              label: "Prefijo de la categoría",
              type: "text",
            },
            { name: "plantilla", label: "Plantilla", type: "text" },
            { name: "activo", label: "Estado", type: "checkbox" },
          ]}
          onSuccess={handleFormSuccess}
          initialData={editItem || {}}
          method={editItem ? "PUT" : "POST"}
        />
      )}

      <GenericTable
        endpoint="http://127.0.0.1:8000/categoriadocumento/"
        fields={[
          { key: "id", label: "ID" },
          { key: "codigo", label: "Código" },
          { key: "nombre", label: "Nombre" },
          { key: "prefijo_numero", label: "Prefijo" },
          { key: "plantilla", label: "Plantilla" },
          { key: "activo", label: "Estado" },
        ]}
        refreshTrigger={refresh}
        onEdit={handleEdit} // <-- Esto es clave para que funcione el botón Editar
      />
    </div>
  );
}
