import React from "react";
import { Page, View, Text, Link } from "@react-pdf/renderer";
import { styles } from "./pdfStyles";
import type { BoletinPDF, CategoriaPDF, ConfiguracionPDF } from "@/types/Boletin";

interface IndiceBoletinPDFProps {
  boletin: BoletinPDF;
  categorias: CategoriaPDF[];
  config: ConfiguracionPDF;
}

export const IndiceBoletinPDF: React.FC<IndiceBoletinPDFProps> = ({
  boletin,
  categorias,
  config
}) => {
  // Calcular número de página inicial para cada categoría
  let currentPage = 3; // Portada(1) + Índice(2) = 3
  
  return (
    <Page size="A4" style={styles.page}>
      {/* Cabecera */}
      <View style={styles.cabecera}>
        <Text style={styles.cabeceraTitulo}>
          ÍNDICE GENERAL
        </Text>
        <Text style={styles.cabeceraSubtitulo}>
          Boletín Oficial Municipal - Edición N° {boletin.numero_edicion}
        </Text>
      </View>
      
      {/* Información del boletín */}
      <View style={styles.infoBoletin}>
        <View style={styles.infoBoletinItem}>
          <Text style={styles.infoBoletinLabel}>Tipo:</Text>
          <Text style={styles.infoBoletinValue}>{boletin.tipo_boletin}</Text>
        </View>
        <View style={styles.infoBoletinItem}>
          <Text style={styles.infoBoletinLabel}>Fecha:</Text>
          <Text style={styles.infoBoletinValue}>
            {new Date(boletin.fecha_publicacion).toLocaleDateString('es-ES')}
          </Text>
        </View>
        <View style={styles.infoBoletinItem}>
          <Text style={styles.infoBoletinLabel}>Total Categorías:</Text>
          <Text style={styles.infoBoletinValue}>{categorias.length}</Text>
        </View>
      </View>
      
      {/* Lista de categorías */}
      <View style={styles.listaCategorias}>
        {categorias.map((categoria, categoriaIndex) => {
          const paginaInicio = currentPage;
          currentPage += 1 + categoria.resumenes.length; // +1 para la página de categoría
          
          return (
            <View key={categoria.id} style={styles.categoriaIndice}>
              {/* Encabezado de categoría */}
              <View style={styles.categoriaIndiceHeader}>
                <View style={styles.categoriaIndiceNumero}>
                  <Text style={styles.categoriaIndiceNumeroTexto}>
                    {String(categoriaIndex + 1).padStart(2, '0')}
                  </Text>
                </View>
                <View style={styles.categoriaIndiceInfo}>
                  <Text style={styles.categoriaIndiceNombre}>
                    {categoria.nombre.toUpperCase()}
                  </Text>
                  <Text style={styles.categoriaIndiceAbreviatura}>
                    ({categoria.abreviatura})
                  </Text>
                </View>
                <Text style={styles.categoriaIndicePagina}>
                  Pág. {paginaInicio}
                </Text>
              </View>
              
              {/* Lista de resúmenes */}
              <View style={styles.resumenesIndice}>
                {categoria.resumenes.map((resumen, resumenIndex) => {
                  const fechaResumen = new Date(resumen.fecha).toLocaleDateString('es-ES');
                  const paginaResumen = paginaInicio + 1 + resumenIndex;
                  
                  return (
                    <View key={resumen.id} style={styles.resumenIndiceItem}>
                      <View style={styles.resumenIndiceInfo}>
                        <Text style={styles.resumenIndiceNumero}>
                          {categoriaIndex + 1}.{resumenIndex + 1}
                        </Text>
                        <Text style={styles.resumenIndiceTexto}>
                          Resumen del {fechaResumen}
                        </Text>
                      </View>
                      <Text style={styles.resumenIndicePagina}>
                        Pág. {paginaResumen}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
      
      {/* Pie de página */}
      <Text style={styles.footer}>
        {config.piePagina.replace("{pageNumber}", "2")}
      </Text>
    </Page>
  );
};