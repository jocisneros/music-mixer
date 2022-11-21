// MusicMixer.tsx

import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ContextSelector } from './components/context-selector/context-selector';
import { WebPlayerPage } from './pages/pages';
import { useMemo } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { SpotifyHttpClient } from './http-clients/spotify-http-client/spotify-http-client';

type MusicMixerProps = {
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
};

export const MusicMixer = ({
    accessToken,
    refreshToken,
    expiresIn
}: MusicMixerProps) => {
    const spotifyClient = useMemo(
        () => new SpotifyHttpClient(accessToken)
    , [accessToken]);

    const redirectTo = useNavigate();

    return (
        <div>
            <Navbar>
                <Nav.Link as={Link} to='/select'>Select</Nav.Link>
                <Nav.Link as={Link} to='/player'>Player</Nav.Link>
            </Navbar>
            <Routes>
                <Route 
                    path='select'
                    element={
                        <ContextSelector
                            redirectTo={redirectTo}
                            search={spotifyClient.search}
                            getPlaylist={spotifyClient.getPlaylist}
                            getUser={spotifyClient.getUser}
                            getAlbum={spotifyClient.getAlbum}
                            getArtist={spotifyClient.getArtist}
                        />
                    }
                />
                <Route
                    path='player'
                    element={
                        <WebPlayerPage
                            token={accessToken}
                            play={spotifyClient.play}
                            pause={spotifyClient.pause}
                            skipToNext={spotifyClient.skipToNext}
                            skipToPrevious={spotifyClient.skipToPrevious}
                            getMyCurrentPlaybackState={spotifyClient.getMyCurrentPlaybackState}                    
                        />
                    }
                />
            </Routes>
        </div>
    );
};