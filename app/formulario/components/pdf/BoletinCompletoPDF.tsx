import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { registerFonts } from "@/components/gestorComp/gestorComponents/boletin-pdf/fonts";

registerFonts();

interface Resumen {
  id: number;
  contenido: string;
  fecha: string;
  id_categoria: number;
  id_boletin: number;
}

interface Categoria {
  id: number;
  nombre: string;
  abreviatura: string;
  resumenes: Resumen[];
}

interface Boletin {
  id: number;
  tipo_boletin: number;
  fecha: string;
  edicion: number;
}

interface PDFData {
  boletin: Boletin;
  categorias: Categoria[];
  totalResumenes: number;
  tipoBoletin?: string;
}

interface ConfiguracionPDF {
  showPortada: boolean;
  showIndice: boolean;
  showCabecera: boolean;
  piePagina: string;
}

interface Props {
  data: PDFData;
  config: ConfiguracionPDF;
}

// ============================================
// ESTILOS
// ============================================
const styles = StyleSheet.create({
  // PÁGINA GENERAL
  ordenanzaHeaderBar: {
    backgroundColor: "#2B97D6",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  ordenanzaHeaderBarText: {
    fontSize: 22,
    fontFamily: "neulis5",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  ordenanzaHeaderBar1: {
    backgroundColor: "#300E74",
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop:10,
    marginBottom:10,
  },

  ordenanzaHeaderBarText1: {
    fontSize: 22,
    fontFamily: "neulis5",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  ordenanzaMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    marginBottom: 20,
  },

  ordenanzaNumero: {
    fontSize: 12,
    fontFamily: "neulis3",
    color: "#111827",
  },

  ordenanzaFecha: {
    fontSize: 11,
    fontFamily: "neulis",
    color: "#374151",
  },

  ordenanzaContenido: {
    fontSize: 11,
    lineHeight: 1.6,
    fontFamily: "Helvetica",
    color: "#1F2937",
    textAlign: "justify",
  },

  page: {
    paddingTop: 50,
    paddingHorizontal: 40,
    paddingBottom: 50,
    fontSize: 11,
    fontFamily: "Helvetica",
  },

  // PORTADA
  portadaPage: {
    backgroundColor: "#FFFFFF",
    flexDirection: "column",
    padding: 0,
    margin: 0,
  },

  portadaContent: {
    // flex: 1,
    alignItems: "center",
    // justifyContent: "space-between",
    // padding: 40,
    padding: 0,
    margin: 0,
  },

  portadaLogo: {
    width: 120,
    height: 120,
    marginTop: 30,
  },

  portadaHeader: {
    alignItems: "center",
    marginTop: 20,
  },

  portadaSubtexto: {
    fontSize: 10,
    color: "#64748B",
    textAlign: "center",
    fontFamily: "neulis",
    marginBottom: 2,
  },

  portadaFecha: {
    fontSize: 10,
    color: "#2B97D6",
    // textAlign: "center",
    fontFamily: "neulis",
    // marginBottom: 2,
    left: 10,
    top: 350,
  },

  portadaEdicion: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginTop: 20,
    marginBottom: 5,
    fontFamily: "neulis",
  },

  portadaAnio: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 10,
    fontFamily: "neulis",
  },

  portadaCenter: {
    alignItems: "center",
    top: 500,
    padding: 0,
    margin: 0,
    //  bottom:100,
  },

  portadaTitulo: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center",
    alignItems: "center",
    // marginBottom: 20,
    // letterSpacing: 2,
    fontFamily: "neulis3",
    padding: 0,
    margin: 0,
    // top:500,
    position: "absolute",
  },

  portadaSubtitulo: {
    fontSize: 44,
    fontWeight: "bold",
    color: "#3B82F6",
    textAlign: "center",
    fontFamily: "neulis3",
    padding: 0,
    margin: 0,
    // top:500,
    position: "absolute",
  },

  portadaFooter: {
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
    fontFamily: "neulis",
  },

  portadaIntendente: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginTop: 15,
    fontFamily: "neulis",
  },

  portadaCargoIntendente: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 10,
    fontFamily: "neulis",
  },

  portadaSeparador: {
    width: 200,
    height: 1,
    backgroundColor: "#CBD5E1",
    marginVertical: 10,
    fontFamily: "neulis",
  },

  portadaSecretario: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginTop: 5,
    fontFamily: "neulis",
  },

  portadaCargoSecretario: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 5,
    fontFamily: "neulis",
  },
  cabecera: {
    position: "relative",
    width: "100%",
    height: 70,
    // paddingHorizontal: 32,
    // paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
    // borderBottomWidth: 1,
    // borderBottomColor: "#2B2E83", // línea inferior azul
  },

  /* IZQUIERDA */
  cabeceraIzquierda: {
    width: "30%",
    justifyContent: "center",
  },

  logoCabecera: {
    width: 170,
    height: 40,
    objectFit: "contain",
  },

  /* DERECHA */
  cabeceraDerecha: {
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "center",
    margin: 0,
  },

  cabeceraEdicion: {
    fontSize: 9,
    fontFamily: "neulis3",
    color: "#2B2E83",
    marginBottom: 1,
  },

  cabeceraTitulo: {
    fontSize: 13,
    fontFamily: "neulis3",
    color: "#2B2E83",
    lineHeight: 1.1,
  },

  cabeceraTituloResaltado: {
    color: "#2B97D6", // celeste "MUNICIPAL"
  },

  cabeceraFecha: {
    fontSize: 9,
    fontFamily: "neulis2",
    color: "#2B2E83",
    marginTop: 2,
  },

  /* NUMERO DE PAGINA */
  cabeceraNumeroPagina: {
    position: "absolute",
    right: 32,
    bottom: -14,
  },

  numeroPaginaTexto: {
    fontSize: 8,
    fontFamily: "Helvetica",
    color: "#2B2E83",
  },

  // SUMARIO/ÍNDICE
  sumarioContainer: {
    marginTop: 20,
  },

  sumarioTitulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 30,
  },

  sumarioGrid: {
    // flexDirection: "row",
    justifyContent: "space-between",
  },

  sumarioColumna: {
    width: "100%",
  },

  sumarioItem: {
    marginBottom: 20,
    paddingBottom: 15,
    // borderBottomWidth: 1,
    // borderBottomColor: "#E2E8F0",
  },

  sumarioCategoria: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 5,
  },

  sumarioRango: {
    fontSize: 10,
    color: "#64748B",
    marginBottom: 8,
  },

  sumarioLinea: {
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
    borderBottomStyle: "dotted",
    marginBottom: 5,
  },

  sumarioPagina: {
    fontSize: 10,
    color: "#3B82F6",
    fontWeight: "bold",
    textAlign: "right",
  },

  // CATEGORÍA
  categoriaHeader: {
    backgroundColor: "#1E3A8A",
    padding: 15,
    // marginBottom: 20,
    borderRadius: 5,
  },

  categoriaTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },

  // RESÚMENES
  resumenesContainer: {
    marginTop: 10,
  },

  resumenItem: {
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  resumenTitulo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 5,
  },

  resumenFecha: {
    fontSize: 11,
    color: "#3B82F6",
    marginBottom: 10,
  },

  resumenContenido: {
    marginTop: 10,
  },

  resumenParrafo: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#1E293B",
    textAlign: "justify",
    marginBottom: 8,
  },
});
// =======================
// ESTILOS PORTADA PDF
// =======================
export const portadaStyles = StyleSheet.create({
  page: {
    position: "relative",
    width: "100%",
    height: "100%",
    padding: 0,
    margin: 0,
  },

  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },

  /* ───────────── Texto superior derecho ───────────── */
  topRight: {
    position: "absolute",
    top: 40,
    right: 42,
    width: 400,
    fontSize: 9,
    color: "#1E3A8A",
    fontFamily: "neulis",
    textAlign: "right",
    lineHeight: 1.35,
  },

  /* ───────────── Edición ───────────── */
  topLeftBox: {
    position: "absolute",
    top: 40,
    left: 45,
  },

  edicion: {
    fontSize: 20,
    fontFamily: "neulis3",
    fontWeight: "bold",
    color: "#1E3A8A",
  },

  anio: {
    fontSize: 10,
    fontFamily: "neulis",
    color: "#475569",
    marginTop: 0,
  },

  /* ───────────── Título central ───────────── */
  titulo: {
    position: "absolute",
    top: 495,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 60,
    fontFamily: "neulis3",
    color: "#300E74",
  },

  subtitulo: {
    position: "absolute",
    top: 545,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 50,
    fontFamily: "neulis3",
    color: "#2B97D6",
  },

  /* ───────────── Fecha ───────────── */
  fecha: {
    position: "absolute",
    bottom: 340,
    right: 50,
    fontSize: 10,
    fontFamily: "neulis",
    color: "#1E3A8A",
  },

  /* ───────────── Autoridades ───────────── */
  autoridades: {
    position: "absolute",
    bottom: 220,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  autoridadesTitulo: {
    fontSize: 8,
    fontFamily: "neulis3",
    color: "#475569",
    // marginTop: 12,
  },
  autoridadesNombres: {
    position: "absolute",
    bottom: 94,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  nombre: {
    fontSize: 14,
    fontFamily: "neulis3",
    fontWeight: "bold",
    color: "#1E3A8A",
    marginTop: 2,
  },

  cargo: {
    fontSize: 8,
    fontFamily: "neulis",
    color: "#2B97D6",
    marginTop: 1,
  },
});

export const PortadaPDF = ({ boletin }: any) => {
  const fecha = new Date(boletin.fecha);
  fecha.setDate(fecha.getDate() + 1);

  const fechaFormateada = new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(fecha);

  return (
    <Page size="A4" style={portadaStyles.page}>
      {/* Fondo */}
      <Image src="/portada.png" style={portadaStyles.background} fixed />

      {/* Texto superior derecho */}
      <Text style={portadaStyles.topRight}>
        2025 – 40 años del Juicio a las Juntas Militares, ordenado por{"\n"}
        el presidente Raúl Alfonsín
      </Text>

      {/* Edición */}
      <View style={portadaStyles.topLeftBox}>
        <Text style={portadaStyles.edicion}>
          EDICIÓN Nº {String(boletin.edicion).padStart(3, "0")}
        </Text>
        <Text style={portadaStyles.anio}>AÑO MMXXV</Text>
      </View>

      {/* Título */}
      <Text style={portadaStyles.titulo}>BOLETÍN OFICIAL</Text>
      <Text style={portadaStyles.subtitulo}>MUNICIPAL</Text>

      {/* Fecha */}
      <Text style={portadaStyles.fecha}>Río Gallegos, {fechaFormateada}</Text>

      {/* Autoridades */}
      <View style={portadaStyles.autoridades}>
        <Text style={portadaStyles.autoridadesTitulo}>AUTORIDADES</Text>
      </View>
      <View style={portadaStyles.autoridadesNombres}>
        <Text style={portadaStyles.nombre}>PABLO GRASSO</Text>
        <Text style={portadaStyles.cargo}>INTENDENTE</Text>

        <Text style={portadaStyles.nombre}>DIEGO ROBLES</Text>
        <Text style={portadaStyles.cargo}>JEFE DE GABINETE</Text>

        <Text style={portadaStyles.nombre}>SARA DELGADO</Text>
        <Text style={portadaStyles.cargo}>SECRETARIA DE GOBIERNO</Text>

        <Text style={portadaStyles.nombre}>GONZALO CHUTE</Text>
        <Text style={portadaStyles.cargo}>SECRETARIO DE LEGAL Y TÉCNICA</Text>
      </View>
    </Page>
  );
};

// ============================================
// COMPONENTE CABECERA
// ============================================
const CabeceraPDF = ({ boletin, tipoBoletin, numeroPagina }: any) => {
  const fecha = new Date(boletin.fecha);
  fecha.setDate(fecha.getDate() + 1);

  const formatoFecha = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(fecha);

  return (
    <View style={styles.cabecera} fixed>
      <View style={styles.cabeceraIzquierda}>
        <Image src="/logo.png" style={styles.logoCabecera} />
      </View>

      <View style={styles.cabeceraDerecha}>
        <Text style={styles.cabeceraEdicion}>EDICIÓN Nº {boletin.edicion}</Text>
        <Text style={styles.cabeceraTitulo}>
          BOLETÍN OFICIAL{" "}
          <Text style={styles.cabeceraTituloResaltado}>MUNICIPAL</Text>
        </Text>
        <Text style={styles.cabeceraFecha}>RÍO GALLEGOS, {formatoFecha}</Text>
      </View>

      {/* <View style={styles.cabeceraNumeroPagina}>
        <Text style={styles.numeroPaginaTexto}>Pág. {numeroPagina}</Text>
      </View> */}
    </View>
  );
};

// ============================================
// COMPONENTE ÍNDICE/SUMARIO
// ============================================
const IndicePDF = ({ categorias, boletin, tipoBoletin }: any) => {
  let paginaActual = 1;

  return (
    <Page size="A4" style={styles.page}>
      <CabeceraPDF
        boletin={boletin}
        tipoBoletin={tipoBoletin}
        // numeroPagina={categorias.length + 1}
      />

      <View style={styles.sumarioContainer}>
<View style={styles.ordenanzaHeaderBar1}>
          <Text style={styles.ordenanzaHeaderBarText1}>
            {/* {categoria.nombre.toUpperCase()} */}
            SUMARIO
          </Text>
        </View>
        <View style={styles.sumarioGrid}>
          <View style={styles.sumarioColumna}>
            {categorias.map((categoria: any, index: number) => {
              const inicioCategoria = paginaActual + 1;
              paginaActual += categoria.resumenes.length;

              if (index % 2 === 0) {
                return (
                  <View key={categoria.id} style={styles.sumarioItem}>
                    <Text style={styles.sumarioCategoria}>
                      {categoria.nombre.toUpperCase()}
                    </Text>
                    <Text style={styles.sumarioRango}>
                      {categoria.resumenes[0]?.contenido?.match(
                        /Nº\s*(\d+)/
                      )?.[1] || "0001"}{" "}
                      -{" "}
                      {categoria.resumenes[
                        categoria.resumenes.length - 1
                      ]?.contenido?.match(/Nº\s*(\d+)/)?.[1] || "0002"}
                    </Text>
                    <View style={styles.sumarioLinea} />
                    <Text style={styles.sumarioPagina}>
                      Página {inicioCategoria}
                    </Text>
                  </View>
                );
              }
              return null;
            })}
          </View>

          <View style={styles.sumarioColumna}>
            {categorias.map((categoria: any, index: number) => {
              const inicioCategoria =
                paginaActual - categoria.resumenes.length + 1;

              if (index % 2 === 1) {
                return (
                  <View key={categoria.id} style={styles.sumarioItem}>
                    <Text style={styles.sumarioCategoria}>
                      {categoria.nombre.toUpperCase()}
                    </Text>
                    <Text style={styles.sumarioRango}>
                      {categoria.resumenes[0]?.contenido?.match(
                        /Nº\s*(\d+)/
                      )?.[1] || "0001"}{" "}
                      -{" "}
                      {categoria.resumenes[
                        categoria.resumenes.length - 1
                      ]?.contenido?.match(/Nº\s*(\d+)/)?.[1] || "0002"}
                    </Text>
                    <View style={styles.sumarioLinea} />
                    <Text style={styles.sumarioPagina}>
                      Página {inicioCategoria}
                    </Text>
                  </View>
                );
              }
              return null;
            })}
          </View>
        </View>
      </View>
    </Page>
  );
};

// ============================================
// FUNCIÓN LIMPIAR HTML
// ============================================
const limpiarHTML = (html: string): string => {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<strong>(.*?)<\/strong>/gi, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
};

// ============================================
// COMPONENTE PÁGINA DE CATEGORÍA
// ============================================
const PaginaCategoriaPDF = ({
  categoria,
  boletin,
  tipoBoletin,
  numeroPagina,
}: any) => {
  return (
    <Page size="A4" style={styles.page}>
      <CabeceraPDF
        boletin={boletin}
        tipoBoletin={tipoBoletin}
        numeroPagina={numeroPagina}
      />

      {/* <View style={styles.categoriaHeader}>
        <Text style={styles.categoriaTitulo}>
          {categoria.nombre.toUpperCase()}
        </Text>
      </View> */}

      <View style={styles.resumenesContainer}>
        <View style={styles.ordenanzaHeaderBar}>
          <Text style={styles.ordenanzaHeaderBarText}>
            {categoria.nombre.toUpperCase()}
          </Text>
        </View>
        {categoria.resumenes.map((resumen: Resumen, index: number) => {
          const contenidoLimpio = limpiarHTML(resumen.contenido);
          const lineas = contenidoLimpio.split("\n").filter((l) => l.trim());

          const numeroMatch = contenidoLimpio.match(/Nº\s*(\d+)/);
          const numero = numeroMatch
            ? numeroMatch[1]
            : String(index + 1).padStart(4, "0");

          const fechaMatch = contenidoLimpio.match(
            /(\d{1,2}\s+de\s+\w+\s+de\s+\d{4})/i
          );
          const fechaTexto = fechaMatch
            ? fechaMatch[1]
            : new Date(resumen.fecha).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });

          return (
            <View key={resumen.id} style={styles.resumenItem} wrap={false}>
              {/* FRANJA AZUL */}

              {/* NÚMERO + FECHA */}
              <View style={styles.ordenanzaMetaRow}>
                <Text style={styles.ordenanzaNumero}>
                  {categoria.nombre.toUpperCase()} Nº {numero}
                </Text>

                <Text style={styles.ordenanzaFecha}>
                  RÍO GALLEGOS, {fechaTexto}.-
                </Text>
              </View>

              {/* CONTENIDO */}
              {lineas.map((linea, idx) => (
                <Text key={idx} style={styles.ordenanzaContenido}>
                  {linea}
                </Text>
              ))}
            </View>
          );
        })}
      </View>
    </Page>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export const BoletinCompletoPDF: React.FC<Props> = ({ data, config }) => {
  const { boletin, categorias } = data;
  let numeroPagina = 0;

  return (
    <Document>
      {/* PORTADA */}
      {config.showPortada && (
        <PortadaPDF boletin={boletin} tipoBoletin={data.tipoBoletin} />
      )}

      {/* PÁGINAS DE CATEGORÍAS CON RESÚMENES */}
      {categorias.map((categoria, indexCat) => {
        numeroPagina++;
        return (
          <PaginaCategoriaPDF
            key={categoria.id}
            categoria={categoria}
            boletin={boletin}
            tipoBoletin={data.tipoBoletin}
            numeroPagina={numeroPagina}
          />
        );
      })}

      {/* ÍNDICE/SUMARIO AL FINAL */}
      {config.showIndice && (
        <IndicePDF
          categorias={categorias}
          boletin={boletin}
          tipoBoletin={data.tipoBoletin}
        />
      )}
    </Document>
  );
};
