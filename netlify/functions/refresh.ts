// refresh.ts

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import axios, { AxiosHeaders, AxiosResponse } from 'axios';
import { AccessTokenResponse, SpotifyAuthHeader } from '../constants';

type RefreshData = {
    refreshToken: string,
}

type RefreshTokenResponse = AxiosResponse<Omit<AccessTokenResponse, 'refresh_token'>>

// @ts-ignore
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const { refreshToken } = (JSON.parse(event.body || '') as RefreshData);

    const body = `grant_type=refresh_token&refresh_token=${refreshToken}`;

    return axios.post('https://accounts.spotify.com/api/token', body, {
        headers: {
            'Authorization': SpotifyAuthHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(
        response => JSON.stringify(response.data)
    ).catch(error => ({ statusCode: 422, body: `Error ${error}`}))
}
