import React from 'react';
import { FileText, Hash, Users, MapPin, Book } from 'lucide-react';

interface SearchMatch {
  type: 'documento' | 'articulo' | 'persona' | 'expediente' | 'boletin';
  texto: string;
  contexto?: string;
}

interface SearchMatchDisplayProps {
  matches: SearchMatch[];
  query: string;
  maxVisible?: number;
}

export function SearchMatchDisplay({ matches, query, maxVisible = 3 }: SearchMatchDisplayProps) {
  if (!matches || matches.length === 0) return null;

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-300 text-gray-900 px-1 rounded font-semibold">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  const getMatchIcon = (type: string) => {
    switch (type) {
      case 'boletin':
        return <Book className="w-4 h-4" />;
      case 'documento':
        return <FileText className="w-4 h-4" />;
      case 'articulo':
        return <Hash className="w-4 h-4" />;
      case 'persona':
        return <Users className="w-4 h-4" />;
      case 'expediente':
        return <MapPin className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getMatchColor = (type: string) => {
    switch (type) {
      case 'boletin':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'documento':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'articulo':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'persona':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'expediente':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      boletin: 'Boletín',
      documento: 'Documento',
      articulo: 'Artículo',
      persona: 'Persona',
      expediente: 'Expediente'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const visibleMatches = matches.slice(0, maxVisible);
  const remainingCount = matches.length - maxVisible;

  return (
    <div className="mt-3 space-y-2 border-l-4 border-yellow-400 pl-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-1.5 w-1.5 rounded-full bg-yellow-500"></div>
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          {matches.length} {matches.length === 1 ? 'coincidencia encontrada' : 'coincidencias encontradas'}
        </p>
      </div>
      
      {visibleMatches.map((match, idx) => (
        <div
          key={idx}
          className={`flex items-start gap-3 p-3 rounded-lg border ${getMatchColor(match.type)} transition-all duration-200 hover:shadow-md`}
        >
          <div className="flex-shrink-0 mt-0.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getMatchColor(match.type)}`}>
              {getMatchIcon(match.type)}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getMatchColor(match.type)}`}>
                {getTypeLabel(match.type)}
              </span>
              {match.contexto && (
                <span className="text-xs text-gray-500">
                  {match.contexto}
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-800 break-words leading-relaxed">
              {highlightText(match.texto, query)}
            </p>
          </div>
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div className="text-center pt-2">
          <button className="text-xs text-gray-600 hover:text-gray-800 font-medium px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            + {remainingCount} coincidencias más
          </button>
        </div>
      )}
    </div>
  );
}