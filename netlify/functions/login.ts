// login.ts

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { SpotifyAuthHeader, SpotifyTokenURL } from '../constants';
import fetch from 'node-fetch';

type LoginData = {
    authorizationCode: string,
}


export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    try {
        const { authorizationCode } = (JSON.parse(event.body || '') as LoginData);

        const response = await fetch(SpotifyTokenURL, {
            method: 'POST',
            headers: {
                'Authorization': SpotifyAuthHeader,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${process.env.VITE_SPOTIFY_REDIRECT_URI}`
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
