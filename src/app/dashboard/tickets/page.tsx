'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

interface Ticket {
  id: number;
  numeroCaso: string;
  tipo: string;
  titulo: string;
  descripcion: string;
  categoriaId: number;
  prioridad: string;
  canalOrigen: string;
  estado: string;
  solicitanteNombre: string;
  solicitanteCorreo: string;
  creadoPorId: number;
  slaMinutos: number;
  areaActualId: number | null;
  asignadoAId: number | null;
  fechaCreacion: string;
  fechaActualizacion: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  areaId: number | null;
  activo: boolean;
}

export default function TicketsPage() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [agentes, setAgentes] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterPrioridad, setFilterPrioridad] = useState('');

  const fetchTickets = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/categorias`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCategorias(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching categorias:', err);
    }
  };

  const fetchAgentes = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAgentes((data.data || []).filter((u: Usuario) => ['Agente', 'Supervisor', 'Administrador'].includes(u.rol) && u.activo));
      }
    } catch (err) {
      console.error('Error fetching agentes:', err);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchCategorias();
    fetchAgentes();
  }, [token]);

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.numeroCaso.toLowerCase().includes(search.toLowerCase()) ||
      t.titulo.toLowerCase().includes(search.toLowerCase()) ||
      t.solicitanteNombre.toLowerCase().includes(search.toLowerCase()) ||
      t.solicitanteCorreo.toLowerCase().includes(search.toLowerCase());
    const matchesEstado = !filterEstado || t.estado === filterEstado;
    const matchesPrioridad = !filterPrioridad || t.prioridad === filterPrioridad;
    return matchesSearch && matchesEstado && matchesPrioridad;
  });

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'Crítica': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Alta': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Media': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Baja': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'Nuevo': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'En Proceso': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Cerrado': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getTipoBadge = (tipo: string) => (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${tipo === 'INC' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'}`}>
      {tipo}
    </span>
  );

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`${API_URL}/tickets/${id}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: newStatus }),
      });
      if (res.ok) fetchTickets();
    } catch (err) {
      console.error('Error changing status:', err);
    }
  };

  const handleAssign = async (id: number, asignadoAId: number | null) => {
    try {
      const res = await fetch(`${API_URL}/tickets/${id}/asignar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ asignadoAId }),
      });
      if (res.ok) fetchTickets();
    } catch (err) {
      console.error('Error assigning:', err);
    }
  };

  const handleEscalar = async (id: number) => {
    if (!confirm('¿Escalar este ticket?')) return;
    try {
      const res = await fetch(`${API_URL}/tickets/${id}/escalar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchTickets();
    } catch (err) {
      console.error('Error escalating:', err);
    }
  };

  const handlePausar = async (id: number) => {
    const motivo = prompt('Motivo de la pausa:');
    if (!motivo) return;
    try {
      const res = await fetch(`${API_URL}/tickets/${id}/pausar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ motivo }),
      });
      if (res.ok) fetchTickets();
    } catch (err) {
      console.error('Error pausing:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-black dark:text-white">Tickets</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gestión y seguimiento de casos</p>
        </div>
        <Link
          href="/dashboard/tickets/nuevo"
          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity rounded self-start"
        >
          + Nuevo Ticket
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar por caso, título, solicitante..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={filterEstado}
            onChange={e => setFilterEstado(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          >
            <option value="">Todos los estados</option>
            <option value="Nuevo">Nuevo</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Cerrado">Cerrado</option>
          </select>
          <select
            value={filterPrioridad}
            onChange={e => setFilterPrioridad(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          >
            <option value="">Todas las prioridades</option>
            <option value="Crítica">Crítica</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-3">Caso</th>
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Título</th>
                <th className="px-6 py-3">Categoría</th>
                <th className="px-6 py-3">Prioridad</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Asignado</th>
                <th className="px-6 py-3">Solicitante</th>
                <th className="px-6 py-3">Canal</th>
                <th className="px-6 py-3">Creado</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                <tr><td colSpan={11} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">Cargando...</td></tr>
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No hay tickets. <Link href="/dashboard/tickets/nuevo" className="text-black dark:text-white underline">Crear uno</Link>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 font-mono text-sm text-black dark:text-white">{ticket.numeroCaso}</td>
                    <td className="px-6 py-4">{getTipoBadge(ticket.tipo)}</td>
                    <td className="px-6 py-4 text-sm text-black dark:text-white max-w-xs truncate">{ticket.titulo}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {categorias.find(c => c.id === ticket.categoriaId)?.nombre || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${getPriorityColor(ticket.prioridad)}`}>
                        {ticket.prioridad}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={ticket.estado}
                        onChange={e => handleStatusChange(ticket.id, e.target.value)}
                        className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(ticket.estado)} border border-transparent focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white cursor-pointer`}
                      >
                        <option value="Nuevo">Nuevo</option>
                        <option value="En Proceso">En Proceso</option>
                        <option value="Cerrado">Cerrado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={ticket.asignadoAId || ''}
                        onChange={e => handleAssign(ticket.id, e.target.value ? Number(e.target.value) : null)}
                        className="px-2 py-0.5 text-xs bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white cursor-pointer w-full"
                      >
                        <option value="">Sin asignar</option>
                        {agentes.map(a => (
                          <option key={a.id} value={a.id}>{a.nombre}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {ticket.solicitanteNombre} ({ticket.solicitanteCorreo})
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 capitalize">{ticket.canalOrigen}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(ticket.fechaCreacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/tickets/${ticket.id}`}
                          className="text-sm text-black dark:text-white hover:underline font-medium"
                        >
                          Ver
                        </Link>
                        {ticket.estado !== 'Cerrado' && (
                          <>
                            <button
                              onClick={() => handleEscalar(ticket.id)}
                              className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
                            >
                              Escalar
                            </button>
                            <button
                              onClick={() => handlePausar(ticket.id)}
                              className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
                            >
                              Pausar
                            </button>
                          </>
                        )}
                      </div>
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
