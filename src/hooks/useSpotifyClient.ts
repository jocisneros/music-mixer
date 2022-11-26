// useSpotifyToken

import { useEffect, useMemo, useState } from 'react';
import Spotify from 'spotify-web-api-js';
import { MusicMixerHttpClient } from '../music-mixer-http-client';

export const useSpotifyClient = (
    initAccessToken: string,
    refreshToken: string,
    initExpiresIn: number,
) => {
    const [accessToken, setAccessToken] = useState(initAccessToken);
    const [expiresIn, setExpiresIn] = useState(initExpiresIn);

    const spotifyClient = useMemo(() => {
        const spotifyClient = new Spotify();
        spotifyClient.setAccessToken(accessToken);
        return spotifyClient;
    }, [accessToken]);

    useEffect(() => {
        const interval = setInterval(() => {
            MusicMixerHttpClient
            .refreshSpotifyAccessToken(refreshToken)
            .then(response => {
                console.log(response)
                setAccessToken(response.data.access_token);
                setExpiresIn(response.data.expires_in);
            })
        }, (expiresIn - 60) * 1000 );

        return () => clearInterval(interval);
    }, [refreshToken, expiresIn, spotifyClient])

    return spotifyClient;
};
