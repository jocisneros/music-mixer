// music-mixer-http-clients.ts

import axios, { AxiosResponse } from 'axios';

type SpotifyTokenResponseInner = {
    access_token: string,
    token_type: string,
    expires_in: number,
    refresh_token: string,
    scope: string,
    error?: string,
    error_description?: string,
};

type SpotifyAccessTokenResponse = AxiosResponse<
    SpotifyTokenResponseInner
>;

type SpotifyRefreshTokenResponse = AxiosResponse<
    Omit<SpotifyTokenResponseInner, 'refresh_token'>
>;

type AuthorizationCode = { authorizationCode: string };

type RefreshToken = { refreshToken: string };

export class MusicMixerHttpClient {
    static async getSpotifyAccessToken(authorizationCode: string): Promise<SpotifyAccessTokenResponse> {
        const response = await axios.post<AuthorizationCode, SpotifyAccessTokenResponse>(
            '/api/login', { authorizationCode: authorizationCode }
        );
        return response;
    }

    static async refreshSpotifyAccessToken(refreshToken: string): Promise<SpotifyRefreshTokenResponse> {
        const response = await axios.post<RefreshToken, SpotifyRefreshTokenResponse>(
            '/api/refresh', { refreshToken: refreshToken }
        );
        return response;
    }
};
