import React from "react";
import { FileText } from "lucide-react";
import { DocumentoItem } from "./documentoItem";
import type { Boletin, Documento } from "../../../types/boletin";

interface DocumentosListProps {
  selectedBoletin: Boletin | null;
  documentos: Documento[];
  selectedDocumentos: number[];
  onToggle: (docId: number) => void;
}

export const DocumentosList: React.FC<DocumentosListProps> = ({
  selectedBoletin,
  documentos,
  selectedDocumentos,
  onToggle,
}) => {
  if (!selectedBoletin) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Selecciona un boletín
        </h3>
        <p className="text-gray-500">
          Elige un boletín de la lista para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">
          Documentos del Boletín Nº {selectedBoletin.numero_edicion}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {selectedDocumentos.length} de {documentos.length} documentos seleccionados
        </p>
      </div>
      
      <div className="p-6">
        {documentos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay documentos asociados a este boletín
          </p>
        ) : (
          <div className="space-y-3">
            {documentos.map(doc => (
              <DocumentoItem
                key={doc.id}
                doc={doc}
                isSelected={selectedDocumentos.includes(doc.id)}
                onToggle={onToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};