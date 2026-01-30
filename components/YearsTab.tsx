import { Button } from "@heroui/button";

interface YearTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  availableYears?: number[]; // Años disponibles basados en los boletines
}

export function YearTabs({ activeTab, onTabChange, availableYears = [] }: YearTabsProps) {
  // Crear tabs dinámicamente: "Todos" + años disponibles
  const allTabs = ["Todos", ...availableYears.map(year => year.toString())];

  // Si no hay años disponibles, solo mostrar "Todos"
  if (availableYears.length === 0) {
    return (
      <section className="px-2 sm:px-6">
        <div className="border-b border-[#E5E5E5]">
          <nav
            className="flex space-x-1 overflow-x-auto scrollbar-hide w-full"
            aria-label="Tabs"
          >
            <Button
              key="Todos"
              variant="light"
              size="sm"
              className="whitespace-nowrap px-4 py-2 rounded-t-md transition-all duration-200 text-[#300E7A] border-b-2 border-[#300E7A] font-semibold bg-white shadow-sm"
              aria-current="page"
              onPress={() => onTabChange("Todos")}
            >
              Todos
            </Button>
          </nav>
        </div>
      </section>
    );
  }

  return (
    <section className="px-2 sm:px-6">
      <div className="border-b border-[#E5E5E5]">
        <nav
          className="flex space-x-1 overflow-x-auto scrollbar-hide w-full pb-px"
          aria-label="Filtrar boletines por año"
        >
          {allTabs.map((label) => {
            const isActive = label === activeTab;
            const isBuscador = activeTab === "Buscador" && label === "Todos";
            
            return (
              <Button
                key={label}
                variant="light"
                size="sm"
                className={`whitespace-nowrap px-4 py-2 rounded-t-md transition-all duration-200 ${
                  isActive || isBuscador
                    ? "text-[#300E7A] border-b-2 border-[#300E7A] font-semibold bg-white shadow-sm"
                    : "text-[#6B7280] hover:text-[#300E7A] hover:bg-gray-50"
                }`}
                aria-current={isActive ? "page" : undefined}
                onPress={() => onTabChange(label)}
              >
                {label === "Todos" ? (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Todos los años
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {label}
                  </span>
                )}
              </Button>
            );
          })}
        </nav>
      </div>
      
      {/* Indicador de año activo */}
      {activeTab !== "Todos" && activeTab !== "Buscador" && (
        <div className="px-2 py-2 text-sm text-gray-600">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtrando por año: <strong>{activeTab}</strong>
          </span>
        </div>
      )}
    </section>
  );
}