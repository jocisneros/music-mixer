// login.ts

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

type LoginData = {
    authorizationCode: string,
}

const AUTH_HEADER = 'Basic ' + Buffer.from(
    `${process.env.VITE_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
).toString('base64');

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const { authorizationCode } = (JSON.parse(event.body || '') as LoginData)

    return fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': AUTH_HEADER,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${process.env.VITE_SPOTIFY_REDIRECT_URI}`
    }).then(response => response.json());
}
