// context-card.types.ts

import { Context, SpotifyContextOwner } from "../../../MusicMixer.types";

export type BaseContextCardProps = Context & {
    cardColor: string,
    key?: React.Key,
};

export type ContextPreviewCardProps = BaseContextCardProps;

export type ContextCardProps = BaseContextCardProps & {
    removeCard?: () => void,
};

export type DraggableContextPreviewCardProps = Omit<
    ContextPreviewCardProps,
    'key'
> & {
    index: number,
};

export type DraggableContextCardProps = Omit<
    ContextCardProps,
    'key'
> & {
    index: number,
};

export interface ContextCardCreditProps {
    contextName: string,
    contextOwner: SpotifyContextOwner,
    style?: React.CSSProperties,
};
