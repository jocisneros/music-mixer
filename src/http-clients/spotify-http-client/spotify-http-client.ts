import Spotify from 'spotify-web-api-js';

export class SpotifyHttpClient extends Spotify {
    constructor(accessToken: string) {
        super();
        super.setAccessToken(accessToken);
    }
}
