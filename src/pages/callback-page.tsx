// callback-page.tsx

import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MusicMixerHttpClient } from '../music-mixer-http-client';

type CallbackPageProps = {
    setAccessToken: (token: string) => void,
    setRefreshToken: (token: string) => void,
    setExpiresIn: (expiresIn: number) => void,
	redirectTo: (to: string) => void,
}

export const CallbackPage = ({
    setAccessToken,
    setRefreshToken,
    setExpiresIn,
	redirectTo
}: CallbackPageProps) => {
	const [searchParams,] = useSearchParams();

	useEffect(() => {
	  if (!searchParams.has('code')) {
		return;
	  }

	  MusicMixerHttpClient
	  .getSpotifyAccessToken(searchParams.get('code')!)
	  .then((response) => {
		setAccessToken(response.data.access_token);
		setRefreshToken(response.data.refresh_token);
		setExpiresIn(response.data.expires_in);

		redirectTo('/')
	  })
	  .catch((error) => {
		console.log(error)
	  })
	}, [searchParams, setAccessToken, setRefreshToken, setExpiresIn, redirectTo])
    
	return <></>
};
