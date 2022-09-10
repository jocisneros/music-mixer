// App.tsx

import { Login } from './components/login/login';
import { WebPlayback } from './components/web-playback/web-playback';
import { useAuth } from './hooks/useAuth';

const authorizationCode = new URLSearchParams(window.location.search).get('code');

function App() {
	const token = useAuth(authorizationCode);

	return (
		<div>
			{!token ? <Login /> : <WebPlayback token={token} />}
		</div>
  	)
}

export default App;
