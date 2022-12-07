// refresh.ts

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

type RefreshData = {
    refreshToken: string,
}

const AUTH_HEADER = 'Basic ' + Buffer.from(
    `${process.env.VITE_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
).toString('base64');

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const { refreshToken } = (JSON.parse(event.body || '') as RefreshData)

    return fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': AUTH_HEADER,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=refresh_token&refresh_token=${refreshToken}`
    }).then(response => response.json());
}
