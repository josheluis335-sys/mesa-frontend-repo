'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

interface Categoria {
  id: number;
  nombre: string;
  areaId?: number;
  areaSugeridaId?: number;
}

interface Area {
  id: number;
  nombre: string;
}

export default function CategoriasPage() {
  const { token } = useAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Categoria | null>(null);
  const [formData, setFormData] = useState({ nombre: '', areaSugeridaId: '' });
  const [error, setError] = useState('');

  const fetchData = async () => {
    if (!token) return;
    try {
      const [catsRes, areasRes] = await Promise.all([
        fetch(`${API_URL}/categorias`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/areas`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (catsRes.ok) {
        const data = await catsRes.json();
        setCategorias(data.data || []);
      }
      if (areasRes.ok) {
        const data = await areasRes.json();
        setAreas(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const url = editing ? `${API_URL}/categorias/${editing.id}` : `${API_URL}/categorias`;
      const method = editing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          areaSugeridaId: formData.areaSugeridaId ? Number(formData.areaSugeridaId) : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        fetchData();
        setShowModal(false);
        setEditing(null);
        setFormData({ nombre: '', areaSugeridaId: '' });
      } else {
        setError(data.message || 'Error al guardar');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    }
  };

  const handleEdit = (cat: Categoria) => {
    setEditing(cat);
    setFormData({ nombre: cat.nombre, areaSugeridaId: cat.areaSugeridaId?.toString() || '' });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta categoría?')) return;

    try {
      const res = await fetch(`${API_URL}/categorias/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Error deleting categoria:', err);
    }
  };

  const openNewModal = () => {
    setEditing(null);
    setFormData({ nombre: '', areaSugeridaId: '' });
    setShowModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-black dark:text-white">Categorías</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gestión de categorías de tickets</p>
        </div>
        <button onClick={openNewModal} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity rounded self-start">
          + Nueva Categoría
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              {editing ? 'Editar Categoría' : 'Nueva Categoría'}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Área sugerida</label>
                <select
                  name="areaSugeridaId"
                  value={formData.areaSugeridaId}
                  onChange={e => setFormData(prev => ({ ...prev, areaSugeridaId: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                >
                  <option value="">Sin área sugerida</option>
                  {areas.map(a => (
                    <option key={a.id} value={a.id}>{a.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm tracking-widest uppercase hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded">Cancelar</button>
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
                <th className="px-6 py-3">Área sugerida</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">Cargando...</td></tr>
              ) : categorias.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No hay categorías</td></tr>
              ) : (
                categorias.map(cat => (
                  <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 font-mono text-sm text-black dark:text-white">{cat.id}</td>
                    <td className="px-6 py-4 text-black dark:text-white">{cat.nombre}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {areas.find(a => a.id === cat.areaSugeridaId)?.nombre || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleEdit(cat)} className="text-sm text-black dark:text-white hover:underline mr-3">Editar</button>
                      <button onClick={() => handleDelete(cat.id)} className="text-sm text-red-600 dark:text-red-400 hover:underline">Eliminar</button>
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