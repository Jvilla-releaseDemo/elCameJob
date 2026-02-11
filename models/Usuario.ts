
import { UserType, UserDTO } from '../types';

export abstract class Usuario {
  protected id: string;
  protected nombres: string;
  protected cedula: string;
  protected email: string;
  protected fechaRegistro: string;
  protected ultimoAcceso: string;

  constructor(data: Partial<UserDTO>) {
    if (!data.nombres || !data.cedula || !data.email) {
      throw new Error("Datos obligatorios faltantes para el usuario");
    }
    this.id = data.id || Math.random().toString(36).substr(2, 9);
    this.nombres = data.nombres;
    this.cedula = data.cedula;
    this.email = data.email;
    this.fechaRegistro = data.fechaRegistro || new Date().toISOString();
    this.ultimoAcceso = new Date().toISOString();
  }

  public abstract getTipoUsuario(): UserType;

  public obtenerDatosPublicos(): Partial<UserDTO> {
    return {
      id: this.id,
      nombres: this.nombres,
      cedula: this.cedula,
      email: this.email,
      tipo: this.getTipoUsuario(),
      fechaRegistro: this.fechaRegistro
    };
  }

  public actualizarUltimoAcceso(): void {
    this.ultimoAcceso = new Date().toISOString();
  }

  public toString(): string {
    return `[Usuario ${this.getTipoUsuario()}] ${this.nombres} (${this.email})`;
  }
}
