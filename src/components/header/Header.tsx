'use client';

import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { LogoMark } from '@/components/logo/Logo';

export function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-black/90 backdrop-blur-lg glass-strong transition-colors duration-300 shadow-sm dark:shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity" aria-label="Ir al Dashboard">
          <LogoMark size="md" className="shrink-0 drop-shadow-md" />
          <span className="font-display font-bold text-xl tracking-tight text-black dark:text-white hidden sm:block">
            Mesa de Servicio
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1">
          <Link 
            href="/dashboard" 
            className="sidebar-link"
          >
            Dashboard
          </Link>
          <Link 
            href="/dashboard/tickets" 
            className="sidebar-link"
          >
            Tickets
          </Link>
          <Link 
            href="/dashboard/portal" 
            className="sidebar-link"
          >
            Portal
          </Link>
          <Link 
            href="/dashboard/settings" 
            className="sidebar-link"
          >
            Configuración
          </Link>
        </nav>
        
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl border border-gray-300 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group shadow-sm dark:shadow-md"
            title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
            aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
          >
            <span className="text-xl transition-transform duration-300 group-hover:rotate-12">
              {theme === 'dark' ? '☀' : '🌙'}
            </span>
          </button>
          
          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-800 relative" ref={userMenuRef}>
            <div className="text-right cursor-pointer" onClick={() => setUserMenuOpen(!userMenuOpen)}>
              <p className="text-sm font-medium text-black dark:text-white">{user?.nombre}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.rol}</p>
            </div>
            
            {userMenuOpen && (
              <div className="dropdown-menu animate-scale-in">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                  <p className="text-sm font-semibold text-black dark:text-white">{user?.nombre}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.correo}</p>
                </div>
                <button className="dropdown-item w-full text-left" onClick={logout}>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
          
          <div className="sm:hidden flex items-center gap-2">
            <button
              onClick={logout}
              className="btn-ghost px-3 py-2"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
