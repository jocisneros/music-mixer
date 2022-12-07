// refresh.ts

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import axios, { AxiosHeaders, AxiosResponse } from 'axios';
import { SpotifyAuthHeader, SpotifyTokenURL } from '../constants';

type RefreshData = {
    refreshToken: string,
}

// @ts-ignore
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const { refreshToken } = (JSON.parse(event.body || '') as RefreshData);

    const body = `grant_type=refresh_token&refresh_token=${refreshToken}`;

    return axios.post(SpotifyTokenURL, body, {
        headers: {
            'Authorization': SpotifyAuthHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(
        response => JSON.stringify(response.data)
    ).catch(error => ({ statusCode: 422, body: `Error ${error}`}))
}
