import React from "react";
import { Page, Text, View } from "@react-pdf/renderer";
import { styles } from "./styles";
import type { ConfiguracionPDF, Documento } from "@/types/Boletin";
interface IndicePDFProps {
  documentos: Documento[];
  config: ConfiguracionPDF;
}

export const IndicePDF: React.FC<IndicePDFProps> = ({ documentos, config }) => (
  <Page size="A4" style={styles.page}>
    
  </Page>
);