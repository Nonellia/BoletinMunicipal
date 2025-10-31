import React from "react";
import { Page, Text, View } from "@react-pdf/renderer";
import { styles } from "./styles";
import type { ConfiguracionPDF, Documento } from "../../../types/boletin";
interface IndicePDFProps {
  documentos: Documento[];
  config: ConfiguracionPDF;
}

export const IndicePDF: React.FC<IndicePDFProps> = ({ documentos, config }) => (
  <Page size="A4" style={styles.page}>
    <Text style={styles.indiceTitle}>Índice</Text>
    {documentos.map((doc, idx) => (
      <View key={doc.id} style={styles.indiceItem}>
        <Text>
          {idx + 1}. Documento Nº {doc.numero_documento} - {doc.numero_completo}
        </Text>
        <Text>Pág. {idx + (config.showPortada ? 2 : 1) + (config.showIndice ? 1 : 0)}</Text>
      </View>
    ))}
  </Page>
);