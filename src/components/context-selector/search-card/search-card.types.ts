// search-card.types.ts

import { GroupBase, SingleValue, StylesConfig } from "react-select";
import Select from "react-select/dist/declarations/src/Select";
import { SpotifyHttpClient } from "../../../http-clients/spotify-http-client/spotify-http-client";
import { ContextCardProps } from "../context-card/context-card.types";
import { SpotifyContextInformation } from "../context-selector.types";

export type SearchCardProps = {
    spotifyClient: SpotifyHttpClient,
    addContextCard: (props: ContextCardProps) => void,
};

export type SearchOptionLabelProps = {
    context: SpotifyContextInformation,
};

export type SearchContextState = (SpotifyContextInformation & {
    cardColor: string,
});

export type ContextPreviewProps = {
    context: SearchContextState,
    prominentColors: string[],
    createContextCard: (context: SearchContextState) => void,
};

export type SearchOption = {
    value: SpotifyContextInformation,
};

export type SelectedSearchOption = SingleValue<SearchOption>;

export type SelectStyles = StylesConfig<SearchOption, false, GroupBase<SearchOption>>;

export type SelectRef = Select<SearchOption, false, GroupBase<SearchOption>> | null;
