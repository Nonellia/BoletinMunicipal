"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Spinner } from "@heroui/spinner";
import { BoletinCard } from "./BoletinCard";
import { FiltersSidebar } from "./filterSidebar";
import { SearchBar } from "./SearchBar";
import { ResultsHeader } from "./ResultsHeader";
import { YearTabs } from "./YearsTab";
import { Pagination } from "./paginationComp";

const API_URL = "http://localhost:8000";

// Interfaces
interface TipoBoletin {
  id: number;
  nombre: string;
  observacion: string;
}

interface CategoriaResumen {
  id: number;
  nombre: string;
  abreviatura: string;
}

interface ResumenPublicado {
  id: number;
  id_publicado: number;
  contenido: string;
  fecha: string;
  id_categoria: number;
  categoria?: CategoriaResumen;
}

interface BoletinPublicado {
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

export default function BoletinList() {
  const [boletines, setBoletines] = useState<BoletinPublicado[]>([]);
  const [tiposBoletin, setTiposBoletin] = useState<TipoBoletin[]>([]);
  const [categorias, setCategorias] = useState<CategoriaResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [orden, setOrden] = useState("fecha-desc");
  const [busqueda, setBusqueda] = useState("");
  const [tabActivo, setTabActivo] = useState("Todos");

  // Paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Función para formatear fechas
  // Función para formatear fechas
  const formatFecha = (fechaString: string): string => {
    try {
      let fecha: Date;

      if (/^\d{4}-\d{2}-\d{2}$/.test(fechaString)) {
        // Formato YYYY-MM-DD
        const [year, month, day] = fechaString.split("-").map(Number);
        // Crear fecha en Argentina (mediodía para evitar zona horaria)
        fecha = new Date(year, month - 1, day, 12, 0, 0, 0);
      } else if (fechaString.includes("T")) {
        // Formato ISO con T
        const dateObj = new Date(fechaString);
        // Crear fecha en Argentina
        fecha = new Date(
          dateObj.getFullYear(),
          dateObj.getMonth(),
          dateObj.getDate(),
          12,
          0,
          0,
          0,
        );
      } else {
        // Intentar parsear de cualquier forma
        const dateObj = new Date(fechaString);
        fecha = new Date(
          dateObj.getFullYear(),
          dateObj.getMonth(),
          dateObj.getDate(),
          12,
          0,
          0,
          0,
        );
      }

      if (isNaN(fecha.getTime())) {
        return "Fecha no disponible";
      }

      return fecha.toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Fecha no disponible";
    }
  };
  // Función para normalizar términos de búsqueda (definida UNA VEZ fuera de cualquier función interna)
  const normalizeSearchTerm = (term: string): string => {
    return term
      .toLowerCase()
      .normalize("NFD") // Eliminar acentos
      .replace(/[\u0300-\u036f]/g, "");
  };

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Cargar tipos de boletín y categorías primero
        const [tiposRes, categoriasRes] = await Promise.all([
          fetch(`${API_URL}/tipos-boletin/`),
          fetch(`${API_URL}/categorias/`),
        ]);

        if (!tiposRes.ok || !categoriasRes.ok) {
          throw new Error("Error al cargar datos de configuración");
        }

        const tiposData = await tiposRes.json();
        const categoriasData = await categoriasRes.json();

        setTiposBoletin(Array.isArray(tiposData) ? tiposData : []);
        setCategorias(Array.isArray(categoriasData) ? categoriasData : []);

        // Cargar boletines publicados
        const boletinesRes = await fetch(`${API_URL}/publicados/boletines`);
        if (!boletinesRes.ok) {
          throw new Error("Error al cargar boletines publicados");
        }

        const boletinesData: BoletinPublicado[] = await boletinesRes.json();

        // Enriquecer cada boletín con información completa
        const boletinesEnriquecidos = await Promise.all(
          boletinesData.map(async (boletin) => {
            try {
              // Obtener nombre del tipo
              const tipo = tiposData.find(
                (t: TipoBoletin) => t.id === boletin.tipo_boletin,
              );
              boletin.tipo_boletin_nombre = tipo?.nombre || "Sin tipo";

              // Obtener resúmenes publicados de este boletín
              const resumenesRes = await fetch(
                `${API_URL}/publicados/resumenes/boletin/${boletin.id}`,
              );

              if (resumenesRes.ok) {
                const resumenesData: ResumenPublicado[] =
                  await resumenesRes.json();

                // Enriquecer resúmenes con categorías
                const resumenesConCategorias = resumenesData.map((resumen) => ({
                  ...resumen,
                  categoria: categoriasData.find(
                    (c: CategoriaResumen) => c.id === resumen.id_categoria,
                  ),
                }));

                boletin.resumenes_publicados = resumenesConCategorias;
                boletin.resumenes_count = resumenesConCategorias.length;

                // Extraer categorías únicas
                const categoriasUnicas = new Set<string>();
                resumenesConCategorias.forEach((resumen) => {
                  if (resumen.categoria) {
                    categoriasUnicas.add(resumen.categoria.nombre);
                  }
                });
                boletin.categorias_principales = Array.from(categoriasUnicas);
              } else {
                boletin.resumenes_count = 0;
                boletin.categorias_principales = [];
              }

              // Determinar si es accesible (tiene resúmenes)
              boletin.accesible = boletin.resumenes_count > 0;

              return boletin;
            } catch (err) {
              console.error(`Error enriqueciendo boletín ${boletin.id}:`, err);
              return boletin;
            }
          }),
        );

        setBoletines(boletinesEnriquecidos);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Obtener años únicos de los boletines
  const yearTabs = useMemo(() => {
    const years = new Set<number>();
    boletines.forEach((boletin) => {
      try {
        const year = new Date(boletin.fecha).getFullYear();
        if (!isNaN(year)) {
          years.add(year);
        }
      } catch (e) {
        // Ignorar fechas inválidas
      }
    });
    return Array.from(years).sort((a, b) => b - a); // Más reciente primero
  }, [boletines]);

  // Aplicar filtros
  const boletinesFiltrados = useMemo(() => {
    let filtered = [...boletines];

    // Filtrar por año
    if (tabActivo !== "Todos" && tabActivo !== "Buscador") {
      const year = parseInt(tabActivo);
      filtered = filtered.filter((boletin) => {
        try {
          const boletinYear = new Date(boletin.fecha).getFullYear();
          return boletinYear === year;
        } catch {
          return false;
        }
      });
    }

    if (fechaSeleccionada) {
      filtered = filtered.filter((boletin) => {
        try {
          // Crear fecha del boletín con zona horaria Argentina
          const boletinDate = new Date(boletin.fecha);
          const boletinArgentina = new Date(
            boletinDate.getFullYear(),
            boletinDate.getMonth(),
            boletinDate.getDate(),
            12,
            0,
            0,
            0, // Mediodía para evitar problemas de zona horaria
          );

          // Crear fecha seleccionada con zona horaria Argentina
          const selectedArgentina = new Date(
            fechaSeleccionada.getFullYear(),
            fechaSeleccionada.getMonth(),
            fechaSeleccionada.getDate(),
            12,
            0,
            0,
            0,
          );

          // Comparar solo las fechas (sin horas)
          return boletinArgentina.getTime() === selectedArgentina.getTime();
        } catch {
          return false;
        }
      });
    }

    // Filtrar por búsqueda
    if (busqueda.trim()) {
      const searchTerm = normalizeSearchTerm(busqueda);
      filtered = filtered.filter((boletin) => {
        // Normalizar también los campos a buscar
        const tipoNormalizado = boletin.tipo_boletin_nombre
          ? normalizeSearchTerm(boletin.tipo_boletin_nombre)
          : "";

        // Buscar en tipo de boletín
        if (tipoNormalizado.includes(searchTerm)) {
          return true;
        }

        // Buscar en número de edición
        if (boletin.edicion.toString().includes(searchTerm)) {
          return true;
        }

        // Buscar en categorías
        if (
          boletin.categorias_principales?.some((cat) =>
            normalizeSearchTerm(cat).includes(searchTerm),
          )
        ) {
          return true;
        }

        // Buscar en contenido de resúmenes
        if (
          boletin.resumenes_publicados?.some(
            (resumen) =>
              normalizeSearchTerm(resumen.contenido).includes(searchTerm) ||
              (resumen.categoria?.nombre &&
                normalizeSearchTerm(resumen.categoria.nombre).includes(
                  searchTerm,
                )),
          )
        ) {
          return true;
        }

        return false;
      });
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (orden) {
        case "fecha-desc":
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        case "fecha-asc":
          return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
        case "numero-desc":
          return b.edicion - a.edicion;
        case "numero-asc":
          return a.edicion - b.edicion;
        case "accesible":
          return (b.accesible ? 1 : 0) - (a.accesible ? 1 : 0);
        default:
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      }
    });

    return filtered;
  }, [boletines, tabActivo, fechaSeleccionada, busqueda, orden]);

  // Paginación
  const totalItems = boletinesFiltrados.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedBoletines = boletinesFiltrados.slice(
    startIndex,
    startIndex + pageSize,
  );

  // Handlers
  const handleView = (url: string) => {
    window.open(url, "_blank");
  };

  const handleDownload = async (boletinId: number) => {
    // Aquí puedes implementar la descarga del PDF
    console.log("Descargar boletín:", boletinId);
  };

  const handleClearAllFilters = () => {
    setFechaSeleccionada(null);
    setBusqueda("");
    setTabActivo("Todos");
    setOrden("fecha-desc");
  };

  const handleFechaChange = (fecha: Date | null) => {
    setFechaSeleccionada(fecha);
    if (fecha) setTabActivo("Todos");
    setCurrentPage(1);
  };

  const handleOrdenChange = (nuevoOrden: string) => {
    setOrden(nuevoOrden);
    setCurrentPage(1);
  };

  const handleBusquedaChange = (valor: string) => {
    setBusqueda(valor);
    setCurrentPage(1);
    if (valor.trim()) {
      setTabActivo("Buscador");
    }
  };

  const handleTabChange = (tab: string) => {
    setTabActivo(tab);
    setCurrentPage(1);
    if (tab !== "Buscador") {
      setBusqueda("");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <Spinner size="lg" />
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">
            Cargando boletines publicados...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Conectando con el sistema municipal
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error de conexión
            </h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <p className="mt-1 text-sm text-red-600">
              Verifica que el servidor backend esté ejecutándose en {API_URL}
            </p>
            <div className="mt-4">
              <button
                onClick={() => window.location.reload()}
                className="text-sm font-medium text-red-700 hover:text-red-600 underline"
              >
                Reintentar conexión
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (boletines.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No hay boletines publicados
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Aún no se han publicado boletines oficiales. Los boletines aparecerán
          aquí una vez que sean publicados por la administración municipal.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Contenido principal */}
      <div className="flex-1 space-y-4">
        <SearchBar
          value={busqueda}
          onChange={handleBusquedaChange}
          placeholder="Buscar por tipo, edición, categoría o contenido..."
        />

        <YearTabs
          activeTab={tabActivo}
          onTabChange={handleTabChange}
          availableYears={yearTabs}
        />

        {/* Banner de resultados de búsqueda */}
        {busqueda.trim() && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-800">
                Se encontraron{" "}
                <span className="font-semibold">{totalItems}</span>{" "}
                {totalItems === 1 ? "resultado" : "resultados"} para "{busqueda}
                "
              </p>
              <button
                onClick={() => {
                  setBusqueda("");
                  setTabActivo("Todos");
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
              >
                Limpiar búsqueda
              </button>
            </div>
          </div>
        )}

        {!busqueda.trim() && (
          <ResultsHeader activeTab={tabActivo} filteredCount={totalItems} />
        )}

        {/* Lista de boletines */}
        {boletinesFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron boletines
            </h3>
            <p className="text-gray-600 mb-4">
              {busqueda.trim()
                ? `No hay boletines que coincidan con "${busqueda}"`
                : fechaSeleccionada
                  ? "No hay boletines para la fecha seleccionada"
                  : `No hay boletines para el año ${tabActivo}`}
            </p>
            <button
              onClick={handleClearAllFilters}
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Limpiar todos los filtros
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {paginatedBoletines.map((boletin, index) => (
              <BoletinCard
                key={boletin.id}
                boletin={boletin}
                isFirst={currentPage === 1 && index === 0}
                onView={handleView}
                onDownload={() => handleDownload(boletin.id)}
              />
            ))}
          </div>
        )}

        {/* Paginación */}
        {boletinesFiltrados.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        )}
      </div>

      {/* Sidebar de filtros */}
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
