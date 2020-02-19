/**
 * LVT Representa el token.
 */
export interface IAccessToken {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: string;
    scope: string;
    jti: string;
}
