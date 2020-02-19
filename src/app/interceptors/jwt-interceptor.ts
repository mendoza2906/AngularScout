import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * LVT Reemplazada por token.interceptor.js
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Añade la autorizacion si el usuario está logoneado.
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        if (usuarioActual && usuarioActual.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${usuarioActual.token}`
                }
            });
        }

        return next.handle(request);
    }
}
