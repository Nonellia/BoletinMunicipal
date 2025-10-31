// components/PDFContentViewer.tsx
// Este componente muestra el contenido de un PDF con opciones de accesibilidad
// es el cuadro que muestra el pdf en el lado derecho de la pantalla
import { Card, CardHeader, CardBody, Spinner } from "@heroui/react"
import { Upload } from "lucide-react"
import type { AccessibilitySettings } from "@/types/interfaces"

interface PDFContentViewerProps {
  pdfText: string
  settings: AccessibilitySettings
  isLoading: boolean
}

export const PDFContentViewer = ({ pdfText, settings, isLoading }: PDFContentViewerProps) => {
  const textStyle = {
    fontSize: `${settings.fontSize}px`,
    backgroundColor: settings.backgroundColor,
    color: settings.textColor,
    lineHeight: settings.lineHeight,
    letterSpacing: `${settings.letterSpacing}px`,
    padding: "2rem",
    borderRadius: "0.75rem",
    border: `1px solid hsl(var(--nextui-divider))`,
    minHeight: "400px",
    whiteSpace: "pre-wrap" as const,
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <h3 className="text-lg font-semibold">Contenido del PDF</h3>
      </CardHeader>
      
      <CardBody>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Spinner 
              size="lg" 
              color="primary"
              label="Procesando PDF..."
              labelColor="primary"
            />
          </div>
        ) : pdfText ? (
          <div
            style={textStyle}
            className="focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg transition-all duration-200"
            tabIndex={0}
            role="document"
            aria-label="Contenido del PDF"
          >
            {pdfText}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-default-500 space-y-4">
            <div className="p-4 rounded-full bg-default-100">
              <Upload size={48} className="opacity-50" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-default-700">No hay PDF cargado</p>
              <p className="text-sm text-default-500 max-w-md px-4">
                Selecciona un archivo PDF para comenzar a leer con opciones de accesibilidad
              </p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}