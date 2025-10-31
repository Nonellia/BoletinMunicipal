"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AccessibilityControls } from "@/components/accessibilityComp/textComp/accessibilityControlls";
import { useAccessibilitySettings } from "@/components/accessibilityComp/textComp/useAccessibilitySettings";
import { useTextProcessor } from "@/components/accessibilityComp/textComp/procesadorTexto";
import { useAudioController } from "@/components/accessibilityComp/audioComp/audioController";
import { Card, CardHeader, CardBody, Spinner } from "@heroui/react";
import { DesktopAudioControls } from "@/components/accessibilityComp/audioComp/desktopAudioControls";
import { MobileAudioPlayer } from "@/components/accessibilityComp/audioComp/mobileAudioPlayer";
import { MobileAdvancedAudioControls } from "@/components/accessibilityComp/audioComp/mobileAdvancedAudioControls";
import { DebugInfo } from "@/components/accessibilityComp/textComp/debugInfo";

export default function AccesiblePage() {
  const searchParams = useSearchParams();
  const boletinId = searchParams.get("boletin");
  const [boletinData, setBoletinData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Accesibilidad visual
  const accessibility = useAccessibilitySettings();

  // Procesador de texto
  const textProcessor = useTextProcessor();

  // Audio controller
  const {
    voiceSettings,
    setVoiceSettings,
    readingState,
    availableVoices,
    isMobile,
    audioInitialized,
    debugInfo,
    startReading,
    pauseReading,
    resumeReading,
    stopReading,
    skipForward,
    skipBackward,
    testAudio,
    initializeAudioForMobile,
  } = useAudioController(textProcessor.textChunks);

  // Extraer texto accesible del boletín
  const getAccessibleText = () => {
    if (!boletinData) return "";
    let text = `Boletín Nº ${boletinData.numero_edicion} - ${boletinData.titulo_edicion}\nFecha: ${boletinData.fecha_publicacion}\n\n`;
    boletinData.documentos_rel?.forEach((doc: any, idx: number) => {
      text += `Documento ${idx + 1}: ${doc.categoria?.nombre || ""} - ${doc.numero_documento}\n`;
      text += `Expediente: ${doc.expediente?.numero_expediente || ""}\n`;
      doc.articulos?.forEach((art: any) => {
        text += `Artículo ${art.numero_articulo} (${art.tipo_articulo}):\n${art.contenido}\n\n`;
      });
      text += "\n";
    });
    return text;
  };

  // Cargar boletín y procesar texto
  useEffect(() => {
    if (!boletinId) return;
    setLoading(true);
    fetch(`http://127.0.0.1:8000/boletin/${boletinId}/full`)
      .then((res) => res.json())
      .then((data) => {
        setBoletinData(data);
        const texto = getAccessibleTextFromData(data);
        textProcessor.handleTextExtracted(texto, `boletin_${boletinId}.txt`);
      })
      .finally(() => setLoading(false));
  }, [boletinId]);

  const getAccessibleTextFromData = (data: any) => {
    console.log("Texto procesado:", JSON.stringify(textProcessor.processedText));

    if (!data) return "";
    let text = `=== BOLETÍN OFICIAL MUNICIPAL ===\n\n`;
    text += `Edición Nº ${data.numero_edicion} - ${data.titulo_edicion}\n`;
    text += `Fecha de publicación: ${data.fecha_publicacion}\n\n`;

    if (data.documentos_rel?.length) {
      data.documentos_rel.forEach((doc: any, idx: number) => {
        text += `--- Documento ${idx + 1} ---\n`;
        text += `Categoría: ${doc.categoria?.nombre || ""}\n`;
        text += `Número: ${doc.numero_documento}\n`;
        text += `Expediente: ${doc.expediente?.numero_expediente || ""}\n`;
        text += `Organismo: ${doc.expediente?.organismo || ""}\n`;
        text += `Fecha de emisión: ${doc.fecha_emision}\n`;
        text += `Estado: ${doc.estado}\n\n`;

        if (doc.articulos?.length) {
          text += `Artículos:\n\n`;
          doc.articulos.forEach((art: any) => {
            text += `  - Artículo ${art.numero_articulo} (${art.tipo_articulo}):\n`;
            text += `    ${art.contenido}\n\n`;
          });
        } else {
          text += "Sin artículos.\n\n";
        }

        if (doc.anexos?.length) {
          text += `Anexos:\n`;
          doc.anexos.forEach((anexo: any, i: number) => {
            text += `  - Anexo ${i + 1}: ${anexo.descripcion || ""}\n`;
          });
          text += "\n";
        }

        text += "-----------------------------\n\n";
      });
    } else {
      text += "No hay documentos en este boletín.\n";
    }

    return text;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.4fr_1.5fr] gap-6 p-6">
      {/* === SIDEBAR izq === */}
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-md space-y-4 overflow-y-auto max-h-[90vh]">
        <AccessibilityControls
          settings={accessibility.settings}
          onUpdateSetting={accessibility.updateSetting}
          onReset={accessibility.resetSettings}
          onToggleHighContrast={accessibility.applyHighContrast}
        />
        {/* Controles avanzados de audio para móvil */}
        <MobileAdvancedAudioControls
          voiceSettings={voiceSettings}
          setVoiceSettings={setVoiceSettings}
          availableVoices={availableVoices}
          onTestAudio={testAudio}
        />
      </div>
      {/* === VISOR accesible der === */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">
              Contenido accesible del boletín
            </h3>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Spinner size="lg" label="Cargando boletín..." />
              </div>
            ) : (
              <div
                className="whitespace-pre-wrap break-words"
                style={{
                  fontSize: `${accessibility.settings.fontSize}px`,
                  backgroundColor: accessibility.settings.backgroundColor,
                  color: accessibility.settings.textColor,
                  lineHeight: accessibility.settings.lineHeight,
                  letterSpacing: `${accessibility.settings.letterSpacing}px`,
                  padding: "2rem",
                  borderRadius: "0.75rem",
                  minHeight: "400px",
                  fontFamily: "ui-sans-serif, system-ui, sans-serif",
                }}
                tabIndex={0}
                role="document"
                aria-label="Contenido accesible"
              >
                {textProcessor.processedText.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Controles de audio desktop */}
        <DesktopAudioControls
          voiceSettings={voiceSettings}
          setVoiceSettings={setVoiceSettings}
          readingState={readingState}
          availableVoices={availableVoices}
          textChunks={textProcessor.textChunks}
          processedText={textProcessor.processedText}
          onStartReading={startReading}
          onPauseReading={pauseReading}
          onResumeReading={resumeReading}
          onStopReading={stopReading}
          onSkipForward={skipForward}
          onSkipBackward={skipBackward}
          onTestAudio={testAudio}
        />

        {/* Controles de audio móvil */}
        <MobileAudioPlayer
          voiceSettings={voiceSettings}
          setVoiceSettings={setVoiceSettings}
          readingState={readingState}
          textChunks={textProcessor.textChunks}
          processedText={textProcessor.processedText}
          isMobile={isMobile}
          audioInitialized={audioInitialized}
          onStartReading={startReading}
          onPauseReading={pauseReading}
          onResumeReading={resumeReading}
          onStopReading={stopReading}
          onSkipForward={skipForward}
          onSkipBackward={skipBackward}
          onTestAudio={testAudio}
          onInitializeAudio={initializeAudioForMobile}
        />

        {/* Debug info */}
        <DebugInfo debugInfo={debugInfo} />
      </div>
    </div>
  );
}
