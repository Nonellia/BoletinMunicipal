// ============================================
// 1. TIPOS ACTUALIZADOS (types/Boletin.ts)
// ============================================
export interface BoletinPublicado {
  id: number;
  id_boletin: number;
  tipo_boletin: number;
  tipo_boletin_nombre?: string;
  fecha: string;
  fecha_publicacion: string;
  edicion: number;
  resumenes_count: number;
  categorias_principales: string[];
  accesible?: boolean;
  destacado?: boolean;
}

export interface TipoBoletin {
  id: number;
  nombre: string;
  observacion?: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  abreviatura: string;
}

export interface Resumen {
  id: number;
  id_boletin: number;
  id_categoria: number;
  fecha: string;
  contenido: string;
  categoria?: Categoria;
}
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