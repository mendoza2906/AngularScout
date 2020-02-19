import { APP_CONFIG } from '../../config/app-config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ModulosService {
  public URL_SERVER = APP_CONFIG.restUrl;
  public URL_ROOT_WS = this.URL_SERVER + '/app';

  constructor(private http: HttpClient) { }

  getModulesByUser(usuario:string): Observable<any> {
    return this.http.get(this.URL_ROOT_WS + '/buscarModulos/' + usuario);
  }

}
