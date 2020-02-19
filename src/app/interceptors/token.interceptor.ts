import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Base64Util} from '../util/base-64-util';
import {TokenService} from '../services/auth/token.service';
import {AuthService} from '../services/auth/auth.service';

/**
 * LVT Intercepts http calls and inject token and authorization information.
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(public auth: AuthService,
                private tokenService: TokenService,
                private base64Util: Base64Util) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // If is a login attempt, includes basic auth header.
        if (request.url.includes('/oauth/token')) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Basic ${this.base64Util.encode(environment.clientId + ':' + environment.clientSecret)}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        } else if (this.tokenService.getToken()) {

            // Verify if token is expired
            if (this.tokenService.isTokenExpired(this.tokenService.getToken())) {
                this.auth.refreshToken(this.tokenService.getToken()).subscribe(data => {}, error => {
                    this.auth.logout();
                });
            }
            
            const newHeaders: any = {};
            let hasContentType = false;
            
            for (const key of request.headers.keys()) {
                if (key.toLowerCase() === 'content-type') {
                    hasContentType = true;
                }
                newHeaders[key] = request.headers.get(key);
            }
            
            if (!hasContentType && !(request.body instanceof FormData)) {
                newHeaders['Content-Type'] = 'application/json';
            }

            // Append token information.
            newHeaders['Authorization'] = `Bearer ${this.tokenService.getToken().access_token}`;
    
            request = request.clone({
                setHeaders: newHeaders
            });
            
        } else {

            // If no token exists attempt a normal access (without authentication).
            request = request.clone({
                setHeaders: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        }

        return next.handle(request);
    }
}
