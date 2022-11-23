// MusicMixer.tsx

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { SelectionPage } from './pages/selection-page/selection-page';
import { MainPage, WebPlayerPage } from './pages/pages';
import React, { useCallback, useMemo, useState } from 'react';
import { SpotifyHttpClient } from './http-clients/spotify-http-client/spotify-http-client';
import MusicMixerLogo from './logo.svg'
import { Button } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi'
import { ContextCardProps } from './components/cards/context-card/context-card.types';
import { DropResult } from 'react-beautiful-dnd';
import { reorder } from './common/functions';

type MusicMixerProps = {
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
};

// TODO: Update token when expired
export const MusicMixer = ({
    accessToken,
    refreshToken,
    expiresIn
}: MusicMixerProps) => {
    const [contextCards, setContextCards] = useState<ContextCardProps[]>([])
    const location = useLocation();

    const spotifyClient = useMemo(
        () => new SpotifyHttpClient(accessToken)
    , [accessToken]);
    
    const redirectTo = useNavigate();

    const addToContextCards = useCallback(
      (props: ContextCardProps) => {
        setContextCards(cards => [
            ...cards,
            {...props, key: `${props.key}-${cards.length}`}
        ]);
      },
      [],
    );

    const removeFromContextCards = useCallback(
        (key: React.Key) => {
            setContextCards(prevCards => prevCards.filter(
                cardProps => cardProps.key !== key
            ));
        }
    , []);

    const onDragEnd = ({ destination, source }: DropResult) => {
        if (!destination) {
            return;
        }

        setContextCards(items => reorder(items, source.index, destination.index));
    };
    
    return (
        <div>
            <div className='absolute top-4 left-4 flex flex-col items-center'>
                <div className='flex items-center justify-center'>
                    <img
                        src={MusicMixerLogo}
                        alt='music mixer logo'
                        className='w-10'
                    />
                    <div
                        className='text-white font-semibold text-2xl tracking-wide'
                    >
                        {'music mixer'}
                    </div>
                </div>
                {
                    location.pathname !== '/' &&
                    <Button
                        onClick={() => redirectTo('/')}
                        bsPrefix='absolute justify-center items-center gap-2 left-2 top-16 flex font-semibold text-white'
                    >
                        <BiArrowBack />
                        {'Back'}
                    </Button>
                }
            </div>
            <Routes>
                <Route
                    path=''
                    element={<MainPage redirectTo={redirectTo} contextCards={contextCards} />}
                />
                <Route 
                    path='select'
                    element={
                        <SelectionPage
                            cards={contextCards}  
                            addToContextCards={addToContextCards}
                            removeFromContextCards={removeFromContextCards}
                            onDragEnd={onDragEnd}
                            redirectTo={redirectTo}
                            search={spotifyClient.search}
                            getPlaylist={spotifyClient.getPlaylist}
                            getUser={spotifyClient.getUser}
                            getAlbum={spotifyClient.getAlbum}
                            getArtist={spotifyClient.getArtist}
                        />
                    }
                />
                <Route
                    path='player'
                    element={
                        <WebPlayerPage
                            contextCards={contextCards}
                            token={accessToken}
                            play={spotifyClient.play}
                            shuffle={async () => await spotifyClient.setShuffle(true)} 
                        />
                    }
                />
            </Routes>
        </div>
    );
};