// components/DesktopAudioControls.tsx
import {
  Button,
  Slider,
  Select,
  SelectItem,
  Divider,
  Progress,
  Chip,
} from "@heroui/react";
import {
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Volume2,
} from "lucide-react";
import type { VoiceSettings, ReadingState } from "@/types/interfaces";

interface DesktopAudioControlsProps {
  voiceSettings: VoiceSettings;
  setVoiceSettings: React.Dispatch<React.SetStateAction<VoiceSettings>>;
  readingState: ReadingState;
  availableVoices: SpeechSynthesisVoice[];
  textChunks: string[];
  processedText: string;
  onStartReading: () => void;
  onPauseReading: () => void;
  onResumeReading: () => void;
  onStopReading: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  onTestAudio: () => void;
}

export const DesktopAudioControls = ({
  voiceSettings,
  setVoiceSettings,
  readingState,
  availableVoices,
  textChunks,
  processedText,
  onStartReading,
  onPauseReading,
  onResumeReading,
  onStopReading,
  onSkipForward,
  onSkipBackward,
  onTestAudio,
}: DesktopAudioControlsProps) => {
  // Encontrar la voz seleccionada actualmente
  const currentVoice = availableVoices.find(
    (voice) => voice.name === voiceSettings.voice?.name
  );

  return (
    <div className="hidden lg:block">
      <Divider className="my-4" />

      <div className="space-y-4">
        <span className="text-sm font-medium text-foreground">
          Lectura de voz
        </span>

        {/* Información de estado desktop */}
        {textChunks.length > 0 && (
          <div className="bg-success-50 border border-success-200 rounded-lg p-3">
            <div className="text-xs text-success-800 space-y-1">
              <div className="flex items-center gap-1">
                <Chip size="sm" color="success" variant="flat">
                  ✅ {textChunks.length} fragmentos listos
                </Chip>
              </div>
              {readingState.totalChunks > 0 && (
                <p className="text-success-700">
                  📖 Progreso: {readingState.currentChunk + 1} /{" "}
                  {readingState.totalChunks}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Controles de reproducción */}
        <div className="flex items-center justify-center gap-2">
          <Button
            isIconOnly
            variant="bordered"
            size="sm"
            onPress={onSkipBackward}
            isDisabled={!processedText || readingState.currentChunk === 0}
            aria-label="Fragmento anterior"
          >
            <SkipBack size={16} />
          </Button>

          <Button
            isIconOnly
            color={
              readingState.isReading && !readingState.isPaused
                ? "primary"
                : "default"
            }
            variant={
              readingState.isReading && !readingState.isPaused
                ? "solid"
                : "bordered"
            }
            size="sm"
            onPress={
              readingState.isReading && !readingState.isPaused
                ? onPauseReading
                : readingState.isPaused
                  ? onResumeReading
                  : () => onStartReading(0)
            }
            isDisabled={!processedText}
            aria-label={
              readingState.isReading && !readingState.isPaused
                ? "Pausar"
                : readingState.isPaused
                  ? "Continuar"
                  : "Reproducir"
            }
          >
            {readingState.isReading && !readingState.isPaused ? (
              <Pause size={16} />
            ) : (
              <Play size={16} />
            )}
          </Button>

          <Button
            isIconOnly
            variant="bordered"
            size="sm"
            onPress={onStopReading}
            isDisabled={!readingState.isReading && !readingState.isPaused}
            aria-label="Detener"
          >
            <Square size={16} />
          </Button>

          <Button
            isIconOnly
            variant="bordered"
            size="sm"
            onPress={onSkipForward}
            isDisabled={
              !processedText ||
              readingState.currentChunk >= textChunks.length - 1
            }
            aria-label="Siguiente fragmento"
          >
            <SkipForward size={16} />
          </Button>
        </div>

        {/* Progreso de lectura */}
        {readingState.totalChunks > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-default-500">
              <span>
                Fragmento: {readingState.currentChunk + 1} /{" "}
                {readingState.totalChunks}
              </span>
              <span>
                {Math.round(
                  ((readingState.currentChunk + 1) / readingState.totalChunks) *
                    100
                )}
                %
              </span>
            </div>
            <Progress
              value={
                ((readingState.currentChunk + 1) / readingState.totalChunks) *
                100
              }
              color="primary"
              size="sm"
              className="w-full"
            />
          </div>
        )}

        {/* Selección de voz */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-foreground">Voz</span>
          <Select
            selectedKeys={voiceSettings.voice ? [voiceSettings.voice.name] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              const selectedVoice = availableVoices.find(
                (voice) => voice.name === selectedKey
              );
              setVoiceSettings((prev) => ({
                ...prev,
                voice: selectedVoice || null,
              }));
            }}
            placeholder="Seleccionar voz"
            size="sm"
            className="[&_*]:text-[0.7rem]" // Intenta afectar todos los elementos hijos
            renderValue={(items) => {
              if (!currentVoice)
                return <span className="text-[0.7rem]">Seleccionar voz</span>;
              return (
                <span className="text-[0.7rem]">
                  {currentVoice.name} ({currentVoice.lang})
                </span>
              );
            }}
          >
            {availableVoices
              .filter(
                (voice) =>
                  voice.lang.startsWith("es") || voice.lang.startsWith("en")
              )
              .map((voice) => (
                <SelectItem
                  key={voice.name}
                  value={voice.name}
                  className="text-[0.7rem]"
                  textValue={`${voice.name} (${voice.lang})`}
                >
                  <span className="text-[0.7rem]">
                    {voice.name} ({voice.lang})
                  </span>
                </SelectItem>
              ))}
          </Select>
        </div>

        {/* Velocidad de lectura */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-foreground">
            Velocidad: {voiceSettings.rate.toFixed(1)}x
          </span>
          <Slider
            value={voiceSettings.rate}
            onChange={(value) =>
              setVoiceSettings((prev) => ({
                ...prev,
                rate: Array.isArray(value) ? value[0] : value,
              }))
            }
            minValue={0.5}
            maxValue={2}
            step={0.1}
            color="primary"
            size="sm"
          />
        </div>

        {/* Tono de voz */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-foreground">
            Tono: {voiceSettings.pitch.toFixed(1)}
          </span>
          <Slider
            value={voiceSettings.pitch}
            onChange={(value) =>
              setVoiceSettings((prev) => ({
                ...prev,
                pitch: Array.isArray(value) ? value[0] : value,
              }))
            }
            minValue={0.5}
            maxValue={2}
            step={0.1}
            color="primary"
            size="sm"
          />
        </div>

        {/* Volumen */}
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Volume2 size={12} />
            <span className="text-xs font-medium text-foreground">
              Volumen: {Math.round(voiceSettings.volume * 100)}%
            </span>
          </div>
          <Slider
            value={voiceSettings.volume}
            onChange={(value) =>
              setVoiceSettings((prev) => ({
                ...prev,
                volume: Array.isArray(value) ? value[0] : value,
              }))
            }
            minValue={0}
            maxValue={1}
            step={0.1}
            color="primary"
            size="sm"
          />
        </div>

        {/* Botón de prueba */}
        <Button
          onPress={onTestAudio}
          variant="bordered"
          className="w-full"
          size="sm"
          startContent={<Volume2 size={12} />}
        >
          Probar Audio
        </Button>
      </div>
    </div>
  );
};
