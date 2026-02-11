
import { Usuario } from './Usuario';
import { UserType, UserDTO } from '../types';

export class Cliente extends Usuario {
  private direccion: string;
  private telefono: string;

  constructor(data: UserDTO) {
    super(data);
    this.direccion = data.direccion || '';
    this.telefono = data.telefono || '';
  }

  public getTipoUsuario(): UserType {
    return UserType.CLIENTE;
  }

  public obtenerDatosPublicos(): UserDTO {
    return {
      ...super.obtenerDatosPublicos(),
      direccion: this.direccion,
      telefono: this.telefono,
    } as UserDTO;
  }
}
