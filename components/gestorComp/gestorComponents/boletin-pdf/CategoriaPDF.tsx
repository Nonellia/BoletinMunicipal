import React from "react";
import { Page, Text, View } from "@react-pdf/renderer";
import type { Documento, Boletin, ConfiguracionPDF } from "@/types/Boletin";
import { CabeceraPDF } from "./cabecera";
import { styles } from "./styles";

interface CategoriaPDFProps {
  categoria: string;
  documentos: Documento[];
  boletin: Boletin;
  config: ConfiguracionPDF;
  pageIndex: number;
}

export const CategoriaPDF: React.FC<CategoriaPDFProps> = ({
  categoria,
  documentos,
  boletin,
  config,
  pageIndex,
}) => (
  <Page size="A4" style={styles.page}>
    {/* CABECERA */}
    <CabeceraPDF
      doc={documentos[0]}
      idx={pageIndex}
      boletin={boletin}
      config={config}
    />

    {/* BARRA AZUL CON NOMBRE DE CATEGORÍA */}
    <View style={styles.categoriaHeader}>
      <Text style={styles.categoriaTitulo}>
        {categoria.toUpperCase()}
      </Text>
    </View>

    {/* LISTA DE DOCUMENTOS EN ESTA CATEGORÍA */}
    <View style={{ marginTop: 20 }}>
      {documentos.map((doc, idx) => (
        <View key={doc.id} style={{ 
          marginBottom: 25,
          paddingBottom: 20,
          borderBottom: idx < documentos.length - 1 ? "1px solid #eee" : "none"
        }}>
          {/* Número del documento */}
          <Text style={styles.docTitle}>
            Documento Nº {doc.numero_documento}
          </Text>
          
          {/* Número completo */}
          {doc.numero_completo && (
            <Text style={styles.docSubtitle}>
              {doc.numero_completo}
            </Text>
          )}
          
          {/* Información del documento */}
          <View style={styles.docInfo}>
            <View style={styles.docInfoRow}>
              <Text style={styles.docInfoLabel}>Categoría:</Text>
              <Text>
                {categoria}
              </Text>
            </View>
            
            {doc.fecha_emision && (
              <View style={styles.docInfoRow}>
                <Text style={styles.docInfoLabel}>Fecha Emisión:</Text>
                <Text>{doc.fecha_emision}</Text>
              </View>
            )}
            
            {doc.lugar_emision && (
              <View style={styles.docInfoRow}>
                <Text style={styles.docInfoLabel}>Lugar Emisión:</Text>
                <Text>{doc.lugar_emision}</Text>
              </View>
            )}
            
            {doc.estado && (
              <View style={styles.docInfoRow}>
                <Text style={styles.docInfoLabel}>Estado:</Text>
                <Text>{doc.estado}</Text>
              </View>
            )}
            
            {doc.paginas && (
              <View style={styles.docInfoRow}>
                <Text style={styles.docInfoLabel}>Páginas:</Text>
                <Text>{doc.paginas}</Text>
              </View>
            )}
          </View>

          {/* Artículos asociados */}
          {doc.articulos && doc.articulos.length > 0 && (
            <View style={{ marginTop: 15 }}>
              <Text style={{ 
                fontSize: 13, 
                fontWeight: "bold", 
                marginBottom: 8,
                color: "#2c2c6c"
              }}>
                Artículos:
              </Text>
              
              {doc.articulos.map((articulo) => (
                <View key={articulo.id} style={{ 
                  marginBottom: 12,
                  backgroundColor: "#f9f9f9",
                  padding: 10,
                  borderRadius: 4
                }}>
                  {/* Título del artículo */}
                  <Text style={{ 
                    fontWeight: "bold",
                    fontSize: 12,
                    marginBottom: 4,
                    color: "#1e88e5"
                  }}>
                    {articulo.prefijo ? `${articulo.prefijo} ` : ''}
                    {articulo.numero_articulo ? `Artículo ${articulo.numero_articulo}` : ''}
                    {articulo.titulo ? ` - ${articulo.titulo}` : ''}
                  </Text>
                  
                  {/* Tipo de artículo */}
                  {articulo.tipo_articulo && (
                    <Text style={{ 
                      fontSize: 10, 
                      fontStyle: "italic",
                      color: "#666",
                      marginBottom: 6
                    }}>
                      Tipo: {articulo.tipo_articulo}
                    </Text>
                  )}
                  
                  {/* Contenido del artículo */}
                  {articulo.contenido && (
                    <Text style={{ 
                      fontSize: 11, 
                      lineHeight: 1.5,
                      textAlign: "justify"
                    }}>
                      {articulo.contenido}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>

    {/* PIE DE PÁGINA */}
    <Text style={styles.footer} fixed>
      {config.piePagina.replace("{pageNumber}", String(pageIndex + 1))}
    </Text>
  </Page>
);