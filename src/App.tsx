import './App.css'
import * as React from 'react';
import Site from './types/Site.types';
import AuthContext from './types/AuthContext.types';
import TokenPayload from './types/TokenPayload.types';
import ListCollection from './components/ListCollection';
import ConfigPanel from './components/ConfigPanel';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import cbrLogo from './assets/cbr-logo.svg'
import colliderLogo from './assets/collider-logo.svg'
import comicBookLogo from './assets/comicbook-logo.svg'
import movieWebLogo from './assets/movieweb-logo.svg'
import screenRantLogo from './assets/screenrant-logo.svg'
import theGamerLogo from './assets/thegamer-logo.svg'
import dualShockersLogo from './assets/dualshockers-logo.svg'

function App() {
  const [hideLowQuality, setHideLowQuality] = React.useState(true);
  const [authContext, setAuthContext] = React.useState<AuthContext>({
    state: 'NOT_LOGGED_IN',
    email: null,
    token: null
  });

  const listSites: Site[] = [{
    name: 'Comic Book Resources',
    link: 'https://www.cbr.com/category/lists/',
    image: cbrLogo,
    imageAlt: 'CBR logo',
    lowQuality: false
  }, {
    name: 'Collider',
    link: 'https://collider.com/tag/lists/',
    image: colliderLogo,
    imageAlt: 'Collider logo',
    lowQuality: false
  }, {
    name: 'Comic Book',
    link: 'https://comicbook.com/tag/list-feature/',
    image: comicBookLogo,
    imageAlt: 'Comic Book logo',
    lowQuality: false
  }, {
    name: 'Movie Web',
    link: 'https://movieweb.com/lists/',
    image: movieWebLogo,
    imageAlt: 'Movie Web logo',
    lowQuality: true
  }, {
    name: 'Screen Rant',
    link: 'https://screenrant.com/lists/',
    image: screenRantLogo,
    imageAlt: 'Screen Rant logo',
    lowQuality: false
  }, {
    name: 'The Gamer',
    link: 'https://www.thegamer.com/category/lists/',
    image: theGamerLogo,
    imageAlt: 'The Gamer logo',
    lowQuality: true
  }, {
    name: 'Dual Shockers',
    link: 'https://www.dualshockers.com/lists/',
    image: dualShockersLogo,
    imageAlt: 'Dual Shockers logo',
    lowQuality: false
  }];

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

  const failedContent = () => {
    return <div>BAD</div>
  }

  const loginButton = () => {
    return (
      <GoogleLogin
        onSuccess={handleSuccessLogin}
        onError={() => {
          <h2>BAD</h2>
        }}
      />
    )
  }

  const sennsFortress = () => {
    return (
      <>
        <ConfigPanel
          lowQualityListsHidden={hideLowQuality}
          onLowQualityCheckboxChange={setHideLowQuality} />
        <ListCollection listSites={listSites.filter(filterLowQuality)} />
      </>
    )
  }

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
