'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

interface Area {
  id: number;
  nombre: string;
  activa: boolean;
}

export default function AreasPage() {
  const { token } = useAuth();
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [formData, setFormData] = useState({ nombre: '', activa: true });
  const [error, setError] = useState('');

  const fetchAreas = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/areas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAreas(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching areas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const url = editingArea ? `${API_URL}/areas/${editingArea.id}` : `${API_URL}/areas`;
      const method = editingArea ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        fetchAreas();
        setShowModal(false);
        setEditingArea(null);
        setFormData({ nombre: '', activa: true });
      } else {
        setError(data.message || 'Error al guardar');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    }
  };

  const handleEdit = (area: Area) => {
    setEditingArea(area);
    setFormData({ nombre: area.nombre, activa: area.activa });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta área?')) return;

    try {
      const res = await fetch(`${API_URL}/areas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchAreas();
    } catch (err) {
      console.error('Error deleting area:', err);
    }
  };

  const openNewModal = () => {
    setEditingArea(null);
    setFormData({ nombre: '', activa: true });
    setShowModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-black dark:text-white">Áreas</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gestión de áreas de soporte</p>
        </div>
        <button onClick={openNewModal} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity rounded self-start">
          + Nueva Área
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              {editingArea ? 'Editar Área' : 'Nueva Área'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={e => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  required
                  className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="activa"
                  checked={formData.activa}
                  onChange={e => setFormData(prev => ({ ...prev, activa: e.target.checked }))}
                  className="w-4 h-4 border-gray-300 dark:border-gray-700 rounded text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Activa</label>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setEditingArea(null); }} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm tracking-widest uppercase hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity rounded">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">Cargando...</td></tr>
              ) : areas.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No hay áreas</td></tr>
              ) : (
                areas.map(area => (
                  <tr key={area.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 font-mono text-sm text-black dark:text-white">{area.id}</td>
                    <td className="px-6 py-4 text-black dark:text-white">{area.nombre}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${area.activa ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
                        {area.activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleEdit(area)} className="text-sm text-black dark:text-white hover:underline mr-3">Editar</button>
                      <button onClick={() => handleDelete(area.id)} className="text-sm text-red-600 dark:text-red-400 hover:underline">Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}