// MusicMixer.tsx

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { SelectionPage } from './pages/selection-page/selection-page';
import { MainPage, WebPlayerPage } from './pages/pages';
import React, { useCallback, useMemo, useState } from 'react';
import { SpotifyHttpClient } from './http-clients/spotify-http-client/spotify-http-client';
import MusicMixerLogo from './logo.svg'
import { Button } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi'
import { ContextCardProps, ContextPreviewCardProps } from './components/cards/context-card/context-card.types';
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
                        previewCards[source.index]
                    )
                    return prevCards;
                });
                return;
            }
        };
    }, []);
    
    // const onDragEnd = useCallback((
    //     previewCards: ContextPreviewCardProps[]
    // ) => {
    //     return async ({ destination, source }: DropResult) => {
    //         if (!destination || destination.droppableId !== 'contextDeck') {
    //             return;
    //         }

    //         if (source.droppableId === 'contextDeck') {
    //             setContextCards(items => reorder(items, source.index, destination.index));
    //             return;
    //         }

    //         if (source.droppableId === 'queryDeck') {
    //             const previewCard = previewCards[source.index];

    //             const contextOwner = 'artists' in previewCard.context
    //                                  ? await spotifyClient.getArtist(previewCard.context.artists[0].id)
    //                                  : await spotifyClient.getUser(previewCard.context.owner.id);

    //             setContextCards(prevCards => {
    //                 prevCards.splice(
    //                     destination.index,
    //                     0,
    //                     {
    //                         ...previewCard,
    //                         contextOwner: contextOwner
    //                     }
    //                 )
    //                 return prevCards;
    //             });
    //             return;
    //         }
    //     };
    // }, [spotifyClient]);

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