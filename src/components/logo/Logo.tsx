'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
};

export function Logo({ size = 'md', className = '', showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/images/logo.png"
        alt="Mesa de Servicio"
        className={`${sizeClasses[size]} filter transition-all duration-300 drop-shadow-lg`}
        style={{ filter: 'none' }}
        aria-hidden="true"
      />
      {showText && (
        <span className={`font-display font-bold tracking-tight text-black dark:text-white ${textSizeClasses[size]}`}>
          Mesa de Servicio
        </span>
      )}
    </div>
  );
}

export function LogoMark({ size = 'md', className = '' }: LogoProps) {
  return (
    <img
      src="/images/logo.png"
      alt="Mesa de Servicio"
      className={`${sizeClasses[size]} filter drop-shadow-lg ${className}`}
      aria-hidden="true"
    />
  );
}