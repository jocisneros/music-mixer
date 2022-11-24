// context-selector.tsx

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { DraggableContextCard, DraggableContextPreviewCard } from '../../components/cards/context-card/context-card';
import { SelectionPageProps } from './selection-page.types';
import { CiSearch } from 'react-icons/ci';
import { ContextPreviewCardProps } from '../../components/cards/context-card/context-card.types';
import Form from 'react-bootstrap/Form';
import { extractProminentColors } from '../../common/functions';
import Spinner from 'react-bootstrap/Spinner';

export const SelectionPage = ({
    redirectTo,
    cards,
    addToContextCards,
    onDragEnd,
    removeFromContextCards,
    ...spotifyFunctions
}: SelectionPageProps) => {
    const searchRef = useRef<HTMLInputElement>(null);

    const [isLoading, setLoading] = useState(false);
    const [contextPreviewCards, setContextPreviewCards] = useState<ContextPreviewCardProps[]>([]);

    const getSearchResults = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (searchRef.current === null) {
            return;
        }
        setLoading(true);
        const { albums, playlists } = await spotifyFunctions.search(
            searchRef.current.value, ['album', 'playlist'], { limit: 10 }
        );

        const contextPreviewCards: ContextPreviewCardProps[] = [];

        for (let i = 0; albums && i < albums.items.length; i++) {
            const cardColor = (await extractProminentColors(albums.items[i].images[0].url))[0];
            const contextOwner = await spotifyFunctions.getArtist(albums.items[i].artists[0].id);

            contextPreviewCards.push({
                key: albums.items[i].id,
                context: albums.items[i],
                contextOwner: contextOwner,
                cardColor: cardColor,
            });
        }

        for (let i = 0; playlists && i < playlists.items.length; i++) {
            const cardColor = (await extractProminentColors(playlists.items[i].images[0].url))[0];
            const contextOwner = await spotifyFunctions.getUser(playlists.items[i].owner.id);

            contextPreviewCards.push({
                key: playlists.items[i].id,
                context: playlists.items[i],
                contextOwner: contextOwner,
                cardColor: cardColor
            });
        }

        setContextPreviewCards(contextPreviewCards);
        setLoading(false);
        console.log(albums, playlists)

    }, [spotifyFunctions]);

    const previewResultsLoader = useMemo(() => {
        if (!isLoading && (!contextPreviewCards || contextPreviewCards.length === 0)) {
            return <div className='h-64 w-[96vw]' />
        }

        if (isLoading) {
            return (
                <div>
                    <div className='flex flex-col gap-2 h-64 w-[96vw] items-center justify-center bg-black/20 rounded-2xl'>
                        <Spinner animation={'border'} variant='light'/>
                        <p className='m-0 text-center text-white'>{'loading results...'}</p>
                    </div>
                </div>
            )
        }

        if (contextPreviewCards) {
            return (
                <div>
                    {/* <p className='m-0 text-white'>{'results'}</p> */}
                    <Droppable droppableId='queryDeck' direction='horizontal'>
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className='flex flex-row gap-4 h-64 w-[96vw] items-center bg-black/20 rounded-2xl snap-mandatory snap-x overflow-x-auto px-4'
                            >
                                {contextPreviewCards && contextPreviewCards.map((props, index) => (
                                    <DraggableContextPreviewCard
                                        {...props}
                                        index={index}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            );
        }
    }, [isLoading, contextPreviewCards])

    const contextDeck = useMemo(() => {
        return (
            <div>
                {/* <p className='m-0 text-white'>{'results'}</p> */}
                <Droppable droppableId='contextDeck' direction='horizontal'>
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className='flex flex-row gap-4 h-96 w-[96vw] items-center bg-black/20 rounded-2xl snap-mandatory snap-x overflow-x-auto px-4'
                        >
                            {
                                cards.length === 0
                                ? <p
                                    className='m-0 text-center w-full text-white'
                                  >
                                    {'search and drag cards here to play!'}
                                  </p>
                                : cards.map((props, index) => (
                                    <DraggableContextCard
                                        {...props}
                                        index={index}
                                        removeCard={
                                            () => props.key && removeFromContextCards(props.key)
                                        }
                                    />
                                ))
                            }
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        )
    }, [cards, removeFromContextCards])

    return (
        <div className='flex flex-col gap-16 items-center justify-center h-screen w-screen'>
            <DragDropContext onDragEnd={onDragEnd(contextPreviewCards)}>
                <div className='flex flex-col items-center justify-center gap-4'>
                    <div className='flex flex-row items-center justify-center'>
                        <Form className='flex' onSubmit={getSearchResults}>
                            <CiSearch className='bg-white rounded-l-full py-2 pl-4 border-none text-5xl'/>
                            <Form.Control
                                ref={searchRef}
                                bsPrefix='rounded-r-full w-96 py-2 px-4 border-none'
                                placeholder={'what do you want to listen to?'}
                            />
                        </Form>
                    </div>
                    {previewResultsLoader}
                </div>
                {contextDeck}
            </DragDropContext>
        </div>
    );
}
