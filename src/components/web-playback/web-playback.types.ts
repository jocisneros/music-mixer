// web-playback.types.ts

export type WebPlaybackProps = {
    token: string,
};

export type AuthCallback = (token: string) => void;

type WebPlaybackImage = {
    url: string,
};

type WebPlaybackAlbum = {
    uri: string,
    name: string,
    images: WebPlaybackImage[],
};

type WebPlaybackArtist = {
    uri: string,
    name: string,
};

export type WebPlaybackTrack = {
    uri: string,
    id: string | null,
    type: 'track' | 'episode' | 'ad',
    name: string,
    is_playable: boolean,
    album: WebPlaybackAlbum,
    artists: WebPlaybackArtist[],
};

export type WebPlaybackStateContext = {
    uri: string,
    metadata: Object | null,
};

export type WebPlaybackStateDisallows= {
    pausing: boolean,
    peeking_next: boolean,
    peeking_prev: boolean,
    resuming: boolean,
    seeking: boolean,
    skipping_next: boolean,
    skipping_prev: boolean,
};

enum RepeatMode {
    NoRepeat = 0,
    RepeatContext = 1,
    RepeatTrack = 2,
};

export type WebPlaybackTrackWindow = {
    current_track: WebPlaybackTrack,
    previous_tracks: WebPlaybackTrack[],
    next_tracks: WebPlaybackTrack[],
};

export type WebPlaybackState = {
    context: WebPlaybackStateContext,
    disallows: WebPlaybackStateDisallows,
    paused: boolean,
    position: number,
    repeat_mode: RepeatMode,
    shuffle: boolean,
    track_window: WebPlaybackTrackWindow,
};

export type WebPlaybackError = {
    message: string,
};

export enum EventType {
    Ready = 'ready',
    NotReady = 'not_ready',
    PlayerStateChanged = 'player_state_changed',
    AutoplayFailed = 'autoplay_failed',
};

export enum ErrorType {
    InitalizationError = 'initialization_error',
    AuthenticationError = 'authentication_error',
    AccountError = 'account_error',
    PlaybackError = 'playback_error',
};

export type WebPlaybackPlayer = {
    device_id: string,
};

type ListenerCallback = ((player: WebPlaybackPlayer) => void)
                        | ((state: WebPlaybackState) => void)
                        | ((error: WebPlaybackError) => void);

export type WebPlayer = {
    connect: () => Promise<boolean>,
    disconnect: () => void,
    addListener: (event: EventType | ErrorType, callback: ListenerCallback) => boolean,
    removeListener: ((event_name: EventType) => boolean) | ((event_name: EventType, callback: ListenerCallback) => boolean),
    getCurrentState: () => Promise<WebPlaybackState | null>,
    setName: (name: string) => Promise<void>,
    getVolume: () => Promise<number>,
    setVolume: (volume: number) => Promise<void>,
    pause: () => Promise<void>,
    resume: () => Promise<void>,
    togglePlay: () => Promise<void>,
    seek: (position_ms: number) => Promise<void>,
    previousTrack: () => Promise<void>,
    nextTrack: () => Promise<void>,
    activateElement: () => Promise<void>,
    on: (event: EventType | ErrorType, callback: ListenerCallback) => boolean,
};
