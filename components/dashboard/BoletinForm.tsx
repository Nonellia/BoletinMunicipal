"use client";
import { useRef, useState, useEffect } from "react";
import { formStyles } from "@/constants/estilos";
import FileUpload from "../form/FileUpload";
import FormField from "../form/FormField";
import SubmitButton from "../form/SubmitButton";

interface BoletinFormProps {
  boletin?: any;           // si viene -> editar
  onSave?: () => void;     // callback al guardar (para refrescar lista)
}

export default function BoletinForm({ boletin, onSave }: BoletinFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-cargar datos si hay boletín para editar
  useEffect(() => {
    if (boletin && formRef.current) {
      Object.entries(boletin).forEach(([key, value]) => {
        const input = formRef.current?.elements.namedItem(key) as HTMLInputElement | null;
        if (input && value !== undefined && value !== null) {
          if (input.type === "file") return;
          input.value = value;
        }
      });
    } else {
      formRef.current?.reset();
    }
  }, [boletin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formRef.current) return;
    const formData = new FormData(formRef.current);

    // Si estamos editando y NO se seleccionó archivo nuevo, quítalo del formData
    if (boletin?.idboletin && !formRef.current.archivo.value) {
      formData.delete("archivo");
    }

    // Loguea los datos que se van a enviar
    const logData = {};
    formData.forEach((value, key) => {
      logData[key] = value;
    });
    console.log("Datos enviados al backend:", logData);

    try {
      let res;
      if (boletin?.idboletin) {
        // Editar boletín existente
        res = await fetch(`http://localhost:8000/boletin/${boletin.idboletin}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        // Crear nuevo boletín
        res = await fetch("http://localhost:8000/boletin/upload", {
          method: "POST",
          body: formData,
        });
      }

      // Loguea la respuesta del backend
      const responseText = await res.text();
      console.log("Respuesta backend:", responseText);

      if (res.ok) {
        alert(boletin?.idboletin ? "Boletín editado correctamente" : "Boletín subido correctamente");
        formRef.current?.reset();
        if (onSave) onSave();
      } else {
        alert("Error al guardar el boletín");
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      alert("Error de conexión");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {boletin?.idboletin ? "Editar Boletín" : "Subir Nuevo Boletín"}
        </h2>
        <p className="text-gray-600 mt-1">
          Complete todos los campos requeridos para{" "}
          {boletin?.idboletin ? "editar el boletín" : "publicar un nuevo boletín"}
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <FileUpload 
          name="archivo"
          accept="application/pdf"
          label="Archivo PDF"
          hint="PDF hasta 10MB"
          required={!boletin?.idboletin}  // ✅ obligatorio solo al crear
        />

        {boletin?.archivo && (
          <p className="text-sm text-gray-600">
            Archivo actual:{" "}
            <a
              href={`http://localhost:8000/items/${boletin.archivo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Ver archivo
            </a>
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Categoría ID" name="categoria_id" type="number" required />
          <FormField label="Nombre" name="nombre" type="text" required />
        </div>

        <FormField label="Descripción" name="descripcion" type="text" required />
        <FormField label="Observaciones" name="observaciones" type="text" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Fecha de creación" name="fecha_creacion" type="date" required />
          <FormField label="Fecha de publicación" name="fecha_publicacion" type="date" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Número string" name="numero_string" type="text" />
          <FormField label="Número int" name="numero_int" type="number" />
        </div>

        <div className="max-w-xs">
          <label className={formStyles.label}>Accesible:</label>
          <select name="accesible" className={formStyles.select} defaultValue={boletin?.accesible ?? "1"}>
            <option value="1">Sí</option>
            <option value="0">No</option>
          </select>
        </div>

        <SubmitButton 
          isSubmitting={isSubmitting}
          submittingText="Procesando..."
          normalText={boletin?.idboletin ? "Guardar cambios" : "Subir boletín"}
        />
      </form>
    </div>
  );
}
