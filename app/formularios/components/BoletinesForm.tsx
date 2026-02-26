'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { FiSave, FiTrash2, FiEdit2, FiCalendar, FiFileText, FiAlertCircle } from 'react-icons/fi';

const API_URL = 'https://funcionlog.mrg-pruebas.site';

export default function BoletinesForm() {
  interface Boletin {
    id: number;
    tipo_boletin: number;
    fecha: string;
    edicion: number;
  }

  interface TipoBoletin {
    id: number;
    nombre: string;
  }

  const { register, handleSubmit, reset, formState: { errors } } = useForm<any>();
  const [boletines, setBoletines] = useState<Boletin[]>([]);
  const [tiposBoletin, setTiposBoletin] = useState<TipoBoletin[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchBoletines();
    fetchTiposBoletin();
  }, []);

  const fetchBoletines = async () => {
    try {
      const response = await axios.get(`${API_URL}/boletines/`);
      setBoletines(response.data);
    } catch (error) {
      console.error('Error fetching boletines:', error);
      alert('Error al cargar boletines');
    }
  };

  const fetchTiposBoletin = async () => {
    try {
      const response = await axios.get(`${API_URL}/tipos-boletin/`);
      setTiposBoletin(response.data);
    } catch (error) {
      console.error('Error fetching tipos:', error);
      alert('Error al cargar tipos de boletín');
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Convertir tipo_boletin a número
      const payload = {
        ...data,
        tipo_boletin: parseInt(data.tipo_boletin),
        fecha: `${data.fecha}T12:00:00`, // Forzar mediodía para evitar problemas de zona horaria (-1 día)
        edicion: parseInt(data.edicion)
      };

      if (editingId) {
        await axios.put(`${API_URL}/boletines/${editingId}`, payload);
        alert('Boletín actualizado exitosamente');
      } else {
        await axios.post(`${API_URL}/boletines/`, payload);
        alert('Boletín creado exitosamente');
      }
      reset();
      setEditingId(null);
      fetchBoletines();
    } catch (error: any) {
      console.error('Error saving boletin:', error);
      alert('Error al guardar el boletín: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (boletin: Boletin) => {
    reset({
      tipo_boletin: boletin.tipo_boletin,
      fecha: boletin.fecha,
      edicion: boletin.edicion
    });
    setEditingId(boletin.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este boletín? Se eliminarán también todos sus resúmenes.')) return;
    
    try {
      await axios.delete(`${API_URL}/boletines/${id}`);
      alert('Boletín eliminado exitosamente');
      fetchBoletines();
    } catch (error) {
      console.error('Error deleting boletin:', error);
      alert('Error al eliminar el boletín');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Formulario */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FiFileText className="text-blue-600" />
          {editingId ? '✏️ Editar Boletín' : '📄 Nuevo Boletín'}
        </h2>

        {tiposBoletin.length === 0 && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
            <FiAlertCircle className="text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">No hay tipos de boletín</p>
              <p className="text-xs text-yellow-700 mt-1">
                Primero debes crear tipos de boletín en la pestaña correspondiente
              </p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Boletín *
            </label>
            <select
              {...register('tipo_boletin', { required: 'Selecciona un tipo de boletín' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              disabled={tiposBoletin.length === 0}
            >
              <option value="">
                {tiposBoletin.length === 0 ? 'Primero crea un tipo de boletín' : 'Seleccionar tipo...'}
              </option>
              {tiposBoletin.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
            {errors.tipo_boletin && (
              <p className="mt-1 text-sm text-red-600">{(errors.tipo_boletin as any).message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Edición *
            </label>
            <input
              type="number"
              {...register('edicion', { 
                required: 'El número de edición es requerido',
                min: { value: 1, message: 'Debe ser mayor a 0' }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Ej: 1, 2, 3..."
            />
            {errors.edicion && (
              <p className="mt-1 text-sm text-red-600">{(errors.edicion as any).message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha *
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="date"
                {...register('fecha', { required: 'La fecha es requerida' })}
                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            {errors.fecha && (
              <p className="mt-1 text-sm text-red-600">{(errors.fecha as any).message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || tiposBoletin.length === 0}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FiSave />
              {loading ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear Boletín'}
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

      {/* Lista de boletines */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Boletines Registrados</h3>
        
        {boletines.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FiFileText size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No hay boletines registrados</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {boletines.map((boletin: Boletin) => {
              const tipo = tiposBoletin.find((t: TipoBoletin) => t.id === boletin.tipo_boletin);
              
              return (
                <div key={boletin.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {tipo?.nombre || `Tipo ID: ${boletin.tipo_boletin}`}
                      </h4>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                          📅 {new Date(boletin.fecha).toLocaleDateString('es-ES')}
                        </p>
                        <p className="text-sm text-blue-600 font-medium">
                          Edición N° {boletin.edicion}
                        </p>
                      </div>
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        ID: {boletin.id}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(boletin)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Editar"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(boletin.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Eliminar"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}