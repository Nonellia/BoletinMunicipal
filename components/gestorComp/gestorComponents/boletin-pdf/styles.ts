import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  portadaPage: {
    padding: 60,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  portadaTitulo: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  portadaSubtitulo: {
    fontSize: 20,
    marginBottom: 60,
    textAlign: "center",
    color: "#555",
  },
  portadaInfo: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
  },
  portadaFecha: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  header: {
    fontSize: 9,
    color: "#666",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "1 solid #ddd",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 9,
    color: "#666",
    textAlign: "center",
    borderTop: "1 solid #ddd",
    paddingTop: 10,
  },
  indiceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  indiceItem: {
    fontSize: 11,
    marginBottom: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  docTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  docSubtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 15,
  },
  docInfo: {
    fontSize: 10,
    marginBottom: 15,
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 4,
  },
  docInfoRow: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 5,
  },
  docInfoLabel: {
    fontWeight: "bold",
    width: 120,
  },
  docContent: {
    fontSize: 11,
    lineHeight: 1.6,
    textAlign: "justify",
    marginTop: 10,
  },
});