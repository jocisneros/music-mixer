// App.tsx

import { useMemo, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { MusicMixer } from './MusicMixer';
import { CallbackPage, LoginPage } from './pages/pages';

function App() {
	const [accessToken, setAccessToken] = useState('');
	const [refreshToken, setRefreshToken] = useState('');
	const [expiresIn, setExpiresIn] = useState(0);
	const isLoggedIn = useMemo(() => {
		return accessToken.length > 0;
	}, [accessToken]);
	const redirectTo = useNavigate();

	return (
		<div className='flex p-0 m-0 h-screen items-center justify-center bg-[#1f1f1f]'>
			<Routes>					
				<Route
					path='/callback' element={
						<CallbackPage
							setAccessToken={setAccessToken}
							setRefreshToken={setRefreshToken}
							setExpiresIn={setExpiresIn}
							redirectTo={redirectTo}
						/>
					}
				/>
				<Route path='/login' element={<LoginPage />}/>
				<Route path='/*' element={
					!isLoggedIn
					? <Navigate to='/login'/>
					: (
						<MusicMixer
							accessToken={accessToken}
							refreshToken={refreshToken}
							expiresIn={expiresIn}
						/>
					)
				}/>
			</Routes>
		</div>
  	)
}

export default App;
