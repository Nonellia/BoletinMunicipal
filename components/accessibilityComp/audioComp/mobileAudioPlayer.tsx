// components/MobileAudioPlayer.tsx
// Este componente maneja la reproducción de audio en dispositivos móviles
// Permite iniciar, pausar, detener y navegar entre fragmentos de texto
import { 
  Button, 
  Card, 
  CardHeader, 
  CardBody, 
  Progress, 
  Chip,
  ButtonGroup 
} from "@heroui/react"
import { Play, Pause, Square, SkipForward, SkipBack, Volume2, Smartphone } from "lucide-react"
import type { VoiceSettings, ReadingState } from "@/types/interfaces"

interface MobileAudioPlayerProps {
  voiceSettings: VoiceSettings
  setVoiceSettings: React.Dispatch<React.SetStateAction<VoiceSettings>>
  readingState: ReadingState
  textChunks: string[]
  processedText: string
  isMobile: boolean
  audioInitialized: boolean
  onStartReading: () => void
  onPauseReading: () => void
  onResumeReading: () => void
  onStopReading: () => void
  onSkipForward: () => void
  onSkipBackward: () => void
  onTestAudio: () => void
  onInitializeAudio: () => void
}

export const MobileAudioPlayer = ({
  voiceSettings,
  setVoiceSettings,
  readingState,
  textChunks,
  processedText,
  isMobile,
  audioInitialized,
  onStartReading,
  onPauseReading,
  onResumeReading,
  onStopReading,
  onSkipForward,
  onSkipBackward,
  onTestAudio,
  onInitializeAudio,
}: MobileAudioPlayerProps) => {
  return (
    <div className="block lg:hidden">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Volume2 size={20} />
            <h3 className="text-lg font-semibold">Controles de Audio</h3>
            {!audioInitialized && isMobile && (
              <Chip size="sm" color="warning" variant="flat">
                Toca para activar
              </Chip>
            )}
          </div>
        </CardHeader>
        
        <CardBody className="space-y-4">
          {/* Activación inicial de audio en móvil */}
          {isMobile && !audioInitialized && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-primary-800">
                <Smartphone size={20} />
                <span className="font-medium">Activar Audio</span>
              </div>
              <p className="text-sm text-primary-700">
                Los dispositivos móviles requieren activación manual del audio:
              </p>
              <Button
                onPress={onInitializeAudio}
                color="primary"
                className="w-full"
                size="lg"
                startContent={<Volume2 size={16} />}
              >
                Activar Audio Ahora
              </Button>
            </div>
          )}

          {/* Información de estado */}
          {textChunks.length > 0 && (
            <div className="bg-success-50 border border-success-200 rounded-lg p-3">
              <div className="text-sm text-success-800 space-y-1">
                <p>✅ Texto procesado: {textChunks.length} fragmentos</p>
                {readingState.totalChunks > 0 && (
                  <p>
                    📖 Progreso: {readingState.currentChunk + 1} / {readingState.totalChunks} fragmentos
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Controles de reproducción principales */}
          <div className="flex items-center justify-center gap-3">
            <Button
              isIconOnly
              variant="bordered"
              size="lg"
              onPress={onSkipBackward}
              isDisabled={!processedText || readingState.currentChunk === 0}
              aria-label="Fragmento anterior"
              className="h-12 w-12"
            >
              <SkipBack size={20} />
            </Button>

            <Button
              isIconOnly
              color="primary"
              size="lg"
              onPress={
                readingState.isReading && !readingState.isPaused
                  ? onPauseReading
                  : readingState.isPaused
                    ? onResumeReading
                    : onStartReading
              }
              isDisabled={!processedText}
              aria-label={
                readingState.isReading && !readingState.isPaused
                  ? "Pausar"
                  : readingState.isPaused
                    ? "Continuar"
                    : "Reproducir"
              }
              className="h-14 w-14"
            >
              {readingState.isReading && !readingState.isPaused ? (
                <Pause size={24} />
              ) : (
                <Play size={24} />
              )}
            </Button>

            <Button
              isIconOnly
              variant="bordered"
              size="lg"
              onPress={onStopReading}
              isDisabled={!readingState.isReading && !readingState.isPaused}
              aria-label="Detener"
              className="h-12 w-12"
            >
              <Square size={20} />
            </Button>

            <Button
              isIconOnly
              variant="bordered"
              size="lg"
              onPress={onSkipForward}
              isDisabled={!processedText || readingState.currentChunk >= textChunks.length - 1}
              aria-label="Siguiente fragmento"
              className="h-12 w-12"
            >
              <SkipForward size={20} />
            </Button>
          </div>

          {/* Progreso de lectura */}
          {readingState.totalChunks > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-default-600">
                <span>
                  Fragmento {readingState.currentChunk + 1} / {readingState.totalChunks}
                </span>
                <span>{Math.round(((readingState.currentChunk + 1) / readingState.totalChunks) * 100)}%</span>
              </div>
              <Progress
                value={((readingState.currentChunk + 1) / readingState.totalChunks) * 100}
                color="primary"
                size="md"
                className="w-full"
              />
            </div>
          )}

          {/* Controles rápidos de velocidad */}
          <ButtonGroup variant="bordered" className="w-full">
            <Button
              onPress={() => setVoiceSettings((prev) => ({ ...prev, rate: 0.8 }))}
              color={voiceSettings.rate === 0.8 ? "primary" : "default"}
              variant={voiceSettings.rate === 0.8 ? "solid" : "bordered"}
              className="flex-1"
            >
              Lento
            </Button>
            <Button
              onPress={() => setVoiceSettings((prev) => ({ ...prev, rate: 1.0 }))}
              color={voiceSettings.rate === 1.0 ? "primary" : "default"}
              variant={voiceSettings.rate === 1.0 ? "solid" : "bordered"}
              className="flex-1"
            >
              Normal
            </Button>
            <Button
              onPress={() => setVoiceSettings((prev) => ({ ...prev, rate: 1.3 }))}
              color={voiceSettings.rate === 1.3 ? "primary" : "default"}
              variant={voiceSettings.rate === 1.3 ? "solid" : "bordered"}
              className="flex-1"
            >
              Rápido
            </Button>
          </ButtonGroup>

          {/* Botón de prueba de audio */}
          <Button 
            onPress={onTestAudio} 
            variant="bordered" 
            className="w-full" 
            size="md"
            startContent={<Volume2 size={16} />}
          >
            Probar Audio
          </Button>
        </CardBody>
      </Card>
    </div>
  )
}