// MusicMixer.types.ts

export type SpotifyContextInformation = SpotifyApi.SinglePlaylistResponse
                                        | SpotifyApi.SingleAlbumResponse
                                        | SpotifyApi.AlbumObjectSimplified
                                        | SpotifyApi.PlaylistObjectSimplified;

export type SpotifyContextOwner = SpotifyApi.UserProfileResponse | SpotifyApi.SingleArtistResponse;

export type Context = {
    context: SpotifyContextInformation,
    contextOwner: SpotifyContextOwner,
};
