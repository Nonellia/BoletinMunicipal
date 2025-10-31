"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Archive,
  Package,
  BookOpen,
  FileImage,
  UserCheck,
  Menu,
  X,
} from "lucide-react";

const forms = [
    {
    id: "generalDocument",
    title: "Generar Boletines",
    icon: FileText,
    featured: true,
    page: "/gestor/generarBoletines",
  },
  {
    id: "document",
    title: "Documento",
    icon: FileText,
    featured: true,
    page: "/gestor/documentos",
  },
  {
    id: "categoryBoletin",
    title: "Categorías de Documentos",
    icon: Archive,
    page: "/gestor/categoriasDocumentos",
  },
  // {
  //   id: "categoryDoc",
  //   title: "Categorías de Boletines",
  //   icon: Archive,
  //   page: "/categoriasBoletin",
  // },

  { id: "expedient", title: "Expediente", icon: Package, page: "/gestor/expedientes" },
  { id: "bulletin", title: "Boletín", icon: BookOpen, page: "/gestor/boletines" },
  { id: "article", title: "Artículo", icon: FileImage, page: "/gestor/articulos" },
  { id: "annex", title: "Anexo", icon: FileImage, page: "/gestor/anexos" },
  // {
  //   id: "person",
  //   title: "Persona Mencionada",
  //   icon: UserCheck,
  //   page: "/personasMencionadas",
  // },
];

interface SidebarProps {
  activeForm: string | null;
  onFormSelect: (formId: string | null) => void;
  className?: string;
}

export default function Sidebar({
  activeForm,
  onFormSelect,
  className,
}: SidebarProps) {
  return (
    <aside
      className={`flex flex-col h-full min-h-screen bg-white border-r border-gray-200 ${className}`}
      style={{ width: "260px" }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-indigo-700">
              Gestión Documental
            </h2>
            <p className="text-sm text-gray-500">Formularios</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Link href="/">
          <button
            onClick={() => onFormSelect(null)}
            className={`w-full flex items-center px-3 py-2 rounded ${
              activeForm === null
                ? "bg-indigo-600 text-white"
                : "hover:bg-indigo-100 text-gray-700"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span className="ml-2">Inicio</span>
          </button>
        </Link>

        <hr className="my-2 border-gray-200" />

        <p className="text-xs uppercase text-gray-400 tracking-wide">
          Formularios
        </p>
        {forms.map((form) => {
          const Icon = form.icon;
          const isActive = activeForm === form.id;

          return (
            <Link href={form.page} key={form.id}>
              <button
                onClick={() => onFormSelect(form.id)}
                className={`w-full flex items-center px-3 py-2 rounded ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-indigo-100 text-gray-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="ml-2 flex-1 text-left">{form.title}</span>
                {form.featured && (
                  <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 px-1 rounded">
                    ★
                  </span>
                )}
              </button>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-center text-xs text-gray-500 flex-shrink-0">
        <p>Sistema de Gestión</p>
        <p>Documental v1.0</p>
      </div>
    </aside>
  );
}
