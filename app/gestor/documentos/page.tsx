"use client";
import GenericForm from "@/components/gestorComp/genericForm";
import GenericTable from "@/components/gestorComp/genericTable";
import { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";

export default function DocumentosForm() {
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [editItem, setEditItem] = useState<any | null>(null); // Nuevo estado

  const handleFormSuccess = () => {
    setRefresh((prev) => !prev);
    setEditItem(null); // Limpiar edición al guardar
  };

  // Nuevo: función para manejar edición
  const handleEdit = (item: any) => {
    setEditItem(item);
    setShowForm(true); // Mostrar el formulario si está oculto
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
              ? `http://127.0.0.1:8000/documento/${editItem.id}/?Documento_id=${editItem.id}`
              : "http://127.0.0.1:8000/documento/"
          }
          fields={[
            {
              name: "categoria_id",
              label: "Categoria Documento",
              type: "select",
              optionsEndpoint: "http://127.0.0.1:8000/categoriadocumento/",
              optionLabelKey: "nombre",
              optionValueKey: "id",
            },
            {
              name: "expediente_id",
              label: "Expediente",
              type: "select",
              optionsEndpoint: "http://127.0.0.1:8000/expediente/",
              optionLabelKey: "numero_expediente",
              optionValueKey: "id",
            },
            {
              name: "id_boletin",
              label: "Boletin Nº",
              type: "select",
              optionsEndpoint: "http://127.0.0.1:8000/boletin/",
              optionLabelKey: "numero_edicion",
              optionValueKey: "id",
            },
            {
              name: "numero_documento",
              label: "Numero Documento",
              type: "text",
            },
            { name: "numero_completo", label: "Numero Completo", type: "text" },
            { name: "fecha_emision", label: "Fecha emisión", type: "date" },
            {
              name: "fecha_publicacion",
              label: "Fecha Publicación",
              type: "date",
            },
            { name: "lugar_emision", label: "Lugar Emisión", type: "text" },
            { name: "contenido", label: "Contenido", type: "textarea" },
            { name: "estado", label: "Estado", type: "text" },
            { name: "paginas", label: "Páginas", type: "text" },
            {
              name: "anio_publicacion",
              label: "Año Publicación",
              type: "number",
            },
            { name: "numero_edicion", label: "Número Edición", type: "number" },
          ]}
          onSuccess={handleFormSuccess}
          initialData={editItem || {}}
          method={editItem ? "PUT" : "POST"} // <-- Debes soportar esto en GenericForm
        />
      )}

      <GenericTable
        endpoint="http://127.0.0.1:8000/documento/"
        fields={[
          { key: "id", label: "ID" },
          { key: "numero_documento", label: "Número Documento" },
          {
            key: "id_boletin",
            label: "Boletín",
            type: "relation",
            relationEndpoint: "http://127.0.0.1:8000/boletin/",
            relationLabelKey: "numero_edicion",
            relationValueKey: "id",
          },
          {
            key: "categoria_id",
            label: "Categoría",
            type: "relation",
            relationEndpoint: "http://127.0.0.1:8000/categoriadocumento/",
            relationLabelKey: "nombre",
            relationValueKey: "id",
          },
          {
            key: "expediente_id",
            label: "Expediente",
            type: "relation",
            relationEndpoint: "http://127.0.0.1:8000/expediente/",
            relationLabelKey: "numero_expediente",
            relationValueKey: "id",
          },
          { key: "numero_completo", label: "Número Completo" },
          { key: "fecha_emision", label: "Fecha Emisión" },
          { key: "lugar_emision", label: "Lugar Emisión" },
          { key: "estado", label: "Estado" },
        ]}
        refreshTrigger={refresh}
        onEdit={handleEdit} // <-- Aquí pasas la función
      />
    </div>
  );
}
