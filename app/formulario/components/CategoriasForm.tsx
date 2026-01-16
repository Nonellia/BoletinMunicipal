// components/CategoriasForm.jsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { FiSave, FiTrash2, FiEdit2, FiTag, FiType } from 'react-icons/fi';

const API_URL = 'http://localhost:8000';

export default function CategoriasForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(`${API_URL}/categorias/`);
      setCategorias(response.data);
    } catch (error) {
      console.error('Error fetching categorias:', error);
      alert('Error al cargar categorías');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API_URL}/categorias/${editingId}`, data);
        alert('Categoría actualizada exitosamente');
      } else {
        await axios.post(`${API_URL}/categorias/`, data);
        alert('Categoría creada exitosamente');
      }
      reset();
      setEditingId(null);
      fetchCategorias();
    } catch (error) {
      console.error('Error saving categoria:', error);
      alert('Error al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (categoria) => {
    reset({
      nombre: categoria.nombre,
      abreviatura: categoria.abreviatura
    });
    setEditingId(categoria.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    
    try {
      await axios.delete(`${API_URL}/categorias/${id}`);
      alert('Categoría eliminada exitosamente');
      fetchCategorias();
    } catch (error) {
      console.error('Error deleting categoria:', error);
      alert('Error al eliminar la categoría');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Formulario */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FiTag className="text-green-600" />
          {editingId ? '✏️ Editar Categoría' : '🏷️ Nueva Categoría'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Categoría *
            </label>
            <div className="relative">
              <FiType className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                {...register('nombre', { 
                  required: 'Este campo es requerido',
                  minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                })}
                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                placeholder="Ej: Acuerdos, Resoluciones, Decretos"
              />
            </div>
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Abreviatura *
            </label>
            <input
              type="text"
              {...register('abreviatura', { 
                required: 'Este campo es requerido',
                maxLength: { value: 20, message: 'Máximo 20 caracteres' }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition uppercase"
              placeholder="Ej: ACU, RES, DEC"
            />
            {errors.abreviatura && (
              <p className="mt-1 text-sm text-red-600">{errors.abreviatura.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FiSave />
              {loading ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear Categoría'}
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

      {/* Lista de categorías */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">🏷️ Categorías Registradas</h3>
        
        {categorias.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FiTag size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No hay categorías registradas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
            {categorias.map((categoria) => (
              <div key={categoria.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">{categoria.nombre}</h4>
                    <div className="mt-2 inline-block px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                      {categoria.abreviatura}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(categoria)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                      title="Editar"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(categoria.id)}
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