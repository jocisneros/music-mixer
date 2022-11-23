// search-card.types.ts

import { GroupBase, SingleValue, StylesConfig } from 'react-select';
import Select from 'react-select/dist/declarations/src/Select';
import { SpotifyContextInformation } from '../../../MusicMixer.types';
import { ContextCardProps } from '../context-card/context-card.types';

export type funtions = {
    search: (
        query: string,
        types: ('album' | 'artist' | 'playlist' | 'track')[],
        options?: SpotifyApi.SearchForItemParameterObject,
    ) => Promise<SpotifyApi.SearchResponse>,
    getPlaylist: (
        playlistId: string,
    ) => Promise<SpotifyApi.SinglePlaylistResponse>,
    getUser: (
        userId: string,
    ) => Promise<SpotifyApi.UserProfileResponse>,
    getAlbum: (
        albumId: string,
    ) => Promise<SpotifyApi.SingleAlbumResponse>,
    getArtist: (
        artistId: string,
    ) => Promise<SpotifyApi.SingleArtistResponse>;
};

export type SearchCardProps = {
    addContextCard: (props: ContextCardProps) => void,
    search: (
        query: string,
        types: ('album' | 'artist' | 'playlist' | 'track')[],
        options?: SpotifyApi.SearchForItemParameterObject,
    ) => Promise<SpotifyApi.SearchResponse>,
    getPlaylist: (
        playlistId: string,
    ) => Promise<SpotifyApi.SinglePlaylistResponse>,
    getUser: (
        userId: string,
    ) => Promise<SpotifyApi.UserProfileResponse>,
    getAlbum: (
        albumId: string,
    ) => Promise<SpotifyApi.SingleAlbumResponse>,
    getArtist: (
        artistId: string,
    ) => Promise<SpotifyApi.SingleArtistResponse>,
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
