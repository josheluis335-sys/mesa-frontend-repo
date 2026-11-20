'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

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
  categoria?: { id: number; nombre: string };
  creadoPor?: { id: number; nombre: string };
}

export default function TicketDetallePage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTicket = async () => {
    if (!token || !params.id) return;
    try {
      const res = await fetch(`${API_URL}/tickets/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTicket(data.data);
      } else {
        setError('Ticket no encontrado');
        router.push('/dashboard/tickets');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [token, params.id]);

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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">{error || 'Ticket no encontrado'}</p>
        <a href="/dashboard/tickets" className="mt-4 inline-block text-black dark:text-white underline">Volver</a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-display font-bold text-black dark:text-white">{ticket.numeroCaso}</h1>
            {getTipoBadge(ticket.tipo)}
          </div>
          <p className="text-gray-500 dark:text-gray-400">{ticket.titulo}</p>
        </div>
        <a
          href="/dashboard/tickets"
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm tracking-widest uppercase hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded self-start"
        >
          ← Volver
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Descripción</h3>
            <div className="prose prose-invert dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {ticket.descripcion}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Información del Solicitante</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <dt className="text-gray-500 dark:text-gray-400">Nombre</dt>
              <dd className="text-black dark:text-white font-medium">{ticket.solicitanteNombre}</dd>
              <dt className="text-gray-500 dark:text-gray-400">Email</dt>
              <dd className="text-black dark:text-white font-medium">{ticket.solicitanteCorreo}</dd>
              <dt className="text-gray-500 dark:text-gray-400">Canal</dt>
              <dd className="text-black dark:text-white font-medium capitalize">{ticket.canalOrigen}</dd>
              <dt className="text-gray-500 dark:text-gray-400">Creado por</dt>
              <dd className="text-black dark:text-white font-medium">{ticket.creadoPor?.nombre || '—'}</dd>
            </dl>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Bitácora / Historial</h3>
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              No hay eventos registrados aún.
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Estado</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Estado actual</label>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded ${getStatusColor(ticket.estado)}`}>
                  {ticket.estado}
                </span>
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Prioridad</label>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded ${getPriorityColor(ticket.prioridad)}`}>
                  {ticket.prioridad}
                </span>
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">SLA (minutos)</label>
                <p className="text-black dark:text-white font-mono">{ticket.slaMinutos}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Categoría</label>
                <p className="text-black dark:text-white">{ticket.categoria?.nombre || '—'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Fechas</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Creado</dt>
                <dd className="text-black dark:text-white font-medium">
                  {new Date(ticket.fechaCreacion).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Actualizado</dt>
                <dd className="text-black dark:text-white font-medium">
                  {new Date(ticket.fechaActualizacion).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Acciones</h3>
            <div className="space-y-2">
              <select className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white">
                <option value="">Cambiar estado...</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Cerrado">Cerrado</option>
              </select>
              <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm tracking-widest uppercase hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded">
                Asignar a mí
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm tracking-widest uppercase hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded">
                Agregar anotación
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}