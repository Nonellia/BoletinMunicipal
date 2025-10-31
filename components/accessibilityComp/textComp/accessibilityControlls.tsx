// components/AccessibilityControls.tsx
import { 
  Button, 
  Slider, 
  Select, 
  SelectItem, 
  Divider, 
  ButtonGroup 
} from "@heroui/react"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import type { AccessibilitySettings } from "@/types/interfaces"
import { backgroundColors, textColors } from "@/types/interfaces"

interface AccessibilityControlsProps {
  settings: AccessibilitySettings
  onUpdateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void
  onReset: () => void
  onToggleHighContrast: () => void
}

export const AccessibilityControls = ({
  settings,
  onUpdateSetting,
  onReset,
  onToggleHighContrast,
}: AccessibilityControlsProps) => {
  // Encontrar el color de fondo y texto actuales
  const currentBgColor = backgroundColors.find(c => c.value === settings.backgroundColor);
  const currentTextColor = textColors.find(c => c.value === settings.textColor);

  return (
    <div className="space-y-6">
      {/* Tamaño de fuente */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Tamaño de letra: {settings.fontSize}px
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            variant="bordered"
            size="sm"
            onPress={() => onUpdateSetting("fontSize", Math.max(12, settings.fontSize - 2))}
            aria-label="Reducir tamaño de letra"
          >
            <ZoomOut size={16} />
          </Button>
          
          <Slider
            value={settings.fontSize}
            onChange={(value) => onUpdateSetting("fontSize", Array.isArray(value) ? value[0] : value)}
            minValue={12}
            maxValue={32}
            step={2}
            className="flex-1"
            color="primary"
            size="sm"
          />
          
          <Button
            isIconOnly
            variant="bordered"
            size="sm"
            onPress={() => onUpdateSetting("fontSize", Math.min(32, settings.fontSize + 2))}
            aria-label="Aumentar tamaño de letra"
          >
            <ZoomIn size={16} />
          </Button>
        </div>
      </div>

      <Divider />

      {/* Colores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        {/* Color de fondo */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Color de fondo</span>
          <Select
            selectedKeys={[settings.backgroundColor]}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string
              onUpdateSetting("backgroundColor", selectedKey)
            }}
            aria-label="Seleccionar color de fondo"
            size="sm"
            renderValue={(items) => {
              return (
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded border border-gray-300" 
                    style={{ backgroundColor: currentBgColor?.value }} 
                  />
                  <span>{currentBgColor?.name}</span>
                </div>
              );
            }}
          >
            {backgroundColors.map((color) => (
              <SelectItem key={color.value} value={color.value}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded border border-gray-300" 
                    style={{ backgroundColor: color.value }} 
                  />
                  <span>{color.name}</span>
                </div>
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Color de texto */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Color de texto</span>
          <Select
            selectedKeys={[settings.textColor]}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string
              onUpdateSetting("textColor", selectedKey)
            }}
            aria-label="Seleccionar color de texto"
            size="sm"
            renderValue={(items) => {
              return (
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded border border-gray-300" 
                    style={{ backgroundColor: currentTextColor?.value }} 
                  />
                  <span>{currentTextColor?.name}</span>
                </div>
              );
            }}
          >
            {textColors.map((color) => (
              <SelectItem key={color.value} value={color.value}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded border border-gray-300" 
                    style={{ backgroundColor: color.value }} 
                  />
                  <span>{color.name}</span>
                </div>
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <Divider />

      {/* Espaciado */}
      <div className="space-y-4">
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">
            Espaciado de líneas: {settings.lineHeight.toFixed(1)}
          </span>
          <Slider
            value={settings.lineHeight}
            onChange={(value) => onUpdateSetting("lineHeight", Array.isArray(value) ? value[0] : value)}
            minValue={1.2}
            maxValue={2.5}
            step={0.1}
            color="primary"
            size="sm"
          />
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">
            Espaciado de letras: {settings.letterSpacing}px
          </span>
          <Slider
            value={settings.letterSpacing}
            onChange={(value) => onUpdateSetting("letterSpacing", Array.isArray(value) ? value[0] : value)}
            minValue={0}
            maxValue={3}
            step={0.5}
            color="primary"
            size="sm"
          />
        </div>
      </div>

      <Divider />

      {/* Botones de acción */}
      <div className="space-y-3">
        <Button
          variant="bordered"
          onPress={onToggleHighContrast}
          className="w-full"
          size="md"
        >
          {settings.highContrast ? "Desactivar" : "Activar"} Alto Contraste
        </Button>
        
        <Button
          variant="bordered"
          onPress={onReset}
          className="w-full"
          size="md"
          startContent={<RotateCcw size={16} />}
        >
          Restablecer
        </Button>
      </div>
    </div>
  )
}