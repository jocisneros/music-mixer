// webplayer-page.tsx

import { useCallback, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import {
    AuthCallback,
    EventType,
    WebPlaybackPlayer,
    WebPlaybackState,
    WebPlaybackTrack,
    WebPlayerPageProps,
    WebPlayer
} from './webplayer-page.types'

export const WebPlayerPage = ({
    token,
    play,
    pause,
    skipToNext,
    skipToPrevious,
    getMyCurrentPlaybackState
}: WebPlayerPageProps) => {
    const [isPaused, setPaused] = useState(false);
    const [isActive, setActive] = useState(false);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [currentTrack, setTrack] = useState({} as WebPlaybackTrack);

    useEffect(() => {
        if (!deviceId) {
            return;
        }

        play({
            device_id: deviceId,
            context_uri: 'spotify:artist:77mJc3M7ZT5oOVM7gNdXim',
        });

    }, [deviceId, play]);

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
            getMyCurrentPlaybackState().then((state) => {
                setActive(state.device?.is_active);
            });
        });

        webPlayer.connect();
    }, [token, getMyCurrentPlaybackState])

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
            <div className='flex flex-col gap-2 items-center'>
                <img
                    src={currentTrack.album.images[0].url}
                    className='rounded-2xl'
                    alt={`album art for '${currentTrack.name}'`}
                />
                <div className='flex flex-row gap-2 w-[500px] items-center justify-center'>
                    <div className='flex-col'>
                        <div className='text-white font-lg'>{currentTrack.name}</div>
                        <div className='now-playing__artist'>{currentTrack.artists[0].name}</div>
                    </div>
                    <div>
                        <Button onClick={async () => { await skipToPrevious() }}>{'<<'}</Button>
                        <Button onClick={async () => { await (isPaused ? play() : pause()) }}>
                            { isPaused ? '▶' : 'Pause'}
                        </Button>
                        <Button onClick={async () => { await skipToNext() }}>{'>>'}</Button>
                    </div>
                </div>
            </div>
        );
    }
}
