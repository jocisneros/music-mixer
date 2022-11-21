// context-selector.tsx

import { useCallback, useMemo, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { reorder } from '../../common/functions';
import { DraggableContextCard } from './context-card/context-card';
import { ContextCardProps } from './context-card/context-card.types';
import { ContextSelectorProps } from './context-selector.types';
import { SearchCard } from './search-card/search-card';
import Button from 'react-bootstrap/Button';
import { CiSearch } from 'react-icons/ci';

export const ContextSelector = ({
    redirectTo,
    ...spotifyFunctions
}: ContextSelectorProps) => {
    const [contextOptions, setContextOptions] = useState<ContextCardProps[]>([]);
    const [showSearchCard, setShowSearchCard] = useState(false);

    const addContextCard = useCallback((props: ContextCardProps) => {
        setContextOptions(options => [
            ...options, 
            {...props, key: `${props.key}-${options.length}`}
        ]);
        setShowSearchCard(false);
    }, []);

    const onDragEnd = ({ destination, source }: DropResult) => {
        if (!destination) {
            return;
        }

        setContextOptions(items => reorder(items, source.index, destination.index));
    }

    const searchCardView = useMemo(() => {
        if (showSearchCard) {
            return (
                <SearchCard
                    {...spotifyFunctions}
                    addContextCard={addContextCard}
                />
            );
        } else {
            return (
                <div className='flex justify-center items-center w-[15.625rem] h-[21.875rem]'>
                    <Button
                        onClick={() => setShowSearchCard(true)}
                        bsPrefix='flex justify-center items-center border-none w-[65px] h-[65px] rounded-full bg-white/[0.5]'
                    >
                        <CiSearch className='text-4xl stroke-1'/>
                    </Button>
                </div>
            );
        }
    }, [showSearchCard, addContextCard, spotifyFunctions]);

    return (
        <div className='flex flex-col items-center'>
            <div className='flex flex-row flex-1 items-center'>
                <div className='p-4'>{searchCardView}</div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className='w-4/5'>
                        <Droppable droppableId='contextOptions' direction='horizontal'>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className='flex flex-row gap-4 h-full w-full items-center overflow-x-auto p-4'
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
                    </div>
                </DragDropContext>
            </div>
            <Button onClick={() => redirectTo('/player')}>
                {'Play'}
            </Button>
        </div>
    );
}
