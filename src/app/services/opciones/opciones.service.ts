import { APP_CONFIG } from '../../config/app-config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


@Injectable()

export class OpcionesService {

  public URL_SERVER = APP_CONFIG.restUrl;
  public URL_ROOT_WS = this.URL_SERVER + '/opciones';

  constructor(private http: HttpClient) {

  }

  getOpcion(id:string): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/buscarOpcion/'+id);
  }

  getOpcionesByUserModuloRol(moduloRolId:string): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/buscarModulosRolesOpciones/'+moduloRolId);
  }
}