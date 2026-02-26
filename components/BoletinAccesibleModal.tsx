import React, { useMemo, useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { PDFContentViewer } from "@/components/accessibilityComp/textComp/pdfContentViewer";
import { useBoletinData } from "@/hooks/useBoletinData";
import { Spinner } from "@heroui/spinner";
import { AccessibilityToolbar } from "@/components/accessibilityComp/textComp/AccessibilityToolbar";
import { useAudioController } from "@/components/accessibilityComp/audioComp/audioController";
import { DesktopAudioControls } from "@/components/accessibilityComp/audioComp/desktopAudioControls";
import { MobileAudioPlayer } from "@/components/accessibilityComp/audioComp/mobileAudioPlayer";
import { AccessibilitySettings } from "@/types/interfaces";

import { useAccessibility } from "@/components/accessibilityComp/AccessibilityContext";

interface BoletinAccesibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  boletinId: number | null;
}

export const BoletinAccesibleModal: React.FC<BoletinAccesibleModalProps> = ({ 
  isOpen, 
  onClose, 
  boletinId 
}) => {
  const { data, loading, error } = useBoletinData(isOpen ? boletinId : null);
  const { settings, updateSetting, resetSettings } = useAccessibility();

  const bulletinText = useMemo(() => {
    if (!data) return "";

    let text = `BOLETÍN OFICIAL MUNICIPAL - EDICIÓN ${data.boletin.edicion}\n`;
    text += `Fecha de publicación: ${new Date(data.boletin.fecha).toLocaleDateString('es-AR')}\n\n`;

    data.categorias.forEach((categoria) => {
      text += `--- ${categoria.nombre.toUpperCase()} ---\n\n`;
      categoria.resumenes.forEach((resumen: any) => {
        text += `${resumen.contenido}\n\n`;
      });
    });

    return text;
  }, [data]);

  // Dividir texto en chunks para lectura TTS
  const textChunks = useMemo(() => {
    if (!bulletinText) return [];
    // Dividir por doble salto de línea (párrafos)
    return bulletinText.split(/\n\n+/).filter(chunk => chunk.trim().length > 0);
  }, [bulletinText]);

  // Controlador de audio
  const audioController = useAudioController(textChunks);

  // Limpiar audio al cerrar modal
  useEffect(() => {
    if (!isOpen) {
      audioController.stopReading();
    }
  }, [isOpen]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => {
        audioController.stopReading();
        onClose();
      }} 
      size="5xl" 
      scrollBehavior="inside"
      className={settings.highContrast ? "dark" : ""}
    >
      <ModalContent className={settings.highContrast ? "bg-black text-yellow-400 border border-yellow-400" : ""}>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Vista Accesible del Boletín
            </ModalHeader>
            <ModalBody>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Spinner size="lg" label="Cargando contenido..." />
                </div>
              ) : error ? (
                <div className="text-red-500 p-4 text-center">
                  <p>Error al cargar el boletín: {error}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Barra de herramientas visual */}
                  <AccessibilityToolbar 
                    settings={settings}
                    onUpdateSetting={updateSetting}
                    onReset={resetSettings}
                  />

                  {/* Controles de audio Desktop */}
                  <DesktopAudioControls
                    voiceSettings={audioController.voiceSettings}
                    setVoiceSettings={audioController.setVoiceSettings}
                    readingState={audioController.readingState}
                    availableVoices={audioController.availableVoices}
                    textChunks={textChunks}
                    processedText={bulletinText}
                    onStartReading={audioController.startReading}
                    onPauseReading={audioController.pauseReading}
                    onResumeReading={audioController.resumeReading}
                    onStopReading={audioController.stopReading}
                    onSkipForward={audioController.skipForward}
                    onSkipBackward={audioController.skipBackward}
                    onTestAudio={audioController.testAudio}
                  />

                  {/* Controles de audio Mobile */}
                  <MobileAudioPlayer
                    voiceSettings={audioController.voiceSettings}
                    setVoiceSettings={audioController.setVoiceSettings}
                    readingState={audioController.readingState}
                    textChunks={textChunks}
                    processedText={bulletinText}
                    isMobile={audioController.isMobile}
                    audioInitialized={audioController.audioInitialized}
                    onStartReading={audioController.startReading}
                    onPauseReading={audioController.pauseReading}
                    onResumeReading={audioController.resumeReading}
                    onStopReading={audioController.stopReading}
                    onSkipForward={audioController.skipForward}
                    onSkipBackward={audioController.skipBackward}
                    onTestAudio={audioController.testAudio}
                    onInitializeAudio={audioController.initializeAudioForMobile}
                  />

                  {/* Visor de contenido */}
                  <div className={audioController.readingState.isReading ? "ring-2 ring-blue-500 rounded-lg" : ""}>
                    <PDFContentViewer 
                      pdfText={bulletinText}
                      settings={settings}
                      isLoading={loading}
                    />
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={() => {
                audioController.stopReading();
                onClose();
              }}>
                Cerrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
