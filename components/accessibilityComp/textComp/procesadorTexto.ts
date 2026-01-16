// hooks/useTextProcessor.ts

// Este hook se encarga de procesar el texto extraído de un PDF para su uso en la síntesis de voz.
// Limpia el texto, lo divide en chunks y maneja el estado del texto procesado
import { useState, useCallback, useEffect } from "react"

export const useTextProcessor = () => {
  // Estados del hook
  const [pdfText, setPdfText] = useState<string>("")
  const [processedText, setProcessedText] = useState<string>("")
  const [textChunks, setTextChunks] = useState<string[]>([])
  const [fileName, setFileName] = useState<string>("")

  // Función para limpiar y procesar el texto del PDF
  const cleanTextForSpeech = useCallback((text: string): string => {
    if (!text) return ""

    const cleanedText = text
      // Remover marcadores de página
      .replace(/--- Página \d+ ---/g, "")
      // Normalizar espacios en blanco
      // .replace(/\s+/g, " ")
      // Remover caracteres especiales problemáticos
      .replace(/[^\w\s.,;:!?¿¡\-()áéíóúüñÁÉÍÓÚÜÑ]/g, " ")
      // Limpiar puntuación múltiple
      .replace(/[.,;:!?]{2,}/g, ".")
      // Remover números de página sueltos
      .replace(/^\d+\s*$/gm, "")
      // Normalizar saltos de línea
      // .replace(/\n+/g, " ")
      // Limpiar espacios múltiples
      // .replace(/\s{2,}/g, " ")
      .trim()

    return cleanedText
  }, [])

  // Función para dividir texto en chunks manejables
  const createTextChunks = useCallback((text: string): string[] => {
    if (!text) return []

    const maxChunkLength = 500 // Máximo 500 caracteres por chunk
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const chunks: string[] = []
    let currentChunk = ""

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim()
      if (!trimmedSentence) continue

      if (currentChunk.length + trimmedSentence.length + 1 <= maxChunkLength) {
        currentChunk += (currentChunk ? ". " : "") + trimmedSentence
      } else {
        if (currentChunk) {
          chunks.push(currentChunk + ".")
        }
        currentChunk = trimmedSentence
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk + ".")
    }

    return chunks.filter((chunk) => chunk.trim().length > 0)
  }, [])

  // Procesar texto cuando cambia el PDF
  useEffect(() => {
    if (pdfText) {
      const cleaned = cleanTextForSpeech(pdfText)
      setProcessedText(cleaned)

      let chunks = createTextChunks(cleaned)
      // Forzar a string cualquier chunk por si acaso
      chunks = chunks
        .map((c) => (typeof c === "string" ? c : String(c)))
        .filter((c) => typeof c === "string" && c.trim().length > 0)

      // Log para depuración
      if (chunks.some((c) => typeof c !== "string")) {
        console.warn("¡Alerta! Hay chunks que no son string:", chunks)
      }

      setTextChunks(chunks)

      // console.log("Texto procesado:", { original: pdfText.length, cleaned: cleaned.length, chunks: chunks.length })
    }
  }, [pdfText, cleanTextForSpeech, createTextChunks])

  const handleTextExtracted = useCallback((text: string, name: string) => {
    setPdfText(text)
    setFileName(name)
  }, [])

  return {
    pdfText,
    processedText,
    textChunks,
    fileName,
    handleTextExtracted,
  }
}