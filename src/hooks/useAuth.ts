// useAuth.ts

import { useEffect, useMemo, useState } from "react";
import { MusicMixerHttpClient } from "../http-clients/music-mixer-http-client/music-mixer-http-client";

export const useAuth = (authorizationCode: string | null) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [expiresIn, setExpiresIn] = useState<number | null>(null);
    const httpClient = useMemo(() => { 
        return new MusicMixerHttpClient(); 
    }, []);

    useEffect(() => {
        if (!authorizationCode) {
            return;
        }

        httpClient
        .getSpotifyAccessToken(authorizationCode)
        .then((response) => {
            // @ts-expect-error
            window.history.pushState({}, null, "/");

            setAccessToken(response.data.access_token);
            setRefreshToken(response.data.refresh_token);
            setExpiresIn(response.data.expires_in);
        })
        .catch((error) => {
            if (accessToken) {
                return;
            }

            // // @ts-expect-error
            // window.location = '/';
            console.log(error)
        });

      }, [authorizationCode, httpClient]);

    useEffect(() => {
        if (!refreshToken || !expiresIn) {
            return;
        }

        let interval = setInterval(() => {
            httpClient
            .refreshSpotifyAccessToken(refreshToken)
            .then((response) => {
                setAccessToken(response.data.access_token);
                setExpiresIn(response.data.expires_in);
            })
            .catch(() => {
                // @ts-expect-error
                window.location = '/';
                console.log("ERROR")
            });

        }, (expiresIn - 60) * 1000 );

        return () => clearInterval(interval);
        
    }, [refreshToken, expiresIn, httpClient]);

    return accessToken
};
