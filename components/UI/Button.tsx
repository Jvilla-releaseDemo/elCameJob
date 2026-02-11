
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
  fullWidth?: boolean;
  animate?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  loading, 
  fullWidth, 
  animate = true,
  className = '', 
  disabled, 
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden px-6 py-3 rounded-xl font-bold transition-all duration-500 flex items-center justify-center gap-2 focus:ring-4 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 hover:scale-[1.02] group";
  
  const variants = {
    primary: "bg-primary text-white shadow-md hover:shadow-primary/40",
    secondary: "bg-secondary text-white shadow-md hover:shadow-secondary/40",
    outline: "border-2 border-primary/20 text-primary hover:bg-primary/5",
    ghost: "text-primary hover:bg-primary/10"
  };

  const isPrimary = variant === 'primary';

  return (
    <button 
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${fullWidth ? 'w-full' : ''} 
        ${loading ? 'animate-propulsion shadow-lg shadow-primary/50' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {/* Efecto de llenado (Power-up) en Hover - Reemplaza al Shimmer */}
      {isPrimary && !loading && !disabled && (
        <span className="absolute inset-0 w-0 bg-primary-hover transition-all duration-500 ease-out group-hover:w-full -z-0"></span>
      )}

      {/* Contenido del botón con z-index para estar sobre el efecto de llenado */}
      <div className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="tracking-wide">Iniciando...</span>
          </>
        ) : (
          <>
            {children}
            {isPrimary && (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes propulsion {
          0% { transform: translateY(0) scale(1.02); box-shadow: 0 0 0 rgba(133, 56, 199, 0); }
          50% { transform: translateY(-2px) scale(1.02); box-shadow: 0 10px 20px rgba(133, 56, 199, 0.4); }
          100% { transform: translateY(0) scale(1.02); box-shadow: 0 0 0 rgba(133, 56, 199, 0); }
        }
        .animate-propulsion {
          animation: propulsion 0.8s ease-in-out infinite;
        }
        
        /* Vibración interna sutil durante carga */
        @keyframes micro-vibrate {
          0%, 100% { transform: translate(0); }
          25% { transform: translate(-0.5px, 0.5px); }
          75% { transform: translate(0.5px, -0.5px); }
        }
        .animate-propulsion div {
          animation: micro-vibrate 0.1s linear infinite;
        }
      `}</style>
    </button>
  );
};
