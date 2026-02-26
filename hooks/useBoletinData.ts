import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://funcionlog.mrg-pruebas.site',
  timeout: 10000,
};

const api = axios.create(API_CONFIG);

export interface PDFData {
  boletin: any;
  categorias: any[];
  totalResumenes: number;
  tipoBoletin?: string;
}

interface UseBoletinDataResult {
  loading: boolean;
  error: string | null;
  data: PDFData | null;
  fetchData: () => Promise<void>;
}

export const useBoletinData = (boletinId: number | null): UseBoletinDataResult => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PDFData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!boletinId) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Obtener datos del boletín
      const boletinRes = await api.get(`/boletines/${boletinId}`);
      const boletin = boletinRes.data;
      
      if (!boletin || !boletin.id) {
        throw new Error('Boletín no encontrado');
      }

      // Obtener tipo de boletín
      let tipoBoletin = 'Sin tipo';
      try {
        const tipoRes = await api.get(`/tipos-boletin/${boletin.tipo_boletin}`);
        tipoBoletin = tipoRes.data?.nombre || 'Sin tipo';
      } catch (err) {
        console.warn('No se pudo obtener el tipo de boletín');
      }

      // Obtener todas las categorías y resúmenes
      const [categoriasRes, resumenesRes] = await Promise.all([
        api.get('/categorias/'),
        api.get(`/resumenes/?id_boletin=${boletinId}`)
      ]);

      const resumenes = Array.isArray(resumenesRes.data) ? resumenesRes.data : [];
      
      // Agrupar resúmenes por categoría
      const categorias = Array.isArray(categoriasRes.data) 
        ? categoriasRes.data
            .map((categoria: any) => ({
              ...categoria,
              resumenes: resumenes
                .filter((resumen: any) => resumen.id_categoria === categoria.id && resumen.id_boletin === parseInt(boletinId.toString()))
                .sort((a: any, b: any) => {
                  // Intentar ordenar por número si existe en el contenido
                  const numA = a.contenido?.match(/N°\s*(\d+)/)?.[1];
                  const numB = b.contenido?.match(/N°\s*(\d+)/)?.[1];
                  if (numA && numB) {
                    return parseInt(numA) - parseInt(numB);
                  }
                  return 0;
                })
            }))
            .filter((categoria: any) => categoria.resumenes.length > 0)
        : [];

      if (categorias.length === 0) {
        // No lanzamos error aquí para permitir ver la "carcasa" del boletín aunque esté vacío de resúmenes, 
        // pero puedes descomentarlo si prefieres estricto.
        // throw new Error('No hay resúmenes para este boletín');
      }

      setData({
        boletin: {
          ...boletin,
          edicion: boletin.edicion || 1,
          fecha: boletin.fecha || new Date().toISOString()
        },
        categorias,
        totalResumenes: resumenes.length,
        tipoBoletin
      });

    } catch (error: any) {
      console.error('Error cargando datos:', error);
      setError(error.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, [boletinId]);

  useEffect(() => {
    if (boletinId) {
      fetchData();
    }
  }, [fetchData, boletinId]);

  return { loading, error, data, fetchData };
};
