// components/accessibilityComp/textComp/AccessibilityToolbar.tsx
import React from "react";
import {
  Button,
  Slider,
  Switch,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
} from "@heroui/react";
import {
  Type,
  AlignJustify,
  Palette,
  Minus,
  Plus,
  RefreshCcw,
  Eye,
} from "lucide-react";
import { AccessibilitySettings } from "@/types/interfaces";

interface AccessibilityToolbarProps {
  settings: AccessibilitySettings;
  onUpdateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  onReset: () => void;
  setSettings?: any; // Deprecated, kept for backward compat temporarily if needed
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  settings,
  onUpdateSetting,
  onReset,
}) => {
  // Manejadores de cambios
  const handleFontSizeChange = (value: number | number[]) => {
    const newVal = Array.isArray(value) ? value[0] : value;
    onUpdateSetting("fontSize", newVal);
  };

  const handleLineHeightChange = (value: number | number[]) => {
    const newVal = Array.isArray(value) ? value[0] : value;
    onUpdateSetting("lineHeight", newVal);
  };

  const handleLetterSpacingChange = (value: number | number[]) => {
    const newVal = Array.isArray(value) ? value[0] : value;
    onUpdateSetting("letterSpacing", newVal);
  };

  const toggleDyslexiaFont = (isSelected: boolean) => {
    onUpdateSetting("dyslexiaFont", isSelected);
    onUpdateSetting("fontFamily", isSelected ? "OpenDyslexic, sans-serif" : "Arial, sans-serif");
  };

  const applyTheme = (theme: "light" | "dark" | "sepia" | "high-contrast") => {
    switch (theme) {
      case "dark":
        onUpdateSetting("backgroundColor", "#1f1f1f");
        onUpdateSetting("textColor", "#ffffff");
        onUpdateSetting("highContrast", false);
        break;
      case "sepia":
         onUpdateSetting("backgroundColor", "#f4ecd8");
         onUpdateSetting("textColor", "#5b4636");
         onUpdateSetting("highContrast", false);
        break;
      case "high-contrast":
         onUpdateSetting("backgroundColor", "#000000");
         onUpdateSetting("textColor", "#ffff00");
         onUpdateSetting("highContrast", true);
        break;
      case "light":
      default:
         onUpdateSetting("backgroundColor", "#ffffff");
         onUpdateSetting("textColor", "#000000");
         onUpdateSetting("highContrast", false);
        break;
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center p-2 bg-default-100 rounded-lg mb-4">
      {/* Tamaño de fuente */}
      <Popover placement="bottom">
        <PopoverTrigger>
          <Button
            size="sm"
            variant="flat"
            startContent={<Type size={18} />}
            className="capitalize"
          >
            Texto
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-4">
          <div className="space-y-4 w-full">
            <div className="space-y-2">
              <label className="text-xs font-medium">Tamaño ({settings.fontSize}px)</label>
              <div className="flex items-center gap-2">
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  onPress={() => handleFontSizeChange(Math.max(12, settings.fontSize - 1))}
                >
                  <Minus size={14} />
                </Button>
                <Slider
                  size="sm"
                  step={1}
                  minValue={12}
                  maxValue={32}
                  value={settings.fontSize}
                  onChange={handleFontSizeChange}
                  className="max-w-md"
                  aria-label="Tamaño de fuente"
                />
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  onPress={() => handleFontSizeChange(Math.min(32, settings.fontSize + 1))}
                >
                  <Plus size={14} />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium">Fuente Dislexia</label>
              <Switch 
                size="sm" 
                isSelected={settings.dyslexiaFont}
                onValueChange={toggleDyslexiaFont}
              >
                Activar OpenDyslexic
              </Switch>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Espaciado */}
      <Popover placement="bottom">
        <PopoverTrigger>
          <Button
            size="sm"
            variant="flat"
            startContent={<AlignJustify size={18} />}
            className="capitalize"
          >
            Espaciado
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-4">
          <div className="space-y-4 w-full">
            <div className="space-y-2">
              <label className="text-xs font-medium">Interlineado ({settings.lineHeight})</label>
              <Slider
                size="sm"
                step={0.1}
                minValue={1}
                maxValue={2.5}
                value={settings.lineHeight}
                onChange={handleLineHeightChange}
                aria-label="Interlineado"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Espacio letras ({settings.letterSpacing}px)</label>
              <Slider
                size="sm"
                step={0.5}
                minValue={0}
                maxValue={5}
                value={settings.letterSpacing}
                onChange={handleLetterSpacingChange}
                aria-label="Espaciado de letras"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Tema / Color */}
      <Popover placement="bottom">
        <PopoverTrigger>
          <Button
            size="sm"
            variant="flat"
            startContent={<Palette size={18} />}
            className="capitalize"
          >
            Tema
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[260px] p-4">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              className="bg-white text-black border border-gray-200" 
              onPress={() => applyTheme("light")}
            >
              Claro
            </Button>
            <Button 
              className="bg-[#1f1f1f] text-white" 
              onPress={() => applyTheme("dark")}
            >
              Oscuro
            </Button>
            <Button 
              className="bg-[#f4ecd8] text-[#5b4636]" 
              onPress={() => applyTheme("sepia")}
            >
              Sepia
            </Button>
            <Button 
              className="bg-black text-[#ffff00] border border-yellow-400" 
              onPress={() => applyTheme("high-contrast")}
            >
              Alto Contraste
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      
      <div className="flex-1" />
      
      <Tooltip content="Restablecer configuración">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          color="danger"
          onPress={onReset}
        >
          <RefreshCcw size={18} />
        </Button>
      </Tooltip>
    </div>
  );
};
