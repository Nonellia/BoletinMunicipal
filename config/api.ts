// config/api.ts
// Configuración centralizada de la API

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
  endpoints: {
    // Boletines publicados
    boletinesPublicados: '/publicados/boletines',
    boletinPublicado: (id: number) => `/publicados/boletin/${id}`,
    publicarBoletin: (boletinId: number) => `/publicados/boletin/${boletinId}`,
    despublicarBoletin: (publicadoId: number) => `/publicados/boletin/${publicadoId}`,
    
    // Resúmenes publicados
    resumenesPorBoletin: (publicadoId: number) => `/publicados/resumenes/boletin/${publicadoId}`,
    resumenesPorCategoria: (categoriaId: number) => `/publicados/resumenes/categoria/${categoriaId}`,
    
    // Boletines (originales)
    boletines: '/boletines/',
    boletin: (id: number) => `/boletines/${id}`,
    boletinCompleto: (id: number) => `/boletines/${id}/completo`,
    
    // Tipos de boletín
    tiposBoletin: '/tipos-boletin/',
    tipoBoletin: (id: number) => `/tipos-boletin/${id}`,
    
    // Categorías
    categorias: '/categorias/',
    categoria: (id: number) => `/categorias/${id}`,
    
    // Resúmenes
    resumenes: '/resumenes/',
    resumen: (id: number) => `/resumenes/${id}`,
  }
};

// Helper para construir URLs completas
export const buildURL = (endpoint: string) => {
  return `${API_CONFIG.baseURL}${endpoint}`;
};

// Helper para hacer requests
export const apiRequest = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const url = buildURL(endpoint);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// Tipos de datos
export interface TipoBoletin {
  id: number;
  nombre: string;
  observacion: string;
}

export interface CategoriaResumen {
  id: number;
  nombre: string;
  abreviatura: string;
}

export interface ResumenPublicado {
  id: number;
  id_publicado: number;
  contenido: string;
  fecha: string;
  id_categoria: number;
  categoria?: CategoriaResumen;
}

export interface BoletinPublicado {
  id: number;
  id_boletin: number;
  tipo_boletin: number;
  tipo_boletin_nombre?: string;
  fecha: string;
  fecha_publicacion: string;
  edicion: number;
  resumenes_publicados?: ResumenPublicado[];
  resumenes_count: number;
  categorias_principales: string[];
  accesible?: boolean;
}