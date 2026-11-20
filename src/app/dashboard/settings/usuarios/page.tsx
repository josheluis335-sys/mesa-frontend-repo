'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  areaId: number | null;
  activo: boolean;
}

interface Area {
  id: number;
  nombre: string;
}

export default function UsuariosPage() {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nombre: '', correo: '', password: '', rol: 'Agente', areaId: '', activo: true
  });
  const [error, setError] = useState('');

  const fetchData = async () => {
    if (!token) return;
    try {
      const [usersRes, areasRes] = await Promise.all([
        fetch(`${API_URL}/usuarios`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/areas`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsuarios(data.data || []);
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
      const payload = {
        nombre: formData.nombre,
        correo: formData.correo,
        rol: formData.rol,
        areaId: formData.areaId ? Number(formData.areaId) : null,
        ...(formData.password && { password: formData.password }),
      };

      const url = editing ? `${API_URL}/usuarios/${editing.id}` : `${API_URL}/usuarios`;
      const method = editing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        fetchData();
        setShowModal(false);
        setEditing(null);
        setFormData({ nombre: '', correo: '', password: '', rol: 'Agente', areaId: '', activo: true });
      } else {
        setError(data.message || 'Error al guardar');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    }
  };

  const handleEdit = (user: Usuario) => {
    setEditing(user);
    setFormData({
      nombre: user.nombre,
      correo: user.correo,
      password: '',
      rol: user.rol,
      areaId: user.areaId?.toString() || '',
      activo: user.activo,
    });
    setShowModal(true);
  };

  const handleToggleStatus = async (id: number, activate: boolean) => {
    try {
      const res = await fetch(`${API_URL}/usuarios/${id}/${activate ? 'activar' : 'desactivar'}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleResetPassword = async (id: number) => {
    const newPass = prompt('Nueva contraseña:');
    if (!newPass) return;
    try {
      const res = await fetch(`${API_URL}/usuarios/${id}/restablecer-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPass }),
      });
      if (!res.ok) alert('Error al restablecer');
    } catch (err) {
      console.error('Error resetting password:', err);
    }
  };

  const openNewModal = () => {
    setEditing(null);
    setFormData({ nombre: '', correo: '', password: '', rol: 'Agente', areaId: '', activo: true });
    setShowModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-black dark:text-white">Usuarios</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gestión de usuarios del sistema</p>
        </div>
        <button onClick={openNewModal} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity rounded self-start">
          + Nuevo Usuario
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              {editing ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={e => setFormData(prev => ({ ...prev, nombre: e.target.value }))} required className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo</label>
                <input type="email" name="correo" value={formData.correo} onChange={e => setFormData(prev => ({ ...prev, correo: e.target.value }))} required className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña {editing ? '(dejar vacío para no cambiar)' : ''}</label>
                <input type="password" name="password" value={formData.password} onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))} required={!editing} className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rol</label>
                <select name="rol" value={formData.rol} onChange={e => setFormData(prev => ({ ...prev, rol: e.target.value }))} className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white">
                  <option value="Administrador">Administrador</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Agente">Agente</option>
                  <option value="Cliente">Cliente</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Área</label>
                <select name="areaId" value={formData.areaId} onChange={e => setFormData(prev => ({ ...prev, areaId: e.target.value }))} className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white">
                  <option value="">Sin área asignada</option>
                  {areas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="activa" checked={formData.activo} onChange={e => setFormData(prev => ({ ...prev, activo: e.target.checked }))} className="w-4 h-4 border-gray-300 dark:border-gray-700 rounded text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white" />
                <label className="text-sm text-gray-700 dark:text-gray-300">Activo</label>
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
                <th className="px-6 py-3">Correo</th>
                <th className="px-6 py-3">Rol</th>
                <th className="px-6 py-3">Área</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">Cargando...</td></tr>
              ) : usuarios.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No hay usuarios</td></tr>
              ) : (
                usuarios.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 font-mono text-sm text-black dark:text-white">{u.id}</td>
                    <td className="px-6 py-4 text-black dark:text-white">{u.nombre}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{u.correo}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400">{u.rol}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {areas.find(a => a.id === u.areaId)?.nombre || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${u.activo ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleEdit(u)} className="text-sm text-black dark:text-white hover:underline mr-3">Editar</button>
                      <button onClick={() => handleToggleStatus(u.id, !u.activo)} className="text-sm text-blue-600 dark:text-blue-400 hover:underline mr-3">
                        {u.activo ? 'Desactivar' : 'Activar'}
                      </button>
                      <button onClick={() => handleResetPassword(u.id)} className="text-sm text-orange-600 dark:text-orange-400 hover:underline mr-3">Reset Pass</button>
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