
export const COLORS = {
  primary: '#8538C7',
  secondary: '#6D8DF4',
  background: '#F8FAFC',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  error: '#EF4444',
  success: '#10B981',
};

export const VALIDATION_MESSAGES = {
  required: (field: string) => `El campo ${field} es requerido`,
  emailInvalid: 'Por favor ingresa un email válido',
  passwordWeak: 'La contraseña es muy débil',
  passwordMismatch: 'Las contraseñas no coinciden',
  cedulaInvalid: 'Formato de cédula inválido (8-10 dígitos)',
  nombresInvalid: 'El nombre debe ser real y tener al menos un apellido',
};

export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  CEDULA: /^\d{8,10}$/,
  SOLO_LETRAS: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/,
};
