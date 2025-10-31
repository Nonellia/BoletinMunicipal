import React from "react";
import { FileText } from "lucide-react";
import type { Boletin } from "../../../types/boletin";

interface BoletinSelectorProps {
  boletines: Boletin[];
  selectedBoletin: Boletin | null;
  onSelect: (boletin: Boletin | null) => void;
}

export const BoletinSelector: React.FC<BoletinSelectorProps> = ({
  boletines,
  selectedBoletin,
  onSelect,
}) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <FileText className="w-5 h-5" />
      Seleccionar Boletín
    </h2>
    <select
      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
      value={selectedBoletin?.id || ""}
      onChange={(e) => {
        const boletin = boletines.find(b => b.id === parseInt(e.target.value));
        onSelect(boletin || null);
      }}
    >
      <option value="">Seleccione un boletín...</option>
      {boletines.map(b => (
        <option key={b.id} value={b.id}>
          Nº {b.numero_edicion} - {b.fecha_publicacion}
        </option>
      ))}
    </select>
  </div>
);