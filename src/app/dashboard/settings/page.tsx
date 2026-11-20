'use client';

import Link from 'next/link';

const settingsMenu = [
  { href: '/dashboard/settings/areas', label: 'Áreas', icon: '🏢', description: 'Gestión de áreas de soporte' },
  { href: '/dashboard/settings/categorias', label: 'Categorías', icon: '📂', description: 'Categorías de tickets' },
  { href: '/dashboard/settings/sla', label: 'Políticas SLA', icon: '⏱️', description: 'Tiempos de respuesta y resolución' },
  { href: '/dashboard/settings/usuarios', label: 'Usuarios', icon: '👥', description: 'Gestión de usuarios y roles' },
];

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-black dark:text-white">Configuración</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Administra la configuración del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {settingsMenu.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="card p-6 hover:border-black dark:hover:border-white transition-colors"
          >
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-1">{item.label}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}