// context-card.types.ts

import { SpotifyContextInformation, SpotifyContextOwner } from "../context-selector.types";

export type ContextCardInnerProps = {
    context: SpotifyContextInformation,
    contextOwner: SpotifyContextOwner,
};

export type ContextCardProps = ContextCardInnerProps & {
    cardColor: string,
    key?: React.Key,
};

export type DraggableContextCardProps = ContextCardInnerProps & {
    cardColor: string,
    index: number,
};

export interface ContextCardCreditProps {
    contextName: string,
    contextOwner: SpotifyContextOwner,
    style?: React.CSSProperties,
};
