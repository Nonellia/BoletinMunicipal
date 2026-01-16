// utils/fechas.ts

/**
 * Convierte una fecha en formato ISO (YYYY-MM-DD) a objeto Date en zona horaria local
 */
export function parseFechaISO(fechaString: string): Date | null {
  if (!fechaString) return null;
  
  try {
    // Si ya es un objeto Date, devolverlo
    if (fechaString instanceof Date) return fechaString;
    
    // Si es un string en formato ISO
    if (typeof fechaString === 'string') {
      // Manejar formato YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(fechaString)) {
        // Agregar hora para evitar problemas de zona horaria
        return new Date(`${fechaString}T12:00:00`);
      }
      
      // Intentar parsear como fecha normal
      const fecha = new Date(fechaString);
      return isNaN(fecha.getTime()) ? null : fecha;
    }
    
    return null;
  } catch (error) {
    console.error('Error parseando fecha:', error);
    return null;
  }
}

/**
 * Formatea una fecha a string local (DD/MM/YYYY)
 */
export function formatFechaLocal(fechaString: string): string {
  const fecha = parseFechaISO(fechaString);
  if (!fecha) return 'Fecha inválida';
  
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formatea una fecha a string largo
 */
export function formatFechaLarga(fechaString: string): string {
  const fecha = parseFechaISO(fechaString);
  if (!fecha) return 'Fecha inválida';
  
  return fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Formatea una fecha a string corto (DD MMM YYYY)
 */
export function formatFechaCorta(fechaString: string): string {
  const fecha = parseFechaISO(fechaString);
  if (!fecha) return 'Fecha inválida';
  
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).replace('.', ''); // Quitar el punto del mes
}