import React from "react";
import { Page, Image, View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";
import type { ConfiguracionPDF, Boletin } from "@/types/Boletin";
import { registerFonts } from "./fonts";

registerFonts();

interface PortadaPDFProps {
  boletin: Boletin;
  config: ConfiguracionPDF;
}

export const PortadaPDF: React.FC<PortadaPDFProps> = ({ boletin, config }) => {
  // Parsear la fecha del boletín
  const fecha = new Date(boletin.fecha_publicacion);
  
  // Agregar un día a la fecha
  fecha.setDate(fecha.getDate() + 1);

  // Formatear la fecha a un formato legible en español
  const formatoFecha = new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(fecha);

  // También una versión más corta si la necesitas
  const fechaCorta = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(fecha);

  return (
    <Page size="A4" style={styles.portadaPage}>
      <View style={styles.portadaContent}>
        <Image
          src="/portada.png"
          style={styles.portadaBackground}
          preserveAspectRatio="xMidYMid slice"
        />
        <Text style={styles.portadaEdicion}>EDICIÓN Nº {boletin.numero_edicion}</Text>
        
        {/* PARTE SUPERIOR */}
        <View style={styles.portadaTop}>
          <Text style={styles.portadaTitulo}>BOLETÍN OFICIAL</Text>
          <Text style={styles.portadaSubtitulo}>MUNICIPAL</Text>

          <Text style={styles.portadaInfo}>AUTORIDADES</Text>
          <Text style={styles.portadaFecha}>
            Río Gallegos, {formatoFecha}
          </Text>
        </View>
      </View>
    </Page>
  );
};