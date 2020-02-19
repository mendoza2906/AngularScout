import {Privilegio} from './privilegio';
import {Usuario} from './usuario';
import {Entity} from '../entity';

/**
 * LVT Representa un privilegio del usuario.
 */
export class UsuarioPrivilegio extends Entity <UsuarioPrivilegio> {

    privilegio: Privilegio;
    usuario: Usuario;
    
    public constructor (usuario?: Usuario, role?: string) {
        super();
        if (usuario) {
            this.usuario = usuario;
        }
        if (role) {
            this.privilegio = new Privilegio(role, role);
        }
    }
    
}
