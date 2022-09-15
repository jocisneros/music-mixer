// App.tsx

import { Login } from './components/login/login';
import { WebPlayback } from './components/web-playback/web-playback';
import { useAuth } from './hooks/useAuth';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ContextSelector } from './components/context-selector/context-selector';

const authorizationCode = new URLSearchParams(window.location.search).get('code');

function App() {
	const token = useAuth(authorizationCode);

	return (
		<div style={{ justifyContent: 'center', display: 'flex', marginTop: '1rem'}}>
			{!token ? <Login /> : <ContextSelector accessToken={token} />}
			{/* {!token ? <Login /> : <WebPlayback token={token} />} */}
		</div>
  	)
}

export default App;
