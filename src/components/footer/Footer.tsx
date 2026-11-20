'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/dashboard" className="flex items-center gap-2 mb-4" aria-label="Mesa de Servicio - Inicio">
              <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white dark:text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="3" strokeWidth="2" />
                  <path d="M9 12h6M12 9v6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-black dark:text-white">Mesa de Servicio</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed max-w-md">
              Plataforma minimalista para gestión de tickets, escalamientos y control de niveles de servicio (SLA).
              Diseñada para equipos de soporte técnico que valoran la precisión y la simplicidad.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-black dark:text-white mb-4">Producto</h3>
            <nav className="space-y-2">
              <Link href="/dashboard/tickets" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Gestión de Tickets</Link>
              <Link href="/dashboard/settings/sla" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Políticas SLA</Link>
              <Link href="/dashboard/settings/areas" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Áreas y Categorías</Link>
              <Link href="/dashboard/portal" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Portal de Consulta</Link>
            </nav>
          </div>
          
          <div>
            <h3 className="font-semibold text-black dark:text-white mb-4">Recursos</h3>
            <nav className="space-y-2">
              <Link href="/login" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Iniciar Sesión</Link>
              <Link href="/dashboard" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Dashboard</Link>
              <Link href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Documentación</Link>
              <Link href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Soporte</Link>
            </nav>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} Mesa de Servicio. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" aria-label="GitHub">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" aria-label="Twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
            </a>
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" aria-label="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
