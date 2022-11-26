// constants.ts

export const SPOTIFY_BASE_URL = 'https://accounts.spotify.com/';

export const SPOTIFY_REDIRECT_URI = 'http://localhost:3000/callback';

const SPOTIFY_SCOPE = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-modify-playback-state',
    'app-remote-control',
    'user-read-currently-playing',
    'user-read-playback-state',
].join(' ');

const spotifyQueryParameters = new URLSearchParams({
    'response_type': 'code',
    'client_id': process.env.REACT_APP_SPOTIFY_CLIENT_ID,
    'scope': SPOTIFY_SCOPE,
    'redirect_uri': SPOTIFY_REDIRECT_URI
} as Record<string, string>);

export const SPOTIFY_AUTH_URL = `${SPOTIFY_BASE_URL}authorize?${spotifyQueryParameters.toString()}`;
