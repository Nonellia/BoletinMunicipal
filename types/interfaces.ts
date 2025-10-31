// types/pdf-reader.ts
export interface AccessibilitySettings {
  fontSize: number
  backgroundColor: string
  textColor: string
  lineHeight: number
  letterSpacing: number
  highContrast: boolean
}

export interface VoiceSettings {
  rate: number
  pitch: number
  volume: number
  voice: SpeechSynthesisVoice | null
}

export interface ReadingState {
  isReading: boolean
  isPaused: boolean
  currentPosition: number
  totalWords: number
  currentChunk: number
  totalChunks: number
}

export interface ColorOption {
  name: string
  value: string
  textColor?: string
}

export const backgroundColors: ColorOption[] = [
  { name: "Blanco", value: "#ffffff", textColor: "#000000" },
  { name: "Crema", value: "#f5f5dc", textColor: "#2d2d2d" },
  { name: "Amarillo suave", value: "#fffacd", textColor: "#2d2d2d" },
  { name: "Verde suave", value: "#f0fff0", textColor: "#2d2d2d" },
  { name: "Azul suave", value: "#f0f8ff", textColor: "#2d2d2d" },
  { name: "Negro", value: "#000000", textColor: "#ffffff" },
  { name: "Gris oscuro", value: "#2d2d2d", textColor: "#ffffff" },
]

export const textColors: ColorOption[] = [
  { name: "Negro", value: "#000000" },
  { name: "Gris oscuro", value: "#2d2d2d" },
  { name: "Azul oscuro", value: "#1e3a8a" },
  { name: "Verde oscuro", value: "#166534" },
  { name: "Blanco", value: "#ffffff" },
  { name: "Amarillo", value: "#fbbf24" },
]