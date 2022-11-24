// context-selector.types.ts

import React from "react";
import { DropResult, ResponderProvided } from "react-beautiful-dnd";
import { ContextCardProps, ContextPreviewCardProps } from "../../components/cards/context-card/context-card.types";

export type SelectionPageProps = {
    redirectTo: (to: string) => void,
    cards: ContextCardProps[],
    addToContextCards: (props: ContextCardProps) => void,
    // onDragEnd: (previewCards: ContextPreviewCardProps[]) => (
    //     drop: DropResult
    // ) => Promise<void>,
    onDragEnd: (previewCards: ContextPreviewCardProps[]) => (
        drop: DropResult
    ) => void,
    removeFromContextCards: (key: React.Key) => void,
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
