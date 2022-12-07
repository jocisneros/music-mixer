// refresh.ts

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { SpotifyAuthHeader, SpotifyTokenURL } from '../constants';
import fetch from 'node-fetch';

type RefreshData = {
    refreshToken: string,
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    try {
        const { refreshToken } = (JSON.parse(event.body || '') as RefreshData);

        const response = await fetch(SpotifyTokenURL, {
            method: 'POST',
            headers: {
                'Authorization': SpotifyAuthHeader,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=refresh_token&refresh_token=${refreshToken}`
        });

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 422,
            body: `Error ${error}`
        };
    }
}
