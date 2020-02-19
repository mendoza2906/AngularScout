import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { TokenService } from './token.service';
import { AccountService } from './account.service';
import { IAccessToken } from '../../model/auth/IAccessToken';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

/**
 * LVT Servicios para verificacion de autorizaciones
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

    constructor(private http: HttpClient,
        private router: Router,
        private tokenService: TokenService,
        private accountService: AccountService) { }

    login(username: string, password: string) {
        let data: string;
        data = 'username=' + username + '&password=' + password + '&grant_type=password';
        console.log(data)
        return this.http.post<any>(environment.baseUrl + '/oauth/token', data)
            .pipe(map(tokenInfo => {
                // login successful if there's a jwt token in the response
                if (tokenInfo && tokenInfo.access_token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    this.tokenService.setToken(tokenInfo);
                }
                return tokenInfo;
            }));
    }

    refreshToken(token: IAccessToken) {
        let data: string;
        data = 'refresh_token=' + token.refresh_token + '&grant_type=refresh_token&jti=' + token.jti;
        return this.http.post<any>(environment.baseUrl + '/oauth/token', data)
            .pipe(map(tokenInfo => {

                console.log('Refresh:' + JSON.stringify(tokenInfo));
                // login successful if there's a jwt token in the response
                if (tokenInfo && tokenInfo.access_token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    this.tokenService.setToken(JSON.parse(tokenInfo));
                }

                return tokenInfo;
            }));
    }

    getUserInfo() {
        return this.http.get(environment.baseUrl + environment.apiResource + '/account/details').pipe(
            map(userInfo => {
                console.log('userInfo', userInfo);
                if (userInfo) {
                    this.accountService.setAccount(JSON.parse(JSON.stringify(userInfo)));
                }
                return userInfo;
            })
        );
    }


    logout() {
        console.log('Cerrando la sesion.');

        console.log('Eliminacion de token de memoria...');
        this.tokenService.removeToken();

        console.log('Eliminacion de datos del usuario de memoria...');
        this.accountService.removeAccount();

        console.log('Redireccionando a ventana de login..');
        this.router.navigate(['login']);
    }

    isAuthenticated() {
        return this.tokenService.isTokenValid(this.tokenService.getToken());
    }

    getAllPrivileges() {
        return this.http.get(environment.baseUrl + environment.apiResource + '/account/all-privileges');
    }
}
