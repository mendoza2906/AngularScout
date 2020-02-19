import { APP_CONFIG } from '../../config/app-config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


@Injectable()

export class ModulosService {

  public URL_SERVER = APP_CONFIG.restUrl;
  public URL_ROOT_WS = this.URL_SERVER + '/modulos';

  constructor(private http: HttpClient) {

  }

  getAll(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/buscarModulos');
  }

  getAllRoles(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/buscarRoles');
  }

  getRolesNiveles(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/buscarNivelAlto');
  }

  getRolesNivel(nivel): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/buscarPorNivel/' + nivel);
  }

  getSubroles(rol_id): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/buscarPorRolId/' + rol_id);
  }

  getAllDepartamentos(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/buscarDepartamentos');
  }

  getModulosRoles(modulo_id: number): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/listaRolesModulos/' + modulo_id);
  }

  getModulosRolesOpciones(modulo_rol_id: string): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/buscarModulosRolesOpciones/' + modulo_rol_id);
  }

  get(id: string) {
    return this.http.get(this.URL_ROOT_WS + '/buscarModulo/' + id);
  }

  getAllOpciones(): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/buscarOpciones');
  }

  getOpciones(id: string) {
    return this.http.get(this.URL_ROOT_WS + '/buscarOpciones/' + id);
  }

  getOpcion(id: string) {
    return this.http.get(this.URL_ROOT_WS + '/buscarOpcion/' + id);
  }

  getRol(id: string) {
    return this.http.get(this.URL_ROOT_WS + '/buscarRol/' + id);
  }

  getRolesDepartamento(id: string) {
    return this.http.get(this.URL_ROOT_WS + '/buscarRolesDepartamentos/' + id);
  }
  
  save(modulo: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS + '/grabarModulo', modulo);
    return result;
  }

  saveOpcion(opcion: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS + '/grabarModuloOpcion', opcion);
    return result;
  }

  saveRol(rol: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS + '/grabarRol', rol);
    return result;
  }

  saveRolDepartamento(rolDepartamento: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS + '/grabarRolDepartamento', rolDepartamento);
    return result;
  }

  saveSubroles(subrol: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS + '/grabarSubrol', subrol);
    return result;
  }

  saveModuloRol(moduloRol: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS + '/grabarModuloRol', moduloRol);
    return result;
  }

  saveModuloRolOpcion(moduloRolOpcion: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.post(this.URL_ROOT_WS + '/grabarModuloRolOpcion', moduloRolOpcion);
    return result;
  }

  remove(id: string) {
    return this.http.delete(this.URL_ROOT_WS + '/borrar/' + id);
  }

  removeOpcion(id: string) {
    return this.http.delete(this.URL_ROOT_WS + '/borrarOpcion/' + id);
  }

  removeRol(id: string) {
    return this.http.delete(this.URL_ROOT_WS + '/borrarRol/' + id);
  }

  removeModuloRol(id: string) {
    return this.http.delete(this.URL_ROOT_WS + '/borrarModuloRol/' + id);
  }

  activaModuloRol(id: string) {
    return this.http.delete(this.URL_ROOT_WS + '/activarModuloRol/' + id);
  }

  getModulesByUser(usuario:string): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/buscarModulos/' + usuario);
  }
}