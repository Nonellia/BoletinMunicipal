"use client";
import GenericForm from "@/components/gestorComp/genericForm";
import GenericTable from "@/components/gestorComp/genericTable";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function ExpedienteForm() {
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
              ? `http://127.0.0.1:8000/expediente/${editItem.id}/`
              : "http://127.0.0.1:8000/expediente/"
          }
          fields={[
            { name: "numero_expediente", label: "Numero de expediente:", type: "text" },
            { name: "organismo", label: "Organismo dueño del expediente", type: "text" },
            { name: "fecha_creacion", label: "Fecha de creación del expediente", type: "date" },
            { name: "estado", label: "Estado del expediente", type: "text" },
            { name: "descripcion", label: "Descripción", type: "text" },
          ]}
          onSuccess={handleFormSuccess}
          initialData={editItem || {}}
          method={editItem ? "PUT" : "POST"}
        />
      )}

      <GenericTable
        endpoint="http://127.0.0.1:8000/expediente/"
        fields={[
          { key: "id", label: "ID" },
          { key: "numero_expediente", label: "Numero de expediente" },
          { key: "organismo", label: "Organismo dueño del expediente" },
          { key: "fecha_creacion", label: "Fecha de creación del expediente" },
          { key: "estado", label: "Estado del expediente" },
          { key: "descripcion", label: "Descripción" },
        ]}
        refreshTrigger={refresh}
        onEdit={handleEdit}
      />
    </div>
  );
}
