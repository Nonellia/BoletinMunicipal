"use client";
import React, { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import { BoletinPDF } from "@/components/gestorComp/gestorComponents/boletin-pdf/boletinPdf";
import { BoletinSelector } from "@/components/gestorComp/gestorComponents/ui/boletinSelector";
import { ConfigPanel } from "@/components/gestorComp/gestorComponents/ui/configPanel";
import { ActionButtons } from "@/components/gestorComp/gestorComponents/ui/actionButtons";
import { DocumentosList } from "@/components/gestorComp/gestorComponents/ui/documentList";
import { PreviewSection } from "@/components/gestorComp/gestorComponents/ui/previewSection";
import type {
  Boletin,
  Documento,
  ConfiguracionPDF,
  Articulo,
} from "../../../types/Boletin";

export default function GenerarBoletinesPage(): React.ReactElement {
  const [boletines, setBoletines] = useState<Boletin[]>([]);
  const [selectedBoletin, setSelectedBoletin] = useState<Boletin | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [selectedDocumentos, setSelectedDocumentos] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const [config, setConfig] = useState<ConfiguracionPDF>({
    portadaTitulo: "BOLETÍN OFICIAL",
    portadaSubtitulo: "República Argentina",
    cabecera: "Boletín Oficial",
    piePagina: "Página {pageNumber}",
    showPortada: true,
    showIndice: true,
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/boletin/")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return await res.json();
      })
      .then((data: Boletin[]) => setBoletines(data))
      .catch((err: Error) => console.error("Error fetching boletines:", err));
  }, []);

  useEffect(() => {
    if (selectedBoletin) {
      // Trae documentos
      fetch(`http://127.0.0.1:8000/documento/?id_boletin=${selectedBoletin.id}`)
        .then(async (res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return await res.json();
        })
        .then((data: Documento[]) => {
          setDocumentos(data);
          setSelectedDocumentos(data.map((d) => d.id));
        })
        .catch((err: Error) =>
          console.error("Error fetching documentos:", err)
        );

      // Trae artículos de los documentos de este boletín
      fetch(`http://127.0.0.1:8000/articulo/?id_boletin=${selectedBoletin.id}`)
        .then(async (res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return await res.json();
        })
        .then((data: Articulo[]) => setArticulos(data))
        .catch((err: Error) => console.error("Error fetching articulos:", err));
    }
  }, [selectedBoletin]);

  const toggleDocumento = (docId: number): void => {
    setSelectedDocumentos((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  };

  // Une los artículos al contenido de cada documento
  const documentosConContenido = documentos.map((doc) => {
    const articulosDoc = articulos.filter((a) => a.documento_id === doc.id);
    return {
      ...doc,
      articulos: articulosDoc, // <-- esto es clave
    };
  });

  // Solo los seleccionados
  const selectedDocsData = documentosConContenido.filter((d) =>
    selectedDocumentos.includes(d.id)
  );

  const generateAndDownloadPDF = async (): Promise<void> => {
    if (!selectedBoletin) return;

    setLoading(true);
    try {
      const blob = await pdf(
        <BoletinPDF
          boletin={selectedBoletin}
          documentos={selectedDocsData}
          config={config}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `boletin_${selectedBoletin.numero_edicion}_${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generando PDF:", error);
      alert("Error al generar el PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Generador de Boletines
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
          {/* Panel de selección */}
          <div className="lg:col-span-1 space-y-6">
            <BoletinSelector
              boletines={boletines}
              selectedBoletin={selectedBoletin}
              onSelect={setSelectedBoletin}
            />

            <ConfigPanel config={config} onConfigChange={setConfig} />

            <ActionButtons
              selectedBoletin={selectedBoletin}
              loading={loading}
              selectedCount={selectedDocumentos.length}
              onPreview={() => setShowPreview(!showPreview)}
              onDownload={generateAndDownloadPDF}
              showPreview={showPreview}
            />
          </div>

          {/* Panel de documentos */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="bg-white rounded-lg shadow flex-grow overflow-auto">
              <DocumentosList
                selectedBoletin={selectedBoletin}
                documentos={documentosConContenido}
                selectedDocumentos={selectedDocumentos}
                onToggle={toggleDocumento}
              />
            </div>
          </div>
        </div>

        {/* Preview abajo, fuera del grid, con scroll y fondo */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow p-6 overflow-auto" style={{ maxHeight: "60vh" }}>
            <PreviewSection
              showPreview={showPreview}
              selectedBoletin={selectedBoletin}
              config={config}
              selectedDocsData={selectedDocsData}
              articulos={articulos}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
