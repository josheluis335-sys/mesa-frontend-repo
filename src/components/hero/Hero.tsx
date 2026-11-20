'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Logo, LogoMark } from '@/components/logo/Logo';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export function Hero() {
  const { login, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({ correo: '', password: '' });
  const [floatingElements, setFloatingElements] = useState<Array<{id: number, x: number, y: number, delay: number, duration: number}>>([]);

  useEffect(() => {
    const elements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 20,
    }));
    setFloatingElements(elements);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setError(null);

    try {
      await login(credentials.correo, credentials.password);
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Credenciales incorrectas');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLearnMore = () => {
    router.push('/features');
  };

  return (
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-mesh-pattern">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-black dark:to-gray-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,0,0,0.03)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
      
        <div className="relative z-10 max-w-5xl mx-auto w-full">
          <div className="text-center mb-16 animate-slide-up">
                    <Logo size="lg" className="justify-center mb-6 drop-shadow-xl" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm tracking-widest uppercase font-semibold">
                      Plataforma de Soporte Técnico & SLA
                    </p>
                  </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-black dark:text-white mb-8 leading-[1.1]">
                Gestiona tus tickets con <span className="italic">precisión.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                La plataforma minimalista para soporte técnico, escalamientos y gestión de niveles de servicio (SLA) en tiempo real.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => setShowLogin(true)}
                  className="btn-primary group"
                  disabled={authLoading || loggingIn}
                >
                  <span className="relative z-10">Iniciar Sesión</span>
                </button>
                <button
                  onClick={handleLearnMore}
                  className="btn-secondary"
                >
                  Conocer Más
                </button>
              </div>
            
              <div className="mt-16 grid grid-cols-3 gap-6 text-center">
                {[
                  { value: '99.9%', label: 'Uptime' },
                  { value: '< 1min', label: 'Respuesta SLA' },
                  { value: '24/7', label: 'Disponibilidad' },
                ].map((stat, i) => (
                  <div key={stat.label} className="animate-slide-up" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                    <div className="text-3xl font-display font-bold text-black dark:text-white">{stat.value}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="card-elevated p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 dark:from-white/5 to-transparent" />
                <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-black/5 dark:from-white/5 to-transparent rounded-full blur-3xl" />
              
                <div className="relative flex items-center justify-center mb-6">
                                <LogoMark size="xl" className="drop-shadow-2xl" />
                              </div>

                <h3 className="text-xl font-semibold text-black dark:text-white text-center mb-6">
                  Acceso al Sistema
                </h3>

                {showLogin ? (
                  <form onSubmit={handleLogin} className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {error && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm animate-slide-down">
                        {error}
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Correo electrónico</label>
                      <input
                        type="email"
                        value={credentials.correo}
                        onChange={e => setCredentials(prev => ({ ...prev, correo: e.target.value }))}
                        placeholder="tu@empresa.com"
                        required
                        autoComplete="email"
                        className="input-field"
                        disabled={loggingIn}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contraseña</label>
                      <input
                        type="password"
                        value={credentials.password}
                        onChange={e => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="••••••••"
                        required
                        autoComplete="current-password"
                        className="input-field"
                        disabled={loggingIn}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loggingIn || authLoading}
                      className="btn-primary w-full mt-2"
                    >
                      {loggingIn ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Iniciando sesión...
                        </span>
                      ) : (
                        'Entrar al Dashboard'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowLogin(false); setError(null); }}
                      className="btn-ghost w-full"
                      disabled={loggingIn}
                    >
                      Cancelar
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner-glow">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Credenciales de prueba</p>
                      <div className="font-mono text-sm text-black dark:text-white space-y-1">
                        <div><span className="text-gray-500 dark:text-gray-400">Email:</span> andres@test.com</div>
                        <div><span className="text-gray-500 dark:text-gray-400">Pass:</span> 1234</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowLogin(true)}
                      className="btn-primary w-full"
                      disabled={authLoading}
                    >
                      Iniciar Sesión
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            {[
                              { icon: '🎯', label: 'Tickets', desc: 'Gestión completa' },
                              { icon: '⏱️', label: 'SLA', desc: 'Tiempos controlados' },
                              { icon: '📊', label: 'Reportes', desc: 'Métricas en vivo' },
                            ].map((feature, i) => (
                              <div key={feature.label} className="card-interactive p-4 text-center">
                                <div className="text-2xl mb-2">{feature.icon}</div>
                                <div className="font-semibold text-black dark:text-white">{feature.label}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{feature.desc}</div>
                              </div>
                            ))}
                          </div>
            </div>
          </div>
        </div>
      </section>
    );
}
