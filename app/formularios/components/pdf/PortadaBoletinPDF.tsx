// components/pdf/PortadaBoletinPDF.tsx
import React from "react";
import { Page, View, Text, Image } from "@react-pdf/renderer";
import { styles } from "./pdfStyles";
import type { BoletinPDF } from "@/types/Boletin"; // ← Cambiado

interface PortadaBoletinPDFProps {
  boletin: BoletinPDF;
  totalCategorias: number;
  totalResumenes: number;
}

export const PortadaBoletinPDF: React.FC<PortadaBoletinPDFProps> = ({
  boletin,
  totalCategorias,
  totalResumenes
}) => {
  // Función para parsear fecha ISO (YYYY-MM-DD) correctamente
  const parsearFechaISO = (fechaString: string): Date => {
    if (!fechaString) return new Date();
    
    // Si ya es una fecha válida, devolverla
    if (fechaString instanceof Date && !isNaN(fechaString.getTime())) {
      return fechaString;
    }
    
    // Manejar formato YYYY-MM-DD
    if (typeof fechaString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fechaString)) {
      // Dividir la fecha
      const [year, month, day] = fechaString.split('-').map(Number);
      // Crear fecha en zona horaria local
      return new Date(year, month - 1, day, 12, 0, 0); // Mediodía para evitar problemas de zona horaria
    }
    
    // Intentar parsear como fecha normal
    const fecha = new Date(fechaString);
    return isNaN(fecha.getTime()) ? new Date() : fecha;
  };

  // Función para formatear fecha larga en español
  const formatFechaLarga = (fechaString: string): string => {
    const fecha = parsearFechaISO(fechaString);
    
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  // Función para formatear fecha del boletín
  const formatFechaBoletin = (fechaString: string): string => {
    const fecha = parsearFechaISO(fechaString);
    
    const opciones: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  // Validar y normalizar datos del boletín
  const boletinValidado = {
    ...boletin,
    numero_edicion: boletin.numero_edicion || 'N/A',
    tipo_boletin: boletin.tipo_boletin || 'Sin tipo especificado',
    fecha_publicacion: boletin.fecha_publicacion || new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
  };

  const fechaFormateada = formatFechaBoletin(boletinValidado.fecha_publicacion);


 // ============================================
// COMPONENTE PORTADA CORREGIDO CON FONDO
// ============================================
const PortadaPDF = ({ boletin, tipoBoletin }: any) => {
  const fecha = new Date(boletin.fecha);
  fecha.setDate(fecha.getDate() + 1);
  
  const formatoFecha = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(fecha);

  return (
    <Page size="A4" style={styles.portadaPage}>
      {/* Fondo de la portada */}
      <Image 
        src="/portada.png" 
        style={{
          position: 'absolute',
          minWidth: '100%',
          minHeight: '100%',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      
      {/* Contenido superpuesto sobre la imagen de fondo */}
      <View style={styles.portadaContent}>
        {/* Logo en la parte superior */}
        <Image src="/logo.png" style={styles.portadaLogo} />
        
        <View style={styles.portadaHeader}>
          <Text style={styles.portadaSubtexto}>
            2025 – 40 años del Juicio a las Juntas Militares, ordenado por
          </Text>
          <Text style={styles.portadaSubtexto}>
            el presidente Raúl Alfonsín
          </Text>
          
          <Text style={styles.portadaEdicion}>
            EDICIÓN Nº {String(boletin.edicion).padStart(3, '0')}
          </Text>
          <Text style={styles.portadaAnio}>AÑO MMXXV</Text>
        </View>
        
        <View style={styles.portadaCenter}>
          <Text style={styles.portadaTitulo}>BOLETÍN OFICIAL</Text>
          <Text style={styles.portadaSubtitulo}>MUNICIPAL</Text>
        </View>
        
        <View style={styles.portadaFooter}>
          <Text style={styles.portadaIntendente}>PABLO GRASSO</Text>
          <Text style={styles.portadaCargoIntendente}>INTENDENTE</Text>
          
          <View style={styles.portadaSeparador} />
          
          <Text style={styles.portadaSecretario}>DIEGO ROBLES</Text>
          <Text style={styles.portadaCargoSecretario}>JEFE DE GABINETE</Text>
          
          <View style={styles.portadaSeparador} />
          
          <Text style={styles.portadaSecretario}>SARA DELGADO</Text>
          <Text style={styles.portadaCargoSecretario}>SECRETARIA DE GOBIERNO</Text>
          
          <View style={styles.portadaSeparador} />
          
          <Text style={styles.portadaSecretario}>GONZALO CHUTE</Text>
          <Text style={styles.portadaCargoSecretario}>SECRETARIO DE LEGAL Y TÉCNICAaa</Text>
        </View>
      </View>
    </Page>
  );
};
