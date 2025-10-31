"use client";
import GenericForm from "@/components/gestorComp/genericForm";
import GenericTable from "@/components/gestorComp/genericTable";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function ArticuloForm() {
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
              ? `http://127.0.0.1:8000/articulo/${editItem.id}/`
              : "http://127.0.0.1:8000/articulo/"
          }
          fields={[
            {
              name: "documento_id",
              label: "Documento",
              type: "select",
              optionsEndpoint: "http://127.0.0.1:8000/documento/",
              optionLabelKey: "numero_documento",
              optionValueKey: "id",
            },
            { name: "numero_articulo", label: "Numero Articulo", type: "text" },
            { name: "tipo_articulo", label: "Tipo de articulo", type: "text" },
            { name: "contenido", label: "Contenido", type: "textarea" },
            { name: "orden", label: "orden", type: "number" },
          ]}
          onSuccess={handleFormSuccess}
          initialData={editItem || {}}
          method={editItem ? "PUT" : "POST"}
        />
      )}

      <GenericTable
        endpoint="http://127.0.0.1:8000/articulo/"
        fields={[
          { key: "id", label: "ID" },
          {
            key: "documento_id",
            label: "Documento",
            type: "relation",
            relationEndpoint: "http://127.0.0.1:8000/documento/",
            relationLabelKey: "numero_documento",
            relationValueKey: "id",
          },
          { key: "numero_articulo", label: "Numero Articulo" },
          { key: "tipo_articulo", label: "Tipo de articulo" },
          { key: "contenido", label: "Contenido" },
          { key: "orden", label: "orden" },
        ]}
        refreshTrigger={refresh}
        onEdit={handleEdit}
      />
    </div>
  );
}
