import {IEntity} from './i-entity';

/**
 * LVT Clase padre de todas las entidades de la aplicacion.
 */
export abstract class Entity<T> implements IEntity<T> {
    estado: string;
    id: number;
    version: number;
}
