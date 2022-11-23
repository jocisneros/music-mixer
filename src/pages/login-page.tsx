// login.tsx

import Button from 'react-bootstrap/Button';
import { spotifyLoginUrl } from '../common/constants';
import MusicMixerLogo from '../logo.svg'

export const LoginPage = () => {
    return (
        <div className='flex flex-col items-center gap-[3rem]'>
            <div className='flex flex-row items-center gap-[1rem]'>
                <img
                    src={MusicMixerLogo}
                    alt='music mixer logo'
                    className='w-20'
                />
                <div className='text-white font-semibold text-5xl tracking-wide'>{'music mixer'}</div>
            </div>
            <a className='btn-spotify' href={spotifyLoginUrl} target='_self'>
                <Button
                    bsPrefix='bg-[#1DB954] text-white rounded-full font-semibold text-xl py-2 px-4 shadow'
                >
                    {'login with spotify'}
                </Button>
            </a>
        </div>
    );
}
