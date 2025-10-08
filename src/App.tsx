import './App.css'
import * as React from 'react';
import cbrLogo from './assets/cbr-logo.svg'
import colliderLogo from './assets/collider-logo.svg'
import comicBookLogo from './assets/comicbook-logo.svg'
import movieWebLogo from './assets/movieweb-logo.svg'
import screenRantLogo from './assets/screenrant-logo.svg'
import theGamerLogo from './assets/thegamer-logo.svg'
import dualShockersLogo from './assets/dualshockers-logo.svg'
import Site from './types/Site.types';
import ListCollection from './components/ListCollection';
import ConfigPanel from './components/ConfigPanel';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [hideLowQuality, setHideLowQuality] = React.useState(true);
  const [authenticated, setAuthenticated] = React.useState(false);
  const [failedLogin, setFailedLogin] = React.useState(false);

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

  const content = () => {
    if (failedLogin) {
      return <div>BAD</div>
    } else if (authenticated) {
      return <>
        <ConfigPanel
          lowQualityListsHidden={hideLowQuality}
          onLowQualityCheckboxChange={setHideLowQuality} />
        <ListCollection listSites={listSites.filter(filterLowQuality)} />
      </>
    } else {
      return <GoogleLogin
        onSuccess={credentialResponse => {
          console.log(credentialResponse);
          if (credentialResponse.credential) {
            const decoded = jwtDecode(credentialResponse.credential);
            console.log(decoded);
            const allowedEmails = import.meta.env.VITE_EMAIL_WHITELIST.split(',') || [];
            //@ts-ignore
            if (allowedEmails.includes(decoded.email)) {
              setAuthenticated(true);
            } else {
              setFailedLogin(true);
            }
          }
        }}
        onError={() => {
          <h2>BAD</h2>
        }}
      />
    }
  };

  return (
    <>
      {content()}
    </>
  );
}

export default App
