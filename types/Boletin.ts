// ============================================
// 1. TIPOS ACTUALIZADOS (types/Boletin.ts)
// ============================================

export interface BoletinPDF {
  id: number;
  numero_edicion: number;
  edicion: number;
  tipo_boletin: string;
  fecha_publicacion: string;
  estado: string;
}

export interface ArticuloPDF {
  id: number;
  numero: string;
  fecha: string;
  contenido: string;
  orden: number;
}

export interface CategoriaPDF {
  id: number;
  nombre: string;
  abreviatura: string;
  orden: number;
  articulos: ArticuloPDF[];
}

export interface PDFData {
  boletin: BoletinPDF;
  categorias: CategoriaPDF[];
  totalArticulos: number;
}

export interface ConfiguracionPDF {
  showPortada: boolean;
  showIndice: boolean;
  showCabecera: boolean;
  piePagina: string;
  logoPath?: string;
}