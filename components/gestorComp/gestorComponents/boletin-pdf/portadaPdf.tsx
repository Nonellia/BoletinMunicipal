import React from "react";
import { Page, Text, View } from "@react-pdf/renderer";
import { styles } from "./styles";
import type { ConfiguracionPDF, Boletin } from "../../../types/boletin";
interface PortadaPDFProps {
  boletin: Boletin;
  config: ConfiguracionPDF;
}

export const PortadaPDF: React.FC<PortadaPDFProps> = ({ boletin, config }) => (
  <Page size="A4" style={styles.portadaPage}>
    <Text style={styles.portadaTitulo}>{config.portadaTitulo}</Text>
    <Text style={styles.portadaSubtitulo}>{config.portadaSubtitulo}</Text>
    <View style={{ marginTop: 80 }}>
      <Text style={styles.portadaInfo}>Edición Nº {boletin.numero_edicion}</Text>
      <Text style={styles.portadaFecha}>{boletin.fecha_publicacion}</Text>
      <Text style={styles.portadaFecha}>Año {boletin.anio_publicacion}</Text>
      {boletin.titulo_edicion && (
        <Text style={[styles.portadaFecha, { marginTop: 20 }]}>
          {boletin.titulo_edicion}
        </Text>
      )}
    </View>
  </Page>
);