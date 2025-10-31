import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [3, 5, 10, 20, 50],
}: PaginationProps) {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPageSizeChange(Number(e.target.value));
  };

  // Generar rango de páginas a mostrar
  const getPageRange = () => {
    const range: number[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      // Mostrar rango alrededor de la página actual
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);
      
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
    }
    
    return range;
  };

  const pageRange = getPageRange();

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 mt-6 pt-4 border-t border-gray-200">
      {/* Información de resultados */}
      <div className="text-sm text-gray-600 order-2 sm:order-1">
        Mostrando{" "}
        <span className="font-medium">{totalItems === 0 ? 0 : startIndex + 1}</span> -{" "}
        <span className="font-medium">{endIndex}</span> de{" "}
        <span className="font-medium">{totalItems}</span>
      </div>

      {/* Controles de paginación */}
      <div className="flex flex-col xs:flex-row items-center gap-3 order-1 sm:order-2 w-full sm:w-auto">
      {/* <div className="flex items-center gap-3"> */}
        {/* Selector de tamaño de página */}
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Items por página"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} / página
            </option>
          ))}
        </select>

        {/* Botones de navegación */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Página anterior"
          >
            ‹
          </button>

          {/* Números de página */}
          <div className="hidden sm:flex items-center gap-1">
            {/* Primera página si no está en el rango */}
            {pageRange[0] > 1 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className="px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                >
                  1
                </button>
                {pageRange[0] > 2 && (
                  <span className="px-2 text-gray-400">…</span>
                )}
              </>
            )}

            {/* Páginas del rango */}
            {pageRange.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1.5 rounded transition-colors ${
                  page === currentPage
                    ? "bg-[#300E7A] text-white"
                    : "border border-gray-300 bg-white hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Última página si no está en el rango */}
            {pageRange[pageRange.length - 1] < totalPages && (
              <>
                {pageRange[pageRange.length - 1] < totalPages - 1 && (
                  <span className="px-2 text-gray-400">…</span>
                )}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          {/* Indicador de página en móvil */}
          <div className="sm:hidden px-3 py-1.5 text-sm text-gray-600">
            {currentPage} / {totalPages}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Página siguiente"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}