"use client";
import BoletinList from "@/components/listado";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br">
      {/* Hero Section mejorada */}
      <section className="relative">
        <div className="relative h-[70vh] overflow-hidden">
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
        <div className="text-center my-8">
          <h2 className="text-2xl md:text-4xl font-bold text-[#300E7A] dark:text-[#c5b9df]">
            Una plataforma para la información ciudadana
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Ordenanzas, decretos, contrataciones, normativas y avisos oficiales.
          </p>
          <div className="mt-4 mx-auto w-11/12 border-b-4 border-blue-400 dark:border-gray-500"></div>
        </div>
        
        <div className="mb-6">
          <div className="text-center my-8">
            <h2 className="text-2xl md:text-3xl font-bold dark:text-[#c5b9df] text-[#300E7A]">
              Boletines registrados
            </h2>
          </div>
          
          {/* Contenedor centrado para BoletinList */}
          <div className="flex justify-center">
            <div className="w-full max-w-screen-xl">
              <BoletinList />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}