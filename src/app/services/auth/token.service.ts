import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import {IAccessToken} from '../../model/auth/IAccessToken';

/**
 * LVT Token management tools.
 */
@Injectable()
export class TokenService {

    TOKEN_INFO = '_TOKEN_';

    constructor() {}

    isTokenValid(token: IAccessToken) {
        return (!this.isTokenExpired(token));
    }

    getToken(): IAccessToken {
        return (<IAccessToken>  JSON.parse(localStorage.getItem(this.TOKEN_INFO)));
    }

    getTokenExpirationDate(token: string): Date {
        const decoded = jwt_decode(token);

        if (decoded.exp === undefined) {
            return null;
        }

        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        return date;
    }

    isTokenExpired(token: IAccessToken): boolean {
        if (!token) {
            return true;
        }

        const date = this.getTokenExpirationDate(token.access_token);
        if (date === undefined) {
            return false;
        }

        return !(date.valueOf() > new Date().valueOf());
    }

    setToken(token: IAccessToken) {
        localStorage.setItem(this.TOKEN_INFO, JSON.stringify(token));
    }

    removeToken() {
        localStorage.removeItem(this.TOKEN_INFO);
    }

}
