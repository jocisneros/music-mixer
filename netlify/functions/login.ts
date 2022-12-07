// login.ts

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import axios, { AxiosResponse } from 'axios';
import { AccessTokenResponse, SpotifyAuthHeader } from '../constants';

type LoginData = {
    authorizationCode: string,
}

type TokenResponse = AxiosResponse<AccessTokenResponse>

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    try {
        const { authorizationCode } = (JSON.parse(event.body || '') as LoginData);

        const body = `grant_type=authorization_code&code=${authorizationCode}` +
                     `&redirect_uri=${process.env.VITE_SPOTIFY_REDIRECT_URI}`;

        const response = await axios.post<any, TokenResponse>('https://accounts.spotify.com/api/token', body, {
            headers: {
                'Authorization': SpotifyAuthHeader,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log(response)
        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        };
    } catch (error) {
        return {
            statusCode: 422,
            body: `Error ${error}`
        };
    }
}
