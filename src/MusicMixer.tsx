// MusicMixer.tsx

import React, { useCallback, useMemo, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { DropResult } from 'react-beautiful-dnd';

import { MainPage, SelectionPage, WebPlayerPage } from './pages/pages';
import { ContextCardProps, ContextPreviewCardProps } from './components/components';
import { useSpotifyClient } from './hooks/useSpotifyClient';

import Button from 'react-bootstrap/Button';
import { BiArrowBack } from 'react-icons/bi';
import MusicMixerLogo from './assets/music-mixer.svg';


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

    const reorderContextCards = useCallback(
        (startIndex: number, finalIndex: number) => {
            setContextCards(prevCards => {
                const newCards = Array.from(prevCards);
                const [ removed ] = newCards.splice(startIndex, 1);
                newCards.splice(finalIndex, 0, removed);

                return newCards;
            });
    }, []);

    const insertContextCard = useCallback(
        (contextCard: ContextCardProps, index?: number) => {
            setContextCards(prevCards => {
                const newCards = Array.from(prevCards);
                newCards.splice(
                    index !== undefined
                    ? index
                    : newCards.length,
                    0,
                    contextCard
                );
                return newCards;
            });
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
            <div className='absolute flex w-full items-center justify-center top-2'>
                <div className='absolute left-2'>{backButton}</div>
                <div className='flex justify-center items-center'>
                    <img className='w-10' src={MusicMixerLogo} alt='music mixer logo' />
                    <div className='text-white font-semibold text-2xl tracking-wide'>
                        {'music mixer'}
                    </div>
                </div>
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
                            redirectTo={redirectTo}
                            search={spotify.search}
                            getUser={spotify.getUser}
                            getArtist={spotify.getArtist}
                            reorderContextCards={reorderContextCards}
                            insertContextCard={insertContextCard}
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
