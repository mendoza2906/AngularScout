import { APP_CONFIG } from '../../config/app-config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * LVT Clase que no se usara, en su lugar se usara: AuthService
 */
@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  constructor(private http: HttpClient) { }

  // Al acceder almacena en memoria el token recibido y la info del usuario logoneado.
  login(usuario: any) {
    // Llama al servicio web para obtener el token
    return this.http.post<any>(APP_CONFIG.restUrl + '/autenticacion/autenticar', usuario);
  }

  logout() {
    // Elimina el token de memoria.
    localStorage.removeItem('usuarioActual');
    //localStorage.removeItem('pageinformation');
    //localStorage.removeItem('gridPersonaState');

  }

}
