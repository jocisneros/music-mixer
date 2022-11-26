// context-selector.tsx

import React, {
    useCallback,
    useMemo,
    useRef,
    useState
} from 'react';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import {
    DragDropContext,
    Droppable,
    DropResult
} from 'react-beautiful-dnd';
import { CiSearch } from 'react-icons/ci';
import { extractProminentColors } from '../common/functions';
import {
    ContextCardProps,
    ContextPreviewCardProps,
    DraggableContextCard,
    DraggableContextPreviewCard
} from '../components/components';

type SelectionPageProps = {
    contextCards: ContextCardProps[],
    redirectTo: (to: string) => void,
    onDragEnd: (previewCards: ContextPreviewCardProps[]) => (
        drop: DropResult
    ) => void,
    removeFromContextCards: (key: React.Key) => void,
    search: (
        query: string,
        types: ('album' | 'artist' | 'playlist' | 'track')[],
        options?: SpotifyApi.SearchForItemParameterObject,
    ) => Promise<SpotifyApi.SearchResponse>,
    getUser: (
        userId: string,
    ) => Promise<SpotifyApi.UserProfileResponse>,
    getArtist: (
        artistId: string,
    ) => Promise<SpotifyApi.SingleArtistResponse>,
};

export const SelectionPage = ({
    contextCards,
    redirectTo,
    onDragEnd,
    removeFromContextCards,
    search,
    getUser,
    getArtist,
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
        const { albums, playlists } = await search(
            searchRef.current.value, ['album', 'playlist'], { limit: 10 }
        );

        const contextPreviewCards: ContextPreviewCardProps[] = [];

        for (let i = 0; albums && i < albums.items.length; i++) {
            const cardColor = (await extractProminentColors(albums.items[i].images[0].url))[0];
            const contextOwner = await getArtist(albums.items[i].artists[0].id);

            contextPreviewCards.push({
                key: albums.items[i].id,
                context: albums.items[i],
                contextOwner: contextOwner,
                cardColor: cardColor,
            });
        }

        for (let i = 0; playlists && i < playlists.items.length; i++) {
            const cardColor = (await extractProminentColors(playlists.items[i].images[0].url))[0];
            const contextOwner = await getUser(playlists.items[i].owner.id);

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

    }, [getArtist, getUser, search]);

    const previewResultsLoader = useMemo(() => {
        if (!isLoading && (!contextPreviewCards || contextPreviewCards.length === 0)) {
            return <div className='h-64 w-[80vw]' />
        }

        if (isLoading) {
            return (
                <div>
                    <div className='flex flex-col shadow-2xl shadow-[#42424220] gap-2 h-64 w-[80vw] items-center justify-center bg-black/20 rounded-2xl'>
                        <Spinner animation={'border'} variant='light'/>
                        <p className='m-0 text-center text-white'>{'loading results...'}</p>
                    </div>
                </div>
            )
        }

        if (contextPreviewCards) {
            return (
                <div>
                    <Droppable droppableId='queryDeck' direction='horizontal'>
                        {(provided) => (
                            <div
                                className='flex flex-row shadow-2xl shadow-[#42424220] gap-4 h-64 w-[80vw] items-center bg-black/20 rounded-2xl snap-mandatory snap-x overflow-x-auto px-4'
                                ref={provided.innerRef}
                                {...provided.droppableProps}
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
                <Droppable droppableId='contextDeck' direction='horizontal'>
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className='flex flex-row shadow-2xl shadow-[#42424220] gap-4 h-96 w-[80vw] items-center bg-black/20 rounded-2xl snap-mandatory snap-x overflow-x-auto px-4'
                        >
                            {
                                contextCards.length === 0
                                ? <p
                                    className='m-0 text-center font-bold text-xl w-full text-[#5c5c5c] tracking-[0.25rem]'
                                  >
                                    {'empty'}
                                  </p>
                                : contextCards.map((props, index) => (
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
    }, [contextCards, removeFromContextCards])

    return (
        <div className='flex flex-col gap-16 items-center justify-center h-screen w-screen'>
            <DragDropContext onDragEnd={onDragEnd(contextPreviewCards)}>
                <div className='flex flex-col items-center justify-center gap-2'>
                    <div className='flex flex-row items-center justify-center'>
                        <Form className='flex' onSubmit={getSearchResults}>
                            <CiSearch className='bg-white rounded-l-full py-2 pl-4 border-none text-5xl'/>
                            
                            <Form.Control
                                ref={searchRef}
                                bsPrefix='rounded-r-full w-96 py-2 px-4 border-none focus:outline-none'
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
};
