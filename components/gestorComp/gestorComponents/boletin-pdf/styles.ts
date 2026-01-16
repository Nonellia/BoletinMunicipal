// styles.ts
import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
    page: {
    paddingTop: 90,
    paddingBottom: 50,
    paddingHorizontal: 60,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
  },

/// Estilos para la versión alternativa
portadaPage: {
  backgroundColor: "#FFFFFF",
  position: "relative",
},

// Imagen que cubre toda la página
portadaBackground: {
  width: "100%",
  height: "100%",
  position: "absolute",
  top: 0,
  left: 0,
  objectFit: "cover",
  opacity: 0.2,
},

// Contenido que se superpone
portadaContentOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
},

portadaEdicion: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#000000",
  marginBottom: 40,
  textAlign: "center",
},

portadaMainContent: {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: 40,
},

portadaTitulo: {
  fontSize: 42,
  fontWeight: "bold",
  color: "#000000",
  letterSpacing: 3,
  marginBottom: 5,
  textAlign: "center",
},

portadaSubtitulo: {
  fontSize: 42,
  fontWeight: "bold",
  color: "#000000",
  letterSpacing: 3,
  marginBottom: 20,
  textAlign: "center",
},

portadaInfo: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#000000",
  textAlign: "center",
},

portadaFecha: {
  fontSize: 14,
  color: "#000000",
  textAlign: "center",
},
  // ==========================================
  // CABECERA (aparece en cada página)
  // ==========================================
  cabecera: {
    position: "absolute",
    top: 30,
    left: 60,
    right: 60,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
  },
  
  cabeceraIzquierda: {
    marginRight: 15,
  },
  
  logoCabecera: {
    width: 50,
    height: 50,
  },
  
  cabeceraDerecha: {
    flex: 1,
  },
  
  cabeceraEdicion: {
    fontSize: 8,
    color: "#000000",
    marginBottom: 2,
  },
  
  cabeceraTitulo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 2,
  },
  
  cabeceraTituloResaltado: {
    fontWeight: "bold",
  },
  
  cabeceraFecha: {
    fontSize: 8,
    color: "#000000",
  },
  
  cabeceraNumeroPagina: {
    alignItems: "flex-end",
  },
  
  numeroPaginaTexto: {
    fontSize: 9,
    color: "#000000",
    marginTop: 25,
  },

  // ==========================================
  // CATEGORÍA HEADER
  // ==========================================
  categoriaHeader: {
    marginBottom: 15,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  
  categoriaTitulo: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
  },

  // ==========================================
  // RESÚMENES
  // ==========================================
  resumenesContainer: {
    flex: 1,
  },
  
  resumenItem: {
    marginBottom: 15,
  },
  
  resumenTitulo: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 3,
  },
  
  resumenFecha: {
    fontSize: 9,
    color: "#000000",
    marginBottom: 8,
  },
  
  resumenContenido: {
    marginTop: 5,
  },
  
  resumenParrafo: {
    fontSize: 9,
    lineHeight: 1.5,
    color: "#000000",
    textAlign: "justify",
    marginBottom: 8,
  },

  // ==========================================
  // SUMARIO (ÍNDICE)
  // ==========================================
  sumarioContainer: {
    flex: 1,
  },
  
  sumarioTitulo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  
  sumarioGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  
  sumarioColumna: {
    width: "48%",
  },
  
  sumarioItem: {
    marginBottom: 20,
  },
  
  sumarioCategoria: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 3,
  },
  
  sumarioRango: {
    fontSize: 9,
    color: "#000000",
    marginBottom: 3,
  },
  
  sumarioLinea: {
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    marginVertical: 3,
  },
  
  sumarioPagina: {
    fontSize: 9,
    color: "#000000",
    textAlign: "right",
    fontWeight: "bold",
  },

  // ==========================================
  // PIE DE PÁGINA
  // ==========================================
  footer: {
    position: "absolute",
    bottom: 30,
    left: 60,
    right: 60,
    textAlign: "center",
    fontSize: 8,
    color: "#666666",
  },
});