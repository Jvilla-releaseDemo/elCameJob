
import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, type = 'text', id, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5 w-full mb-4">
      <label 
        htmlFor={inputId} 
        className="text-sm font-medium text-textPrimary flex justify-between"
      >
        {label}
        {props.required && <span className="text-error" aria-hidden="true">*</span>}
      </label>
      <div className="relative group/input">
        <input
          id={inputId}
          type={inputType}
          className={`
            w-full px-4 py-3 rounded-lg border-2 outline-none transition-all duration-300
            ${error 
              ? 'border-error bg-error-light focus:border-error shadow-sm shadow-error/10' 
              : 'border-gray-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 bg-white'
            }
            placeholder:text-gray-400
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {/* Escáner de Apertura Mecánica */}
            <div className="relative w-6 h-6 flex items-center justify-center">
              {/* Aspas del diafragma */}
              <div className={`absolute inset-0 border-2 border-current rounded-full transition-all duration-500 ${showPassword ? 'scale-110 border-primary opacity-20' : 'scale-100 border-gray-300'}`}></div>
              
              {/* Aspa Superior Izquierda */}
              <div className={`absolute w-2 h-2 border-t-2 border-l-2 transition-all duration-300 ${showPassword ? '-translate-x-1 -translate-y-1 rotate-45 border-primary' : 'translate-x-0 translate-y-0 rotate-0 border-gray-400'}`}></div>
              {/* Aspa Superior Derecha */}
              <div className={`absolute w-2 h-2 border-t-2 border-r-2 transition-all duration-300 ${showPassword ? 'translate-x-1 -translate-y-1 -rotate-45 border-primary' : 'translate-x-0 translate-y-0 rotate-0 border-gray-400'}`}></div>
              {/* Aspa Inferior Izquierda */}
              <div className={`absolute w-2 h-2 border-b-2 border-l-2 transition-all duration-300 ${showPassword ? '-translate-x-1 translate-y-1 -rotate-45 border-primary' : 'translate-x-0 translate-y-0 rotate-0 border-gray-400'}`}></div>
              {/* Aspa Inferior Derecha */}
              <div className={`absolute w-2 h-2 border-b-2 border-r-2 transition-all duration-300 ${showPassword ? 'translate-x-1 translate-y-1 rotate-45 border-primary' : 'translate-x-0 translate-y-0 rotate-0 border-gray-400'}`}></div>

              {/* Iris Central / Sensor */}
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${showPassword ? 'bg-primary scale-150 shadow-[0_0_8px_rgba(133,56,199,0.8)]' : 'bg-transparent scale-0'}`}></div>
              
              {/* Línea de bloqueo (Slash) sutil cuando está cerrado */}
              {!showPassword && (
                <div className="absolute w-[120%] h-[1.5px] bg-gray-300 rotate-45 transition-all duration-300 opacity-40"></div>
              )}
            </div>
          </button>
        )}
      </div>
      {error && (
        <span 
          id={`${inputId}-error`} 
          className="text-xs font-semibold text-error animate-slideDown" 
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
};
