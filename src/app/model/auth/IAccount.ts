/**
 * LVT Representa la cuenta de un usuario.
 */
export interface IAccount {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    notificationsUUID: string;
    notificationsToken: string;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
    enabled: boolean;
    enableNotifications: boolean;
    roles: string[];
    authorities: any[];
}
