// login.ts

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import axios, { AxiosResponse } from 'axios';

type LoginData = {
    authorizationCode: string,
}

type AccessTokenResponse = AxiosResponse<{
    access_token: string,
    token_type: string,
    scope: string,
    expires_in: number,
    refresh_token: string,
}>

const AUTH_HEADER = 'Basic ' + Buffer.from(
    `${process.env.VITE_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
).toString('base64');

// @ts-ignore
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const { authorizationCode } = (JSON.parse(event.body || '') as LoginData)

    return axios.post<any, AccessTokenResponse>('https://accounts.spotify.com/api/token', {
        'grant_type': 'authorization_code',
        'refresh_token': authorizationCode,
        'redirect_uri': process.env.VITE_SPOTIFY_REDIRECT_URI
    }, { headers: {
            'Authorization': AUTH_HEADER,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
