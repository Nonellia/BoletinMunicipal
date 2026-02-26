import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./pdfStyles";
import type { BoletinPDF, CategoriaPDF, ConfiguracionPDF } from "@/types/Boletin";
import { CabeceraPDF } from "./cabecera";
interface SeccionCategoriaPDFProps {
  categoria: CategoriaPDF;
  boletin: BoletinPDF;
  config: ConfiguracionPDF;
  pageIndex: number;
}

export const SeccionCategoriaPDF: React.FC<SeccionCategoriaPDFProps> = ({
  categoria,
  boletin,
  config,
  pageIndex
}) => {
  const fechaBoletin = new Date(boletin.fecha_publicacion);
  const formatoFecha = new Intl.DateTimeFormat("es-ES", {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(fechaBoletin);

  return (
    <Page size="A4" style={styles.page}>
      {/* Cabecera estándar */}

      
      {/* Encabezado de categoría */}
      <View style={styles.encabezadoCategoria}>
        <View style={styles.encabezadoCategoriaContenido}>
          <Text style={styles.encabezadoCategoriaNumero}>
            SECCIÓN
          </Text>
          <Text style={styles.encabezadoCategoriaTitulo}>
            {categoria.nombre.toUpperCase()}
          </Text>
          <Text style={styles.encabezadoCategoriaSubtitulo}>
            {categoria.abreviatura} • {categoria.resumenes.length} resúmenes
          </Text>
        </View>
        <View style={styles.encabezadoCategoriaDecoracion} />
      </View>
      
      {/* Contenido introductorio */}
      <View style={styles.contenidoCategoria}>
        <Text style={styles.contenidoCategoriaTexto}>
          En esta sección se presentan los {categoria.resumenes.length} resúmenes 
          correspondientes a la categoría "{categoria.nombre}" ({categoria.abreviatura}) 
          del Boletín Oficial Municipal N° {boletin.numero_edicion}, 
          publicado el {formatoFecha}.
        </Text>
        
        {/* Lista de resúmenes (vista previa) */}
        <View style={styles.listaResumenesPreview}>
          <Text style={styles.listaResumenesTitulo}>
            RESÚMENES INCLUIDOS:
          </Text>
          
          {categoria.resumenes.map((resumen, index) => {
            const fechaResumen = new Date(resumen.fecha).toLocaleDateString('es-ES');
            const contenidoBreve = resumen.contenido
              
              
            return (
              <View key={resumen.id} style={styles.resumenPreviewItem}>
                <View style={styles.resumenPreviewHeader}>
                  <Text style={styles.resumenPreviewNumero}>
                    Resumen {index + 1}
                  </Text>
                  <Text style={styles.resumenPreviewFecha}>
                    Fecha: {fechaResumen}
                  </Text>
                </View>
                <Text style={styles.resumenPreviewContenido}>
                  {contenidoBreve}
                </Text>
              </View>
            );
          })}
        </View>
        
        {/* Nota informativa */}
        <View style={styles.notaCategoria}>
          <Text style={styles.notaCategoriaTitulo}>
            NOTA:
          </Text>
          <Text style={styles.notaCategoriaTexto}>
            Cada resumen se presenta en páginas individuales con su contenido completo, 
            manteniendo la estructura y formato original del documento oficial.
          </Text>
        </View>
      </View>
      
      {/* Pie de página */}
      <Text style={styles.footer} fixed>
        {config.piePagina.replace("{pageNumber}", String(pageIndex + 1))}
      </Text>
    </Page>
  );
};