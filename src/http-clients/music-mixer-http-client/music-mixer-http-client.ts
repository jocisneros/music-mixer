// music-mixer-http-clients.ts

import axios from "axios";
import { 
    AuthorizationCode, 
    RefreshToken, 
    SpotifyAccessTokenResponse, 
    SpotifyRefreshTokenResponse
} from './music-mixer-http-client.types';

export class MusicMixerHttpClient {    
    async getSpotifyAccessToken(authorizationCode: string): Promise<SpotifyAccessTokenResponse> {
        const response = await axios.post<AuthorizationCode, SpotifyAccessTokenResponse>(
            '/login', { authorizationCode: authorizationCode }
        );
        return response;
    }

    async refreshSpotifyAccessToken(refreshToken: string): Promise<SpotifyRefreshTokenResponse> {
        const response = await axios.post<RefreshToken, SpotifyRefreshTokenResponse>(
            '/refresh', { refreshToken: refreshToken }
        );
        return response;
    }
}
