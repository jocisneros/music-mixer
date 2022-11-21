// context-selector.types.ts

export type ContextSelectorProps = {
    redirectTo: (to: string) => void,
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


export type SpotifyContextInformation = SpotifyApi.SinglePlaylistResponse | SpotifyApi.SingleAlbumResponse;

export type SpotifyContextOwner = SpotifyApi.UserProfileResponse | SpotifyApi.SingleArtistResponse;
