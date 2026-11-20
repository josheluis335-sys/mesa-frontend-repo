'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { BarChart, DonutChart, StatCard, AreaChart } from '@/components/charts/Charts';

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

interface User {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  activo: boolean;
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    total: 0, 
    nuevos: 0, 
    enProceso: 0, 
    cerrados: 0,
    porPrioridad: { Critica: 0, Alta: 0, Media: 0, Baja: 0 },
    porTipo: { INC: 0, REQ: 0 },
    ultimos7Dias: [] as Array<{ label: string; value: number }>,
  });

  const fetchData = async () => {
    if (!token) return;
    try {
      const [ticketsRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/tickets`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/usuarios`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      
      if (ticketsRes.ok) {
        const ticketsData = (await ticketsRes.json()).data || [];
        setTickets(ticketsData);
        
        const porPrioridad = { Critica: 0, Alta: 0, Media: 0, Baja: 0 };
        const porTipo = { INC: 0, REQ: 0 };
        
        ticketsData.forEach((t: Ticket) => {
          if (t.prioridad in porPrioridad) porPrioridad[t.prioridad as keyof typeof porPrioridad]++;
          if (t.tipo in porTipo) porTipo[t.tipo as keyof typeof porTipo]++;
        });
        
        const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          const dayStart = new Date(date.setHours(0,0,0,0));
          const dayEnd = new Date(date.setHours(23,59,59,999));
          const count = ticketsData.filter((t: Ticket) => {
            const created = new Date(t.fechaCreacion);
            return created >= dayStart && created <= dayEnd;
          }).length;
          return {
            label: date.toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: '2-digit' }),
            value: count,
          };
        });
        
        setStats({
          total: ticketsData.length,
          nuevos: ticketsData.filter((t: Ticket) => t.estado === 'Nuevo').length,
          enProceso: ticketsData.filter((t: Ticket) => t.estado === 'En Proceso').length,
          cerrados: ticketsData.filter((t: Ticket) => t.estado === 'Cerrado').length,
          porPrioridad,
          porTipo,
          ultimos7Dias,
        });
      }
      
      if (usersRes.ok) {
        setUsers((await usersRes.json()).data || []);
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

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'Crítica': return 'badge-critical';
      case 'Alta': return 'badge-high';
      case 'Media': return 'badge-medium';
      case 'Baja': return 'badge-low';
      default: return 'badge-closed';
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'Nuevo': return 'badge-new';
      case 'En Proceso': return 'badge-in-progress';
      case 'Cerrado': return 'badge-closed';
      default: return 'badge-closed';
    }
  };

  const getTipoBadge = (tipo: string) => (
    <span className={`badge ${tipo === 'INC' ? 'badge-incident' : 'badge-request'}`}>
      {tipo}
    </span>
  );

  return (
    <div className="space-y-8 animate-fade-in bg-mesh-pattern/50 p-6 rounded-2xl -m-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Vista general de la mesa de servicio</p>
        </div>
        <Link
          href="/dashboard/tickets/nuevo"
          className="btn-primary"
        >
          + Nuevo Ticket
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tickets"
          value={stats.total}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          trend={{ value: 12, label: 'vs mes anterior', positive: true }}
          color="bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
        />
        <StatCard
          title="Nuevos"
          value={stats.nuevos}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          trend={{ value: 5, label: 'hoy', positive: true }}
          color="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="En Proceso"
          value={stats.enProceso}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          trend={{ value: 3, label: 'pendientes', positive: false }}
          color="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
        />
        <StatCard
          title="Cerrados"
          value={stats.cerrados}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          trend={{ value: 18, label: 'esta semana', positive: true }}
          color="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-elevated p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-black dark:text-white">Tickets por Prioridad</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">Distribución actual</span>
          </div>
          <BarChart
            data={[
              { label: 'Crítica', value: stats.porPrioridad.Critica, color: '#ef4444' },
              { label: 'Alta', value: stats.porPrioridad.Alta, color: '#f97316' },
              { label: 'Media', value: stats.porPrioridad.Media, color: '#eab308' },
              { label: 'Baja', value: stats.porPrioridad.Baja, color: '#22c55e' },
            ]}
            height={240}
            showValues={true}
          />
        </div>

        <div className="card-elevated p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-black dark:text-white">Por Tipo</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">INC vs REQ</span>
          </div>
          <DonutChart
            data={[
              { label: 'Incidentes', value: stats.porTipo.INC, color: '#ef4444' },
              { label: 'Requerimientos', value: stats.porTipo.REQ, color: '#3b82f6' },
            ]}
            size={200}
            strokeWidth={16}
          />
        </div>
      </div>

      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-black dark:text-white">Actividad Reciente (7 días)</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">Tickets creados por día</span>
        </div>
        <AreaChart
                  data={stats.ultimos7Dias}
                  height={160}
                  color="#000000"
                  fillOpacity={0.1}
                />
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-black dark:text-white">Tickets Recientes</h2>
          <Link href="/dashboard/tickets" className="btn-ghost text-sm">
            Ver todos
          </Link>
        </div>
        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="table-cell">Caso</th>
                <th className="table-cell">Tipo</th>
                <th className="table-cell">Título</th>
                <th className="table-cell">Prioridad</th>
                <th className="table-cell">Estado</th>
                <th className="table-cell">Solicitante</th>
                <th className="table-cell">Creado</th>
                <th className="table-cell">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="table-cell text-center py-12">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-6 w-6 text-gray-400" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Cargando...
                    </div>
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-cell text-center py-12">
                    <div className="empty-state">
                                          <div className="empty-state-icon">
                                            <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                          </div>
                      <p className="empty-state-title">No hay tickets registrados</p>
                      <p className="empty-state-description">Comienza creando tu primer ticket para ver la actividad aquí.</p>
                      <Link href="/dashboard/tickets/nuevo" className="btn-primary inline-block">
                        Crear Ticket
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                tickets.slice(0, 10).map((ticket) => (
                  <tr key={ticket.id} className="table-row">
                    <td className="table-cell font-mono text-sm font-medium text-black dark:text-white">{ticket.numeroCaso}</td>
                    <td className="table-cell">{getTipoBadge(ticket.tipo)}</td>
                    <td className="table-cell text-sm text-black dark:text-white max-w-xs truncate block">{ticket.titulo}</td>
                    <td className="table-cell">
                      <span className={`badge ${getPriorityColor(ticket.prioridad)}`}>
                        {ticket.prioridad}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${getStatusColor(ticket.estado)}`}>
                        {ticket.estado}
                      </span>
                    </td>
                    <td className="table-cell text-sm text-gray-600 dark:text-gray-400">
                      {ticket.solicitanteNombre} ({ticket.solicitanteCorreo})
                    </td>
                    <td className="table-cell text-sm text-gray-500 dark:text-gray-400">
                      {new Date(ticket.fechaCreacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="table-cell">
                      <Link
                        href={`/dashboard/tickets/${ticket.id}`}
                        className="text-sm font-medium text-black dark:text-white hover:underline"
                      >
                        Ver
                      </Link>
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
