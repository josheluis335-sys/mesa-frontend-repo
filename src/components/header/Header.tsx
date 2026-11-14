'use client';

import React, { useState, useEffect } from 'react';

export function Header() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedMode = localStorage.getItem('theme');
    if (savedMode === 'white') {
      setIsDarkMode(false);
      document.body.classList.add('toggle-white-mode');
      document.body.classList.remove('toggle-black-mode');
    } else {
      setIsDarkMode(true);
      document.body.classList.add('toggle-black-mode');
      document.body.classList.remove('toggle-white-mode');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.body.classList.remove('toggle-black-mode');
      document.body.classList.add('toggle-white-mode');
      localStorage.setItem('theme', 'white');
      setIsDarkMode(false);
    } else {
      document.body.classList.remove('toggle-white-mode');
      document.body.classList.add('toggle-black-mode');
      localStorage.setItem('theme', 'black');
      setIsDarkMode(true);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-black/80 backdrop-blur-md transition-colors duration-500 theme-header">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white theme-text">
            Mesa de Servicio
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium theme-link">Portal</a>
          <a href="#" className="text-sm font-medium theme-link">SLA</a>
          <a href="#" className="text-sm font-medium theme-link">Nosotros</a>
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all theme-button-toggle"
            title="Cambiar Modo"
          >
            {isDarkMode ? '☼' : '☾'}
          </button>
        </nav>
      </div>
    </header>
  );
}