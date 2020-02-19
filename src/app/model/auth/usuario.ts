import {UsuarioPrivilegio} from './usuario-privilegio';
import {IAccount} from '../auth/IAccount';
import {Entity} from '../entity';

/**
 * LTV Representa al usuario que se recupera de la base.
 */
export class Usuario extends Entity<Usuario> {

    usuario: string;
    clave: string;
    titulo: string;
    nombres: string;
    apellidos: string;
    nombreCompleto: string;
    email: string;
    telefono: string;
    cargo: string;
    referencia: string;
    bloqueado: boolean;
    uuidNotificacion: string;
    tokenNotificacion: string;
    activaNotificacion: boolean;

    // Transient attributes

    calificacion: number;
    
    usuarioPrivilegios: Array<UsuarioPrivilegio>;

    constructor(private account?: IAccount) {
        super();
        if (account) {
            this.id = account.id;
            this.usuario = account.username;
            this.nombres = account.firstName;
            this.apellidos = account.lastName;
            this.email = account.email;
            this.uuidNotificacion = account.notificationsUUID;
            this.tokenNotificacion = account.notificationsToken;
            this.bloqueado = !account.accountNonLocked;

            if (account.roles) {
                this.usuarioPrivilegios = new Array<UsuarioPrivilegio>();
                for (const role of account.roles) {
                    this.usuarioPrivilegios.push(new UsuarioPrivilegio(this, role));
                }
            }
        } else {
            this.usuarioPrivilegios = new Array<UsuarioPrivilegio>();
        }
    }
    
}
