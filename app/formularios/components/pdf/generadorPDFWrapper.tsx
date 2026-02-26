'use client';

import React, { useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { BoletinCompletoPDF } from './BoletinCompletoPDF';
import type { PDFData, ConfiguracionPDF } from '@/types/Boletin';
import { FiDownload, FiEye, FiPrinter, FiSettings } from 'react-icons/fi';

interface GeneradorPDFWrapperProps {
  datosIniciales: PDFData;
  nombreArchivo?: string;
}

export const GeneradorPDFWrapper: React.FC<GeneradorPDFWrapperProps> = ({
  datosIniciales,
  nombreArchivo = `boletin_${datosIniciales.boletin.numero_edicion}.pdf`
}) => {
  const [config, setConfig] = useState<ConfiguracionPDF>({
    showPortada: true,
    showIndice: true,
    showCabecera: true,
    piePagina: "Página {pageNumber} • Boletín Oficial Municipal • Río Gallegos",
    logoPath: "/municipio-logo.png"
  });
  
  const [modoVista, setModoVista] = useState<'config' | 'vista'>('config');
  
  const configuracionAvanzada = {
    tamanoPagina: 'A4' as const,
    orientacion: 'portrait' as const,
    margenes: {
      top: 50,
      right: 40,
      bottom: 50,
      left: 40
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Generador de Boletín PDF
          </h1>
          <p className="text-gray-600 mt-2">
            Edición N° {datosIniciales.boletin.numero_edicion} • {datosIniciales.boletin.tipo_boletin}
          </p>
        </div>
        
        {/* Panel de control */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Configuración del PDF
            </h2>
            
            <div className="flex gap-4">
              <button
                onClick={() => setModoVista('config')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  modoVista === 'config' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiSettings />
                Configuración
              </button>
              
              <button
                onClick={() => setModoVista('vista')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  modoVista === 'vista' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiEye />
                Vista Previa
              </button>
            </div>
          </div>
          
          {modoVista === 'config' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Configuraciones */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Opciones de Contenido</h3>
                
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
                  <span className="text-gray-700">Incluir Índice</span>
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
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Texto del Pie de Página</h3>
                <textarea
                  value={config.piePagina}
                  onChange={(e) => setConfig({...config, piePagina: e.target.value})}
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Texto del pie de página..."
                />
                <p className="text-sm text-gray-500">
                  Usa {"{pageNumber}"} para insertar el número de página
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Estadísticas</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categorías:</span>
                    <span className="font-semibold text-blue-600">
                      {datosIniciales.categorias.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resúmenes:</span>
                    <span className="font-semibold text-green-600">
                      {datosIniciales.totalResumenes}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Páginas estimadas:</span>
                    <span className="font-semibold text-purple-600">
                      {1 + (config.showIndice ? 1 : 0) + datosIniciales.categorias.length + datosIniciales.totalResumenes}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Acciones</h3>
                
                <PDFDownloadLink
                  document={
                    <BoletinCompletoPDF 
                      data={datosIniciales}
                      config={config}
                    />
                  }
                  fileName={nombreArchivo}
                  className="block"
                >
                  {({ loading }) => (
                    <button
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
                      disabled={loading}
                    >
                      <FiDownload />
                      {loading ? 'Generando PDF...' : 'Descargar PDF'}
                    </button>
                  )}
                </PDFDownloadLink>
                
                <button
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
                  onClick={() => window.print()}
                >
                  <FiPrinter />
                  Imprimir Directamente
                </button>
              </div>
            </div>
          ) : (
            /* Vista previa */
            <div className="h-[600px] border-2 border-gray-300 rounded-lg overflow-hidden">
              <PDFViewer width="100%" height="100%">
                <BoletinCompletoPDF 
                  data={datosIniciales}
                  config={config}
                />
              </PDFViewer>
            </div>
          )}
        </div>
        
        {/* Resumen de datos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Información del Boletín</h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600">Número de Edición:</span>
                <span className="ml-2 font-semibold text-blue-600">
                  {datosIniciales.boletin.numero_edicion}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Tipo:</span>
                <span className="ml-2 font-semibold text-green-600">
                  {datosIniciales.boletin.tipo_boletin}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Fecha:</span>
                <span className="ml-2 font-semibold text-purple-600">
                  {new Date(datosIniciales.boletin.fecha_publicacion).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Distribución por Categoría</h3>
            <div className="space-y-3">
              {datosIniciales.categorias.map((categoria) => (
                <div key={categoria.id} className="flex justify-between items-center">
                  <span className="text-gray-700">{categoria.nombre}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {categoria.resumenes.length} resúmenes
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Vista Previa Rápida</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="h-3 bg-blue-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
              <p className="text-sm text-gray-600">
                El PDF incluirá: 
                {config.showPortada && ' ✓ Portada'} 
                {config.showIndice && ' ✓ Índice'} 
                {' ✓ Secciones por categoría'} 
                {' ✓ Resúmenes individuales'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};