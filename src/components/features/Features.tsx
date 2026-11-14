import React from 'react';

const features = [
  {
    title: "Gestión de Tickets",
    description: "Seguimiento completo desde la creación hasta el cierre con estados automáticos.",
    icon: "⬚"
  },
  {
    title: "SLA Dinámico",
    description: "Políticas de escalamiento y tiempos de respuesta configurables por prioridad.",
    icon: "◒"
  },
  {
    title: "Notificaciones",
    description: "Alertas vía email y push para mantener a los técnicos y usuarios informados.",
    icon: "◉"
  }
];

export function Features() {
  return (
    <section className="py-24 px-6 border-t border-white/5 transition-colors duration-500 theme-section">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, idx) => (
            <div key={idx} className="p-8 border border-white/10 hover:border-white/30 transition-all group theme-card">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform origin-left text-white theme-icon">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-white theme-text">{feature.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed theme-subtext">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}