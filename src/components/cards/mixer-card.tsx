// mixer-card.tsx

import React from 'react';

export type MixerCardProps = {
    color?: string,
    gradient?: boolean,
    children: React.ReactNode,
}

export const MixerCard = ({
    color,
    gradient,
    children,
}: MixerCardProps) => {
    const cardColor = color ? color : '#171717';
    return (
        <div
            className='relative flex flex-col items-center border-none w-[15.625rem] h-[21.875rem] rounded-2xl shadow py-3 px-2'
            style={
                gradient
                ? { backgroundImage: `linear-gradient(${cardColor}, #121312 500%)` }
                : { background: cardColor }
            }
        >
            {children}
        </div>
    );
}
