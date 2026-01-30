"use client";
import { useState, useEffect } from "react";
import BoletinList from "@/components/listado";
import { Spinner } from "@heroui/spinner";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [boletinesDisponibles, setBoletinesDisponibles] = useState(true);

  useEffect(() => {
    // Verificar si hay boletines publicados
    const verificarBoletines = async () => {
      try {
        const response = await fetch("http://localhost:8000/publicados/boletines");
        const data = await response.json();
        setBoletinesDisponibles(Array.isArray(data) && data.length > 0);
      } catch (error) {
        console.error("Error verificando boletines:", error);
        setBoletinesDisponibles(false);
      } finally {
        setIsLoading(false);
      }
    };

    verificarBoletines();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="flex flex-col justify-center items-center h-screen">
          <Spinner size="lg" label="Cargando boletines..." />
        </div>
      </main>
    );
  }

  if (!boletinesDisponibles) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        {/* <div className="flex flex-col justify-center items-center h-screen text-center px-4">
          <div className="max-w-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              📢 Boletines Municipales de Río Gallegos
            </h1>
            <p className="text-gray-600 mb-6">
              Aún no hay boletines publicados. Los boletines oficiales aparecerán aquí una vez que sean publicados por la administración.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">Información:</span> El sistema está en funcionamiento pero no hay contenido publicado aún.
              </p>
            </div>
          </div>
        </div> */}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Hero Section actualizada */}
      <section className="relative">
        <div className="relative h-[60vh] overflow-hidden">
          <picture>
            <source srcSet="/imagenMovil2.png" media="(max-width: 768px)" />
            <img
              src="/imageHome.png"
              alt="Boletin Oficial municipal de Río Gallegos"
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
          </picture>
        </div>
        
        {/* Texto debajo de la imagen */}
        <div className="text-center my-8 px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-[#300E7A] mb-4">
            Una plataforma para la información ciudadana
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Accede a todos los boletines oficiales, ordenanzas, decretos, contrataciones, 
            normativas y avisos publicados por la Municipalidad de Río Gallegos.
          </p>
          <div className="mt-6 mx-auto w-full max-w-3xl border-b-2 border-blue-300"></div>
        </div>
        
        {/* Sección de boletines */}
        <div className="container mx-auto px-4 pb-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#300E7A] mb-4">
              Boletines Oficiales Publicados
            </h2>
            
          </div>
          
          {/* Contenedor para BoletinList */}
          <div className="flex justify-center">
            <div className="w-full max-w-screen-2xl">
              <BoletinList />
            </div>
          </div>
          
          
        </div>
      </section>
    </main>
  );
}