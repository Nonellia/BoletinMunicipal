'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  FiFileText, 
  FiTag, 
  FiBarChart2, 
  FiDownload, 
  FiChevronDown,
  FiLoader,
  FiAlertTriangle,
  FiRefreshCw,
  FiServer,
  FiCalendar,
  FiType,
  FiLayers
} from 'react-icons/fi';
import axios from 'axios';
import { GenerarBoletinPDF } from './GenerarBoletinPDF';
import ClientOnly from './ClientOnly';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default function Dashboard() {
  const [stats, setStats] = useState({
    tiposBoletin: 0,
    boletines: 0,
    categorias: 0,
    resumenes: 0
  });
  const [boletines, setBoletines] = useState([]);
  const [tiposBoletin, setTiposBoletin] = useState([]);
  const [boletinSeleccionado, setBoletinSeleccionado] = useState(null);
  const [mostrarGenerador, setMostrarGenerador] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cargandoBoletines, setCargandoBoletines] = useState(false);
  const [errorConexion, setErrorConexion] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  const fetchStats = useCallback(async () => {
    try {
      const [tiposRes, boletinesRes, categoriasRes, resumenesRes] = await Promise.all([
        api.get('/tipos-boletin/'),
        api.get('/boletines/'),
        api.get('/categorias/'),
        api.get('/resumenes/')
      ]);

      setStats({
        tiposBoletin: tiposRes.data?.length || 0,
        boletines: boletinesRes.data?.length || 0,
        categorias: categoriasRes.data?.length || 0,
        resumenes: resumenesRes.data?.length || 0
      });
      setErrorConexion(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setErrorConexion(true);
      setMensajeError(error.message || 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBoletines = useCallback(async () => {
    setCargandoBoletines(true);
    setErrorConexion(false);
    
    try {
      const [boletinesRes, tiposRes] = await Promise.all([
        api.get('/boletines/'),
        api.get('/tipos-boletin/')
      ]);
      
      const boletinesData = Array.isArray(boletinesRes.data) ? boletinesRes.data : [];
      setTiposBoletin(Array.isArray(tiposRes.data) ? tiposRes.data : []);
      
      // Ordenar boletines por fecha (más reciente primero)
      const boletinesOrdenados = boletinesData.sort((a, b) => {
        const fechaA = new Date(a.fecha);
        const fechaB = new Date(b.fecha);
        return fechaB.getTime() - fechaA.getTime();
      });
      
      setBoletines(boletinesOrdenados);
      
      if (boletinesOrdenados.length > 0) {
        setBoletinSeleccionado(boletinesOrdenados[0]);
      } else {
        setBoletinSeleccionado(null);
      }
    } catch (error) {
      console.error('Error fetching boletines:', error);
      setErrorConexion(true);
      setMensajeError(error.message || 'Error al cargar los boletines');
      setBoletines([]);
      setBoletinSeleccionado(null);
    } finally {
      setCargandoBoletines(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchBoletines();
  }, [fetchStats, fetchBoletines]);

  const StatCard = ({ title, value, icon: Icon, color, onClick }) => (
    <div 
      className={`p-6 rounded-xl shadow-lg ${color} text-white transition-transform hover:scale-105 cursor-pointer ${onClick ? 'hover:shadow-xl' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">{loading ? '...' : value}</p>
        </div>
        <Icon size={32} className="opacity-80" />
      </div>
    </div>
  );

  const handleReintentarConexion = () => {
    setErrorConexion(false);
    setMensajeError('');
    fetchStats();
    fetchBoletines();
  };

  const getTipoNombre = (tipoId) => {
    const tipo = tiposBoletin.find(t => t.id === tipoId);
    return tipo?.nombre || 'Sin tipo';
  };

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Panel de Control</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMostrarGenerador(!mostrarGenerador)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              mostrarGenerador 
                ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FiDownload />
            {mostrarGenerador ? 'Ocultar Generador' : 'Generar PDF'}
            <FiChevronDown className={`transition-transform ${mostrarGenerador ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mensaje de error de conexión */}
      {errorConexion && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <FiAlertTriangle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
            <div className="flex-1">
              <h4 className="font-medium text-red-800">Error de conexión</h4>
              <p className="text-red-600 text-sm mt-1">{mensajeError}</p>
              <div className="mt-3 flex gap-3">
                <button
                  onClick={handleReintentarConexion}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm flex items-center gap-2"
                >
                  <FiRefreshCw />
                  Reintentar conexión
                </button>
                <button
                  onClick={() => window.open(API_URL, '_blank')}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm flex items-center gap-2"
                >
                  <FiServer />
                  Verificar servidor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sección de Generador de PDF */}
      {mostrarGenerador && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FiDownload className="text-blue-600" />
              Generar Boletín PDF
            </h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
              Selecciona un boletín
            </span>
          </div>

          <div className="space-y-6">
            {/* Selector de Boletín */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Boletín para Generar PDF:
              </label>
              <div className="relative">
                {cargandoBoletines ? (
                  <div className="flex items-center justify-center p-4 border border-gray-300 rounded-lg bg-gray-50">
                    <FiLoader className="animate-spin text-gray-400 mr-2" />
                    <span className="text-gray-600">Cargando boletines...</span>
                  </div>
                ) : errorConexion ? (
                  <div className="p-4 border border-red-300 rounded-lg bg-red-50">
                    <p className="text-red-700">No se pueden cargar los boletines</p>
                    <p className="text-sm text-red-600 mt-1">Verifica la conexión con el servidor</p>
                  </div>
                ) : boletines.length === 0 ? (
                  <div className="p-4 border border-gray-300 rounded-lg bg-yellow-50 text-center">
                    <p className="text-yellow-700">No hay boletines disponibles</p>
                    <p className="text-sm text-yellow-600 mt-1">
                      Crea primero un boletín en la sección correspondiente
                    </p>
                  </div>
                ) : (
                  <>
                    <select
                      value={boletinSeleccionado?.id || ''}
                      onChange={(e) => {
                        const selected = boletines.find(b => b.id === parseInt(e.target.value));
                        if (selected) {
                          setBoletinSeleccionado(selected);
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                    >
                      <option value="">Seleccionar boletín...</option>
                      {boletines.map((boletin) => (
                        <option key={boletin.id} value={boletin.id}>
                          {getTipoNombre(boletin.tipo_boletin)} - Edición N° {boletin.edicion} 
                          {' '}({new Date(boletin.fecha).toLocaleDateString('es-ES')})
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </>
                )}
              </div>
            </div>

            {/* Información del boletín seleccionado */}
            {boletinSeleccionado && !errorConexion && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                  <FiFileText />
                  Información del Boletín Seleccionado:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-blue-600 mb-1">
                      <FiLayers size={14} />
                      Número de Edición:
                    </div>
                    <p className="font-semibold text-lg text-blue-800">
                      {boletinSeleccionado.edicion || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-blue-600 mb-1">
                      <FiType size={14} />
                      Tipo:
                    </div>
                    <p className="font-semibold text-lg text-blue-800">
                      {getTipoNombre(boletinSeleccionado.tipo_boletin)}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-blue-600 mb-1">
                      <FiCalendar size={14} />
                      Fecha:
                    </div>
                    <p className="font-semibold text-lg text-blue-800">
                      {new Date(boletinSeleccionado.fecha).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Componente Generador de PDF */}
            {boletinSeleccionado && !errorConexion && (
              <ClientOnly>
                <GenerarBoletinPDF 
                  boletinId={boletinSeleccionado.id} 
                />
              </ClientOnly>
            )}
          </div>
        </div>
      )}

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Tipos de Boletín" 
          value={errorConexion ? '?' : stats.tiposBoletin} 
          icon={FiLayers}
          color={errorConexion ? "bg-gradient-to-r from-gray-400 to-gray-500" : "bg-blue-500 from-indigo-500 to-purple-500"}
        />
        <StatCard 
          title="Boletines Totales" 
          value={errorConexion ? '?' : stats.boletines} 
          icon={FiFileText}
          color={errorConexion ? "bg-gradient-to-r from-gray-400 to-gray-500" : "bg-blue-500 from-blue-500 to-cyan-500"}
          onClick={() => setMostrarGenerador(true)}
        />
        <StatCard 
          title="Categorías" 
          value={errorConexion ? '?' : stats.categorias} 
          icon={FiTag}
          color={errorConexion ? "bg-gradient-to-r from-gray-400 to-gray-500" : "bg-blue-500 from-green-500 to-emerald-500"}
        />
        <StatCard 
          title="Resúmenes" 
          value={errorConexion ? '?' : stats.resumenes} 
          icon={FiBarChart2}
          color={errorConexion ? "bg-gradient-to-r from-gray-400 to-gray-500" : "bg-blue-500 from-purple-500 to-pink-500"}
        />
      </div>

      {/* Sección inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Guía Rápida */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Guía Rápida</h3>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
              <h4 className="font-medium text-indigo-600 mb-2 flex items-center gap-2">
                1. Crear Tipos de Boletín
              </h4>
              <p className="text-gray-600 text-sm">
                Define los tipos (Ordinario, Extraordinario, etc.) antes de crear boletines
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <h4 className="font-medium text-blue-600 mb-2 flex items-center gap-2">
                2. Crear Boletines
              </h4>
              <p className="text-gray-600 text-sm">
                Registra boletines con número de edición, tipo y fecha
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
              <h4 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                3. Agregar Resúmenes
              </h4>
              <p className="text-gray-600 text-sm">
                Asigna resúmenes a categorías usando el editor WYSIWYG
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
              <h4 className="font-medium text-purple-600 mb-2 flex items-center gap-2">
                4. Generar PDF
              </h4>
              <p className="text-gray-600 text-sm">
                Selecciona un boletín y descarga el PDF organizado por categorías
              </p>
            </div>
          </div>
        </div>

        {/* Lista de boletines recientes */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Boletines Recientes</h3>
            <button 
              onClick={fetchBoletines}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              disabled={cargandoBoletines}
            >
              <FiRefreshCw className={cargandoBoletines ? 'animate-spin' : ''} />
              Actualizar
            </button>
          </div>
          
          {errorConexion ? (
            <div className="text-center py-8">
              <FiAlertTriangle className="text-yellow-500 mx-auto mb-3" size={32} />
              <p className="text-yellow-700">No se puede conectar al servidor</p>
              <p className="text-yellow-600 text-sm mt-1">Verifica que el backend esté ejecutándose</p>
            </div>
          ) : cargandoBoletines ? (
            <div className="text-center py-8">
              <FiLoader className="animate-spin text-gray-400 mx-auto mb-2" size={24} />
              <p className="text-gray-500">Cargando boletines...</p>
            </div>
          ) : boletines.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FiFileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No hay boletines registrados</p>
              <p className="text-sm text-gray-400 mt-1">Crea tu primer boletín</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {boletines.slice(0, 5).map((boletin) => (
                <div 
                  key={boletin.id} 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    boletinSeleccionado?.id === boletin.id
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onClick={() => {
                    setBoletinSeleccionado(boletin);
                    setMostrarGenerador(true);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {getTipoNombre(boletin.tipo_boletin)}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-blue-600 font-medium">
                          Edición N° {boletin.edicion}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(boletin.fecha).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setBoletinSeleccionado(boletin);
                        setMostrarGenerador(true);
                      }}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1"
                    >
                      <FiDownload size={14} />
                      PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!errorConexion && boletines.length > 5 && (
            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Mostrando 5 de {boletines.length} boletines
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}