// MusicMixer.tsx

import React, { useCallback, useMemo, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { DropResult } from 'react-beautiful-dnd';

import { MainPage, SelectionPage, WebPlayerPage } from './pages/pages';
import { ContextCardProps, ContextPreviewCardProps } from './components/components';
import { useSpotifyClient } from './hooks/useSpotifyClient';

import Button from 'react-bootstrap/Button';
import { BiArrowBack } from 'react-icons/bi'
import { reorder } from './common/common';
import MusicMixerLogo from './logo.svg';


type MusicMixerProps = {
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
};

export const MusicMixer = ({
    accessToken,
    refreshToken,
    expiresIn
}: MusicMixerProps) => {
    const [contextCards, setContextCards] = useState<ContextCardProps[]>([])
    const location = useLocation();
    const spotify = useSpotifyClient(
        accessToken,
        refreshToken,
        expiresIn
    );

    const redirectTo = useNavigate();

    const removeFromContextCards = useCallback(
        (key: React.Key) => {
            setContextCards(prevCards => prevCards.filter(
                cardProps => cardProps.key !== key
            ));
    }, []);

    const onDragEnd = useCallback((
        previewCards: ContextPreviewCardProps[]
    ) => {
        return ({ destination, source }: DropResult) => {
            if (!destination || destination.droppableId !== 'contextDeck') {
                return;
            }

            if (source.droppableId === 'contextDeck') {
                setContextCards(items => reorder(items, source.index, destination.index));
                return;
            }

            if (source.droppableId === 'queryDeck') {
                setContextCards(prevCards => {
                    prevCards.splice(
                        destination.index,
                        0,
                        {
                            key: `${previewCards[source.index].key}-${prevCards.length + 1}`,
                            ...previewCards[source.index]
                        }
                    )
                    return prevCards;
                });
                return;
            }
        };
    }, []);

    const backButton = useMemo(() => {
        if (location.pathname === '/') {
            return <div className='w-16'></div>;
        }

        return (
            <Button
                onClick={() => redirectTo('/')}
                bsPrefix='flex justify-center items-center gap-2 font-semibold text-white tracking-wide'
            >
                <BiArrowBack />
                {'back'}
            </Button>
        )
    }, [location.pathname, redirectTo]);
    
    return (
        <div className='flex flex-col h-screen w-screen items-center justify-center'>
            <div className='flex flex-row w-screen justify-between pt-2 pb-2'>
                <div className='flex pl-4'>{backButton}</div>
                <div className='flex justify-center items-center'>
                    <img className='w-10' src={MusicMixerLogo} alt='music mixer logo' />
                    <div className='text-white font-semibold text-2xl tracking-wide'>
                        {'music mixer'}
                    </div>
                </div>
                <div className='w-20'></div>
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
                            contextCards={contextCards}
                            removeFromContextCards={removeFromContextCards}
                            onDragEnd={onDragEnd}
                            redirectTo={redirectTo}
                            search={spotify.search}
                            getUser={spotify.getUser}
                            getArtist={spotify.getArtist}
                        />
                    }
                />
                <Route
                    path='player'
                    element={
                        <WebPlayerPage
                            contextCards={contextCards}
                            token={accessToken}
                            play={spotify.play}
                            shuffle={async () => await spotify.setShuffle(true)} 
                        />
                    }
                />
            </Routes>
        </div>
    );
};
