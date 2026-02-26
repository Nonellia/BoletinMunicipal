import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { CabeceraPDF } from "./cabecera";
import { styles } from "@/components/gestorComp/gestorComponents/boletin-pdf/styles";
import type { BoletinPDF, CategoriaPDF, ConfiguracionPDF } from "@/types/Boletin";

interface PaginaCategoriaPDFProps {
  categoria: CategoriaPDF;
  boletin: BoletinPDF;
  config: ConfiguracionPDF;
  numeroPagina: number;
}

// Componente para renderizar HTML como texto PDF
const HtmlToPdf: React.FC<{ html: string }> = ({ html }) => {
  if (!html) return <Text>Sin contenido</Text>;

  // Eliminar etiquetas HTML y mantener el texto
  const textoLimpio = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<strong>(.*?)<\/strong>/gi, '$1')
    .replace(/<[^>]+>/g, '')
    .trim();

  return <Text style={styles.contenidoTexto}>{textoLimpio}</Text>;
};

export const PaginaCategoriaPDF: React.FC<PaginaCategoriaPDFProps> = ({
  categoria,
  boletin,
  config,
  numeroPagina
}) => {
  return (
    <Page size="A4" style={styles.page}>
      {/* Cabecera */}
      {config.showCabecera && (
        <CabeceraPDF boletin={boletin} numeroPagina={numeroPagina} />
      )}
      
      {/* Título de la categoría */}
      <View style={styles.tituloCategoria}>
        <Text style={styles.tituloCategoriaTexto}>
          {categoria.nombre.toUpperCase()}
        </Text>
      </View>
      
      {/* Artículos de la categoría */}
      <View style={styles.contenidoCategoria}>
        {categoria.articulos.map((articulo, index) => (
          <View key={articulo.id} style={styles.articuloContainer}>
            <Text style={styles.articuloTitulo}>
              {categoria.nombre.toUpperCase()} N° {articulo.numero}
            </Text>
            
            <Text style={styles.articuloFecha}>
              RÍO GALLEGOS, {new Date(articulo.fecha).toLocaleDateString('es-ES')}.-
            </Text>
            
            <HtmlToPdf html={articulo.contenido} />
          </View>
        ))}
      </View>
    </Page>
  );
};