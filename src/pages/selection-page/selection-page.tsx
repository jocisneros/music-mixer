// context-selector.tsx

import { useCallback, useMemo, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { DraggableContextCard } from '../../components/cards/context-card/context-card';
import { SelectionPageProps } from './selection-page.types';
import { SearchCard } from '../../components/cards/search-card/search-card';
import Button from 'react-bootstrap/Button';
import { CiSearch } from 'react-icons/ci';
import { MixerCard } from '../../components/cards/mixer-card';
import { ContextCardProps } from '../../components/cards/context-card/context-card.types';

export const SelectionPage = ({
    redirectTo,
    cards,
    addToContextCards,
    onDragEnd,
    removeFromContextCards,
    ...spotifyFunctions
}: SelectionPageProps) => {
    const [showSearchCard, setShowSearchCard] = useState(false);

    const addContextCard = useCallback(
        (props: ContextCardProps) => {
            addToContextCards(props);
            setShowSearchCard(false);
    }, [addToContextCards])

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
                <MixerCard>
                    <div className='flex items-center justify-center h-full w-full'>
                    <Button
                        onClick={() => setShowSearchCard(true)}
                        bsPrefix='flex justify-center items-center border-none w-[65px] h-[65px] rounded-full bg-white/[0.5] hover:bg-white/[0.35]'
                    >
                        <CiSearch className='text-4xl stroke-1'/>
                    </Button>
                    </div>
                </MixerCard>
            );
        }
    }, [showSearchCard, addToContextCards, spotifyFunctions]);

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
                                    {cards.map((props, index) => (
                                        <DraggableContextCard
                                            {...props}
                                            index={index}
                                            removeCard={
                                                () => props.key && removeFromContextCards(props.key)
                                            }
                                        />
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
}
