// context-selector.types.ts

export interface ContextSelectorProps {
    accessToken: string,
}

export type SpotifyContextInformation = SpotifyApi.SinglePlaylistResponse | SpotifyApi.SingleAlbumResponse;

export type SpotifyContextOwner = SpotifyApi.UserProfileResponse | SpotifyApi.SingleArtistResponse;
