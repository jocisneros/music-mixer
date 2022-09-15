// context-selector.tsx

import React, { useCallback, useMemo, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { SpotifyHttpClient } from '../../http-clients/spotify-http-client/spotify-http-client';
import { ContextCard } from './context-card/context-card';
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

    return (
        // <DragDropContext onDragEnd={() => {}}>

        // </DragDropContext>
        <div style={{ display: 'flex', flexDirection: 'row', gap: "1rem" }}>
            {contextOptions.map(cardProps => <ContextCard {...cardProps} />)}
            <SearchCard spotifyClient={spotify} addContextCard={addContextCard} />
        </div>
    );
}
