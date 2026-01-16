'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { FiSave, FiTrash2, FiEdit2, FiFileText, FiAlertCircle } from 'react-icons/fi';

const API_URL = 'http://localhost:8000';

export default function TiposBoletinForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTipos();
  }, []);

  const fetchTipos = async () => {
    try {
      const response = await axios.get(`${API_URL}/tipos-boletin/`);
      setTipos(response.data);
    } catch (error) {
      console.error('Error fetching tipos:', error);
      alert('Error al cargar tipos de boletín');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API_URL}/tipos-boletin/${editingId}`, data);
        alert('Tipo de boletín actualizado exitosamente');
      } else {
        await axios.post(`${API_URL}/tipos-boletin/`, data);
        alert('Tipo de boletín creado exitosamente');
      }
      reset();
      setEditingId(null);
      fetchTipos();
    } catch (error) {
      console.error('Error saving tipo:', error);
      alert('Error al guardar el tipo de boletín');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tipo) => {
    reset({
      nombre: tipo.nombre,
      observacion: tipo.observacion
    });
    setEditingId(tipo.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este tipo de boletín? Esto podría afectar a los boletines existentes.')) return;
    
    try {
      await axios.delete(`${API_URL}/tipos-boletin/${id}`);
      alert('Tipo de boletín eliminado exitosamente');
      fetchTipos();
    } catch (error) {
      console.error('Error deleting tipo:', error);
      alert('Error al eliminar el tipo de boletín');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Formulario */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FiFileText className="text-indigo-600" />
          {editingId ? '✏️ Editar Tipo de Boletín' : '📋 Nuevo Tipo de Boletín'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Tipo *
            </label>
            <input
              type="text"
              {...register('nombre', { 
                required: 'Este campo es requerido',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Ej: Ordinario, Extraordinario, Especial"
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observación
            </label>
            <textarea
              {...register('observacion', { 
                required: 'La observación es requerida'
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
              placeholder="Descripción o notas sobre este tipo de boletín"
              rows={4}
            />
            {errors.observacion && (
              <p className="mt-1 text-sm text-red-600">{errors.observacion.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FiSave />
              {loading ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear Tipo'}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  reset();
                  setEditingId(null);
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de tipos */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">📋 Tipos Registrados</h3>
        
        {tipos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FiFileText size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No hay tipos de boletín registrados</p>
            <p className="text-sm text-gray-400 mt-1">Crea el primer tipo para poder crear boletines</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {tipos.map((tipo) => (
              <div key={tipo.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition group">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-lg mb-1">{tipo.nombre}</h4>
                    <p className="text-sm text-gray-600 mb-2">{tipo.observacion}</p>
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                      ID: {tipo.id}
                    </span>
                  </div>
                  <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(tipo)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="Editar"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(tipo.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Eliminar"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}