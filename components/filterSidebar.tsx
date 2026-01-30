import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Boletin } from "@/types/Boletin";
import { useState, useEffect } from "react";

interface FiltersSidebarProps {
  orden: string;
  onOrdenChange: (orden: string) => void;
  fechaSeleccionada: Date | null;
  onFechaChange: (fecha: Date | null) => void;
  boletines: Boletin[];
  boletinesFiltrados: Boletin[];
  tabActivo: string;
  onClearFilters: () => void;
}

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  hasBulletin: boolean;
  isSelected: boolean;
  isToday: boolean;
}

export function FiltersSidebar({
  orden,
  onOrdenChange,
  fechaSeleccionada,
  onFechaChange,
  boletines,
  boletinesFiltrados,
  tabActivo,
  onClearFilters,
}: FiltersSidebarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  // Nombres de meses y días en español
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  const dayNames = ["L", "M", "M", "J", "V", "S", "D"];

  // Función para formatear fecha como YYYY-MM-DD (solo la parte de fecha, sin hora)
  const formatDateOnly = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Función para parsear fecha del servidor y extraer solo la parte de fecha
  const parseDateFromServer = (dateString: string): string => {
    try {
      // Si el string ya es YYYY-MM-DD, devolverlo
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      
      // Si tiene formato ISO (con T o Z), extraer solo la parte de fecha
      if (dateString.includes('T') || dateString.includes('Z')) {
        return dateString.split('T')[0];
      }
      
      // Intentar parsear y formatear
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      
      return formatDateOnly(date);
    } catch {
      return "";
    }
  };

  // Obtener fechas de boletines (solo comparando strings YYYY-MM-DD)
  const getBulletinDates = (): Set<string> => {
    const dates = new Set<string>();
    
    boletines.forEach((boletin) => {
      if (boletin.fecha) {
        try {
          const dateStr = parseDateFromServer(boletin.fecha);
          if (dateStr) {
            dates.add(dateStr);
          }
        } catch (error) {
          console.error("Error procesando fecha:", boletin.fecha, error);
        }
      }
    });
    
    return dates;
  };

  // Generar los días del calendario
  const generateCalendar = (): CalendarDay[] => {
    const bulletinDates = getBulletinDates();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const startOffset = startDay === 0 ? 6 : startDay - 1;
    const daysInMonth = lastDay.getDate();

    const days: CalendarDay[] = [];
    
    // Obtener fecha de hoy
    const today = new Date();
    const todayStr = formatDateOnly(today);

    // Días del mes anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < startOffset; i++) {
      const dayNum = prevMonthLastDay - startOffset + i + 1;
      const date = new Date(year, month - 1, dayNum);
      const dateStr = formatDateOnly(date);
      
      const isSelected = fechaSeleccionada ? 
        formatDateOnly(fechaSeleccionada) === dateStr : false;
      
      days.push({
        date,
        day: dayNum,
        isCurrentMonth: false,
        hasBulletin: bulletinDates.has(dateStr),
        isSelected,
        isToday: dateStr === todayStr,
      });
    }

    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = formatDateOnly(date);
      
      const isSelected = fechaSeleccionada ? 
        formatDateOnly(fechaSeleccionada) === dateStr : false;
      
      days.push({
        date,
        day: i,
        isCurrentMonth: true,
        hasBulletin: bulletinDates.has(dateStr),
        isSelected,
        isToday: dateStr === todayStr,
      });
    }

    // Días del próximo mes
    const totalCells = 42;
    const nextMonthDays = totalCells - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      const date = new Date(year, month + 1, i);
      const dateStr = formatDateOnly(date);
      
      const isSelected = fechaSeleccionada ? 
        formatDateOnly(fechaSeleccionada) === dateStr : false;
      
      days.push({
        date,
        day: i,
        isCurrentMonth: false,
        hasBulletin: bulletinDates.has(dateStr),
        isSelected,
        isToday: dateStr === todayStr,
      });
    }

    return days;
  };

  useEffect(() => {
    setCalendarDays(generateCalendar());
  }, [currentMonth, boletines, fechaSeleccionada]);

  // FUNCIONES CON PREVENCIÓN DE PROPAGACIÓN
  const prevMonth = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDayClick = (day: CalendarDay, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (day.isCurrentMonth) {
      onFechaChange(day.date);
    }
  };

  const handleClearDate = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    onFechaChange(null);
  };

  const handleClearFilters = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    onClearFilters();
  };

  return (
    <div className="xl:col-span-1 order-1 xl:order-2">
      <div className="sticky top-6 space-y-6">
        {/* Card de Filtros */}
        <Card className="border border-[#E5E5E5] shadow-sm bg-gradient-to-br from-[#300E7A]/5 to-[#2B97D6]/5">
          <CardBody className="p-5">
            <div className="relative flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold dark:text-[#FFFFFF] text-[#300E7A] flex items-center">
                <svg
                  className="w-5 h-5 mr-2 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filtros
              </h4>
              {/* Icono "?" con tooltip */}
              <div className="relative group">
                <div className="w-5 h-5 flex items-center justify-center rounded-full bg-[#2B97D6] text-white text-xs font-bold cursor-default transition-transform duration-200 hover:scale-110">
                  ?
                </div>
                <div className="absolute right-0 top-7 bg-[#2B97D6] text-white text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-10 whitespace-nowrap">
                  Personalizá los resultados con filtros
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="dark:text-[#FFFFFF] block text-sm font-medium text-gray-700 mb-2">
                  Ordenar por:
                </label>
                <Select
                  placeholder="Seleccionar orden"
                  className="w-full"
                  size="sm"
                  aria-label="Ordenar resultados"
                  selectedKeys={[orden]}
                  onChange={(e) => onOrdenChange(e.target.value)}
                >
                  <SelectItem key="fecha-desc">Más recientes</SelectItem>
                  <SelectItem key="fecha-asc">Más antiguos</SelectItem>
                  <SelectItem key="numero-desc">Por número (desc)</SelectItem>
                  <SelectItem key="numero-asc">Por número (asc)</SelectItem>
                  <SelectItem key="accesible">Más accesibles</SelectItem>
                </Select>
              </div>

              <hr className="border-gray-200" />

              <button
                type="button"
                onClick={handleClearFilters}
                className="w-full flex items-center justify-center px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Limpiar filtros
              </button>
            </div>
          </CardBody>
        </Card>

        {/* Card del Calendario */}
        <Card className="border border-[#E5E5E5] shadow-sm bg-gradient-to-br from-[#300E7A]/5 to-[#2B97D6]/5">
          <CardBody className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="dark:text-[#FFFFFF] text-lg font-semibold text-[#300E7A] flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2" />
                Filtrar por fecha
              </h4>
              <div className="relative group ml-2">
                <div className="w-5 h-5 flex items-center justify-center rounded-full bg-[#2B97D6] text-white text-xs font-bold cursor-default transition-transform duration-200 hover:scale-110">
                  i
                </div>
                <div className="absolute right-0 top-7 bg-[#2B97D6] text-white text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-10 whitespace-nowrap">
                  Filtrá los boletines por fecha
                </div>
              </div>
            </div>

            <div className="w-full">
              {/* Encabezado del calendario */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Mes anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <span className="text-lg font-semibold">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Mes siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Días de la semana */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day, index) => (
                  <div key={index} className="dark:text-[#FFFFFF] text-center text-sm font-medium text-gray-500 py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Días del calendario */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={(e) => handleDayClick(day, e)}
                    className={`
                      h-8 flex items-center justify-center rounded-full text-sm transition-colors
                      ${day.isToday ? "border border-[#2B97D6]" : ""}
                      ${day.isSelected ? "bg-[#300E7A] text-white" : 
                        day.isCurrentMonth ? 
                          (day.hasBulletin ? "bg-[#2B97D6] text-white font-bold hover:bg-[#2479ac]" : "dark:text-white text-gray-800 hover:bg-[#8a93db]") : 
                          "text-gray-300 bg-gray-100/50 dark:text-gray-500 dark:bg-gray-800/50 cursor-not-allowed"}
                    `}
                    disabled={!day.isCurrentMonth}
                  >
                    {day.day}
                  </button>
                ))}
              </div>
            </div>

            {fechaSeleccionada && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Fecha seleccionada:</span>
                  <button
                    type="button"
                    onClick={handleClearDate}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="text-sm font-medium text-[#300E7A] mt-1">
                  {fechaSeleccionada.toLocaleDateString("es-AR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            )}
            
          </CardBody>
        </Card>

        {/* Card de estadísticas */}
        <Card className="border border-[#E5E5E5] shadow-sm bg-gradient-to-br from-[#300E7A]/5 to-[#2B97D6]/5">
          <CardBody className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold dark:text-[#FFFFFF] text-[#300E7A] flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Resumen
              </h4>
              <div className="relative group ml-2">
                <div className="w-5 h-5 flex items-center justify-center rounded-full bg-[#2B97D6] text-white text-xs font-bold cursor-default transition-transform duration-200 hover:scale-110">
                  i
                </div>
                <div className="absolute right-0 top-7 bg-[#2B97D6] text-white text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-10 whitespace-nowrap">
                  Estadísticas de los boletines filtrados
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm dark:text-[#FFFFFF] text-[#300E7A]">Total de boletines:</span>
                <span className="font-semibold dark:text-[#FFFFFF] text-[#300E7A]">{boletinesFiltrados.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm dark:text-[#FFFFFF] text-[#300E7A]">Documentos accesibles:</span>
                <span className="font-semibold dark:text-[#FFFFFF] text-[#300E7A]">{boletinesFiltrados.filter((b) => b.accesible).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm dark:text-[#FFFFFF] text-[#300E7A]">Año activo:</span>
                <span className="font-semibold dark:text-[#FFFFFF] text-[#300E7A]">{tabActivo !== "Buscador" ? tabActivo : "Todos"}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}