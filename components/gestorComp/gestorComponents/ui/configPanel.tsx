import React from "react";
import { Settings } from "lucide-react";
import type { ConfiguracionPDF } from "../../../types/boletin";

interface ConfigPanelProps {
  config: ConfiguracionPDF;
  onConfigChange: (config: ConfiguracionPDF) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ 
  config, 
  onConfigChange 
}) => ( 
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <Settings className="w-5 h-5" />
      Configuración
    </h2>
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">
          Título Portada
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded text-sm"
          value={config.portadaTitulo}
          onChange={(e) => onConfigChange({...config, portadaTitulo: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Subtítulo Portada
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded text-sm"
          value={config.portadaSubtitulo}
          onChange={(e) => onConfigChange({...config, portadaSubtitulo: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Texto Cabecera
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded text-sm"
          value={config.cabecera}
          onChange={(e) => onConfigChange({...config, cabecera: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Pie de página
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded text-sm"
          value={config.piePagina}
          onChange={(e) => onConfigChange({...config, piePagina: e.target.value})}
        />
      </div>
      <div className="space-y-2 pt-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={config.showPortada}
            onChange={(e) => onConfigChange({...config, showPortada: e.target.checked})}
            className="rounded"
          />
          <span className="text-sm">Incluir portada</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={config.showIndice}
            onChange={(e) => onConfigChange({...config, showIndice: e.target.checked})}
            className="rounded"
          />
          <span className="text-sm">Incluir índice</span>
        </label>
      </div>
    </div>
  </div>
);