// refresh.ts

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import axios, { AxiosHeaders, AxiosResponse } from 'axios';

type RefreshData = {
    refreshToken: string,
}

type RefreshedTokenResponse = AxiosResponse<{
    access_token: string,
    token_type: string,
    scope: string,
    expires_in: number,
}>

const AUTH_HEADER = 'Basic ' + Buffer.from(
    `${process.env.VITE_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
).toString('base64');

// @ts-ignore
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const { refreshToken } = (JSON.parse(event.body || '') as RefreshData)

    return axios.post<any, RefreshedTokenResponse>('https://accounts.spotify.com/api/token', {
        'grant_type': 'refresh_token',
        'refresh_token': refreshToken
    }, { headers: {
            'Authorization': AUTH_HEADER,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
