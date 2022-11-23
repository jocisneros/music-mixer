// context-card.tsx

import { useMemo, useState } from 'react';
import { ContextCardProps, DraggableContextCardProps } from './context-card.types';
import { Draggable } from 'react-beautiful-dnd';
import { MixerCard } from '../mixer-card';
import { Button } from 'react-bootstrap';


export const ContextCard = ({
    context,
    contextOwner,
    cardColor,
    removeCard,
    key,
}: ContextCardProps) => {
    const [showModal, setShowModal] = useState(false);
    
    const contextName = useMemo(() => {
        if (context.name.length > 50) {
            return context.name.slice(0, 43) + '...';
        }

        return context.name;
    }, [context]);
    
    const contextOwnerName = useMemo(() => {
        if (contextOwner.type === 'user') {
            return contextOwner.display_name;
        }
        return contextOwner.name;
    }, [contextOwner]);

    const contextOwnerImage = useMemo(() => {
        if (contextOwner.images && contextOwner.images?.length !== 0) {
            return (
                <img
                    src={contextOwner.images[0].url}
                    alt={`spotify profile of '${contextOwnerName}'`}
                    className='h-[1.5rem] p-0 m-0 rounded-full'
                />
            );
        }
        return;
    }, [contextOwner, contextOwnerName])

    const modal = useMemo(() => {
        if (!showModal) {
            return;
        }
        return (
            <div className='absolute h-full w-full bg-black/80 z-20 top-0 rounded-2xl'>
                <div className='flex flex-col items-center gap-2 h-full justify-center'>
                    <Button
                        onClick={() => removeCard && removeCard()}
                        bsPrefix='border-none rounded-2xl bg-red-500 font-bold text-white text-sm py-2 px-4'
                    >
                        {'Remove Card'}
                    </Button>
                    <Button
                        bsPrefix='border-none rounded-2xl bg-white font-bold text-xs py-2 px-3'
                        onClick={() => setShowModal(false)}
                    >
                        {'Close'}
                    </Button>
                </div>
            </div>
        )
    }, [showModal])

    return (
        <MixerCard gradient color={cardColor}>
            {modal}
            <img
                src={context.images[0].url}
                alt={`art for '${context.name}'`}
                className='rounded-2xl h-[14.0625rem] max-w-[14.0625rem] object-cover shadow'
                onClick={() => {setShowModal(true)}}
            />
            <div
                className='absolute left-0 bottom-[0.75rem] gap-[0.375rem] px-3 py-0 m-0 w-full'
            >
                <p className='font-bold text-lg text-white p-0 m-0'>
                    {contextName}
                </p>
                <div
                    className='flex items-center flex-row gap-[0.5rem] font-semibold text-white text-sm'
                >
                    {contextOwnerImage}
                    {contextOwnerName}
                </div>
            </div>
        </MixerCard>
    );
};


export const DraggableContextCard = ({
    context,
    contextOwner,
    cardColor,
    index,
    removeCard,
}: DraggableContextCardProps) => {
    const id = context.id + '-' + index;

    return (
        <Draggable draggableId={id} key={id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className='flex items-center'
                >
                    <ContextCard
                        context={context}
                        contextOwner={contextOwner}
                        cardColor={cardColor}
                        removeCard={removeCard}
                    />
                </div>
            )}
        </Draggable>
    );
};
