// context-card.tsx

import { useMemo, useState } from 'react';
import { ContextCardProps, ContextPreviewCardProps, DraggableContextCardProps, DraggableContextPreviewCardProps } from './context-card.types';
import { Draggable } from 'react-beautiful-dnd';
import { MixerCard, MixerPreviewCard } from '../mixer-card';
import { Button } from 'react-bootstrap';

export const ContextPreviewCard = ({
    context,
    cardColor,
}: ContextPreviewCardProps) => {
    const ownerName = useMemo(() => {
        if ('artists' in context) {
            return context.artists[0].name;
        }

        if ('owner' in context) {
            return context.owner.display_name;
        }
    }, [context]);

    const tag = useMemo(() => {
        if ('album_type' in context) {
            return context.album_type;
        } else {
            return 'playlist';
        }
    }, [context]);
    return (
        <MixerPreviewCard color={cardColor + '50'}>
            <p className='m-0 text-center w-full px-2 truncate h-24 text-white'>{ownerName}</p>
            <img
                src={context.images[0].url}
                alt={`art for '${context.name}'`}
                className='w-full max-h-[8.5714rem] min-h-[8.5714rem] object-cover'
            />
            <div className='flex flex-col gap-2 h-full w-full items-center justify-center'>
                <p className='m-0 text-white pb-4 px-2 text-center w-full truncate'>{context.name}</p>
                <p className='absolute bottom-0 bg-white/10 rounded-b-2xl text-center w-full m-0 text-white tracking-wide'>{tag}</p>
            </div>
        </MixerPreviewCard>
    )
}

export const ContextCard = ({
    context,
    contextOwner,
    cardColor,
    removeCard,
}: ContextCardProps) => {
    const [showModal, setShowModal] = useState(false);
    
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
            <div className='absolute h-full w-full bg-black/80 z-20 top-0 rounded-[.935rem]'>
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
    }, [showModal, removeCard])

    return (
        <MixerCard gradient color={cardColor + 'D0'}>
            {modal}
            <img
                src={context.images[0].url}
                alt={`art for '${context.name}'`}
                className='h-full w-full object-cover'
                onClick={() => {setShowModal(true)}}
            />
            <div className='flex flex-col items-center justify-start w-full px-[1rem] pt-3'>
                <p className='font-bold text-lg text-white m-0 w-full truncate'>
                    {context.name}
                </p>
                <div
                    className='flex items-center flex-row gap-[0.5rem] font-semibold text-white text-sm w-full'
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

export const DraggableContextPreviewCard = ({
    context,
    contextOwner,
    cardColor,
    index,
}: DraggableContextPreviewCardProps) => {
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
                    <ContextPreviewCard
                        context={context}
                        contextOwner={contextOwner}
                        cardColor={cardColor}
                    />
                </div>
            )}
        </Draggable>
    );
};