// mixer-card.tsx

import React from 'react';

export type MixerCardProps = {
    color?: string,
    gradient?: boolean,
    children: React.ReactNode,
};

export const MixerPreviewCard = ({
    color,
    gradient,
    children,
}: MixerCardProps) => {
    const cardColor = color ? color : '#171717';
    return (
        <div
            className='relative flex flex-col items-center border-none min-w-[8.5714rem] max-w-[8.5714rem] h-56 rounded-2xl shadow snap-normal snap-center'
            style={
                gradient
                ? { backgroundImage: `linear-gradient(${cardColor}, #121312 500%)` }
                : { background: cardColor }
            }
        >
            {children}
        </div>
    );
};

export const MixerCard = ({
    color,
    gradient,
    children,
}: MixerCardProps) => {
    const cardColor = color ? color : '#171717';
    return (
        <div
            className='relative flex flex-col items-center border-none min-w-[15.625rem] max-w-[15.625rem] h-[21.875rem] rounded-2xl shadow py-3 snap-normal snap-center'
            style={
                gradient
                ? { backgroundImage: `linear-gradient(${cardColor}, #121312 500%)` }
                : { background: cardColor }
            }
        >
            {children}
        </div>
    );
};
