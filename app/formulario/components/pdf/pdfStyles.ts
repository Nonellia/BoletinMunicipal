import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  // Página general
  parrafoResumen: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 8,
    textAlign: 'justify',
    fontFamily: 'Helvetica',
  },
  
  horizontalRule: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    borderBottomStyle: 'solid',
    marginVertical: 12,
    width: '100%',
  },
    // PORTADA
  portadaPage: {
    backgroundColor: "#FFFFFF",
    flexDirection: "column",
    padding: 0,
    position: "relative", // Agregado para posicionamiento relativo
  },
  
  portadaContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 40,
    backgroundColor: "rgba(255, 255, 255, 0.85)", // Fondo semitransparente para mejor legibilidad
  },
  contenidoResumenTexto: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  
  // Estilos para listas
  listItemContainer: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  
  bulletPoint: {
    fontSize: 10,
    marginRight: 5,
    marginLeft: 10,
    fontFamily: 'Helvetica',
  },
  
  listItem: {
    fontSize: 10,
    lineHeight: 1.5,
    flex: 1,
    textAlign: 'justify',
    fontFamily: 'Helvetica',
  },
  page: {
    paddingTop: 50,
    paddingHorizontal: 40,
    paddingBottom: 50,
    fontSize: 11,
    fontFamily: "Helvetica",
    position: "relative",
  },
  
  // PORTADA
  portadaPage: {
    backgroundColor: "#FFFFFF",
  },
  portadaBackground: {
    flex: 1,
    // backgroundColor: "#F8FAFC",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  portadaLogo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  portadaContent: {
    alignItems: "center",
    maxWidth: 500,
  },
  portadaTituloPrincipal: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 1,
  },
  portadaSubtitulo: {
    fontSize: 22,
    color: "#3B82F6",
    textAlign: "center",
    marginBottom: 30,
    fontStyle: "italic",
  },
  portadaSeparador: {
    width: 200,
    height: 3,
    backgroundColor: "#1E3A8A",
    marginVertical: 25,
  },
  portadaEdicion: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 10,
  },
  portadaTipo: {
    fontSize: 20,
    color: "#3B82F6",
    marginBottom: 20,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  portadaFecha: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 40,
  },
  portadaEstadisticas: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    backgroundColor: "#F1F5F9",
    padding: 20,
    borderRadius: 10,
  },
  portadaEstadisticaItem: {
    alignItems: "center",
    paddingHorizontal: 30,
  },
  portadaEstadisticaNumero: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  portadaEstadisticaLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  portadaEstadisticaSeparador: {
    width: 1,
    height: 40,
    backgroundColor: "#CBD5E1",
  },
  portadaInfo: {
    marginTop: 40,
    paddingTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    width: "100%",
  },
  portadaInfoTitulo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 15,
    textAlign: "center",
    textTransform: "uppercase",
  },
  portadaInfoTexto: {
    fontSize: 12,
    color: "#475569",
    textAlign: "center",
    marginBottom: 5,
  },
  portadaPie: {
    position: "absolute",
    bottom: 30,
    fontSize: 10,
    color: "#94A3B8",
    textAlign: "center",
    width: "100%",
  },
  
  // CABECERAS
  cabecera: {
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#1E3A8A",
  },
  cabeceraTitulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 5,
  },
  cabeceraSubtitulo: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
  cabeceraPagina: {
    position: "absolute",
    top: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    color: "#64748B",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 10,
  },
  cabeceraEdicion: {
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  cabeceraFecha: {
    fontStyle: "italic",
  },
  
  // SECCIÓN CATEGORÍA
  encabezadoCategoria: {
    backgroundColor: "#1E3A8A",
    marginBottom: 25,
    borderRadius: 5,
    overflow: "hidden",
  },
  encabezadoCategoriaContenido: {
    padding: 25,
  },
  encabezadoCategoriaNumero: {
    fontSize: 12,
    color: "#93C5FD",
    marginBottom: 5,
    letterSpacing: 2,
  },
  encabezadoCategoriaTitulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  encabezadoCategoriaSubtitulo: {
    fontSize: 14,
    color: "#BFDBFE",
  },
  encabezadoCategoriaDecoracion: {
    height: 5,
    backgroundColor: "#3B82F6",
  },
  
  // RESÚMENES
  encabezadoResumen: {
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 5,
    overflow: "hidden",
  },
  encabezadoResumenSuperior: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  encabezadoResumenPrincipal: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  resumenCodigo: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginRight: 20,
    borderRadius: 3,
    justifyContent: "center",
  },
  resumenCodigoTexto: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 1,
  },
  resumenInfo: {
    flex: 1,
    justifyContent: "center",
  },
  resumenTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 5,
  },
  resumenFecha: {
    fontSize: 14,
    color: "#3B82F6",
    marginBottom: 5,
  },
  resumenReferencia: {
    fontSize: 11,
    color: "#64748B",
  },
  resumenMetadatos: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#F1F5F9",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  metadatoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metadatoLabel: {
    fontWeight: "bold",
    color: "#475569",
    marginRight: 5,
    fontSize: 10,
  },
  metadatoValue: {
    color: "#1E293B",
    fontSize: 10,
  },
  
  // CONTENIDO
  contenidoCategoria: {
    marginBottom: 25,
  },
  contenidoCategoriaTexto: {
    fontSize: 12,
    lineHeight: 1.6,
    color: "#334155",
    textAlign: "justify",
    marginBottom: 20,
  },
  contenidoResumen: {
    marginBottom: 30,
  },
  contenidoResumenTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 15,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#3B82F6",
  },
  // contenidoResumenTexto: {
  //   marginTop: 10,
  // },
  // parrafoResumen: {
  //   fontSize: 11,
  //   lineHeight: 1.6,
  //   color: "#1E293B",
  //   textAlign: "justify",
  //   marginBottom: 10,
  // },
  
  // LISTAS Y VISTAS PREVIAS
  listaCategorias: {
    marginTop: 20,
  },
  categoriaIndice: {
    marginBottom: 20,
  },
  categoriaIndiceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  categoriaIndiceNumero: {
    backgroundColor: "#1E3A8A",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  categoriaIndiceNumeroTexto: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  categoriaIndiceInfo: {
    flex: 1,
  },
  categoriaIndiceNombre: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E293B",
  },
  categoriaIndiceAbreviatura: {
    fontSize: 11,
    color: "#64748B",
  },
  categoriaIndicePagina: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#3B82F6",
  },
  resumenesIndice: {
    paddingLeft: 45,
  },
  resumenIndiceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingVertical: 5,
  },
  resumenIndiceInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  resumenIndiceNumero: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginRight: 10,
    minWidth: 30,
  },
  resumenIndiceTexto: {
    fontSize: 11,
    color: "#475569",
  },
  resumenIndicePagina: {
    fontSize: 11,
    color: "#64748B",
  },
  listaResumenesPreview: {
    backgroundColor: "#F8FAFC",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  listaResumenesTitulo: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 10,
  },
  resumenPreviewItem: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  resumenPreviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  resumenPreviewNumero: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#3B82F6",
  },
  resumenPreviewFecha: {
    fontSize: 10,
    color: "#94A3B8",
  },
  resumenPreviewContenido: {
    fontSize: 10,
    color: "#64748B",
    lineHeight: 1.4,
    fontStyle: "italic",
  },
  
  // ELEMENTOS ADICIONALES
  infoBoletin: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    padding: 15,
    backgroundColor: "#F1F5F9",
    borderRadius: 5,
  },
  infoBoletinItem: {
    alignItems: "center",
  },
  infoBoletinLabel: {
    fontSize: 10,
    color: "#64748B",
    marginBottom: 3,
  },
  infoBoletinValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  notaCategoria: {
    backgroundColor: "#FEF3C7",
    padding: 15,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  notaCategoriaTitulo: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#92400E",
    marginBottom: 5,
  },
  notaCategoriaTexto: {
    fontSize: 10,
    color: "#92400E",
    lineHeight: 1.4,
  },
  paginacionResumen: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  paginacionTexto: {
    fontSize: 10,
    color: "#94A3B8",
    marginBottom: 5,
    fontStyle: "italic",
  },
  paginacionCategoria: {
    fontSize: 9,
    color: "#64748B",
  },
  selloOficial: {
    alignItems: "center",
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  selloTexto: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1E3A8A",
    letterSpacing: 2,
  },
  selloSubtexto: {
    fontSize: 9,
    color: "#64748B",
    marginTop: 3,
  },
  
  // PIE DE PÁGINA
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#94A3B8",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 10,
  },
});