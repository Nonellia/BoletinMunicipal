import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./pdfStyles";
import type { BoletinPDF, CategoriaPDF, ResumenPDF, ConfiguracionPDF } from "@/types/Boletin"; 

interface PaginaResumenPDFProps {
  resumen: ResumenPDF;
  categoria: CategoriaPDF;
  boletin: BoletinPDF;
  config: ConfiguracionPDF;
  pageIndex: number;
  resumenNumero: number;
  totalResumenes: number;
}

// Componente para renderizar elementos HTML como PDF
const HtmlContentToPdf: React.FC<{ html: string }> = ({ html }) => {
  if (!html || html.trim() === "") {
    return <Text style={styles.parrafoResumen}>Sin contenido</Text>;
  }

  const paragraphs = html.match(/<p[^>]*>.*?<\/p>/gi);

  if (!paragraphs) return null;

  return (
    <>
      {paragraphs.map((p, index) => {
        const alignMatch = p.match(/text-align:\s*(left|center|right|justify)/);
        const textAlign = alignMatch ? alignMatch[1] : "left";

        const inner = p.replace(/<\/?p[^>]*>/gi, "");

        const parts = inner.split(/(<strong>.*?<\/strong>)/gi);

        return (
          <Text
            key={index}
            style={[styles.parrafoResumen, { textAlign }]}
          >
            {parts.map((part, i) => {
              if (part.startsWith("<strong>")) {
                return (
                  <Text key={i} style={{ fontWeight: "bold" }}>
                    {part.replace(/<\/?strong>/gi, "")}
                  </Text>
                );
              }
              return <Text key={i}>{part}</Text>;
            })}
          </Text>
        );
      })}
    </>
  );
};


export const PaginaResumenPDF: React.FC<PaginaResumenPDFProps> = ({
  resumen,
  categoria,
  boletin,
  config,
  pageIndex,
  resumenNumero,
  totalResumenes
}) => {
  const fechaResumen = new Date(resumen.fecha);
  const fechaBoletin = new Date(boletin.fecha_publicacion);
  
  const formatoFechaResumen = new Intl.DateTimeFormat("es-ES", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(fechaResumen);
  
  const formatoFechaCorta = new Intl.DateTimeFormat("es-ES").format(fechaResumen);
  
  // Extraer texto plano para estadísticas
  const extraerTextoPlano = (html: string): string => {
    return html
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };
  
  const contenidoPlano = extraerTextoPlano(resumen.contenido);
  const palabras = contenidoPlano.split(' ').filter(word => word.length > 0).length;
  
  return (
    <Page size="A4" style={styles.page}>
      {/* Cabecera estándar */}
      <View style={styles.cabeceraPagina} fixed>
        <Text style={styles.cabeceraEdicion}>
          Edición N° {boletin.numero_edicion} • {boletin.tipo_boletin}
        </Text>
        <Text style={styles.cabeceraFecha}>
          Río Gallegos, {new Date(fechaBoletin).toLocaleDateString('es-ES')}
        </Text>
      </View>
      
      {/* Encabezado del resumen */}
      <View style={styles.encabezadoResumen}>
        <View style={styles.encabezadoResumenSuperior}>
          <Text style={styles.resumenCategoria}>
            {categoria.nombre} • {categoria.abreviatura}
          </Text>
          <Text style={styles.resumenNumeroPagina}>
            Resumen {resumenNumero} de {totalResumenes}
          </Text>
        </View>
        
        <View style={styles.encabezadoResumenPrincipal}>
          <View style={styles.resumenCodigo}>
            <Text style={styles.resumenCodigoTexto}>
              {boletin.numero_edicion.toString().padStart(3, '0')}-
              {categoria.abreviatura}-
              {resumenNumero.toString().padStart(3, '0')}
            </Text>
          </View>
          
          <View style={styles.resumenInfo}>
            <Text style={styles.resumenTitulo}>
              RESÚMEN OFICIAL
            </Text>
            <Text style={styles.resumenFecha}>
              {formatoFechaResumen.toUpperCase()}
            </Text>
            <Text style={styles.resumenReferencia}>
              Referencia: Boletín Municipal N° {boletin.numero_edicion}
            </Text>
          </View>
        </View>
        
        <View style={styles.resumenMetadatos}>
          <View style={styles.metadatoItem}>
            <Text style={styles.metadatoLabel}>ID Resumen:</Text>
            <Text style={styles.metadatoValue}>RES-{resumen.id.toString().padStart(6, '0')}</Text>
          </View>
          <View style={styles.metadatoItem}>
            <Text style={styles.metadatoLabel}>Fecha Publicación:</Text>
            <Text style={styles.metadatoValue}>{formatoFechaCorta}</Text>
          </View>
          <View style={styles.metadatoItem}>
            <Text style={styles.metadatoLabel}>Categoría:</Text>
            <Text style={styles.metadatoValue}>{categoria.nombre}</Text>
          </View>
          <View style={styles.metadatoItem}>
            <Text style={styles.metadatoLabel}>Extensión:</Text>
            <Text style={styles.metadatoValue}>{palabras} palabras</Text>
          </View>
        </View>
      </View>
      
      {/* Contenido del resumen */}
      <View style={styles.contenidoResumen}>
        <Text style={styles.contenidoResumenTitulo}>
          CONTENIDO
        </Text>
        
        <View style={styles.contenidoResumenTexto}>
          <HtmlContentToPdf html={resumen.contenido} />
        </View>
      </View>
      
      {/* Información de paginación */}
      <View style={styles.paginacionResumen}>
        <Text style={styles.paginacionTexto}>
          — Continúa en la próxima sección —
        </Text>
        <Text style={styles.paginacionCategoria}>
          Próxima: {categoria.nombre} - Resumen {resumenNumero + 1 <= totalResumenes ? resumenNumero + 1 : 'Fin de sección'}
        </Text>
      </View>
      
      {/* Sello oficial */}
      <View style={styles.selloOficial}>
        <Text style={styles.selloTexto}>
          ✧ DOCUMENTO OFICIAL ✧
        </Text>
        <Text style={styles.selloSubtexto}>
          Municipalidad de Río Gallegos
        </Text>
      </View>
      
      {/* Pie de página */}
      <Text style={styles.footer} fixed>
        {config.piePagina.replace("{pageNumber}", String(pageIndex + 1))}
      </Text>
    </Page>
  );
};