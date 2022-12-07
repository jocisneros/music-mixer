// constants.ts

export const SpotifyAuthHeader = 'Basic ' + Buffer.from(
    `${process.env.VITE_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
).toString('base64');

export type AccessTokenResponse = {
    access_token: string,
    token_type: string,
    scope: string,
    expires_in: number,
    refresh_token: string,
};
