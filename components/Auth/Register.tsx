
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { AuthLayout } from '../Layout/AuthLayout';
import { UserType } from '../../types';
import { validateEmail, validatePassword, validateCedula, validateNombres } from '../../utils/validations';
import { register } from '../../services/authService';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  
  const [formData, setFormData] = useState({
    nombres: '',
    cedula: '',
    email: '',
    password: '',
    confirmPassword: '',
    tipo: UserType.CLIENTE,
    telefono: '',
    direccion: '',
    cargo: '',
    departamento: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      const vNombre = validateNombres(formData.nombres);
      if (!vNombre.isValid) newErrors.nombres = vNombre.error;
      const vCedula = validateCedula(formData.cedula);
      if (!vCedula.isValid) newErrors.cedula = vCedula.error;
      const vEmail = validateEmail(formData.email);
      if (!vEmail.isValid) newErrors.email = vEmail.error;
    } else if (step === 2) {
      const vPass = validatePassword(formData.password);
      if (!vPass.isValid) newErrors.password = vPass.error;
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    
    setIsLoading(true);
    try {
      await register(formData);
      // Reload or navigate to dashboard. Reloading ensures AuthContext picks up the new user.
      window.location.reload();
    } catch (err: any) {
      setErrors({ general: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Información Personal</h2>
            <Input label="Nombres y Apellidos" name="nombres" value={formData.nombres} onChange={handleChange} error={errors.nombres} required />
            <Input label="Número de Cédula" name="cedula" value={formData.cedula} onChange={handleChange} error={errors.cedula} required />
            <Input label="Email Corporativo/Personal" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Seguridad</h2>
            <Input label="Contraseña" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} required />
            {formData.password && (
              <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${validatePassword(formData.password).strength! > 70 ? 'bg-success' : 'bg-yellow-500'}`}
                  style={{ width: `${validatePassword(formData.password).strength}%` }}
                ></div>
              </div>
            )}
            <Input label="Confirmar Contraseña" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} required />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tipo de Perfil</h2>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setFormData(p => ({...p, tipo: UserType.CLIENTE}))}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.tipo === UserType.CLIENTE ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.tipo === UserType.CLIENTE ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="font-bold">Cliente</span>
              </button>
              <button 
                type="button"
                onClick={() => setFormData(p => ({...p, tipo: UserType.TRABAJADOR}))}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.tipo === UserType.TRABAJADOR ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.tipo === UserType.TRABAJADOR ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-bold">Trabajador</span>
              </button>
            </div>
            
            {formData.tipo === UserType.CLIENTE ? (
              <Input label="Teléfono de contacto" name="telefono" value={formData.telefono} onChange={handleChange} required />
            ) : (
              <Input label="Cargo/Oficio" name="cargo" value={formData.cargo} onChange={handleChange} placeholder="Ej: Electricista, Limpieza" required />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout>
      <div className="p-8 md:p-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Crea tu cuenta</h1>
            <p className="text-gray-500">Únete a la comunidad CameJob</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Paso {step} de {totalSteps}</span>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1.5 w-6 rounded-full transition-all ${step >= i ? 'bg-primary' : 'bg-gray-200'}`}></div>
              ))}
            </div>
          </div>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-error-light border-l-4 border-error rounded-r-lg">
            <p className="text-sm text-error font-medium">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {renderStep()}

          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={handlePrev} className="flex-1">
                Anterior
              </Button>
            )}
            {step < totalSteps ? (
              <Button type="button" variant="primary" onClick={handleNext} className="flex-1">
                Siguiente
              </Button>
            ) : (
              <Button type="submit" variant="primary" fullWidth loading={isLoading}>
                Finalizar Registro
              </Button>
            )}
          </div>

          <p className="mt-8 text-center text-gray-600">
            ¿Ya tienes una cuenta? {' '}
            <Link to="/login" className="text-primary font-bold hover:underline">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Register;
