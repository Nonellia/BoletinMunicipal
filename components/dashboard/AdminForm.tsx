"use client";
import { useRef, useState } from "react";
import { formStyles } from "@/constants/estilos";
import FormField from "../form/FormField";
import SubmitButton from "../form/SubmitButton";

export default function AdminForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);
    
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    
    const body = {
      nombre_completo: formData.get("nombre_completo"),
      ndni: formData.get("ndni"),
      tipo_usuario: 1,
      usuario: formData.get("usuario"),
      password: formData.get("password"),
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      if (res.ok) {
        setMessage("Administrador creado exitosamente");
        formRef.current?.reset();
      } else {
        const errorData = await res.json();
        setMessage(errorData.detail || "Error al crear admin");
      }
    } catch {
      setMessage("Error de conexión");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Crear Nuevo Administrador</h2>
        <p className="text-gray-600 mt-1">
          Complete los datos para crear un nuevo usuario administrador
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Nombre Completo"
            name="nombre_completo"
            type="text"
            required
          />
          
          <FormField
            label="DNI"
            name="ndni"
            type="number"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Usuario"
            name="usuario"
            type="text"
            required
          />
          
          <FormField
            label="Contraseña"
            name="password"
            type="password"
            required
          />
        </div>

        <SubmitButton 
          isSubmitting={isSubmitting}
          submittingText="Procesando..."
          normalText="Crear Admin"
        />

        {message && (
          <div className={`p-3 rounded-md text-center text-sm ${
            message.includes("exitosamente") 
              ? "bg-green-50 text-green-700" 
              : "bg-red-50 text-red-700"
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}