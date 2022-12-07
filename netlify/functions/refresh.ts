// refresh.ts

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import axios, { AxiosHeaders, AxiosResponse } from 'axios';

type RefreshData = {
    refreshToken: string,
}

const AUTH_HEADER = 'Basic ' + Buffer.from(
    `${process.env.VITE_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
).toString('base64');

// @ts-ignore
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const { refreshToken } = (JSON.parse(event.body || '') as RefreshData);

    const body = `grant_type=refresh_token&refresh_token=${refreshToken}`;

    return axios.post(
        'https://accounts.spotify.com/api/token',
        body, { headers: {
            'Authorization': AUTH_HEADER,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
