'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

interface SLAPolitica {
  id: number;
  tipo: string;
  prioridad: string;
  tiempoRespuestaMinutos: number;
  tiempoResolucionMinutos: number;
}

export default function SLAPage() {
  const { token } = useAuth();
  const [slas, setSlas] = useState<SLAPolitica[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<SLAPolitica | null>(null);
  const [formData, setFormData] = useState({
    tipo: 'INC',
    prioridad: 'Media',
    tiempoRespuestaMinutos: 120,
    tiempoResolucionMinutos: 1440,
  });
  const [error, setError] = useState('');

  const fetchSLAs = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/sla-politicas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSlas(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching SLA:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSLAs();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const url = editing ? `${API_URL}/sla-politicas/${editing.id}` : `${API_URL}/sla-politicas`;
      const method = editing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tipo: formData.tipo,
          prioridad: formData.prioridad,
          tiempoRespuestaMinutos: formData.tiempoRespuestaMinutos,
          tiempoResolucionMinutos: formData.tiempoResolucionMinutos,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        fetchSLAs();
        setShowModal(false);
        setEditing(null);
        setFormData({ tipo: 'INC', prioridad: 'Media', tiempoRespuestaMinutos: 120, tiempoResolucionMinutos: 1440 });
      } else {
        setError(data.message || 'Error al guardar');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    }
  };

  const handleEdit = (sla: SLAPolitica) => {
    setEditing(sla);
    setFormData({
      tipo: sla.tipo,
      prioridad: sla.prioridad,
      tiempoRespuestaMinutos: sla.tiempoRespuestaMinutos,
      tiempoResolucionMinutos: sla.tiempoResolucionMinutos,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta política SLA?')) return;

    try {
      const res = await fetch(`${API_URL}/sla-politicas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchSLAs();
    } catch (err) {
      console.error('Error deleting SLA:', err);
    }
  };

  const openNewModal = () => {
    setEditing(null);
    setFormData({ tipo: 'INC', prioridad: 'Media', tiempoRespuestaMinutos: 120, tiempoResolucionMinutos: 1440 });
    setShowModal(true);
  };

  const getTipoBadge = (tipo: string) => (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${tipo === 'INC' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'}`}>
      {tipo}
    </span>
  );

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'Crítica': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Alta': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Media': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Baja': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const formatTime = (minutos: number) => {
    if (minutos < 60) return `${minutos}m`;
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return mins > 0 ? `${horas}h ${mins}m` : `${horas}h`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-black dark:text-white">Políticas SLA</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Tiempos de respuesta y resolución por tipo y prioridad</p>
        </div>
        <button onClick={openNewModal} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity rounded self-start">
          + Nueva Política
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              {editing ? 'Editar Política SLA' : 'Nueva Política SLA'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={e => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                >
                  <option value="INC">Incidente (INC)</option>
                  <option value="REQ">Requerimiento (REQ)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridad</label>
                <select
                  name="prioridad"
                  value={formData.prioridad}
                  onChange={e => setFormData(prev => ({ ...prev, prioridad: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                >
                  <option value="Crítica">Crítica</option>
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tiempo Respuesta (min)</label>
                  <input
                    type="number"
                    name="tiempoRespuestaMinutos"
                    value={formData.tiempoRespuestaMinutos}
                    onChange={e => setFormData(prev => ({ ...prev, tiempoRespuestaMinutos: Number(e.target.value) }))}
                    min={1}
                    className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tiempo Resolución (min)</label>
                  <input
                    type="number"
                    name="tiempoResolucionMinutos"
                    value={formData.tiempoResolucionMinutos}
                    onChange={e => setFormData(prev => ({ ...prev, tiempoResolucionMinutos: Number(e.target.value) }))}
                    min={1}
                    className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  />
                </div>
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
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Prioridad</th>
                <th className="px-6 py-3">Tiempo Respuesta</th>
                <th className="px-6 py-3">Tiempo Resolución</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">Cargando...</td></tr>
              ) : slas.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No hay políticas SLA</td></tr>
              ) : (
                slas.map(sla => (
                  <tr key={sla.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 font-mono text-sm text-black dark:text-white">{sla.id}</td>
                    <td className="px-6 py-4">{getTipoBadge(sla.tipo)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${getPriorityColor(sla.prioridad)}`}>
                        {sla.prioridad}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-black dark:text-white font-mono">{formatTime(sla.tiempoRespuestaMinutos)}</td>
                    <td className="px-6 py-4 text-black dark:text-white font-mono">{formatTime(sla.tiempoResolucionMinutos)}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleEdit(sla)} className="text-sm text-black dark:text-white hover:underline mr-3">Editar</button>
                      <button onClick={() => handleDelete(sla.id)} className="text-sm text-red-600 dark:text-red-400 hover:underline">Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Referencia de tiempos sugeridos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4">
            <p className="text-red-600 dark:text-red-400 font-bold">Crítica</p>
            <p className="text-gray-600 dark:text-gray-400">Respuesta: 15m | Resolución: 4h</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4">
            <p className="text-orange-600 dark:text-orange-400 font-bold">Alta</p>
            <p className="text-gray-600 dark:text-gray-400">Respuesta: 30m | Resolución: 8h</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4">
            <p className="text-yellow-600 dark:text-yellow-400 font-bold">Media</p>
            <p className="text-gray-600 dark:text-gray-400">Respuesta: 2h | Resolución: 24h</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4">
            <p className="text-green-600 dark:text-green-400 font-bold">Baja</p>
            <p className="text-gray-600 dark:text-gray-400">Respuesta: 4h | Resolución: 72h</p>
          </div>
        </div>
      </div>
    </div>
  );
}
