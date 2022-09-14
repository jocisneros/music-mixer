// playlist-card.types.ts

export interface PlaylistCardProps {
    playlist: SpotifyApi.SinglePlaylistResponse,
    playlistOwner: SpotifyApi.UserProfileResponse,
};

export interface PlaylistCardCreditProps {
    playlistTitle: string,
    playlistOwner: SpotifyApi.UserProfileResponse,
    style?: React.CSSProperties,
};
