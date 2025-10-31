// hooks/useAccessibilitySettings.ts
//Este archivo define un hook para manejar la configuración de accesibilidad en la aplicación. Aqui se ve los colores a los que se van a pasar
//el visor del PDF, la altura de línea, el espaciado de letras, etc. Este hook se utiliza en el componente de accesibilidad para actualizar
import { useState, useCallback } from "react"
import type { AccessibilitySettings } from "@/types/interfaces"

export const useAccessibilitySettings = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 16,
    backgroundColor: "#ffffff",
    textColor: "#000000",
    lineHeight: 1.6,
    letterSpacing: 0,
    highContrast: false,
  })

  const updateSetting = useCallback(
    <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const resetSettings = useCallback(() => {
    setSettings({
      fontSize: 16,
      backgroundColor: "#ffffff",
      textColor: "#000000",
      lineHeight: 1.6,
      letterSpacing: 0,
      highContrast: false,
    })
  }, [])

  const applyHighContrast = useCallback(() => {
    if (settings.highContrast) {
      updateSetting("backgroundColor", "#ffffff")
      updateSetting("textColor", "#000000")
      updateSetting("highContrast", false)
    } else {
      updateSetting("backgroundColor", "#000000")
      updateSetting("textColor", "#ffffff")
      updateSetting("highContrast", true)
    }
  }, [settings.highContrast, updateSetting])

  return {
    settings,
    updateSetting,
    resetSettings,
    applyHighContrast,
  }
}