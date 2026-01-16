import React from "react";
import { Document } from "@react-pdf/renderer";
import { PortadaPDF } from "./portadaPdf";
import { IndicePDF } from "./indicePDF";
import { CategoriaPDF } from "./CategoriaPDF";
import type { Boletin, Documento, ConfiguracionPDF } from "@/types/Boletin";
import { agruparPorCategoria } from "@/utils/agruparCategoria";

interface BoletinPDFProps {
  boletin: Boletin;
  documentos: Documento[];
  config: ConfiguracionPDF;
}

export const BoletinPDF: React.FC<BoletinPDFProps> = ({ 
  boletin, 
  documentos, 
  config 
}) => {
  // Agrupar documentos por categoría
  const documentosPorCategoria = agruparPorCategoria(documentos);
  const categorias = Object.keys(documentosPorCategoria);
  
  // Calcular el índice de página base
  let pageIndex = 0;
  if (config.showPortada) pageIndex++;
  if (config.showIndice && documentos.length > 0) pageIndex++;

  return (
    <Document>
      {config.showPortada && (
        <PortadaPDF boletin={boletin} config={config} />
      )}
      
      {config.showIndice && documentos.length > 0 && (
        <IndicePDF 
          documentos={documentos} 
          config={config} 
          categorias={categorias}
        />
      )}
      
      {categorias.map((categoria, idx) => {
        const docsDeCategoria = documentosPorCategoria[categoria];
        const categoriaPageIndex = pageIndex + idx;
        
        return (
          <CategoriaPDF
            key={categoria}
            categoria={categoria}
            documentos={docsDeCategoria}
            boletin={boletin}
            config={config}
            pageIndex={categoriaPageIndex}
          />
        );
      })}
    </Document>
  );
};