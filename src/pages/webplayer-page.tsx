// webplayer-page.tsx

import { useCallback, useEffect, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { WebPlaybackSDK, usePlayerDevice, usePlaybackState, useSpotifyPlayer, useWebPlaybackSDKReady } from "react-spotify-web-playback-sdk";
import Spinner from 'react-bootstrap/Spinner';
import { BsFillPlayFill, BsPauseFill, BsFillSkipStartFill, BsFillSkipEndFill } from 'react-icons/bs'
import { ContextCardProps } from '../components/cards/context-card/context-card.types';
import { extractProminentColors } from '../common/functions';

type WebPlayerPageInnerProps = {
    contextCards: ContextCardProps[],
    play: (options?: SpotifyApi.PlayParameterObject) => Promise<void>,
    shuffle: () => Promise<void>
};

export type WebPlayerPageProps = WebPlayerPageInnerProps & {
    token: string,
};

const WebPlayerPageInner = ({
    play,
    shuffle,
    contextCards,
}: WebPlayerPageInnerProps) => {
    const device = usePlayerDevice();
    const playbackState = usePlaybackState();
    const player = useSpotifyPlayer();
    const webPlayerReady = useWebPlaybackSDKReady();

    const [currentContext, setCurrentContext] = useState<ContextCardProps>()
    const [backgroundColor, setBackgroundColor] = useState('#1f1f1f');

    const playedTracks = useMemo(() => new Map<string, Set<string>>(), []);

    const playerCardContainerStyle = (
        'flex flex-col gap-2 items-center rounded-3xl justify-center w-96 h-[34rem] bg-black/20 shadow'
    );
    const playerControlButtonStyle = (
        'flex items-center justify-center rounded-full bg-white/10 text-white text-[2.25rem] w-[3rem] h-[3rem] shadow hover:bg-white/5'
    );

    const getNextCard = useCallback(() => {
        if (contextCards.length === 0) {
            return null;
        }

        const nextContext = Math.floor(Math.random() * contextCards.length);

        return contextCards[nextContext];
    }, [contextCards]);

    useEffect(() => {
        if (player === null) {
            return;
        }

        player.activateElement();
    }, [player]);

    useEffect(() => {
        if (device === null || contextCards.length === 0) {
            return;
        }

        const contextCard = getNextCard()!;
        
        play({
            device_id: device.device_id,
            context_uri: contextCard.context.uri
        }).then(() => shuffle());

        setBackgroundColor(contextCard.cardColor);
        setCurrentContext(contextCard);
    }, [device, play, shuffle, getNextCard, contextCards]);

    useEffect(() => {
        if (playbackState === null) {
            return;
        }

        if (!playbackState.shuffle) {
            shuffle();
        }

        const currentTrack = playbackState.track_window.current_track;

        if (!currentContext || currentContext.context.uri !== playbackState.context.uri) {
            // TODO: maybe create new context card?
            setCurrentContext(
                contextCards.filter(
                    card => card.context.uri === playbackState.context.uri
                ).at(0)
            );
        }

        if (currentTrack.id !== null && currentContext) {
            const contextUri = currentContext.context.uri;
            if (!playedTracks.has(contextUri)) {
                playedTracks.set(contextUri, new Set())
            }
            playedTracks.get(contextUri)!.add(currentTrack.id);
        }

        extractProminentColors(currentTrack.album.images[0].url)
        .then(
            colors => setBackgroundColor(colors[0])
        )
    }, [contextCards, currentContext, playbackState, playedTracks, shuffle])

    const nextTrack = useCallback(async () => {
        if (player === null || playbackState === null) {
            return;
        }

        const nextContext = getNextCard();

        if (nextContext === null || nextContext?.context.uri === currentContext?.context.uri) {
            await player.nextTrack();
            return;
        }
        // const playedTracksInContext = playedTracks.get(nextContext.context.uri);

        await play({context_uri: nextContext.context.uri});
        // const currentState = await player.getCurrentState();
        // const currentTrack = currentState !== null
        //                      ? currentState.track_window.current_track
        //                      : undefined;

        // while (
        //     currentTrack
        //     && currentTrack.id !== null
        //     && playedTracksInContext?.has(currentTrack.id)
        // ) {
        //     await player.nextTrack();
        // }

    }, [currentContext?.context.uri, player, playbackState, getNextCard, play])

    if (playbackState === null || player === null || device === null || !webPlayerReady) {
        return (
            <div className={playerCardContainerStyle}>
                <Spinner animation={'border'} variant='light'/>
            </div>
        );
    }

    const currentTrack = playbackState.track_window.current_track;

    return (
        <div
            className='flex flex-col gap-4 items-center justify-center h-screen w-screen'
            style={{
                background: 
                    `radial-gradient(ellipse at top, ${currentContext?.cardColor + '35'}, transparent), ` +
                    `radial-gradient(ellipse at bottom, ${backgroundColor + '50'}, transparent)`
                
            }}
        >
            { currentContext &&
                <div
                    className='flex flex-row gap-3 rounded-3xl items-center justify-center h-20 w-96 px-4 shadow'
                    style={{ background: currentContext.cardColor + '30' }}
                >
                    <div className='flex flex-col w-full'>
                        <div className='tracking-wide text-white text-xs'>{'now playing'}</div>
                        <p className='font-semibold text-white truncate m-0 w-[17rem]'>{currentContext.context.name}</p>
                    </div>
                    <img
                        className='object-cover rounded-xl w-14 h-14'
                        alt={`art for '${currentContext.context.name}'`}
                        src={currentContext.context.images[0].url}
                    />
                </div>
            }
            <div className={playerCardContainerStyle}>
                <img
                    src={currentTrack.album.images[0].url}
                    className='w-full pt-1'
                    alt={`album art for '${currentTrack.name}'`}
                />
                <div className='flex flex-col items-center justify-center w-80'>
                    <p className='flex items-center justify-center text-white text-lg m-0 w-80 truncate'>{currentTrack.name}</p>
                    <p className='flex items-center justify-center text-white text-sm m-0 w-80 truncate'>
                        {currentTrack.artists.map(artist => artist.name).join(', ')}
                    </p>
                </div>
                <div className='flex flex-row gap-2'>
                    <Button
                        bsPrefix={playerControlButtonStyle}
                        onClick={ async () => player.previousTrack() }
                    >
                        <BsFillSkipStartFill />
                    </Button>
                    <Button
                        bsPrefix={playerControlButtonStyle}
                        onClick={ async () => await (playbackState.paused ? player.resume() : player.pause()) }
                    >
                        {
                            playbackState.paused
                            ? <BsFillPlayFill />
                            : <BsPauseFill />
                        }
                    </Button>
                    <Button
                        bsPrefix={playerControlButtonStyle}
                        onClick={ async () => await nextTrack() }
                    >
                        <BsFillSkipEndFill />
                    </Button>
                </div>
            </div>
        </div>
    );
}


export const WebPlayerPage = ({
    token,
    ...innerProps
}: WebPlayerPageProps) => {
    const getOAuthToken = useCallback(
        (callback: (token: string) => void) => callback(token)
    , [token]);
    return (
        // @ts-ignore
        <WebPlaybackSDK
            initialDeviceName={'Music Mixer'}
            getOAuthToken={getOAuthToken}
            connectOnInitialized
        >
            <WebPlayerPageInner {...innerProps} />
        </WebPlaybackSDK>
    );
};
