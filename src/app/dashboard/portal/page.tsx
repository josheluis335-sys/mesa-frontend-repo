'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

interface Ticket {
  id: number;
  numeroCaso: string;
  tipo: string;
  titulo: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  fechaCreacion: string;
  solicitanteNombre: string;
  solicitanteCorreo: string;
}

export default function PortalPage() {
  const { token } = useAuth();
  const [numeroCaso, setNumeroCaso] = useState('');
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConsultar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setTicket(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/portal/consulta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ numeroCaso }),
      });

      const data = await res.json();

      if (res.ok) {
        setTicket(data.data);
      } else {
        setError(data.message || 'Ticket no encontrado');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
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

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'Crítica': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Alta': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Media': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Baja': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getTipoBadge = (tipo: string) => (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${tipo === 'INC' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'}`}>
      {tipo}
    </span>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-black dark:text-white">Portal de Consulta</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Consulta el estado de tu ticket por número de caso</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <form onSubmit={handleConsultar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número de Caso</label>
            <input
              type="text"
              value={numeroCaso}
              onChange={e => setNumeroCaso(e.target.value.toUpperCase())}
              placeholder="Ej: INC0001, REQ0002"
              required
              className="w-full px-4 py-3 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-black dark:bg-white text-white dark:text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Consultando...' : 'Consultar'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
      </div>

      {ticket && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-xl font-semibold text-black dark:text-white">{ticket.numeroCaso}</h2>
              {getTipoBadge(ticket.tipo)}
              <span className={`px-2 py-0.5 text-xs font-medium rounded ${getPriorityColor(ticket.prioridad)}`}>
                {ticket.prioridad}
              </span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(ticket.estado)}`}>
                {ticket.estado}
              </span>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">{ticket.titulo}</h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{ticket.descripcion}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Solicitante</p>
                <p className="text-black dark:text-white">{ticket.solicitanteNombre}</p>
                <p className="text-gray-600 dark:text-gray-400">{ticket.solicitanteCorreo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Fecha de creación</p>
                <p className="text-black dark:text-white">
                  {new Date(ticket.fechaCreacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}