
import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { styles } from "@/components/gestorComp/gestorComponents/boletin-pdf/styles";
import type { BoletinPDF } from "@/types/Boletin";

interface CabeceraPDFProps {
  boletin: BoletinPDF;
  numeroPagina: number;
}

export const CabeceraPDF: React.FC<CabeceraPDFProps> = ({
  boletin,
  numeroPagina
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
      <View style={styles.logoContainer}>
        <Image src="/logo.png" style={styles.logoCabecera} />
      </View>

      <View style={styles.textoContainer}>
        <Text style={styles.edicion}>
          EDICIÓN Nº {boletin.edicion}
        </Text>

        <Text style={styles.titulo}>
          BOLETÍN OFICIAL <Text style={styles.tituloResaltado}>MUNICIPAL</Text>
        </Text>

        <Text style={styles.fecha}>
          RÍO GALLEGOS, {formatoFecha}
        </Text>
      </View>
      
      <Text style={styles.numeroPagina}>
        Pág. {numeroPagina}
      </Text>
    </View>
  );
};