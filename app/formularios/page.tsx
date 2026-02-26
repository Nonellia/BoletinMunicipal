'use client';

import { useState } from 'react';
import { useAuth } from "@/context/auth-context";
import { Button, User as UserInfo } from "@heroui/react";
import { LogOut } from "lucide-react";
import TiposBoletinForm from './components/TipoBoletinForm';
import BoletinesForm from './components/BoletinesForm';
import CategoriasForm from './components/CategoriasForm';
import ResumenesForm from './components/ResumenesForm';
import Dashboard from './components/Dashboard';
import PublicarBoletines from './components/PublicarBoletines';
import AdminsForm from './components/AdminsForm';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { logout, user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-6">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Sistema de Boletines Municipales
          </h1>
          <p className="text-gray-600">Gestión completa de boletines, categorías y resúmenes</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 pr-4 rounded-2xl shadow-sm border border-gray-100">
           {user && (
             <UserInfo
               name={user.username}
               description={user.email}
               avatarProps={{
                 src: `https://i.pravatar.cc/150?u=${user.id}`,
                 size: "sm"
               }}
             />
           )}
           <div className="w-px h-8 bg-gray-200 mx-2 hidden sm:block"></div>
           <Button 
             color="danger" 
             variant="light" 
             onPress={logout}
             isIconOnly
             className="min-w-unit-8 w-8 h-8 rounded-full"
             title="Cerrar Sesión"
           >
             <LogOut className="w-4 h-4" />
           </Button>
        </div>
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
            📊 Panel de control
          </button>
          <button
            onClick={() => setActiveTab('tipos')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'tipos'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            📋 Tipos de Boletín
          </button>
          <button
            onClick={() => setActiveTab('boletines')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'boletines'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            📄 Boletines
          </button>
          <button
            onClick={() => setActiveTab('categorias')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'categorias'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            🏷️ Categorías
          </button>
          <button
            onClick={() => setActiveTab('resumenes')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'resumenes'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            📝 Documentos
          </button>
          <button
            onClick={() => setActiveTab('publicar')}
            className={`px-4 py-2 rounded-lg transition-all font-medium ${activeTab === 'publicar'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-pink-200'
              }`}
          >
            🚀 Publicar Boletines
          </button>
          <button
            onClick={() => setActiveTab('admins')}
            className={`px-4 py-2 rounded-lg transition-all font-medium ${activeTab === 'admins'
              ? 'bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-slate-200'
              }`}
          >
            🛡️ Administradores
          </button>
        </div>
      </div>

      {/* Contenido de la pestaña activa */}
      <div className={`${activeTab === 'dashboard' || activeTab === 'publicar' ? 'max-w-6xl' : 'max-w-8xl px-20'} mx-auto`}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'tipos' && <TiposBoletinForm />}
        {activeTab === 'boletines' && <BoletinesForm />}
        {activeTab === 'categorias' && <CategoriasForm />}
        {activeTab === 'resumenes' && <ResumenesForm />}
        {activeTab === 'publicar' && <PublicarBoletines />}
        {activeTab === 'admins' && <AdminsForm />}
      </div>
    </div>
  );
}