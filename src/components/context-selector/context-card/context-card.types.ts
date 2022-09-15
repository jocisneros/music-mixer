// context-card.types.ts

import { SpotifyContextInformation, SpotifyContextOwner } from "../context-selector.types";

export type ContextCardProps = {
    context: SpotifyContextInformation,
    contextOwner: SpotifyContextOwner,
    cardColor: string,
    key?: React.Key,
};

export interface ContextCardCreditProps {
    contextName: string,
    contextOwner: SpotifyContextOwner,
    style?: React.CSSProperties,
};
