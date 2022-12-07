// constants.ts

export const SpotifyAuthHeader = 'Basic ' + Buffer.from(
    `${process.env.VITE_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
).toString('base64');

export const SpotifyTokenURL = 'https://accounts.spotify.com/api/token';
