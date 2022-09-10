// web-playback.tsx

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SpotifyHttpClient } from '../../http-clients/spotify-http-client/spotify-http-client';
import {
    AuthCallback,
    EventType,
    WebPlaybackPlayer,
    WebPlaybackProps,
    WebPlaybackState,
    WebPlaybackTrack,
    WebPlayer
} from './web-playback.types'


export const WebPlayback: React.FC<WebPlaybackProps> = ({ token }) => {
    const [isPaused, setPaused] = useState(false);
    const [isActive, setActive] = useState(false);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [currentTrack, setTrack] = useState({} as WebPlaybackTrack);
    const spotify = useMemo(() => {
        return new SpotifyHttpClient(token)
    }, [token]);

    useEffect(() => {
        if (!deviceId) {
            return;
        }

        spotify.play({
            device_id: deviceId,
            context_uri: 'spotify:artist:77mJc3M7ZT5oOVM7gNdXim',
        });

    }, [deviceId, spotify]);

    const onSpotifyWebPlaybackSDKReady = useCallback(() => {
        // @ts-expect-error
        const webPlayer = new window.Spotify.Player({
            name: 'Music Mixer',
            getOAuthToken: (callback: AuthCallback) => { callback(token); },
            volume: 0.5
        }) as WebPlayer;

        webPlayer.addListener(EventType.Ready, (player: WebPlaybackPlayer) => {
            if (!player) {
                return;
            }

            setDeviceId(player.device_id);
        })

        webPlayer.addListener(EventType.PlayerStateChanged, (state: WebPlaybackState) => {
            if (!state) {
                return;
            }

            setTrack(state.track_window.current_track);
            setPaused(state.paused);
            spotify.getMyCurrentPlaybackState().then((state) => {
                setActive(state.device?.is_active);
            });
        });

        webPlayer.connect();
    }, [token, spotify])

    useEffect(() => {
        document.body.appendChild(
            Object.assign(
                document.createElement('script'),
                {
                    src: 'https://sdk.scdn.co/spotify-player.js',
                    async: true,
                    name: 'spotify-sdk'
                }
            )
        )

        // @ts-expect-error
        window.onSpotifyWebPlaybackSDKReady = onSpotifyWebPlaybackSDKReady;
    }, [onSpotifyWebPlaybackSDKReady]);

    if (!isActive) {
        return (
            <div>
                <b> Instance not active </b>
            </div>
        );
    } else {
        return (
            <div className="main-wrapper">
                <img src={currentTrack.album.images[0].url} className="now-playing__cover" alt="" />
                <div className="now-playing__side">
                    <div className="now-playing__name">{currentTrack.name}</div>
                    <div className="now-playing__artist">{currentTrack.artists[0].name}</div>

                    <button className="btn-spotify" onClick={async () => { await spotify.skipToPrevious() }} >
                        &lt;&lt;
                    </button>

                    <button className="btn-spotify" onClick={async () => { isPaused ? spotify.play() : spotify.pause() }} >
                        { isPaused ? "PLAY" : "PAUSE" }
                    </button>

                    <button className="btn-spotify" onClick={async () => { await spotify.skipToNext() }} >
                        &gt;&gt;
                    </button>
                </div>
            </div>
        );
    }
}