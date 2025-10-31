"use client";
import React, { useEffect, useState } from "react";
import { Spinner } from "@heroui/spinner";
import { BoletinCard } from "./BoletinCard";
import type { Boletin } from "@/types/Boletin";
import { FiltersSidebar } from "./filterSidebar";
import { SearchBar } from "./SearchBar";
import { useBoletinesFilter } from "@/hooks/useBoletinesFilter";
import { ResultsHeader } from "./ResultsHeader";
import { YearTabs } from "./YearsTab";
import { SearchMatchDisplay } from "./SearchMatchDisplay";
import { Pagination } from "./paginationComp";

export default function BoletinList() {
  const [boletines, setBoletines] = useState<Boletin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [orden, setOrden] = useState("fecha-desc");

  // Hook de filtrado
  const {
    busqueda,
    setBusqueda,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    soloAccesibles,
    setSoloAccesibles,
    tabActivo,
    setTabActivo,
    boletinesFiltrados,
    clearFilters,
  } = useBoletinesFilter(boletines, fechaSeleccionada, orden);

  // Estado de paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [busqueda, tabActivo, fechaSeleccionada, orden, boletines.length]);

  const totalItems = boletinesFiltrados.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedBoletines = boletinesFiltrados.slice(startIndex, startIndex + pageSize);

  // Carga inicial de boletines
  useEffect(() => {
    const fetchBoletines = async () => {
      setLoading(true);
      setError(null);

      try {
        const resBoletines = await fetch("http://127.0.0.1:8000/boletin/");
        if (!resBoletines.ok) throw new Error("Error al cargar boletines");
        const boletinesData: Boletin[] = await resBoletines.json();

        const boletinesConContenido = await Promise.all(
          boletinesData.map(async (boletin) => {
            try {
              const resDocumentos = await fetch(
                `http://127.0.0.1:8000/documento/?id_boletin=${boletin.id}`
              );
              const documentos = resDocumentos.ok ? await resDocumentos.json() : [];

              const resArticulos = await fetch(
                `http://127.0.0.1:8000/articulo/?id_boletin=${boletin.id}`
              );
              const articulos = resArticulos.ok ? await resArticulos.json() : [];

              const documentosConArticulos = documentos.map((doc: any) => ({
                ...doc,
                articulos: articulos.filter((art: any) => art.documento_id === doc.id),
              }));

              return {
                ...boletin,
                fecha: (boletin.fecha_publicacion || "").slice(0, 10),
                documentos_rel: documentosConArticulos,
              };
            } catch (err) {
              console.error(`Error cargando contenido del boletín ${boletin.id}:`, err);
              return {
                ...boletin,
                fecha: (boletin.fecha_publicacion || "").slice(0, 10),
                documentos_rel: [],
              };
            }
          })
        );

        setBoletines(boletinesConContenido);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoletines();
  }, []);

  const handleView = (url: string) => {
    if (url) window.open(url, "_blank");
  };

  const handleDownload = (url: string) => {
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.download = url.split("/").pop() || "boletin.pdf";
      link.click();
    }
  };

  const handleClearAllFilters = () => {
    setFechaSeleccionada(null);
    clearFilters();
  };

  const handleFechaChange = (fecha: Date | null) => {
    setFechaSeleccionada(fecha);
    if (fecha) setTabActivo("Todos");
  };

  const handleOrdenChange = (nuevoOrden: string) => {
    setOrden(nuevoOrden);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <Spinner size="lg" />
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Cargando boletines...</p>
          <p className="text-sm text-gray-500 mt-2">Indexando documentos y artículos para búsqueda profunda</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }

  const isSearchActive = busqueda.trim().length > 0;

  // Encuentra el boletín más reciente por fecha
  const boletinMasReciente = boletinesFiltrados.reduce((latest, b) => {
    return (!latest || new Date(b.fecha) > new Date(latest.fecha)) ? b : latest;
  }, null);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Contenido principal */}
      <div className="flex-1 space-y-4 px-2 sm:px-6">
        <SearchBar 
          value={busqueda} 
          onChange={setBusqueda}
          placeholder="Buscar en boletines, documentos, artículos, personas..."
        />
        
        <YearTabs activeTab={tabActivo} onTabChange={setTabActivo} />
        
        {isSearchActive && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-800">
                Se encontraron <span className="font-semibold">{totalItems}</span>{" "}
                {totalItems === 1 ? 'resultado' : 'resultados'} para "{busqueda}"
              </p>
              <button
                onClick={() => setBusqueda("")}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Limpiar búsqueda
              </button>
            </div>
          </div>
        )}
        
        {!isSearchActive && (
          <ResultsHeader 
            activeTab={tabActivo} 
            filteredCount={totalItems} 
          />
        )}
        
        {/* Renderizar boletines paginados */}
        <div className="space-y-4">
          {paginatedBoletines.map((boletin, index) => (
            <div key={boletin.id} className="space-y-2">
              <BoletinCard
                boletin={boletin}
                isFirst={boletin.id === boletinMasReciente?.id} // Solo el más reciente tiene el badge
                onView={handleView}
                onDownload={handleDownload}
              />
              
              {isSearchActive && (boletin as any).searchMatches && (boletin as any).searchMatches.length > 0 && (
                <div className="ml-4">
                  <SearchMatchDisplay 
                    matches={(boletin as any).searchMatches}
                    query={busqueda}
                    maxVisible={5}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Componente de paginación */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[3,5, 10, 20, 50]}
        />
        
        {/* Mensaje si no hay resultados */}
        {totalItems === 0 && !loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron boletines
            </h3>
            <p className="text-gray-600 mb-4">
              {isSearchActive 
                ? `No hay resultados para "${busqueda}"`
                : "No hay boletines con los filtros aplicados"
              }
            </p>
            <button
              onClick={handleClearAllFilters}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Limpiar todos los filtros
            </button>
          </div>
        )}
      </div>
      
      {/* Sidebar */}
      <div className="w-full lg:w-72">
        <FiltersSidebar
          orden={orden}
          onOrdenChange={handleOrdenChange}
          fechaSeleccionada={fechaSeleccionada}
          onFechaChange={handleFechaChange}
          boletines={boletines}
          boletinesFiltrados={boletinesFiltrados}
          tabActivo={tabActivo}
          onClearFilters={handleClearAllFilters}
        />
      </div>
    </div>
  );
}