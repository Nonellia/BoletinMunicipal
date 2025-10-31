"use client";
import GenericTable from "@/components/gestorComp/genericTable";
import GenericForm from "@/components/gestorComp/genericForm";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AnexoForm() {
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [editItem, setEditItem] = useState<any | null>(null);

  const handleFormSuccess = () => {
    setRefresh((prev) => !prev);
    setEditItem(null);
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
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
              ? `http://127.0.0.1:8000/anexo/${editItem.id}/`
              : "http://127.0.0.1:8000/anexo/"
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
            { name: "titulo", label: "Título", type: "text" },
            { name: "contenido", label: "Contenido", type: "textarea" },
            { name: "es_tabla", label: "Es tabla?", type: "checkbox" },
          ]}
          onSuccess={handleFormSuccess}
          initialData={editItem || {}}
          method={editItem ? "PUT" : "POST"}
        />
      )}

      <GenericTable
        endpoint="http://127.0.0.1:8000/anexo/"
        fields={[
          { key: "id", label: "ID" },
          { key: "tipo_anexo", label: "Tipo de anexo" },
          {
            key: "documento_id",
            label: "Documento",
            type: "relation",
            relationEndpoint: "http://127.0.0.1:8000/documento/",
            relationLabelKey: "numero_documento",
            relationValueKey: "id",
          },
          { key: "titulo", label: "Título" },
          { key: "contenido", label: "Contenido" },
          { key: "es_tabla", label: "Es tabla" },
        ]}
        refreshTrigger={refresh}
        onEdit={handleEdit}
      />
    </div>
  );
}
