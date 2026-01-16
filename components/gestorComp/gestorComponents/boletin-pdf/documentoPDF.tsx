import React from "react";
import { Page, Text, View } from "@react-pdf/renderer";
import { styles } from "./styles";
import type { Documento, Boletin, ConfiguracionPDF, Articulo } from "../../../types/boletin";
import { CabeceraPDF } from "./cabecera";
interface DocumentoPDFProps {
  doc: Documento & { articulos?: Articulo[]; categoria?: string };
  idx: number;
  boletin: Boletin;
  config: ConfiguracionPDF;
}

export const DocumentoPDF: React.FC<DocumentoPDFProps> = ({ 
  doc, 
  idx, 
  boletin, 
  config 
}) => (
  <Page size="A4" style={styles.page}>
    {/* <View style={styles.header} fixed>
      <Text>{config.cabecera}</Text>
      <Text>Edición Nº {boletin.numero_edicion}</Text>
    </View> */}
    <CabeceraPDF
        key={doc.id}
        doc={doc}
        idx={idx}
        boletin={boletin}
        config={config}
    />
    <Text style={styles.docTitle}>Documento Nº {doc.numero_documento}</Text>
    <Text style={styles.docSubtitle}>{doc.numero_completo}</Text>

    <View style={styles.docInfo}>
      <View style={styles.docInfoRow}>
        <Text style={styles.docInfoLabel}>Categoría:</Text>
        <Text>
          {typeof doc.categoria === "object"
            ? doc.categoria?.nombre || "Sin categoría"
            : doc.categoria || "Sin categoría"}
        </Text>
      </View>
      <View style={styles.docInfoRow}>
        <Text style={styles.docInfoLabel}>Fecha Emisión:</Text>
        <Text>{doc.fecha_emision || "N/A"}</Text>
      </View>
      <View style={styles.docInfoRow}>
        <Text style={styles.docInfoLabel}>Lugar Emisión:</Text>
        <Text>{doc.lugar_emision || "N/A"}</Text>
      </View>
      <View style={styles.docInfoRow}>
        <Text style={styles.docInfoLabel}>Estado:</Text>
        <Text>{doc.estado || "N/A"}</Text>
      </View>
      {doc.paginas && (
        <View style={styles.docInfoRow}>
          <Text style={styles.docInfoLabel}>Páginas:</Text>
          <Text>{doc.paginas}</Text>
        </View>
      )}
    </View>

    {/* Artículos asociados */}
    {doc.articulos && doc.articulos.length > 0 ? (
      <View style={{ marginTop: 10 }}>
        <Text style={{ fontSize: 13, fontWeight: "bold", marginBottom: 6 }}>
          Artículos:
        </Text>
        {doc.articulos.map((a) => (
          <View key={a.id} style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: "bold" }}>
              {(a.prefijo ? a.prefijo + " " : "") +
                (a.numero_articulo ? a.numero_articulo + " - " : "") +
                (a.titulo ? a.titulo : "")}
            </Text>
            {a.tipo_articulo && (
              <Text style={{ fontStyle: "italic" }}>
                Tipo: {a.tipo_articulo}
              </Text>
            )}
            <Text style={{ marginTop: 2 }}>{a.contenido}</Text>
          </View>
        ))}
      </View>
    ) : (
      <Text style={{ marginTop: 10 }}>Sin artículos</Text>
    )}

    <Text style={styles.footer} fixed>
      {config.piePagina.replace(
        "{pageNumber}",
        String(idx + 1 + (config.showPortada ? 1 : 0) + (config.showIndice ? 1 : 0))
      )}
    </Text>
  </Page>
);