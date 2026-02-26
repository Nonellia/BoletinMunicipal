import React, { useState } from 'react';
import { Button } from "@heroui/button";
import { Download } from "lucide-react";
import { pdf } from '@react-pdf/renderer';
import axios from 'axios';
import { BoletinCompletoPDF } from "@/app/formularios/components/pdf/BoletinCompletoPDF";
import clsx from "clsx";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://funcionlog.mrg-pruebas.site';

interface DownloadBoletinButtonProps {
  boletinId: number;
  edicion: number;
  fecha: string;
  className?: string;
}

export const DownloadBoletinButton: React.FC<DownloadBoletinButtonProps> = ({
  boletinId,
  edicion,
  fecha,
  className
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchBoletinData = async (id: number) => {
    try {
      const boletinRes = await axios.get(`${API_URL}/boletines/${id}`);
      const boletin = boletinRes.data;
      
      let tipoBoletin = 'Sin tipo';
      try {
        const tipoRes = await axios.get(`${API_URL}/tipos-boletin/${boletin.tipo_boletin}`);
        tipoBoletin = tipoRes.data?.nombre || 'Sin tipo';
      } catch (err) {
        console.warn('No se pudo obtener el tipo de boletín');
      }

      const [categoriasRes, resumenesRes] = await Promise.all([
        axios.get(`${API_URL}/categorias/`),
        axios.get(`${API_URL}/resumenes/?id_boletin=${id}`)
      ]);

      const resumenes = Array.isArray(resumenesRes.data) ? resumenesRes.data : [];
      const categorias = Array.isArray(categoriasRes.data) 
        ? categoriasRes.data
            .map((categoria: any) => ({
              ...categoria,
              resumenes: resumenes
                .filter((r: any) => r.id_categoria === categoria.id && r.id_boletin === id)
                .sort((a: any, b: any) => {
                  const numA = a.contenido?.match(/N°\s*(\d+)/)?.[1];
                  const numB = b.contenido?.match(/N°\s*(\d+)/)?.[1];
                  return numA && numB ? parseInt(numA) - parseInt(numB) : 0;
                })
            }))
            .filter((c: any) => c.resumenes.length > 0)
        : [];

      return {
        boletin: {
          ...boletin,
          edicion: boletin.edicion || 1,
          fecha: boletin.fecha || new Date().toISOString()
        },
        categorias,
        totalResumenes: resumenes.length,
        tipoBoletin
      };
    } catch (error) {
      console.error('Error fetching data for PDF:', error);
      throw error;
    }
  };

  const handleDownload = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      // 1. Fetch data
      const fullData = await fetchBoletinData(boletinId);
      
      // 2. Generate PDF blob
      const blob = await pdf(
        <BoletinCompletoPDF 
          data={fullData}
          config={{
            showPortada: true,
            showIndice: true,
            showCabecera: true,
            piePagina: "Página {pageNumber} • Boletín Oficial Municipal • Río Gallegos"
          }}
        />
      ).toBlob();

      // 3. Trigger download
      const nombreArchivo = `BOLETIN_OFICIAL_${edicion}_${new Date(fecha).toISOString().split('T')[0]}.pdf`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Hubo un error al generar el PDF. Por favor, intente nuevamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      size="md"
      variant="bordered"
      className={clsx(
        "border-blue-600 text-blue-600 font-medium",
        "hover:bg-blue-50 transition-all duration-200",
        "shadow-sm hover:shadow-lg",
        "flex items-center justify-center gap-2 py-3",
        "w-full",
        className
      )}
      onPress={handleDownload}
      isLoading={isGenerating}
    >
      {!isGenerating && <Download className="w-5 h-5" />}
      <span>{isGenerating ? "Generando..." : "Descargar PDF"}</span>
    </Button>
  );
};
