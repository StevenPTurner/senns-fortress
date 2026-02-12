import './App.css'
import * as React from 'react';
import AuthContext from './types/AuthContext.types';
import TokenPayload from './types/TokenPayload.types';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Navigation from './components/Navigation';
import QuizSitePage from './pages/QuizSitePage';
import ListSitePage from './pages/ListSitePage';

function App() {
  const [authContext, setAuthContext] = React.useState<AuthContext>({
    state: import.meta.env.VITE_SKIP_LOGIN === 'true' ? 'LOGGED_IN' : 'NOT_LOGGED_IN',
    email: null,
    token: null
  });

  const handleSuccessLogin = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const decoded = jwtDecode<TokenPayload>(credentialResponse.credential);
      const allowedEmails = import.meta.env.VITE_EMAIL_WHITELIST.split(',') || [];
      if (allowedEmails.includes(decoded.email)) {
        setAuthContext({
          state: 'LOGGED_IN',
          token: credentialResponse.credential,
          email: decoded.email
        })
      } else {
        setAuthContext({
          state: 'FAILED_LOGIN',
          token: null,
          email: null
        })
      }
    }
  }

  const failedContent = () => (
    <div>BAD</div>
  )

  const loginButton = () => (
    <GoogleLogin
      onSuccess={handleSuccessLogin}
      onError={() => {
        <h2>BAD</h2>
      }}
    />
  );

  const sennsFortress = () => (
    <Navigation
      navigationTabs={[
        {
          label: 'Lists',
          index: '1',
          content: <ListSitePage />
        },
        {
          label: 'Quiz',
          index: '2',
          content: <QuizSitePage />
        }
      ]}
    />
  );

  return (
    <>
      {authContext.state === 'FAILED_LOGIN' && (
        failedContent()
      )}

      {authContext.state === 'NOT_LOGGED_IN' && (
        loginButton()
      )}

      {authContext.state === 'LOGGED_IN' && (
        sennsFortress()
      )}
    </>
  );
}

export default App
