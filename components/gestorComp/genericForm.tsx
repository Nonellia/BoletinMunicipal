"use client";
import { useState, useEffect } from "react";

type Field = {
  name: string;
  label: string;
  type: "text" | "number" | "textarea" | "checkbox" | "date" | "select";
  optionsEndpoint?: string;
  optionLabelKey?: string;
  optionValueKey?: string;
};

type GenericFormProps = {
  endpoint: string;
  fields: Field[];
  onSuccess?: (data: any) => void;
  initialData?: any;
  method?: "POST" | "PUT";
};

export default function GenericForm({
  endpoint,
  fields,
  onSuccess,
  initialData = {},
  method = "POST",
}: GenericFormProps) {
  const [formData, setFormData] = useState<any>(initialData);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<Record<string, any[]>>({});

  useEffect(() => {
    setFormData(initialData || {});
  }, [JSON.stringify(initialData)]);

  useEffect(() => {
    fields.forEach((field) => {
      if (field.type === "select" && field.optionsEndpoint) {
        (async () => {
          try {
            const res = await fetch(field.optionsEndpoint);
            if (!res.ok) throw new Error(`Error ${res.status}`);
            const data = await res.json();
            setOptions((prev) => ({
              ...prev,
              [field.name]: Array.isArray(data) ? data : [data],
            }));
          } catch (err) {
            console.error(`Error cargando opciones para ${field.name}`, err);
            setOptions((prev) => ({ ...prev, [field.name]: [] }));
          }
        })();
      }
    });
  }, [fields]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanFormData = { ...formData };
    ["categoria_id", "expediente_id", "id_boletin"].forEach((key) => {
      if (cleanFormData[key] === "" || cleanFormData[key] == null) {
        cleanFormData[key] = null;
      } else {
        cleanFormData[key] = Number(cleanFormData[key]);
      }
    });

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanFormData),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error("Error al guardar: " + errorText);
      }
      const data = await res.json();
      if (onSuccess) onSuccess(data);
      alert("Guardado con éxito");
      setFormData({});
    } catch (err) {
      console.error(err);
      alert("Hubo un error al guardar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {fields.map((field) => (
          <div
            key={field.name}
            className={`flex flex-col ${
              field.type === "textarea" ? "md:col-span-4" : ""
            } ${field.type === "checkbox" ? "md:col-span-4" : ""}`}
          >
            <label
              htmlFor={field.name}
              className="mb-0.5 font-medium text-gray-700 text-xs uppercase tracking-tight"
            >
              {field.label}
            </label>

            {field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                rows={2}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-white resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={field.label}
              />
            ) : field.type === "select" ? (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="" className="text-xs">
                  ...
                </option>
                {(options[field.name] || []).map((opt: any) => (
                  <option
                    key={opt[field.optionValueKey || "id"]}
                    value={opt[field.optionValueKey || "id"]}
                    className="text-xs"
                  >
                    {opt[field.optionLabelKey || "nombre"]}
                  </option>
                ))}
              </select>
            ) : field.type === "checkbox" ? (
              <div className="flex items-center">
                <input
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  checked={formData[field.name] || false}
                  onChange={handleChange}
                  className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor={field.name}
                  className="ml-1.5 text-gray-700 text-xs"
                >
                  {field.label}
                </label>
              </div>
            ) : (
              <input
                id={field.name}
                type={field.type}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={field.label}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-1.5 rounded text-xs font-medium text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
