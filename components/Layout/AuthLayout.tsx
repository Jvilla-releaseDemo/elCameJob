
import React, { useState } from 'react';
import { Logo } from '../UI/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const [isLaunching, setIsLaunching] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex flex-col relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px]"></div>

      <header className="relative z-10 p-8">
        <div className="container mx-auto flex flex-col items-center md:flex-row md:justify-start gap-4">
          <Logo 
            className="w-16 h-16 drop-shadow-xl" 
            onLaunchStateChange={setIsLaunching}
          />
          <div className={`text-center md:text-left transition-all duration-300 ${isLaunching ? 'animate-vibrate-text' : ''}`}>
            <span className="text-3xl font-black tracking-tighter text-gray-900 block leading-none">elCameJob</span>
            <span className="text-[11px] uppercase tracking-[0.3em] font-extrabold text-primary mt-1 block">Impulsando tu talento</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[480px] bg-white rounded-[2.5rem] shadow-[0_30px_70px_rgba(133,56,199,0.08)] border border-gray-100 overflow-hidden animate-fadeIn">
          {children}
        </div>
      </main>

      <footer className="relative z-10 p-8 text-center">
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          &copy; 2024 elCameJob &bull; Sistema de Gestión ADSO SENA
        </p>
      </footer>

      <style>{`
        @keyframes vibrate-text {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        .animate-vibrate-text {
          animation: vibrate-text 0.15s linear infinite;
        }
      `}</style>
    </div>
  );
};
