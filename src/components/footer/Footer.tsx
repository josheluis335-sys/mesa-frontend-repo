import React from 'react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-6 transition-colors duration-500 theme-footer">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-lg text-white theme-text">Mesa de Servicio</span>
          <span className="text-white/30 text-sm">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-6 text-sm text-white/50 theme-subtext">
          <a href="#" className="hover:text-white transition-colors">Privacidad</a>
          <a href="#" className="hover:text-white transition-colors">Términos</a>
          <a href="#" className="hover:text-white transition-colors">Soporte</a>
        </div>
      </div>
    </footer>
  );
}