import { Injectable } from '@angular/core';
import {IAccount} from '../../model/auth/IAccount';
import {Usuario} from '../../model/auth/usuario';
import {Constants} from '../../util/constants';

/**
 * LVT Servicios para gestion de la cuenta
 */
@Injectable()
export class AccountService {

    ACCOUNT_INFO = '_ACCOUNT_';

    constructor() {}

    setAccount(account: IAccount) {
        if (this.exists()) {
            this.removeAccount();
        }
        localStorage.setItem(this.ACCOUNT_INFO, JSON.stringify(account));
    }

    getAccount(): IAccount {
        if (this.exists()) {
            return (JSON.parse(localStorage.getItem(this.ACCOUNT_INFO)) as IAccount);
        }
        return null;
    }

    /**
     * Returns a Usuario object based in current user account info
     */
    getUsuario(): Usuario {
        return new Usuario(this.getAccount());
    }

    removeAccount() {
        localStorage.removeItem(this.ACCOUNT_INFO);
    }

    exists(): boolean {
        return localStorage.getItem(this.ACCOUNT_INFO) !== null;
    }

    /**
     * Returns true if current user have ROLE_DIRECTIVO privilege
     */
    isDirective(): boolean {
        return this.havePrivilege(Constants.ROLE_DIRECTIVO);
    }

    /**
     * Returns true if current user have ROLE_DOCENTE privilege
     */
    isTeacher(): boolean {
        return this.havePrivilege(Constants.ROLE_DOCENTE);
    }

    /**
     * Returns true if current user have ROLE_ADMINISTRATIVO privilege
     */
    isAdministrative(): boolean {
        return this.havePrivilege(Constants.ROLE_ADMINISTRATIVO);
    }

    /**
     * Returns true if current user have ROLE_SUPERVISOR privilege
     */
    isSupervisor(): boolean {
        return this.havePrivilege(Constants.ROLE_SUPERVISOR);
    }

    /**
     * Returns true if current user have ROLE_REPRESENTANTE privilege
     */
    isRepresent(): boolean {
        return this.havePrivilege(Constants.ROLE_REPRESENTANTE);
    }

    isNotificationsEnabled(): boolean {
        const account: IAccount = this.getAccount();
        if (account) {
            return account.enableNotifications;
        } else {
            return false;
        }
    }

    /**
     * Returns true if current user have passed privilege
     */
    private havePrivilege(privilege: string): boolean {
        let returnValue = false;
        const account: IAccount = this.getAccount();
        if (account) {
            if (account.roles.indexOf(privilege) > -1) {
                returnValue = true;
            }
        }

        return returnValue;
    }

}
