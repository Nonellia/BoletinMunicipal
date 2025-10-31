'use client';
import React, { useState, useEffect } from 'react';
import { Search, FileText, BookOpen, Calendar, Filter, X, ChevronDown, ChevronRight, Download, Eye } from 'lucide-react';

export default function BibliotecaDocumentos() {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todos');
  const [anioFiltro, setAnioFiltro] = useState('todos');
  const [expandedDocs, setExpandedDocs] = useState(new Set());
  const [categorias, setCategorias] = useState([]);
  const [vista, setVista] = useState('documentos'); // 'documentos' o 'articulos'

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargar documentos
      const resDocumentos = await fetch('http://127.0.0.1:8000/documento/');
      const docsData = await resDocumentos.json();

      // Cargar artículos
      const resArticulos = await fetch('http://127.0.0.1:8000/articulo/');
      const articulosData = await resArticulos.json();

      // Cargar categorías
      const resCategorias = await fetch('http://127.0.0.1:8000/categoriadocumento/');
      const categoriasData = await resCategorias.json();
      setCategorias(categoriasData);

      // Cargar boletines para obtener información adicional
      const resBoletines = await fetch('http://127.0.0.1:8000/boletin/');
      const boletinesData = await resBoletines.json();

      // Asociar artículos a documentos y enriquecer con información
      const documentosCompletos = docsData.map(doc => {
        const boletin = boletinesData.find(b => b.id === doc.id_boletin);
        const categoria = categoriasData.find(c => c.id === doc.categoria_id);
        
        return {
          ...doc,
          articulos: articulosData.filter(art => art.documento_id === doc.id),
          boletin_info: boletin,
          categoria_info: categoria
        };
      });

      setDocumentos(documentosCompletos);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDocumento = (docId) => {
    const newExpanded = new Set(expandedDocs);
    if (newExpanded.has(docId)) {
      newExpanded.delete(docId);
    } else {
      newExpanded.add(docId);
    }
    setExpandedDocs(newExpanded);
  };

  // Filtrado de documentos
  const documentosFiltrados = documentos.filter(doc => {
    // Filtro de búsqueda
    const cumpleBusqueda = busqueda.trim() === '' || 
      doc.numero_documento?.toLowerCase().includes(busqueda.toLowerCase()) ||
      doc.numero_completo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      doc.contenido?.toLowerCase().includes(busqueda.toLowerCase()) ||
      doc.articulos?.some(art => 
        art.contenido?.toLowerCase().includes(busqueda.toLowerCase()) ||
        art.numero_articulo?.toLowerCase().includes(busqueda.toLowerCase())
      );

    // Filtro de categoría
    const cumpleCategoria = categoriaFiltro === 'todos' || 
      doc.categoria_id === parseInt(categoriaFiltro);

    // Filtro de año
    const cumpleAnio = anioFiltro === 'todos' || 
      doc.anio_publicacion === parseInt(anioFiltro);

    return cumpleBusqueda && cumpleCategoria && cumpleAnio;
  });

  // Obtener años únicos
  const aniosUnicos = [...new Set(documentos.map(d => d.anio_publicacion))].sort((a, b) => b - a);

  // Estadísticas
  const totalArticulos = documentos.reduce((sum, doc) => sum + (doc.articulos?.length || 0), 0);

  const limpiarFiltros = () => {
    setBusqueda('');
    setCategoriaFiltro('todos');
    setAnioFiltro('todos');
  };

  const resaltarTexto = (texto, query) => {
    if (!query.trim() || !texto) return texto;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const partes = texto.split(regex);
    
    return partes.map((parte, i) => 
      regex.test(parte) ? 
        <mark key={i} className="bg-yellow-200 px-1 rounded">{parte}</mark> : 
        parte
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📚 Biblioteca Municipal
          </h1>
          <p className="text-gray-600">
            Explora y busca en todos los documentos y artículos oficiales
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documentos</p>
                <p className="text-3xl font-bold text-blue-600">{documentos.length}</p>
              </div>
              <FileText className="w-12 h-12 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Artículos</p>
                <p className="text-3xl font-bold text-green-600">{totalArticulos}</p>
              </div>
              <BookOpen className="w-12 h-12 text-green-200" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resultados</p>
                <p className="text-3xl font-bold text-purple-600">{documentosFiltrados.length}</p>
              </div>
              <Filter className="w-12 h-12 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="space-y-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por número, contenido, artículos..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={categoriaFiltro}
                  onChange={(e) => setCategoriaFiltro(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todas las categorías</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año
                </label>
                <select
                  value={anioFiltro}
                  onChange={(e) => setAnioFiltro(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todos los años</option>
                  {aniosUnicos.map(anio => (
                    <option key={anio} value={anio}>{anio}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={limpiarFiltros}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Limpiar filtros
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de documentos */}
        <div className="space-y-4">
          {documentosFiltrados.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No se encontraron documentos
              </h3>
              <p className="text-gray-500">
                Intenta ajustar los filtros o la búsqueda
              </p>
            </div>
          ) : (
            documentosFiltrados.map(doc => (
              <div key={doc.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                {/* Header del documento */}
                <div
                  onClick={() => toggleDocumento(doc.id)}
                  className="p-6 cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {expandedDocs.has(doc.id) ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {resaltarTexto(doc.numero_completo || doc.numero_documento, busqueda)}
                        </h3>
                        {doc.categoria_info && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {doc.categoria_info.nombre}
                          </span>
                        )}
                      </div>
                      
                      <div className="ml-8 space-y-1 text-sm text-gray-600">
                        {doc.fecha_emision && (
                          <p className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(doc.fecha_emision).toLocaleDateString('es-AR')}
                          </p>
                        )}
                        {doc.boletin_info && (
                          <p>Boletín N° {doc.boletin_info.numero_edicion}</p>
                        )}
                        {doc.articulos && doc.articulos.length > 0 && (
                          <p className="flex items-center gap-2 text-green-600">
                            <BookOpen className="w-4 h-4" />
                            {doc.articulos.length} {doc.articulos.length === 1 ? 'artículo' : 'artículos'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contenido expandido */}
                {expandedDocs.has(doc.id) && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    {/* Contenido del documento */}
                    {doc.contenido && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Contenido:</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {resaltarTexto(doc.contenido, busqueda)}
                        </p>
                      </div>
                    )}

                    {/* Artículos */}
                    {doc.articulos && doc.articulos.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          Artículos ({doc.articulos.length})
                        </h4>
                        <div className="space-y-3">
                          {doc.articulos.map(articulo => (
                            <div
                              key={articulo.id}
                              className="bg-white rounded-lg p-4 border border-gray-200"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900">
                                    {resaltarTexto(articulo.numero_articulo || `Art. ${articulo.orden}`, busqueda)}
                                  </span>
                                  {articulo.tipo_articulo && (
                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                      {articulo.tipo_articulo}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {articulo.contenido && (
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {resaltarTexto(articulo.contenido, busqueda)}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Información adicional */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                      <div className="text-xs text-gray-500 space-y-1">
                        {doc.lugar_emision && <p>Lugar: {doc.lugar_emision}</p>}
                        {doc.estado && <p>Estado: {doc.estado}</p>}
                        {doc.paginas && <p>Páginas: {doc.paginas}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}