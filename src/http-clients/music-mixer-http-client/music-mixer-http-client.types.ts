// music-mixer-http-client.types.ts

import { AxiosResponse } from "axios"

type SpotifyTokenResponseInner = {
    access_token: string,
    token_type: string,
    expires_in: number,
    refresh_token: string,
    scope: string,
    error?: string,
    error_description?: string,
};

export type SpotifyAccessTokenResponse = AxiosResponse<
    SpotifyTokenResponseInner
>;

export type SpotifyRefreshTokenResponse = AxiosResponse<
    Omit<SpotifyTokenResponseInner, 'refresh_token'>
>;

export type AuthorizationCode = {
    authorizationCode: string,
};

export type RefreshToken = {
    refreshToken: string,
};
