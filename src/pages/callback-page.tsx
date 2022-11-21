// callback-page.tsx

import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MusicMixerHttpClient } from '../http-clients/music-mixer-http-client/music-mixer-http-client';

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
	const musicMixerHttpClient = useMemo(() => new MusicMixerHttpClient(), [])

	useEffect(() => {
	  if (!searchParams.has('code')) {
		return;
	  }

	  musicMixerHttpClient
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
	}, [musicMixerHttpClient, searchParams, setAccessToken, setRefreshToken, setExpiresIn, redirectTo])
    
	return <></>
};
