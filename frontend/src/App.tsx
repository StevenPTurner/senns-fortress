import './App.css'
import * as React from 'react';
import Site from './types/Site.types';
import AuthContext from './types/AuthContext.types';
import TokenPayload from './types/TokenPayload.types';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import ConfigPanel from './components/ConfigPanel';
import Navigation from './components/Navigation';
import QuizListItem from './components/lists/QuizListItem';
import ListListItem from './components/lists/SiteListItem';
import SiteList from './components/lists/SiteList';
import { useEffect } from 'react';
import { mockListSites, mockQuizSites } from './mock/mockData';

function App() {
  const [hideLowQuality, setHideLowQuality] = React.useState(true);
  const [listSites, setListSites] = React.useState<Site[]>([]);
  const [quizSites, setQuizSites] = React.useState<Site[]>([]);
  const [authContext, setAuthContext] = React.useState<AuthContext>({
    state: import.meta.env.VITE_SKIP_LOGIN === 'true' ? 'LOGGED_IN' : 'NOT_LOGGED_IN',
    email: null,
    token: null
  });

  useEffect(() => {
    const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (useMockData) {
      setListSites(mockListSites);
    } else {
      fetch("/api/list/site")
        .then(response => response.json())
        .then((data) => setListSites(data))
        .catch((error) => console.error(error));
    }
    if (useMockData) {
      setQuizSites(mockQuizSites);
    } else {
      fetch("/api/list/quiz")
        .then(response => response.json())
        .then((data) => setQuizSites(data))
        .catch((error) => console.error(error));
    }
  }, []);


  const filterLowQuality = (site: Site) => {
    return !(site.lowQuality && hideLowQuality);
  };

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

  const listContent = () => (
    <>
      <ConfigPanel
        lowQualityListsHidden={hideLowQuality}
        onLowQualityCheckboxChange={setHideLowQuality} />
      <SiteList>
        {listSites.filter(filterLowQuality).map(site => (
          <ListListItem
            key={site.name}
            listSite={site}
          />
        ))}
      </SiteList>
    </>
  );

  const quizContent = () => (
    <SiteList>
      {quizSites.map(site => (
        <QuizListItem
          key={site.name}
          quizSite={site}
        />
      ))}
    </SiteList>
  );

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
          content: listContent()
        },
        {
          label: 'Quiz',
          index: '2',
          content: quizContent()
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
