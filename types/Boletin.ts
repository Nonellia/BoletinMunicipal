export type Boletin = {
  id: string;
  numero?: string;
  titulo?: string;
  descripcion?: string;
  fecha: string;
  fecha_publicacion?: string;
  // fecha_creacion?: string;
  categoria: string;
  archivoUrl?: string;
  archivo?: string;
  formatos?: string[];
  destacado?: boolean;
  accesible?: boolean;
  storagePath?: string;
}
export interface Documento {
  id: number;
  numero_documento: number;
  numero_completo: string;
  fecha_emision?: string;
  lugar_emision?: string;
  estado?: string;
  paginas?: string;
  contenido?: string;
  id_boletin: number;
  articulos?: Articulo[];
  categoria?: string;
}

export interface ConfiguracionPDF {
  portadaTitulo: string;
  portadaSubtitulo: string;
  cabecera: string;
  piePagina: string;
  showPortada: boolean;
  showIndice: boolean;
}

export interface Articulo {
  id: number;
  documento_id: number;
  contenido: string;
  numero_articulo?: string;
  tipo_articulo?: string;
  titulo?: string;
  prefijo?: string;
  // otros campos si es necesario
}

interface PreviewSectionProps {
  showPreview: boolean;
  selectedBoletin: Boletin | null;
  config: ConfiguracionPDF;
  selectedDocsData: Documento[];
  articulos: Articulo[]; // <-- agrega esto
}