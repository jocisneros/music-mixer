// login.ts

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import axios, { AxiosResponse } from 'axios';

type LoginData = {
    authorizationCode: string,
}

const AUTH_HEADER = 'Basic ' + Buffer.from(
    `${process.env.VITE_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
).toString('base64');

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    try {
        const { authorizationCode } = (JSON.parse(event.body || '') as LoginData);

        const body = `grant_type=authorization_code&code=${authorizationCode}` +
                     `&redirect_uri=${process.env.VITE_SPOTIFY_REDIRECT_URI}`;

        const response = await axios.post('https://accounts.spotify.com/api/token', body, {
            headers: {
                'Authorization': AUTH_HEADER,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

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
