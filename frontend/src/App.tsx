import './App.css'
import * as React from 'react';
import AuthContext from './types/AuthContext.types';
import TokenPayload from './types/TokenPayload.types';
import { CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Navigation from './components/Navigation';
import QuizSitePage from './pages/QuizSitePage';
import ListSitePage from './pages/ListSitePage';
import { useEffect } from 'react';

declare const google: any;

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

  useEffect(() => {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_CLIENT_ID,
      callback: handleSuccessLogin
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const failedContent = () => (
    <div>BAD</div>
  )

  const loginButton = () => (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <div id="buttonDiv"></div>
    </div>
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
