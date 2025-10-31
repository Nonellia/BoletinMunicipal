import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import {
  FileText,
  Calendar as CalendarIcon,
  Eye,
  Download,
} from "lucide-react";
import type { Boletin } from "@/types/Boletin";
import { useRouter } from "next/navigation";
import { pdf } from "@react-pdf/renderer";
import { BoletinPDF } from "@/components/gestorComp/gestorComponents/boletin-pdf/boletinPdf";
import { useState } from "react";
import clsx from "clsx";

interface BoletinCardProps {
  boletin: Boletin;
  isFirst?: boolean;
  onView: (url: string) => void;
}

export function BoletinCard({
  boletin,
  isFirst = false,
  onView,
}: BoletinCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Función para generar y descargar el PDF igual que en generarBoletines
  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      // Trae los datos completos del boletín
      const res = await fetch(
        `http://127.0.0.1:8000/boletin/${boletin.id}/full`
      );
      const data = await res.json();

      // Une artículos a cada documento
      const documentosConContenido = (data.documentos_rel || []).map(
        (doc: any) => ({
          ...doc,
          articulos: doc.articulos || [],
        })
      );

      // Configuración básica (puedes personalizar)
      const config = {
        portadaTitulo: "BOLETÍN OFICIAL",
        portadaSubtitulo: "República Argentina",
        cabecera: "Boletín Oficial",
        piePagina: "Página {pageNumber}",
        showPortada: true,
        showIndice: true,
      };

      // Genera el PDF
      const blob = await pdf(
        <BoletinPDF
          boletin={data}
          documentos={documentosConContenido}
          config={config}
        />
      ).toBlob();

      // Descarga el PDF
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `boletin_${data.numero_edicion}_${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Error al generar el PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className={clsx(
        "hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
        "dark:bg-[#242424]",
        boletin.destacado
          ? "ring-2 ring-[#300E7A] shadow-md"
          : "border border-[#E5E5E5]",
        boletin.accesible ? "ring-1 ring-[#2B97D6]" : "",
      )}
      aria-label={`Documento: ${boletin.titulo}`}
    >
      <CardBody className="p-4 md:p-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          {/* Contenido principal */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <FileText className="w-10 h-10 md:w-12 md:h-12 dark:text-[#FFFFFF] text-[#300E7A] mt-1" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-lg md:text-xl font-bold dark:text-[#FFFFFF] text-[#300E7A] mb-2 hover:text-[#2B97D6] transition-colors cursor-pointer">
                {boletin.titulo_edicion}
              </h4>

              <p className="text-gray-600 mb-3  dark:text-[#FFFFFF] text-sm md:text-base">
                Nº
                {boletin.numero_edicion}
              </p>

              {/* Badges informativos */}
              <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm mb-3">
                <div className="flex items-center bg-gray-100 px-2 py-1 rounded-md text-gray-700">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {new Date(boletin.fecha + "T12:00:00").toLocaleDateString(
                    "es-AR",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }
                  )}
                </div>

                {isFirst && (
                  <div className="flex items-center dark:bg-[#189e48]  bg-green-600 text-white px-2 py-1 rounded-md font-medium">
                    {/* <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span> */}
                    Último boletín
                  </div>
                )}

                {boletin.accesible && (
                  <div className="flex items-center bg-[#2B97D6] text-white px-2 py-1 rounded-md font-medium">
                    ♿ Accesible
                  </div>
                )}

                {boletin.numero && (
                  <div className="flex items-center bg-[#300E7A] text-white px-2 py-1 rounded-md font-medium">
                    N° {boletin.numero}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto sm:min-w-[160px] flex-shrink-0">
            {/* Ver accesible con tooltip */}
            <div className="relative group flex-1">
              <Button
                title="Leer una versión accesible del boletín"
                size="md"
                variant="flat"
                className={clsx(
                  "bg-[#2B97D6] hover:bg-[#2B97D6]/90 text-white transition-all duration-200",
                  "shadow-sm hover:shadow-lg",
                  "transform hover:-translate-y-1",
                  "hover:ring-2 hover:ring-[#1A6FA3] hover:ring-offset-2 hover:ring-offset-white",
                  "rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A6FA3]",
                  "flex items-center justify-center gap-2 py-2",
                  "w-full min-w-[160px] text-center"
                )}
                style={{ fontWeight: 600, fontSize: "1rem" }}
                onPress={() =>
                  window.open(`/accesible?boletin=${boletin.id}`, "_blank")
                }
              >
                <Eye className="w-6 h-6" />
                <span>Ver accesible</span>
              </Button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-[#2B97D6] text-white text-xs px-3 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-10 whitespace-nowrap">
                Abrir visor accesible
              </div>
            </div>

            {/* Descargar con tooltip */}
            <div className="relative group flex-1">
              <Button
                size="md"
                className={clsx(
                  "bg-[#180e74] hover:bg-[#140a6e]/90 text-white transition-all duration-200",
                  "shadow-sm hover:shadow-lg",
                  "transform hover:-translate-y-1",
                  "hover:ring-2 hover:ring-[#1A6FA3] hover:ring-offset-2 hover:ring-offset-white",
                  "rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A6FA3]",
                  "flex items-center justify-center gap-2 py-2",
                  "w-full min-w-[160px] text-center"
                )}
                style={{ fontWeight: 600, fontSize: "1rem" }}
                onPress={handleDownloadPDF}
                disabled={loading}
              >
                <Download className="w-6 h-6" />
                <span>{loading ? "Generando..." : "Descargar"}</span>
              </Button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-[#180e74] text-white text-xs px-3 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-10 whitespace-nowrap">
                Descargar PDF del boletín
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
