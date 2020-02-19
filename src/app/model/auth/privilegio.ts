import {Entity} from '../entity';

/**
 * LVT Representa un privilegio asignable al usuario.
 */
export class Privilegio extends Entity <Privilegio> {

    codigo: string;
    descripcion: string;

    constructor(codigo: string, descripcion: string) {
        super();
        this.codigo = codigo;
        this.descripcion = descripcion;
    }

}
