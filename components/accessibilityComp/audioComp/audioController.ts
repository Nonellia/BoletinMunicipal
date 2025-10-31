// hooks/useAudioController.ts
import { useState, useCallback, useEffect, useRef } from "react"
import type { VoiceSettings, ReadingState } from "@/types/interfaces"

export const useAudioController = (textChunks: string[]) => {
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    rate: 1,
    pitch: 1,
    volume: 1,
    voice: null,
  })

  const [readingState, setReadingState] = useState<ReadingState>({
    isReading: false,
    isPaused: false,
    currentPosition: 0,
    totalWords: 0,
    currentChunk: 0,
    totalChunks: 0,
  })

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [audioInitialized, setAudioInitialized] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>("")

  const wakeLockRef = useRef<any>(null)
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Detectar dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()

      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent)
      setIsMobile(isMobileDevice)
      console.log("Dispositivo móvil detectado:", isMobileDevice)
      if (isMobileDevice) {
        setVoiceSettings((prev) => ({ ...prev, volume: 1 }))
      }
    }

    checkMobile()
  }, [])

  const loadVoices = useCallback(() => {
    const voices = speechSynthesis.getVoices()
    setAvailableVoices(voices)

    let spanishVoice = voices.find((voice) => voice.lang.startsWith("es") && voice.localService)

    if (!spanishVoice) {
      spanishVoice = voices.find((voice) => voice.lang.startsWith("es") || voice.name.toLowerCase().includes("spanish"))
    }

    if (spanishVoice && !voiceSettings.voice) {
      setVoiceSettings((prev) => ({ ...prev, voice: spanishVoice }))
    }
  }, [voiceSettings.voice])

  const initializeAudioForMobile = useCallback(async () => {
    if (!isMobile || audioInitialized) return

    try {
      const utterance = new SpeechSynthesisUtterance(" ")
      utterance.volume = 0.01
      utterance.rate = 10

      return new Promise<void>((resolve) => {
        utterance.onend = () => {
          setAudioInitialized(true)
          resolve()
        }

        utterance.onerror = () => {
          console.warn("Error al inicializar audio, pero continuando...")
          setAudioInitialized(true)
          resolve()
        }

        speechSynthesis.speak(utterance)

        setTimeout(() => {
          speechSynthesis.cancel()
          setAudioInitialized(true)
          resolve()
        }, 1000)
      })
    } catch (error) {
      console.error("Error al inicializar audio:", error)
      setAudioInitialized(true)
    }
  }, [isMobile, audioInitialized])

  const requestWakeLock = useCallback(async () => {
    if ("wakeLock" in navigator && isMobile) {
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request("screen")
      } catch (error) {
        console.warn("No se pudo activar wake lock:", error)
      }
    }
  }, [isMobile])

  const releaseWakeLock = useCallback(() => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release()
      wakeLockRef.current = null
    }
  }, [])

  // Función mejorada para leer por chunks
  const readTextChunk = useCallback(
    (chunkIndex: number) => {
      if (chunkIndex >= textChunks.length) {
        // Terminó la lectura
        setReadingState((prev) => ({
          ...prev,
          isReading: false,
          isPaused: false,
          currentPosition: 0,
          currentChunk: 0,
        }))
        releaseWakeLock()
        return
      }

      const chunk = textChunks[chunkIndex]
      // Validar que sea string y no vacío
      if (typeof chunk !== "string" || chunk.trim().length === 0) {
        console.warn(`Chunk ${chunkIndex} no es un string válido o está vacío, saltando...`, chunk)
        setTimeout(() => readTextChunk(chunkIndex + 1), 100)
        return
      }

      // console.log(`Leyendo chunk ${chunkIndex + 1}/${textChunks.length}:`, chunk.substring(0, 100) + "...")

      const utterance = new SpeechSynthesisUtterance(chunk)
      utterance.rate = voiceSettings.rate
      utterance.pitch = voiceSettings.pitch
      utterance.volume = voiceSettings.volume

      if (voiceSettings.voice) {
        utterance.voice = voiceSettings.voice
      }

      utterance.onstart = () => {
        setReadingState((prev) => ({
          ...prev,
          isReading: true,
          isPaused: false,
          currentChunk: chunkIndex,
          totalChunks: textChunks.length,
        }))
      }

      utterance.onend = () => {
        // Continuar con el siguiente chunk
        setTimeout(() => readTextChunk(chunkIndex + 1), 100)
      }

      utterance.onerror = (error) => {
        console.error(`Error en chunk ${chunkIndex}:`, error)
        setDebugInfo(`Error en chunk ${chunkIndex}: ${error.error}`)

        // Intentar con el siguiente chunk
        setTimeout(() => readTextChunk(chunkIndex + 1), 500)
      }

      currentUtteranceRef.current = utterance
      speechSynthesis.speak(utterance)
    },
    [textChunks, voiceSettings, releaseWakeLock],
  )

  const startReading = useCallback(
    async (fromChunk = 0) => {
      // Si el primer argumento es un evento, ignóralo y usa 0
      if (typeof fromChunk !== "number") fromChunk = 0

      if (textChunks.length === 0) {
        setDebugInfo("No hay texto procesado para leer")
        return
      }

      // console.log("Iniciando lectura desde chunk:", fromChunk)
      // setDebugInfo(`Iniciando lectura: ${textChunks.length} chunks disponibles`)

      // Inicializar audio en móvil si es necesario
      if (isMobile && !audioInitialized) {
        await initializeAudioForMobile()
      }

      // Activar wake lock
      await requestWakeLock()

      // Detener cualquier lectura anterior
      speechSynthesis.cancel()

      // Comenzar lectura por chunks
      readTextChunk(fromChunk)
    },
    [textChunks, isMobile, audioInitialized, initializeAudioForMobile, requestWakeLock, readTextChunk],
  )

  const pauseReading = useCallback(() => {
    speechSynthesis.pause()
    setReadingState((prev) => ({ ...prev, isPaused: true }))
  }, [])

  const resumeReading = useCallback(() => {
    speechSynthesis.resume()
    setReadingState((prev) => ({ ...prev, isPaused: false }))
  }, [])

  const stopReading = useCallback(() => {
    speechSynthesis.cancel()
    setReadingState((prev) => ({
      ...prev,
      isReading: false,
      isPaused: false,
      currentPosition: 0,
      currentChunk: 0,
    }))
    releaseWakeLock()
  }, [releaseWakeLock])

  const skipForward = useCallback(() => {
    const nextChunk = Math.min(readingState.currentChunk + 1, textChunks.length - 1)
    stopReading()
    setTimeout(() => startReading(nextChunk), 100)
  }, [readingState.currentChunk, textChunks.length, startReading, stopReading])

  const skipBackward = useCallback(() => {
    const prevChunk = Math.max(readingState.currentChunk - 1, 0)
    stopReading()
    setTimeout(() => startReading(prevChunk), 100)
  }, [readingState.currentChunk, startReading, stopReading])

  const testAudio = useCallback(async () => {
    if (isMobile && !audioInitialized) {
      await initializeAudioForMobile()
    }

    speechSynthesis.cancel()

    const testText = "Hola, esta es una prueba de audio. Si puedes escuchar esto, el audio funciona correctamente."
    const utterance = new SpeechSynthesisUtterance(testText)
    utterance.rate = voiceSettings.rate
    utterance.pitch = voiceSettings.pitch
    utterance.volume = voiceSettings.volume

    if (voiceSettings.voice) {
      utterance.voice = voiceSettings.voice
    }

    utterance.onstart = () => {
      setDebugInfo("Prueba de audio iniciada correctamente")
    }

    utterance.onend = () => {
      setDebugInfo("Prueba de audio completada")
    }

    utterance.onerror = (error) => {
      setDebugInfo(`Error en prueba de audio: ${error.error}`)
    }

    speechSynthesis.speak(utterance)
  }, [voiceSettings, isMobile, audioInitialized, initializeAudioForMobile])

  // Cargar voces cuando el componente se monta
  useEffect(() => {
    loadVoices()
    speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      speechSynthesis.cancel()
      releaseWakeLock()
    }
  }, [loadVoices, releaseWakeLock])

  return {
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
  }
}