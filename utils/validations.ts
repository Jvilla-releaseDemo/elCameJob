
import { ValidationResult } from '../types';
import { REGEX, VALIDATION_MESSAGES } from '../constants';

export const validateEmail = (email: string): ValidationResult => {
  if (!email) return { isValid: false, error: 'El email es requerido' };
  const isValid = REGEX.EMAIL.test(email);
  return {
    isValid,
    error: isValid ? '' : VALIDATION_MESSAGES.emailInvalid
  };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) return { isValid: false, error: 'La contraseña es requerida' };
  
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[a-z]/.test(password)) strength += 20;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[!@#$%^&*]/.test(password)) strength += 15;

  const isValid = password.length >= 8 && strength >= 60;
  return {
    isValid,
    error: isValid ? '' : VALIDATION_MESSAGES.passwordWeak,
    strength
  };
};

export const validateCedula = (cedula: string): ValidationResult => {
  if (!cedula) return { isValid: false, error: 'La cédula es requerida' };
  const isValid = REGEX.CEDULA.test(cedula);
  return {
    isValid,
    error: isValid ? '' : VALIDATION_MESSAGES.cedulaInvalid
  };
};

export const validateNombres = (nombres: string): ValidationResult => {
  if (!nombres) return { isValid: false, error: 'El nombre es requerido' };
  const hasSpace = nombres.trim().includes(' ');
  const onlyLetters = REGEX.SOLO_LETRAS.test(nombres);
  const isValid = hasSpace && onlyLetters && nombres.length >= 5;
  return {
    isValid,
    error: isValid ? '' : VALIDATION_MESSAGES.nombresInvalid
  };
};
