import React from "react";
import { Page, Image, View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";
import type {
  Documento,
  Boletin,
  ConfiguracionPDF,
  Articulo,
} from "@/types/Boletin";

interface CabeceraPDFProps {
  doc: Documento & { articulos?: Articulo[]; categoria?: string };
  idx: number;
  boletin: Boletin;
  config: ConfiguracionPDF;
}

export const CabeceraPDF: React.FC<CabeceraPDFProps> = ({
  boletin,
}) => {
  const fecha = new Date(boletin.fecha_publicacion);
  fecha.setDate(fecha.getDate() + 1);

  const formatoFecha = new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(fecha);

  return (
    <View style={styles.cabecera} fixed>
      {/* Logo izquierda */}
      <View style={styles.logoContainer}>
        <Image src="/logo.png" style={styles.logoCabecera} />
      </View>

      {/* Texto derecha */}
      <View style={styles.textoContainer}>
        <Text style={styles.edicion}>
          EDICIÓN Nº {boletin.numero_edicion}
        </Text>

        <Text style={styles.titulo}>
          BOLETÍN OFICIAL <Text style={styles.tituloResaltado}>MUNICIPAL</Text>
        </Text>

        <Text style={styles.fecha}>
          RÍO GALLEGOS, {formatoFecha}
        </Text>
      </View>
    </View>
  );
};
