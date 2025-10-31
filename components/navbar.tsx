'use client';
import { useState } from "react";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  Menu,
  Twitter,
  Facebook,
  Youtube,
  Instagram,
  Newspaper,
  X
} from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);

  const redessociales = [
    { name: "Twitter", icon: Twitter, link: "https://x.com/MunicipioRGL" },
    { name: "Facebook", icon: Facebook, link: "https://www.facebook.com/municipalidadriogallegos/" },
    { name: "Youtube", icon: Youtube, link: "https://www.youtube.com/@municipalidadriogallegos3544" },
    { name: "Instagram", icon: Instagram, link: "https://www.instagram.com/rglmunicipalidad/" },
    { name: "Noticias", icon: Newspaper, link: "https://www.riogallegos.gob.ar/noticias/" },
  ];

  return (
    <header className="backdrop-blur bg-white/70 dark:bg-[#18181b]/70 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Redes sociales - desktop */}
          <div className="hidden md:flex items-center gap-2">
            {redessociales.map(({ name, icon: Icon, link }, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-violet-400 rounded-full flex items-center justify-center hover:bg-violet-600 transition-colors"
                aria-label={name}
              >
                <Icon className="w-4 h-4 text-white" />
              </a>
            ))}
          </div>

          {/* Botón menú móvil mejorado */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-md transition-colors dark:border-gray-700  hover:scale-105"
              aria-label="Abrir menú"
            >
              <span className="sr-only">Abrir menú</span>
              {open ? (
                <X className="w-7 h-7 text-violet-500" strokeWidth={3} />
              ) : (
                <Menu className="w-7 h-7 text-violet-500" strokeWidth={3} />
              )}
            </button>
          </div>

          {/* Logo, título y ThemeSwitch */}
          <div className="flex items-center gap-3 md:gap-4 mx-auto md:mx-0">
            <h1 className="text-[#2c3e7a] dark:text-white font-bold text-sm sm:text-base md:text-lg tracking-wide text-center whitespace-nowrap">
              MUNICIPALIDAD DE RÍO GALLEGOS
            </h1>
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src="https://riogallegos.gob.ar/rgl/wp-content/uploads/2021/08/cropped-escudo-rg.png?x60804"
                alt="Municipalidad de Río Gallegos"
                className="h-10"
              />
            </div>
            <div className="hidden md:block ml-4">
              <ThemeSwitch />
            </div>
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {open && (
        <div className="md:hidden p-4 ">
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            {redessociales.map(({ name, icon: Icon, link }, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-violet-400 rounded-full flex items-center justify-center hover:bg-violet-600 transition-colors"
                aria-label={name}
              >
                <Icon className="w-5 h-5 text-white" />
              </a>
            ))}
          </div>
          <div className="flex justify-center">
            <ThemeSwitch />
          </div>
        </div>
      )}
    </header>
  );
}