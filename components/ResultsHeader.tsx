interface ResultsHeaderProps {
  activeTab: string;
  filteredCount: number;
}

export function ResultsHeader({ activeTab, filteredCount }: ResultsHeaderProps) {
  return (
    <div className="px-6 md:px-6 mb-6">
      <h3 className="text-xl md:text-2xl font-bold dark:text-[#c5b9df] text-[#300E7A] mb-1">
        {activeTab === "Buscador"
          ? "Resultados de búsqueda"
          : activeTab === "Todos"
          ? "Todos los boletines"
          : `Boletines del año ${activeTab}`}
      </h3>
      <p className="text-sm text-gray-600">
        {filteredCount} documentos encontrados
      </p>
    </div>
  );
}
