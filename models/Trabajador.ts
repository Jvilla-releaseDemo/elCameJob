
import { Usuario } from './Usuario';
import { UserType, UserDTO } from '../types';

export class Trabajador extends Usuario {
  private cargo: string;
  private departamento: string;

  constructor(data: UserDTO) {
    super(data);
    this.cargo = data.cargo || '';
    this.departamento = data.departamento || '';
  }

  public getTipoUsuario(): UserType {
    return UserType.TRABAJADOR;
  }

  public obtenerDatosPublicos(): UserDTO {
    return {
      ...super.obtenerDatosPublicos(),
      cargo: this.cargo,
      departamento: this.departamento,
    } as UserDTO;
  }
}
