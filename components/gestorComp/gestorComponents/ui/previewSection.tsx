import React from "react";
import type { Boletin, Documento, ConfiguracionPDF } from "@/types/Boletin";

interface PreviewSectionProps {
  showPreview: boolean;
  selectedBoletin: Boletin | null;
  config: ConfiguracionPDF;
  selectedDocsData: Documento[];
  articulos: { documento_id: number; contenido: string }[]; // Agregado para los artículos
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  showPreview,
  selectedBoletin,
  config,
  selectedDocsData,
  articulos, // Desestructuración de articulos
}) => {
  if (!showPreview || !selectedBoletin) return null;

  return (
    <div className="mt-6 bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Preview del Boletín</h2>
      
      <div className="border rounded-lg overflow-hidden bg-gray-50">
        {config.showPortada && (
          <div className="bg-white p-12 text-center border-b-4 border-blue-600">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {config.portadaTitulo}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {config.portadaSubtitulo}
            </p>
            <div className="mt-12 space-y-2">
              <p className="text-2xl font-semibold">
                Edición Nº {selectedBoletin.numero_edicion}
              </p>
              <p className="text-lg text-gray-600">
                {selectedBoletin.fecha_publicacion}
              </p>
              <p className="text-lg text-gray-600">
                Año {selectedBoletin.anio_publicacion}
              </p>
            </div>
          </div>
        )}

        {config.showIndice && selectedDocsData.length > 0 && (
          <div className="bg-white p-8 border-b">
            <h2 className="text-2xl font-bold mb-4">Índice</h2>
            <div className="space-y-2">
              {selectedDocsData.map((doc, idx) => (
                <div key={doc.id} className="flex justify-between text-sm">
                  <span>{idx + 1}. Documento Nº {doc.numero_documento}</span>
                  <span className="text-gray-500">Pág. {idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className="bg-white rounded shadow p-4 overflow-auto"
          style={{ maxHeight: "70vh", minHeight: "300px" }}
        >
          {selectedDocsData.map((doc, idx) => {
            const articulosDoc = articulos.filter(a => a.documento_id === doc.id);

            const contenidoArticulos = articulosDoc.length
              ? articulosDoc.map(a => (
                  <div key={a.id} style={{ marginBottom: 16 }}>
                    <div>
                      <strong>
                        {a.prefijo ? a.prefijo + " " : ""}
                        {a.numero_articulo ? a.numero_articulo + " - " : ""}
                        {a.titulo ? a.titulo : ""}
                      </strong>
                    </div>
                    <div>{a.contenido}</div>
                  </div>
                ))
              : "Sin artículos";
            return (
              <div key={doc.id} className="bg-white p-8 border-b">
                <div className="text-xs text-gray-500 mb-6 pb-2 border-b flex justify-between">
                  <span>{config.cabecera}</span>
                  <span>Edición Nº {selectedBoletin.numero_edicion}</span>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">
                    Documento Nº {doc.numero_documento}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {doc.numero_completo}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-medium">Categoría:</span>{" "}
                      {typeof doc.categoria === "object"
                        ? doc.categoria?.nombre
                        : doc.categoria || "Sin categoría"}
                    </div>
                    <div>
                      <span className="font-medium">Fecha Emisión:</span> {doc.fecha_emision}
                    </div>
                    <div>
                      <span className="font-medium">Lugar:</span> {doc.lugar_emision}
                    </div>
                    <div>
                      <span className="font-medium">Estado:</span> {doc.estado}
                    </div>
                    {doc.paginas && (
                      <div>
                        <span className="font-medium">Páginas:</span> {doc.paginas}
                      </div>
                    )}
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {contenidoArticulos}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-gray-500 pt-4 border-t text-center">
                  {config.piePagina.replace("{pageNumber}", String(idx + 1))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};