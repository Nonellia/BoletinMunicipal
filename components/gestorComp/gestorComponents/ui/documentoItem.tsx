import React from "react";
import type { Documento } from "../../../types/boletin";

interface DocumentoItemProps {
  doc: Documento;
  isSelected: boolean;
  onToggle: (docId: number) => void;
}

export const DocumentoItem: React.FC<DocumentoItemProps> = ({
  doc,
  isSelected,
  onToggle,
}) => (
  <div
    className={`p-4 border rounded-lg cursor-pointer transition ${
      isSelected
        ? "border-blue-500 bg-blue-50"
        : "border-gray-200 hover:border-gray-300"
    }`}
    onClick={() => onToggle(doc.id)}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onToggle(doc.id);
      }
    }}
    role="button"
    tabIndex={0}
  >
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggle(doc.id)}
        className="mt-1"
        onClick={(e) => e.stopPropagation()}
      />
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">
          Doc. Nº {doc.numero_documento}
        </h3>
        {/* <p className="text-sm text-gray-600 mt-1">
          {doc.numero_completo}
        </p> */}
        {doc.categoria && (
          <div className="text-xs text-gray-700 mt-1">
            <span className="font-semibold">Categoría:</span>{" "}
            {typeof doc.categoria === "object"
              ? doc.categoria.nombre
              : doc.categoria}
          </div>
        )}
        {doc.articulos && doc.articulos.length > 0 && (
          <div className="text-sm text-gray-500 mt-2">
            {doc.articulos.map((articulo) => (
              <div key={articulo.id} className="mb-1">
                {/* Muestra aquí los datos que quieras, por ejemplo: */}
                <strong>Artículo:</strong> {articulo.contenido}
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-4 mt-2 text-xs text-gray-500">
          <span>Emisión: {doc.fecha_emision}</span>
          <span>Estado: {doc.estado}</span>
          {doc.paginas && <span>Págs: {doc.paginas}</span>}
        </div>
      </div>
    </div>
  </div>
);