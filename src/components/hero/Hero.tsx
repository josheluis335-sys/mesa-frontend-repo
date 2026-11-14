'use client';

import React, { useState } from 'react';

export function Hero() {
  const [loginVisible, setLoginVisible] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userCreds, setUserCreds] = useState({ correo: '', password: '' });

  const showLogin = () => setLoginVisible(true);
  const hideLogin = () => setLoginVisible(false);

  const handleLogin = async () => {
    setLoggingIn(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: userCreds.correo, password: userCreds.password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Login exitoso! Token guardado.');
        setLoginVisible(false);
      } else {
        setError(data.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('No se pudo conectar con el backend. Verifica que NestJS esté corriendo en http://localhost:3000');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLearnMore = () => {
    window.location.href = '/features';
  };

  return (
    <section className="pt-40 pb-20 px-6 min-h-[80vh] flex flex-col items-center justify-center text-center transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-8xl font-display font-bold mb-8 leading-tight text-white theme-text">
          Gestiona tus tickets con <span className="italic">precisión.</span>
        </h1>
        <p className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto theme-subtext">
          La plataforma minimalista para soporte técnico, escalamientos y gestión de niveles de servicio (SLA) en tiempo real.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={showLogin}
            className="px-10 py-4 bg-white text-black font-bold text-sm tracking-widest hover:bg-white/90 transition-all uppercase theme-button-primary"
          >
            Iniciar Sesión
          </button>
          {loginVisible && (
            <div className="mt-4 max-w-sm w-full space-y-2">
              <input
                placeholder="Correo electrónico"
                value={userCreds.correo}
                onChange={(e) => setUserCreds({ ...userCreds, correo: e.target.value })}
                className="w-full py-2 border border-white/20 rounded-sm bg-black text-white placeholder-white/30 focus:border-white"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={userCreds.password}
                onChange={(e) => setUserCreds({ ...userCreds, password: e.target.value })}
                className="w-full py-2 border border-white/20 rounded-sm bg-black text-white placeholder-white/30 focus:border-white"
              />
              {loggingIn && <p className="text-white/50 text-sm">Iniciando sesión...</p>}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={handleLogin}
                  className="flex-1 py-2 bg-white text-black rounded-sm font-bold text-sm disabled:opacity-50"
                  disabled={loggingIn}
                >
                  Entrar
                </button>
                <button
                  onClick={hideLogin}
                  className="py-2 bg-black text-white rounded-sm font-bold text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
          <button 
            onClick={handleLearnMore}
            className="px-10 py-4 border border-white/20 text-white font-bold text-sm tracking-widest hover:border-white transition-all uppercase theme-button-secondary"
            style={{ marginLeft: '12px' }}>
            Conocer Más
          </button>
        </div>
      </div>
    </section>
  );
}
