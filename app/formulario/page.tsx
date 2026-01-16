'use client';

import { useState } from 'react';
import TiposBoletinForm from './components/TipoBoletinForm';
import BoletinesForm from './components/BoletinesForm';
import CategoriasForm from './components/CategoriasForm';
import ResumenesForm from './components/ResumenesForm';
import Dashboard from './components/Dashboard';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-6">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Sistema de Boletines Municipales
        </h1>
        <p className="text-gray-600">Gestión completa de boletines, categorías y resúmenes</p>
      </header>

      {/* Navegación con pestañas */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'dashboard'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            Panel de control
          </button>
          <button
            onClick={() => setActiveTab('tipos')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'tipos'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            Tipos de Boletín
          </button>
          <button
            onClick={() => setActiveTab('boletines')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'boletines'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            Boletines
          </button>
          <button
            onClick={() => setActiveTab('categorias')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'categorias'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            Categorías
          </button>
          <button
            onClick={() => setActiveTab('resumenes')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'resumenes'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            Documentos
          </button>
        </div>
      </div>

      {/* Contenido de la pestaña activa */}
      <div className={`${activeTab === 'dashboard' ? 'max-w-6xl' : 'max-w-8xl px-20'} mx-auto`}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'tipos' && <TiposBoletinForm />}
        {activeTab === 'boletines' && <BoletinesForm />}
        {activeTab === 'categorias' && <CategoriasForm />}
        {activeTab === 'resumenes' && <ResumenesForm />}
      </div>
    </div>
  );
}