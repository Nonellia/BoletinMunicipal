// GenerarBoletinPDF.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import axios from 'axios';
import { 
  FiDownload, 
  FiLoader, 
  FiCheckCircle, 
  FiAlertCircle,
  FiSettings,
  FiEye,
  FiFileText,
  FiCalendar,
  FiTag
} from 'react-icons/fi';
import { BoletinCompletoPDF } from './pdf/BoletinCompletoPDF';
import ClientOnly from './ClientOnly';

const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
};

const api = axios.create(API_CONFIG);

interface GenerarBoletinPDFProps {
  boletinId: number;
}

interface PDFData {
  boletin: any;
  categorias: any[];
  totalResumenes: number;
  tipoBoletin?: string;
}

export const GenerarBoletinPDF: React.FC<GenerarBoletinPDFProps> = ({ boletinId }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PDFData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState({
    showPortada: true,
    showIndice: true,
    showCabecera: true,
    piePagina: "Página {pageNumber} • Boletín Oficial Municipal • Río Gallegos"
  });
  const [mostrarConfig, setMostrarConfig] = useState(false);
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);

  const formatFechaSegura = (fechaString: string): string => {
    if (!fechaString) return 'Fecha no disponible';
    try {
      const fecha = new Date(fechaString);
      fecha.setDate(fecha.getDate() + 1);
      if (isNaN(fecha.getTime())) return 'Fecha inválida';
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return 'Error en fecha';
    }
  };

  const cargarDatos = useCallback(async () => {
    if (!boletinId) {
      setError('No se proporcionó un ID de boletín');
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
                .filter((resumen: any) => resumen.id_categoria === categoria.id)
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
        throw new Error('No hay resúmenes para este boletín');
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
      setError(error.message || 'Error al cargar los datos para generar el PDF');
    } finally {
      setLoading(false);
    }
  }, [boletinId]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const nombreArchivo = data && data.boletin 
    ? `EDICION_${String(data.boletin.edicion).padStart(3, '0')}_BOLETIN_MUNICIPAL.pdf`
    : 'boletin.pdf';

  const paginasEstimadas = data 
    ? 1 + data.categorias.length + (config.showIndice ? 1 : 0)
    : 0;

  if (loading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <FiLoader className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
        <p className="text-gray-700 mb-2">Cargando datos del boletín...</p>
        <p className="text-sm text-gray-500">Preparando la generación del PDF</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <FiAlertCircle className="text-red-500 mt-0.5 mr-3" size={20} />
          <div className="flex-1">
            <h4 className="font-medium text-red-800">Error al cargar datos</h4>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button
              onClick={cargarDatos}
              className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm flex items-center gap-2"
            >
              <FiLoader />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.boletin) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <FiAlertCircle className="text-yellow-500 mx-auto mb-3" size={24} />
        <p className="text-yellow-700">No hay datos disponibles para este boletín</p>
        <p className="text-yellow-600 text-sm mt-1">Asegúrate de que el boletín tenga resúmenes</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Panel de configuración */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <button
          onClick={() => setMostrarConfig(!mostrarConfig)}
          className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center transition-colors"
        >
          <span className="font-medium text-gray-700 flex items-center gap-2">
            <FiSettings />
            Configuración del PDF
          </span>
          <span className={`transform transition-transform ${mostrarConfig ? 'rotate-180' : ''}`}>
            ↓
          </span>
        </button>
        
        {mostrarConfig && (
          <div className="p-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.showPortada}
                  onChange={(e) => setConfig({...config, showPortada: e.target.checked})}
                  className="rounded text-blue-600"
                />
                <span className="text-gray-700">Incluir Portada</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.showIndice}
                  onChange={(e) => setConfig({...config, showIndice: e.target.checked})}
                  className="rounded text-blue-600"
                />
                <span className="text-gray-700">Incluir Sumario</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.showCabecera}
                  onChange={(e) => setConfig({...config, showCabecera: e.target.checked})}
                  className="rounded text-blue-600"
                />
                <span className="text-gray-700">Cabecera en páginas</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Resumen del PDF */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
        <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
          <FiCheckCircle />
          Resumen del PDF a generar
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">{data.categorias.length}</div>
            <div className="text-sm text-blue-600 flex items-center justify-center gap-1">
              <FiTag size={12} />
              Categorías
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">{data.totalResumenes}</div>
            <div className="text-sm text-green-600 flex items-center justify-center gap-1">
              <FiFileText size={12} />
              Resúmenes
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-700">{paginasEstimadas}</div>
            <div className="text-sm text-purple-600">Páginas estimadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-700">
              {data.boletin.edicion}
            </div>
            <div className="text-sm text-cyan-600">Edición</div>
          </div>
        </div>
      </div>

      {/* Información del boletín */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
        <h4 className="font-medium text-gray-700 mb-3">Información del boletín:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-500">Número de Edición:</div>
            <div className="font-semibold text-blue-800">{data.boletin.edicion}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Tipo:</div>
            <div className="font-semibold text-blue-800">{data.tipoBoletin}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Fecha:</div>
            <div className="font-semibold text-blue-800">
              {formatFechaSegura(data.boletin.fecha)}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de categorías incluidas */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h4 className="font-medium text-gray-700 mb-3">Categorías incluidas:</h4>
        <div className="space-y-2">
          {data.categorias.map((categoria) => (
            <div key={categoria.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <div>
                <span className="font-medium text-gray-800">{categoria.nombre}</span>
                <span className="ml-2 text-sm text-gray-500">
                  ({categoria.abreviatura})
                </span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                {categoria.resumenes?.length || 0} resúmenes
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ClientOnly>
          <PDFDownloadLink
            document={
              <BoletinCompletoPDF 
                data={data}
                config={config}
              />
            }
            fileName={nombreArchivo}
            className="block"
          >
            {({ loading: pdfLoading }) => (
              <button
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  pdfLoading
                    ? 'bg-blue-400 text-white cursor-wait'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:opacity-90'
                }`}
                disabled={pdfLoading}
              >
                {pdfLoading ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Generando PDF...
                  </>
                ) : (
                  <>
                    <FiDownload />
                    Descargar PDF
                  </>
                )}
              </button>
            )}
          </PDFDownloadLink>
        </ClientOnly>

        <button
          onClick={() => setMostrarVistaPrevia(!mostrarVistaPrevia)}
          className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <FiEye />
          {mostrarVistaPrevia ? 'Ocultar' : 'Ver'} Vista Previa
        </button>
      </div>

      {/* Vista previa */}
      {mostrarVistaPrevia && (
        <ClientOnly>
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden" style={{ height: '600px' }}>
            <PDFViewer width="100%" height="100%">
              <BoletinCompletoPDF 
                data={data}
                config={config}
              />
            </PDFViewer>
          </div>
        </ClientOnly>
      )}

      {/* Notas informativas */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          El archivo se descargará como:{' '}
          <span className="font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
            {nombreArchivo}
          </span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          PDF generado con contenido actualizado al momento de la descarga
        </p>
      </div>
    </div>
  );
};