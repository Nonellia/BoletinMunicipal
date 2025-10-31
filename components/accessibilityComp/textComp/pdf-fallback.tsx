// components/accessibilityComp/textComp/pdf-fallback.tsx
"use client";
import { useState, useEffect } from "react";
import { AlertCircle, FileText } from "lucide-react";
import { Card, CardHeader, CardBody, Chip, Spinner } from "@heroui/react";

interface PDFTextExtractorProps {
  onTextExtracted: (text: string, fileName: string) => void;
  pdfUrl?: string;
}

export function PDFTextExtractor({ onTextExtracted, pdfUrl }: PDFTextExtractorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");

useEffect(() => {
  if (!pdfUrl) return;

  const fetchAndProcessPDF = async () => {
    setIsProcessing(true);
    setError("");
    try {

      if (!pdfUrl.startsWith('http://') && !pdfUrl.startsWith('https://')) {
        throw new Error("URL inválida");
      }

      const response = await fetch(pdfUrl, {
        mode: 'cors',
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const blob = await response.blob();
      
      if (!blob || blob.size === 0) {
        throw new Error("El archivo PDF está vacío");
      }

      // Extraer nombre del archivo
      const fileName = pdfUrl.split('/').pop()?.split('?')[0] || 'documento.pdf';
      const file = new File([blob], fileName, { type: blob.type || 'application/pdf' });

      // Procesar el PDF
      await extractTextWithFallback(file);
    } catch (err) {
      console.error("Error en fetchAndProcessPDF:", err);
      setError(`Error al procesar el PDF: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  fetchAndProcessPDF();
}, [pdfUrl]);
 const extractTextWithFallback = async (file: File) => {
    setIsProcessing(true);
    setError("");

    try {
      try {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";

        if (!window.pdfjsLib) {
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(" ");
          fullText += `\n\n--- Página ${i} ---\n\n${pageText}`;
        }

        if (fullText.trim()) {
          onTextExtracted(fullText, file.name);
          return;
        }
      } catch (pdfError) {
        console.warn("PDF.js falló, intentando método alternativo:", pdfError);
      }

      const text = await extractTextFallback(file);
      if (text) {
        onTextExtracted(text, file.name);
        return;
      }

      throw new Error("No se pudo extraer texto del PDF");
    } catch (error) {
      console.error("Error:", error);
      setError("No se pudo procesar el PDF. Verifica que contenga texto seleccionable y no esté protegido.");
    } finally {
      setIsProcessing(false);
    }
  };

  const extractTextFallback = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const textMatches = result.match(/$$([^)]+)$$/g);
        if (textMatches) {
          const extractedText = textMatches
            .map((match) => match.slice(1, -1))
            .filter((text) => text.length > 1)
            .join(" ");
          resolve(extractedText);
        } else {
          resolve("");
        }
      };
      reader.readAsText(file, "latin1");
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Por favor selecciona un archivo PDF válido");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("El archivo es demasiado grande. Por favor selecciona un PDF menor a 10MB");
      return;
    }

    extractTextWithFallback(file);
  };

  return (
    <Card>
      <CardHeader>
        <h1 className="flex items-center gap-2 text-lg font-semibold">
          <FileText className="h-5 w-5" />
          {pdfUrl ? "Visualizando PDF" : "Cargar PDF"}
        </h1>
      </CardHeader>
      <CardBody className="space-y-4">
        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-8">
            <Spinner size="lg" />
            <p className="mt-4 text-sm">Descargando y procesando PDF...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{error}</span>
            </div>
            {pdfUrl && (
              <p className="mt-2 text-sm text-red-600">
                URL del PDF: <span className="font-mono break-all">{pdfUrl}</span>
              </p>
            )}
          </div>
        )}

        {!pdfUrl && (
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            disabled={isProcessing}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        )}
      </CardBody>
    </Card>
  );
}