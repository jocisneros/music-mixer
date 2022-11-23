// context-card.types.ts

import { Context, SpotifyContextOwner } from "../../../MusicMixer.types";

export type BaseContextCardProps = Context & {
    cardColor: string,
    key?: React.Key,
}

export type ContextCardProps = Context & {
    cardColor: string,
    key?: React.Key,
    removeCard?: () => void,
};

export type DraggableContextCardProps = Omit<ContextCardProps, 'key'> & {
    index: number,
};

export interface ContextCardCreditProps {
    contextName: string,
    contextOwner: SpotifyContextOwner,
    style?: React.CSSProperties,
};
