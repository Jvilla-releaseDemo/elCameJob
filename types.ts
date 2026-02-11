
export enum UserType {
  CLIENTE = 'CLIENTE',
  TRABAJADOR = 'TRABAJADOR'
}

export enum JobStatus {
  ABIERTO = 'ABIERTO',
  EN_PROCESO = 'EN_PROCESO',
  COMPLETADO = 'COMPLETADO',
  CANCELADO = 'CANCELADO'
}

export enum ApplicationStatus {
  PENDIENTE = 'PENDIENTE',
  ACEPTADA = 'ACEPTADA',
  RECHAZADA = 'RECHAZADA'
}

export interface ValidationResult {
  isValid: boolean;
  error: string;
  strength?: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface UserDTO {
  id: string;
  nombres: string;
  cedula: string;
  email: string;
  password?: string; // Añadido para validación en demo
  tipo: UserType;
  direccion?: string;
  telefono?: string;
  cargo?: string;
  departamento?: string;
  fechaRegistro: string;
}

export interface JobDTO {
  id: string;
  clienteId: string;
  clienteNombre: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  presupuesto: number;
  ubicacion: string;
  estado: JobStatus;
  fechaPublicacion: string;
}

export interface ApplicationDTO {
  id: string;
  jobId: string;
  trabajadorId: string;
  trabajadorNombre: string;
  mensaje: string;
  estado: ApplicationStatus;
  fechaPostulacion: string;
}
