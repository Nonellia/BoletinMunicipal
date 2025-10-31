import { Twitter, Facebook, Youtube, Instagram, Newspaper } from "lucide-react";

export default function Footer() {
  const redessociales = [
    { name: "Twitter", icon: Twitter, link: "https://x.com/MunicipioRGL" },
    { name: "Facebook", icon: Facebook, link: "https://www.facebook.com/municipalidadriogallegos/" },
    { name: "Youtube", icon: Youtube, link: "https://www.youtube.com/@municipalidadriogallegos3544" },
    { name: "Instagram", icon: Instagram, link: "https://www.instagram.com/rglmunicipalidad/" },
    { name: "Noticias", icon: Newspaper, link: "https://www.riogallegos.gob.ar/noticias/" },
  ];

  return (
    <footer className="bg-[#111827] text-gray-300 py-12">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-700 pb-10">
          
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <img
              src="https://riogallegos.gob.ar/rgl/wp-content/uploads/2021/08/cropped-escudo-rg.png?x60804"
              alt="Municipalidad de Río Gallegos"
              className="h-20"
            />
            <h2 className="text-xl font-bold tracking-wide text-white">
              Municipalidad de Río Gallegos
            </h2>
            <p className="text-sm text-gray-400">
              Comprometidos con el desarrollo y bienestar de nuestra ciudad.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="text-sm font-semibold text-violet-400 mb-4">ENLACES</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://riogallegos.gob.ar/rgl/" className="hover:text-violet-400 transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="https://riogallegos.gob.ar/rgl/tramites-y-servicios/" className="hover:text-violet-400 transition-colors">
                  Trámites y Servicios
                </a>
              </li>
              <li>
                <a href="https://www.riogallegos.gob.ar/rgl/mirecibo/login.php" className="hover:text-violet-400 transition-colors">
                  Autogestión
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-sm font-semibold text-violet-400 mb-4">CONTACTO</h3>
            <ul className="space-y-2 text-sm">
              <li>Av. José de San Martín N° 791</li>
              <li>Santa Cruz, Argentina</li>
              <li>Tel. +54 2966 - 457021</li>
              <li>info@riogallegos.gob.ar</li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 className="text-sm font-semibold text-violet-400 mb-4">SEGUINOS</h3>
            <div className="flex gap-4">
              {redessociales.map(({ name, icon: Icon, link }, i) => (
                <a
                  key={i}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-violet-500 hover:text-white transition-all transform hover:scale-110"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Pie inferior */}
        <div className="pt-6 text-center text-xs text-gray-500">
          <p>
            COPYRIGHT © 2025 | MUNICIPALIDAD DE RÍO GALLEGOS
          </p>
          <p className="mt-2">
            <a href="https://riogallegos.gob.ar/rgl/politicas-de-privacidad/" className="hover:text-violet-400 transition-colors">
              Políticas de Privacidad
            </a>{" "}
            |{" "}
            <a href="https://riogallegos.gob.ar/rgl/terminos-y-condiciones/" className="hover:text-violet-400 transition-colors">
              Términos y Condiciones
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
