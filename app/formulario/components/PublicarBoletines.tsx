'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  FiUpload, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiTrash2,
  FiEye,
  FiCalendar,
  FiFileText,
  FiLayers,
  FiRefreshCw,
  FiDownload
} from 'react-icons/fi';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default function PublicarBoletines() {
  const [boletines, setBoletines] = useState([]);
  const [boletinesPublicados, setBoletinesPublicados] = useState([]);
  const [tiposBoletin, setTiposBoletin] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPublicar, setLoadingPublicar] = useState(null);
  const [loadingDespublicar, setLoadingDespublicar] = useState(null);
  const [error, setError] = useState(null);
  const [boletinDetalle, setBoletinDetalle] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [boletinesRes, publicadosRes, tiposRes] = await Promise.all([
        api.get('/boletines/'),
        api.get('/publicados/boletines'),
        api.get('/tipos-boletin/')
      ]);

      setBoletines(Array.isArray(boletinesRes.data) ? boletinesRes.data : []);
      setBoletinesPublicados(Array.isArray(publicadosRes.data) ? publicadosRes.data : []);
      setTiposBoletin(Array.isArray(tiposRes.data) ? tiposRes.data : []);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error al cargar los datos. Verifica la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerDetallePublicado = async (publicadoId) => {
    try {
      const response = await api.get(`/publicados/boletin/${publicadoId}`);
      setBoletinDetalle(response.data);
      setMostrarDetalle(true);
    } catch (error) {
      console.error('Error obteniendo detalle:', error);
      alert('Error al cargar el detalle del boletín');
    }
  };

  const publicarBoletin = async (boletinId) => {
    if (!confirm('¿Estás seguro de publicar este boletín?')) return;
    
    setLoadingPublicar(boletinId);
    setError(null);
    
    try {
      await api.post(`/publicados/boletin/${boletinId}`);
      alert('✅ Boletín publicado exitosamente');
      cargarDatos();
    } catch (error) {
      console.error('Error publicando boletín:', error);
      const mensaje = error.response?.data?.detail || 'Error al publicar el boletín';
      alert('❌ ' + mensaje);
      setError(mensaje);
    } finally {
      setLoadingPublicar(null);
    }
  };

  const despublicarBoletin = async (publicadoId) => {
    if (!confirm('¿Estás seguro de despublicar este boletín? Se eliminará de la tabla de publicados pero el boletín original se mantendrá.')) return;
    
    setLoadingDespublicar(publicadoId);
    setError(null);
    
    try {
      await api.delete(`/publicados/boletin/${publicadoId}`);
      alert('🗑️ Boletín despublicado exitosamente');
      cargarDatos();
      if (boletinDetalle?.id === publicadoId) {
        setMostrarDetalle(false);
        setBoletinDetalle(null);
      }
    } catch (error) {
      console.error('Error despublicando boletín:', error);
      alert('Error al despublicar el boletín');
      setError('Error al despublicar el boletín');
    } finally {
      setLoadingDespublicar(null);
    }
  };

  const getTipoNombre = (tipoId) => {
    const tipo = tiposBoletin.find(t => t.id === tipoId);
    return tipo?.nombre || 'Sin tipo';
  };

  const formatFecha = (fechaString) => {
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return 'Fecha inválida';
    }
  };

  const estaPublicado = (boletinId) => {
    return boletinesPublicados.some(pub => pub.id_boletin === boletinId);
  };

  const getIdPublicado = (boletinId) => {
    const publicado = boletinesPublicados.find(pub => pub.id_boletin === boletinId);
    return publicado?.id;
  };

  if (loading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <FiRefreshCw className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
        <p className="text-gray-700">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FiUpload className="text-purple-600" />
            Publicar Boletines
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Gestiona la publicación de boletines al sistema oficial
          </p>
        </div>
        <button
          onClick={cargarDatos}
          disabled={loading}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          Actualizar
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <FiAlertCircle className="text-red-500 mt-0.5 mr-3" size={20} />
            <div>
              <h4 className="font-medium text-red-800">Error</h4>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Boletines Totales</p>
              <p className="text-3xl font-bold mt-2">{boletines.length}</p>
            </div>
            <FiFileText size={32} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Publicados</p>
              <p className="text-3xl font-bold mt-2">{boletinesPublicados.length}</p>
            </div>
            <FiCheckCircle size={32} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pendientes</p>
              <p className="text-3xl font-bold mt-2">
                {boletines.length - boletinesPublicados.length}
              </p>
            </div>
            <FiUpload size={32} className="opacity-80" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Boletines para publicar */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiFileText className="text-blue-600" />
            Boletines Disponibles
          </h3>

          {boletines.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FiFileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No hay boletines disponibles</p>
              <p className="text-sm text-gray-400 mt-1">Crea un boletín primero</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {boletines.map((boletin) => {
                const publicado = estaPublicado(boletin.id);
                const publicadoId = getIdPublicado(boletin.id);
                
                return (
                  <div 
                    key={boletin.id} 
                    className={`border rounded-lg p-4 transition-all ${
                      publicado 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start gap-2">
                          <h4 className="font-semibold text-gray-800">
                            {getTipoNombre(boletin.tipo_boletin)}
                          </h4>
                          {publicado && (
                            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full flex items-center gap-1">
                              <FiCheckCircle size={12} />
                              Publicado
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <FiCalendar size={14} />
                            {formatFecha(boletin.fecha)}
                          </p>
                          <p className="text-sm text-blue-600 font-medium flex items-center gap-1">
                            <FiLayers size={14} />
                            Edición N° {boletin.edicion}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        {publicado ? (
                          <>
                            <button
                              onClick={() => obtenerDetallePublicado(publicadoId)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Ver detalle"
                            >
                              <FiEye />
                            </button>
                            <button
                              onClick={() => despublicarBoletin(publicadoId)}
                              disabled={loadingDespublicar === publicadoId}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                              title="Despublicar"
                            >
                              {loadingDespublicar === publicadoId ? (
                                <FiRefreshCw className="animate-spin" />
                              ) : (
                                <FiTrash2 />
                              )}
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => publicarBoletin(boletin.id)}
                            disabled={loadingPublicar === boletin.id}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                            title="Publicar"
                          >
                            {loadingPublicar === boletin.id ? (
                              <>
                                <FiRefreshCw className="animate-spin" />
                                Publicando...
                              </>
                            ) : (
                              <>
                                <FiUpload />
                                Publicar
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Boletines publicados */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiCheckCircle className="text-green-600" />
            Boletines Publicados
          </h3>

          {boletinesPublicados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FiCheckCircle size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No hay boletines publicados</p>
              <p className="text-sm text-gray-400 mt-1">Publica tu primer boletín</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {boletinesPublicados
                .sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion))
                .map((publicado) => (
                  <div 
                    key={publicado.id} 
                    className="border border-green-200 rounded-lg p-4 bg-green-50 hover:bg-green-100 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">
                          {getTipoNombre(publicado.tipo_boletin)}
                        </h4>
                        
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">
                            📅 {formatFecha(publicado.fecha)}
                          </p>
                          <p className="text-sm text-blue-600 font-medium">
                            Edición N° {publicado.edicion}
                          </p>
                          <p className="text-xs text-green-700">
                            Publicado: {new Date(publicado.fecha_publicacion).toLocaleString('es-ES')}
                          </p>
                        </div>

                        <div className="mt-2 flex gap-2">
                          <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded">
                            ID Original: {publicado.id_boletin}
                          </span>
                          <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded">
                            ID Publicado: {publicado.id}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => obtenerDetallePublicado(publicado.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Ver detalle"
                        >
                          <FiEye />
                        </button>
                        <button
                          onClick={() => despublicarBoletin(publicado.id)}
                          disabled={loadingDespublicar === publicado.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          title="Despublicar"
                        >
                          {loadingDespublicar === publicado.id ? (
                            <FiRefreshCw className="animate-spin" />
                          ) : (
                            <FiTrash2 />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalle */}
      {mostrarDetalle && boletinDetalle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">
                Detalle del Boletín Publicado
              </h3>
              <button
                onClick={() => {
                  setMostrarDetalle(false);
                  setBoletinDetalle(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FiFileText className="text-gray-600" size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Información general */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 mb-1">ID Publicado</p>
                  <p className="text-xl font-bold text-blue-800">{boletinDetalle.id}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 mb-1">ID Original</p>
                  <p className="text-xl font-bold text-green-800">{boletinDetalle.id_boletin}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600 mb-1">Edición</p>
                  <p className="text-xl font-bold text-purple-800">{boletinDetalle.edicion}</p>
                </div>
                <div className="p-4 bg-pink-50 rounded-lg">
                  <p className="text-sm text-pink-600 mb-1">Resúmenes</p>
                  <p className="text-xl font-bold text-pink-800">
                    {boletinDetalle.resumenes_publicados?.length || 0}
                  </p>
                </div>
              </div>

              {/* Fechas */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Fechas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Fecha del Boletín</p>
                    <p className="font-medium text-gray-800">{formatFecha(boletinDetalle.fecha)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Publicación</p>
                    <p className="font-medium text-gray-800">
                      {new Date(boletinDetalle.fecha_publicacion).toLocaleString('es-ES')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Resúmenes publicados */}
              {boletinDetalle.resumenes_publicados && boletinDetalle.resumenes_publicados.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Resúmenes Publicados ({boletinDetalle.resumenes_publicados.length})
                  </h4>
                  <div className="space-y-3">
                    {boletinDetalle.resumenes_publicados.map((resumen, index) => (
                      <div key={resumen.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-gray-800">
                            {resumen.categoria?.nombre || 'Sin categoría'}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {resumen.categoria?.abreviatura}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          📅 {formatFecha(resumen.fecha)}
                        </p>
                        <div 
                          className="mt-2 text-sm text-gray-700 line-clamp-2"
                          dangerouslySetInnerHTML={{ 
                            __html: resumen.contenido?.replace(/<[^>]+>/g, ' ').substring(0, 150) + '...'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón cerrar */}
              <button
                onClick={() => {
                  setMostrarDetalle(false);
                  setBoletinDetalle(null);
                }}
                className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}