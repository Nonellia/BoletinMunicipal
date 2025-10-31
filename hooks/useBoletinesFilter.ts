import { useState, useMemo } from 'react';
import type { Boletin } from '@/types/Boletin';

export interface SearchMatch {
  type: 'documento' | 'articulo' | 'persona' | 'expediente' | 'boletin';
  texto: string;
  contexto?: string;
}

export interface BoletinConMatches extends Boletin {
  searchMatches?: SearchMatch[];
}

function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .toLowerCase();
}

export function useBoletinesFilter(
  boletines: Boletin[],
  fechaSeleccionada: Date | null,
  orden: string
) {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [soloAccesibles, setSoloAccesibles] = useState(false);
  const [tabActivo, setTabActivo] = useState("Todos");

  const boletinesFiltrados = useMemo(() => {
    let resultado = [...boletines];

    // 1. Filtro por búsqueda avanzada
    if (busqueda.trim()) {
      const query = normalizeText(busqueda.trim());
      
      resultado = resultado
        .map(boletin => {
          const matches: SearchMatch[] = [];

          // Buscar en el boletín mismo
          if (boletin.titulo_edicion && normalizeText(boletin.titulo_edicion).includes(query)) {
            matches.push({
              type: 'boletin',
              texto: boletin.titulo_edicion,
              contexto: `Título del boletín`
            });
          }

          if (boletin.numero_edicion?.toString().includes(query)) {
            matches.push({
              type: 'boletin',
              texto: `Edición N° ${boletin.numero_edicion}`,
              contexto: 'Número de edición'
            });
          }

          // Buscar en documentos
          boletin.documentos_rel?.forEach(doc => {
            if (doc.numero_documento && normalizeText(doc.numero_documento).includes(query)) {
              matches.push({
                type: 'documento',
                texto: doc.numero_documento,
                contexto: `Documento - ${doc.categoria?.nombre || 'Sin categoría'}`
              });
            }

            if (doc.lugar_emision && normalizeText(doc.lugar_emision).includes(query)) {
              matches.push({
                type: 'documento',
                texto: doc.lugar_emision,
                contexto: 'Lugar de emisión'
              });
            }

            if (doc.estado && normalizeText(doc.estado).includes(query)) {
              matches.push({
                type: 'documento',
                texto: doc.estado,
                contexto: 'Estado del documento'
              });
            }

            if (doc.categoria?.nombre && normalizeText(doc.categoria.nombre).includes(query)) {
              matches.push({
                type: 'documento',
                texto: doc.categoria.nombre,
                contexto: 'Categoría'
              });
            }

            // Buscar en expedientes
            if (doc.expediente?.organismo && normalizeText(doc.expediente.organismo).includes(query)) {
              matches.push({
                type: 'expediente',
                texto: doc.expediente.organismo,
                contexto: `Expediente: ${doc.expediente.numero_expediente || 'S/N'}`
              });
            }

            if (doc.expediente?.numero_expediente && normalizeText(doc.expediente.numero_expediente).includes(query)) {
              matches.push({
                type: 'expediente',
                texto: doc.expediente.numero_expediente,
                contexto: `Organismo: ${doc.expediente.organismo || 'N/A'}`
              });
            }

            // Buscar en artículos (búsqueda profunda en contenido)
            doc.articulos?.forEach(art => {
              // Buscar en el contenido completo del artículo
              if (art.contenido && normalizeText(art.contenido).includes(query)) {
                const contenidoLower = art.contenido.toLowerCase();
                const queryIndex = contenidoLower.indexOf(query);
                
                // Extraer contexto alrededor de la coincidencia
                const start = Math.max(0, queryIndex - 75);
                const end = Math.min(art.contenido.length, queryIndex + query.length + 75);
                let snippet = art.contenido.substring(start, end);
                
                // Agregar elipsis si es necesario
                if (start > 0) snippet = '...' + snippet;
                if (end < art.contenido.length) snippet = snippet + '...';
                
                matches.push({
                  type: 'articulo',
                  texto: snippet,
                  contexto: `Artículo ${art.numero_articulo || 'S/N'} - ${art.tipo_articulo || 'General'} (Doc: ${doc.numero_documento || 'N/A'})`
                });
              }

              // Buscar en número y tipo de artículo
              if (art.numero_articulo?.toLowerCase().includes(query)) {
                matches.push({
                  type: 'articulo',
                  texto: `Artículo ${art.numero_articulo}`,
                  contexto: `${art.tipo_articulo || 'Artículo'} - ${doc.numero_documento || 'Documento'}`
                });
              }

              if (art.tipo_articulo?.toLowerCase().includes(query)) {
                matches.push({
                  type: 'articulo',
                  texto: art.tipo_articulo,
                  contexto: `Tipo de artículo - ${doc.numero_documento || 'Documento'}`
                });
              }
            });

            // Buscar en personas mencionadas
            doc.personas_mentioned?.forEach(persona => {
              if (typeof persona === 'string' && normalizeText(persona).includes(query)) {
                matches.push({
                  type: 'persona',
                  texto: persona,
                  contexto: `Mencionado en ${doc.numero_documento || 'documento'}`
                });
              }
            });
          });

          return {
            ...boletin,
            searchMatches: matches
          };
        })
        .filter(boletin => boletin.searchMatches && boletin.searchMatches.length > 0);
    }

    // 2. Filtro por categoría
    if (categoriaSeleccionada) {
      resultado = resultado.filter(b =>
        b.documentos_rel?.some(d => d.categoria?.nombre === categoriaSeleccionada)
      );
    }

    // 3. Filtro por accesibilidad
    if (soloAccesibles) {
      resultado = resultado.filter(b => b.archivo_url);
    }

    // 4. Filtro por fecha específica
    if (fechaSeleccionada) {
      const fechaStr = fechaSeleccionada.toISOString().split('T')[0];
      resultado = resultado.filter(b => b.fecha === fechaStr);
    }

    // 5. Filtro por año (tab activo)
    if (tabActivo !== "Todos") {
      resultado = resultado.filter(b => {
        if (!b.fecha) return false;
        const year = parseInt(b.fecha.split('-')[0]);
        return year.toString() === tabActivo;
      });
    }

    // 6. Ordenamiento
    resultado.sort((a, b) => {
      switch (orden) {
        case "fecha-desc":
          return (b.fecha || "").localeCompare(a.fecha || "");
        case "fecha-asc":
          return (a.fecha || "").localeCompare(b.fecha || "");
        case "numero-desc":
          return (b.numero_edicion || 0) - (a.numero_edicion || 0);
        case "numero-asc":
          return (a.numero_edicion || 0) - (b.numero_edicion || 0);
        default:
          return 0;
      }
    });

    return resultado;
  }, [boletines, busqueda, categoriaSeleccionada, soloAccesibles, fechaSeleccionada, tabActivo, orden]);

  const clearFilters = () => {
    setBusqueda("");
    setCategoriaSeleccionada(null);
    setSoloAccesibles(false);
    setTabActivo("Todos");
  };

  return {
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
  };
}