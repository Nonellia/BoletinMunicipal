// components/MobileAdvancedAudioControls.tsx
// Este componente muestra los controles avanzados de audio para dispositivos móviles
// Permite ajustar la velocidad, el tono y la volumen del audio


import { 
  Card, 
  CardHeader, 
  CardBody, 
  Select, 
  SelectItem, 
  Slider, 
  Button, 
  Accordion, 
  AccordionItem 
} from "@heroui/react"
import { Settings, Volume2 } from "lucide-react"
import type { VoiceSettings } from "@/types/interfaces"

interface MobileAdvancedAudioControlsProps {
  voiceSettings: VoiceSettings
  setVoiceSettings: React.Dispatch<React.SetStateAction<VoiceSettings>>
  availableVoices: SpeechSynthesisVoice[]
  onTestAudio: () => void
}

export const MobileAdvancedAudioControls = ({
  voiceSettings,
  setVoiceSettings,
  availableVoices,
  onTestAudio,
}: MobileAdvancedAudioControlsProps) => {
  return (
    <Card className="lg:hidden">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings size={20} />
          <h3 className="text-lg font-semibold">Configuración Avanzada</h3>
        </div>
      </CardHeader>
      
      <CardBody>
        <Accordion variant="splitted">
          <AccordionItem key="voice" aria-label="Configuración de Voz" title="Configuración de Voz">
            <div className="space-y-4 pb-4">
              {/* Selección de voz */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">Voz</span>
                <Select
                  selectedKeys={voiceSettings.voice ? [voiceSettings.voice.name] : []}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string
                    const selectedVoice = availableVoices.find((voice) => voice.name === selectedKey)
                    setVoiceSettings((prev) => ({ ...prev, voice: selectedVoice || null }))
                  }}
                  placeholder="Seleccionar voz"
                  size="sm"
                  className="w-full"
                >
                  {availableVoices
                    .filter((voice) => voice.lang.startsWith("es") || voice.lang.startsWith("en"))
                    .map((voice) => (
                      <SelectItem key={voice.name} value={voice.name} className="text-sm">
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                </Select>
              </div>

              {/* Velocidad detallada */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">
                  Velocidad: {voiceSettings.rate.toFixed(1)}x
                </span>
                <Slider
                  value={voiceSettings.rate}
                  onChange={(value) => setVoiceSettings((prev) => ({ 
                    ...prev, 
                    rate: Array.isArray(value) ? value[0] : value 
                  }))}
                  minValue={0.5}
                  maxValue={2}
                  step={0.1}
                  color="primary"
                  size="md"
                  className="w-full"
                />
              </div>

              {/* Tono de voz */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">
                  Tono: {voiceSettings.pitch.toFixed(1)}
                </span>
                <Slider
                  value={voiceSettings.pitch}
                  onChange={(value) => setVoiceSettings((prev) => ({ 
                    ...prev, 
                    pitch: Array.isArray(value) ? value[0] : value 
                  }))}
                  minValue={0.5}
                  maxValue={2}
                  step={0.1}
                  color="primary"
                  size="md"
                  className="w-full"
                />
              </div>

              {/* Volumen */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Volume2 size={16} />
                  <span className="text-sm font-medium text-foreground">
                    Volumen: {Math.round(voiceSettings.volume * 100)}%
                  </span>
                </div>
                <Slider
                  value={voiceSettings.volume}
                  onChange={(value) => setVoiceSettings((prev) => ({ 
                    ...prev, 
                    volume: Array.isArray(value) ? value[0] : value 
                  }))}
                  minValue={0}
                  maxValue={1}
                  step={0.1}
                  color="primary"
                  size="md"
                  className="w-full"
                />
              </div>

              {/* Botón de prueba */}
              <Button
                onPress={onTestAudio}
                variant="bordered"
                className="w-full"
                size="md"
                startContent={<Volume2 size={16} />}
              >
                Probar Configuración
              </Button>
            </div>
          </AccordionItem>
        </Accordion>
      </CardBody>
    </Card>
  )
}