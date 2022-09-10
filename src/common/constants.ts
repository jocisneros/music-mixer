// constants.ts

import { generateRandomString } from './functions'

export const spotifyBaseUrl = 'https://accounts.spotify.com/';

export const spotifyClientId = '7b502c7721ea449ca620b12c09a5ba43';

export const spotifyRedirectUri = 'http://localhost:3000/';

export const spotifyApiBaseUrl = 'https://api.spotify.com/v1/';

const spotifyScope = 'streaming \
                     user-read-email \
                     user-read-private \
                     user-modify-playback-state \
                     app-remote-control \
                     user-read-currently-playing \
                     user-read-playback-state';

const spotifyState = generateRandomString(16);

const spotifyQueryParameters = new URLSearchParams({
    'response_type': 'code',
    'client_id': spotifyClientId,
    'scope': spotifyScope,
    'redirect_uri': spotifyRedirectUri,
    'state': spotifyState,
} as Record<string, string>);

export const spotifyLoginUrl = `${spotifyBaseUrl}authorize?${spotifyQueryParameters.toString()}`;