// context-selector.tsx

import React, { useCallback, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { reorder } from '../../common/functions';
import { SpotifyHttpClient } from '../../http-clients/spotify-http-client/spotify-http-client';
import { ContextCard, DraggableContextCard } from './context-card/context-card';
import { ContextCardProps } from './context-card/context-card.types';
import { ContextSelectorProps } from './context-selector.types';
import { SearchCard } from './search-card/search-card';


export const ContextSelector: React.FC<ContextSelectorProps> = ({
    accessToken
}) => {
    const spotify = useMemo(() => {
        return new SpotifyHttpClient(accessToken)
    }, [accessToken]);
    const [contextOptions, setContextOptions] = useState<ContextCardProps[]>([]);
    // const [selectedPlaylists, setSelectedPlaylists] = useState([]);

    const addContextCard = useCallback((props: ContextCardProps) => {
        setContextOptions(options => [
            ...options, 
            {...props, key: `${props.key}-${options.length}`}
        ]);
    }, []);

    const onDragEnd = ({ destination, source }: DropResult) => {
        if (!destination) {
            return;
        }

        setContextOptions(items => reorder(items, source.index, destination.index));
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: "1rem", justifyContent: 'center' }}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='contextOptions' direction='horizontal'>
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{ display: 'flex', flexDirection: 'row', gap: '16px', flexWrap: 'wrap', maxWidth: '70%', alignItems: 'center', justifyContent: 'center' }}
                        >
                            {contextOptions.map((props, index) => (
                                <DraggableContextCard
                                    {...props}
                                    index={index}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        
            {/* {contextOptions.map(cardProps => <ContextCard {...cardProps} />)} */}
            <SearchCard spotifyClient={spotify} addContextCard={addContextCard} />
        </div>
    );
}
