// login.tsx

import React, { useMemo } from 'react';
import { spotifyLoginUrl } from '../../common/constants';

export type LoginProps = unknown;

export const Login: React.FC<LoginProps> = () => {
    return (
        <div className="App">
            <header className="App-header">
                <a className="btn-spotify" href={spotifyLoginUrl} >
                    Login with Spotify
                </a>
            </header>
        </div>
    );
}