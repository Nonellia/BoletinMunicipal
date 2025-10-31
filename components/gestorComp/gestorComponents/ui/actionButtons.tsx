import React from "react";
import { Download, Eye, Accessibility } from "lucide-react";
import type { Boletin } from "@/types/Boletin";

interface ActionButtonsProps {
  selectedBoletin: Boletin | null;
  loading: boolean;
  selectedCount: number;
  onPreview: () => void;
  onDownload: () => void;
  onAccessibleView: () => void; // Nueva prop
  showPreview: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  selectedBoletin,
  loading,
  selectedCount,
  onPreview,
  onDownload,
  onAccessibleView, // Nueva función
  showPreview,
}) => {
  if (!selectedBoletin) return null;

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onPreview}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        <Eye className="w-5 h-5" />
        {showPreview ? "Ocultar" : "Ver"} Preview
      </button>
      
      <button
        type="button"
        onClick={onDownload}
        disabled={loading || selectedCount === 0}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <Download className="w-5 h-5" />
        {loading ? "Generando PDF..." : "Descargar PDF"}
      </button>
    </div>
  );
};