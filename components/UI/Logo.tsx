
import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  allowLaunch?: boolean;
  onLaunchStateChange?: (isLaunching: boolean) => void;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "w-16 h-16", 
  allowLaunch = true,
  onLaunchStateChange 
}) => {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunch = () => {
    if (!allowLaunch || isLaunching) return;
    setIsLaunching(true);
    onLaunchStateChange?.(true);
    
    // La animación completa dura exactamente 2 segundos
    setTimeout(() => {
      setIsLaunching(false);
      onLaunchStateChange?.(false);
    }, 2000);
  };

  return (
    <div 
      className={`relative cursor-pointer select-none flex items-center justify-center ${isLaunching ? 'z-50' : 'hover:scale-110 active:scale-90'} ${className}`}
      onClick={handleLaunch}
      aria-label="Logo elCameJob Rocket"
    >
      {/* Contenedor del Cohete y Propulsión: Ambos se mueven juntos */}
      <div className={`relative flex items-center justify-center ${isLaunching ? 'animate-rocket-vessel' : 'animate-float'}`}>
        
        {/* Resplandor de propulsión (Halo de fondo) */}
        {isLaunching && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[150%] h-[150%] bg-orange-600/10 blur-[40px] rounded-full animate-pulse"></div>
          </div>
        )}

        {/* Rastro de Fuego Mejorado: Alineado en diagonal al propulsor del 🚀 */}
        {isLaunching && (
          <div className="absolute -bottom-1 -left-1 z-0 pointer-events-none flex items-center justify-center">
            {/* Contenedor rotado de la llama principal */}
            <div className="relative transform rotate-[135deg] origin-top">
              {/* Llama principal externa */}
              <div className="w-10 h-24 bg-gradient-to-t from-transparent via-orange-500 to-yellow-300 rounded-full animate-fire-bloom blur-[3px] opacity-90"></div>
              {/* Núcleo de plasma blanco */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-12 bg-white/80 blur-md rounded-full animate-pulse"></div>
            </div>
            
            {/* Partículas de escape: Ahora siguen la trayectoria diagonal */}
            <div className="absolute w-2 h-2 bg-yellow-100 rounded-full animate-spark-diagonal-1"></div>
            <div className="absolute w-1.5 h-1.5 bg-orange-400 rounded-full animate-spark-diagonal-2"></div>
            <div className="absolute w-1 h-1 bg-red-400 rounded-full animate-spark-diagonal-3"></div>
          </div>
        )}
        
        {/* Emoji de Cohete */}
        <span 
          className="text-[3.5rem] inline-block relative z-10 leading-none drop-shadow-lg"
          style={{ filter: 'contrast(1.1) brightness(1.1) saturate(1.1)' }}
        >
          🚀
        </span>
      </div>

      <style>{`
        /* Movimiento suave de flotación */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        
        /* El "Vessel" (Nave) se encarga de la vibración y el ascenso */
        @keyframes rocket-vessel {
          0% { transform: translate(0, 0) rotate(0deg); }
          5% { transform: translate(2px, 2px) rotate(2deg); }
          10% { transform: translate(-2px, -2px) rotate(-2deg); }
          25% { transform: translate(15px, -45px) scale(1.2) rotate(10deg); }
          50% { transform: translate(25px, -70px) scale(1.3) rotate(15deg); }
          75% { transform: translate(10px, -20px) scale(1.1) rotate(5deg); }
          100% { transform: translate(0, 0) scale(1); }
        }

        /* Llama pulsante orgánica */
        @keyframes fire-bloom {
          0%, 100% { transform: scaleY(0.7) scaleX(0.8); opacity: 0.7; }
          50% { transform: scaleY(1.5) scaleX(1.2); opacity: 1; }
        }

        /* Chispas con trayectoria diagonal (Alineadas con la propulsión) */
        @keyframes spark-diagonal-1 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-50px, 50px) scale(0); opacity: 0; }
        }
        @keyframes spark-diagonal-2 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-35px, 65px) scale(0); opacity: 0; }
        }
        @keyframes spark-diagonal-3 {
          0% { transform: translate(0, 0) scale(1.5); opacity: 1; }
          100% { transform: translate(-60px, 40px) scale(0); opacity: 0; }
        }

        .animate-float { 
          animation: float 4s ease-in-out infinite; 
        }
        .animate-rocket-vessel { 
          animation: rocket-vessel 2s cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards; 
        }
        .animate-fire-bloom { 
          animation: fire-bloom 0.1s infinite; 
        }
        .animate-spark-diagonal-1 { animation: spark-diagonal-1 0.6s ease-out infinite; }
        .animate-spark-diagonal-2 { animation: spark-diagonal-2 0.8s ease-out infinite; delay: 0.15s; }
        .animate-spark-diagonal-3 { animation: spark-diagonal-3 0.5s ease-out infinite; delay: 0.3s; }
      `}</style>
    </div>
  );
};
