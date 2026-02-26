import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import {
  FileText,
  Calendar as CalendarIcon,
  Eye,
  Tag,
  Layers
} from "lucide-react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { DownloadBoletinButton } from "./DownloadBoletinButton";

interface BoletinCardProps {
  boletin: any;
  isFirst?: boolean;
  onView: (url: string) => void;
  onViewAccessible: (id: number) => void;
  onDownload: (url: string) => void;
}

export function BoletinCard({
  boletin,
  isFirst = false,
  onView,
  onViewAccessible,
  onDownload,
}: BoletinCardProps) {
  const router = useRouter();

  const formatFecha = (fechaString: string) => {
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Fecha no disponible";
    }
  };

  return (
    <Card
      className={clsx(
        "hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
        "dark:bg-[#242424] bg-white",
        isFirst
          ? "ring-2 ring-blue-500 shadow-lg"
          : "border border-gray-200",
      )}
      aria-label={`Boletín: Edición ${boletin.edicion}`}
    >
      <CardBody className="p-6 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          {/* Contenido principal */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <h4 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">
                  Boletín Municipal - Edición {boletin.edicion}
                </h4>
                
                {isFirst && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                    Más reciente
                  </span>
                )}
              </div>

              {/* Información del boletín */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {formatFecha(boletin.fecha_publicacion)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Tag className="w-4 h-4" />
                  <span className="text-sm">
                    {boletin.tipo_boletin_nombre || `Tipo ID ${boletin.tipo_boletin}`}
                  </span>
                </div>
              </div>

              {/* Resúmenes incluidos */}
              {boletin.resumenes_count > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">{boletin.resumenes_count}</span> resúmenes incluidos
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {boletin.categorias_principales?.slice(0, 3).map((cat: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                        {cat}
                      </span>
                    ))}
                    {boletin.categorias_principales?.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{boletin.categorias_principales.length - 3} más
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto lg:min-w-[200px]">
            {/* Botón Ver Accesible */}
            <Button
              size="md"
              variant="solid"
              className={clsx(
                "bg-gradient-to-r from-blue-600 to-cyan-600 text-white",
                "hover:opacity-90 transition-all duration-200",
                "shadow-sm hover:shadow-lg",
                "flex items-center justify-center gap-2 py-3",
                "w-full"
              )}
              onPress={() => onViewAccessible(boletin.id_boletin)}
            >
              <Eye className="w-5 h-5" />
              <span>Ver Accesible</span>
            </Button>

            {/* Botón Descargar PDF */}
            <DownloadBoletinButton
              boletinId={boletin.id_boletin}
              edicion={boletin.edicion}
              fecha={boletin.fecha}
            />

          </div>
        </div>
      </CardBody>
    </Card>
  );
}
