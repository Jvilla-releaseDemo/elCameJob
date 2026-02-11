
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { AuthLayout } from '../Layout/AuthLayout';
import { validateEmail } from '../../utils/validations';
import { login } from '../../services/authService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para el Modal de Recuperación
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryStatus, setRecoveryStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined, general: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const emailCheck = validateEmail(formData.email);
    if (!emailCheck.isValid) {
      setErrors({ email: emailCheck.error });
      setIsLoading(false);
      return;
    }

    try {
      await login(formData.email, formData.password);
      window.location.reload(); 
    } catch (err: any) {
      setErrors({ general: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryStatus('loading');
    // Simulamos latencia de red
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRecoveryStatus('success');
    // Resetear después de mostrar el éxito
    setTimeout(() => {
      setShowForgotModal(false);
      setRecoveryStatus('idle');
      setRecoveryEmail('');
    }, 4000);
  };

  return (
    <AuthLayout>
      <div className="p-8 md:p-12">
        <div className="mb-12 text-center group">
          <div className="relative inline-block">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight animate-focus-snap select-none">
              ¡Bienvenido!
            </h1>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[3px] w-0 bg-gradient-to-r from-secondary via-primary to-secondary rounded-full animate-expand-line opacity-80"></div>
          </div>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-error-light border-l-4 border-error rounded-r-xl animate-slideDown">
            <p className="text-sm text-error font-bold flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.general}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Correo Electrónico"
            name="email"
            type="email"
            placeholder="ejemplo@correo.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            autoComplete="email"
          />

          <Input
            label="Contraseña"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" className="peer sr-only" />
                <div className="w-5 h-5 border-2 border-gray-200 rounded-md peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                <svg className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span className="text-gray-500 font-semibold group-hover:text-primary transition-colors">Recordarme</span>
            </label>
            <button 
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-primary font-bold hover:text-primary-hover transition-colors focus:outline-none"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <Button type="submit" variant="primary" fullWidth loading={isLoading}>
            Ingresar
          </Button>

          <div className="relative flex items-center gap-4 py-2">
            <div className="flex-1 border-t border-gray-100"></div>
            <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">O continúa con</span>
            <div className="flex-1 border-t border-gray-100"></div>
          </div>

          <div className="text-center">
            <p className="text-gray-500 font-medium">
              ¿Eres nuevo aquí? {' '}
              <Link to="/registro" className="text-primary font-black hover:underline decoration-2 underline-offset-4">Crea tu cuenta</Link>
            </p>
          </div>
        </form>
      </div>

      {/* Modal Ingenioso de Recuperación */}
      {showForgotModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden animate-slideUp">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-secondary to-primary"></div>
            
            <button 
              onClick={() => setShowForgotModal(false)}
              className="absolute top-6 right-6 text-gray-300 hover:text-primary transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            {recoveryStatus === 'success' ? (
              <div className="py-8 text-center animate-fadeIn">
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 text-success animate-bounce-short">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">¡Llave Enviada!</h3>
                <p className="text-gray-500 font-medium">Revisa tu bandeja de entrada para restaurar tu acceso.</p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Recuperar Acceso</h3>
                  <p className="text-gray-400 font-medium">Enviaremos una llave digital a tu correo para que puedas volver a ingresar.</p>
                </div>

                <form onSubmit={handleRecoverySubmit} className="space-y-6">
                  <Input 
                    label="Tu Correo Electrónico"
                    placeholder="email@registrado.com"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    required
                  />
                  <Button 
                    type="submit" 
                    fullWidth 
                    loading={recoveryStatus === 'loading'}
                    disabled={!recoveryEmail}
                  >
                    Generar Nueva Llave
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes focus-snap {
          0% { filter: blur(12px); letter-spacing: 0.2em; opacity: 0; transform: scale(0.95); text-shadow: 10px 0 20px rgba(109, 141, 244, 0.5), -10px 0 20px rgba(133, 56, 199, 0.5); }
          100% { filter: blur(0); letter-spacing: -0.02em; opacity: 1; transform: scale(1); text-shadow: 0 0 0 transparent; }
        }
        @keyframes expand-line {
          0% { width: 0; opacity: 0; }
          40% { opacity: 1; }
          100% { width: 60px; opacity: 0.6; }
        }
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-focus-snap { animation: focus-snap 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-expand-line { animation: expand-line 1.2s cubic-bezier(0.65, 0, 0.35, 1) 0.4s forwards; }
        .animate-bounce-short { animation: bounce-short 1s ease-in-out infinite; }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .delay-500 { animation-delay: 0.5s; }
        .fill-mode-forwards { animation-fill-mode: forwards; }
      `}</style>
    </AuthLayout>
  );
};

export default Login;
