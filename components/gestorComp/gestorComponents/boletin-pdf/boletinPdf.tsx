import React from "react";
import { Document } from "@react-pdf/renderer";
import { PortadaPDF } from "./portadaPdf";
import { IndicePDF } from "./indicePDF";
import { DocumentoPDF } from "./documentoPDF";
import type { Boletin, Documento, ConfiguracionPDF } from "../../../types/boletin";

interface BoletinPDFProps {
  boletin: Boletin;
  documentos: Documento[];
  config: ConfiguracionPDF;
}

export const BoletinPDF: React.FC<BoletinPDFProps> = ({ 
  boletin, 
  documentos, 
  config 
}) => (
  <Document>
    {config.showPortada && (
      <PortadaPDF boletin={boletin} config={config} />
    )}
    {config.showIndice && documentos.length > 0 && (
      <IndicePDF documentos={documentos} config={config} />
    )}
    {documentos.map((doc, idx) => (
      <DocumentoPDF 
        key={doc.id}
        doc={doc}
        idx={idx}
        boletin={boletin}
        config={config}
      />
    ))}
  </Document>
);