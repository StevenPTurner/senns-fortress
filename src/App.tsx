import './App.css'
import * as React from 'react';
import Site from './types/Site.types';
import AuthContext from './types/AuthContext.types';
import TokenPayload from './types/TokenPayload.types';
import ListCollection from './components/ListCollection';
import ConfigPanel from './components/ConfigPanel';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import cbrLogo from './assets/cbr-logo.svg';
import colliderLogo from './assets/collider-logo.svg';
import comicBookLogo from './assets/comicbook-logo.svg';
import movieWebLogo from './assets/movieweb-logo.svg';
import screenRantLogo from './assets/screenrant-logo.svg';
import theGamerLogo from './assets/thegamer-logo.svg';
import dualShockersLogo from './assets/dualshockers-logo.svg';
import aniguesserLogo from './assets/aniguesser-logo.png';
import gamedleLogo from './assets/gamedle-logo.png';
import Navigation from './components/Navigation';
import { Avatar, Box, Button, Collapse, Divider, FormControlLabel, FormGroup, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemSecondaryAction, ListItemText, Stack, Switch, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

function App() {
  const [hideLowQuality, setHideLowQuality] = React.useState(true);
  const [authContext, setAuthContext] = React.useState<AuthContext>({
    state: 'LOGGED_IN',
    email: null,
    token: null
  });
  const [expanded, setExpanded] = React.useState(false);

  const showQuizData = (import.meta.env.VITE_SHOW_QUIZ_DATA === "true");

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

  const listContent = () => {
    return (
      <>
        <ConfigPanel
          lowQualityListsHidden={hideLowQuality}
          onLowQualityCheckboxChange={setHideLowQuality} />
        <ListCollection listSites={listSites.filter(filterLowQuality)} />
      </>
    )
  }

  const quizItem = (title: string, image: string, quizSiteUrl: string) => {
    return (
      <Box>
        <ListItem
          sx={{
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            pt: 2,
            pb: 2,
            border: 1,
            borderColor: '#999999'
          }}
          secondaryAction={
            showQuizData ? <IconButton onClick={() => setExpanded(expanded => !expanded)}
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton> : undefined
          }
        >
          <ListItemAvatar>
            <Avatar
              sx={{
                backgroundColor: 'black',
              }}>
              <img src={image} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={title} />
          <Button
            variant='contained'
            color='primary'
            href={quizSiteUrl}
            sx={{ minWidth: 'auto', 
              padding: 1, 
              mr: 2 }}
          >
            <RocketLaunchIcon />
          </Button>
        </ListItem>
        <Collapse
          in={expanded}
          timeout="auto"
          unmountOnExit>
          <Stack
            sx={{
              bgcolor: 'background.paper',
              paddingTop: 2,
              paddingLeft: 2,
              paddingRight: 2,
              paddingBottom: 2
            }}
            spacing={1}>
            <TextField size='small' label="High score" />
            <DatePicker
              slotProps={{
                textField: { size: 'small' }
              }}
              label="Last played" />
            <DatePicker
              slotProps={{
                textField: { size: 'small' }
              }}
              label="Furthest back played" />
            <Button variant="contained">Save</Button>
          </Stack>
        </Collapse>
      </Box>
    );
  }

  const quizContent = () => {
    return (
      <List
        sx={{
          gap: 2,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {quizItem('Aniguesser', aniguesserLogo, 'https://aniguessr.com/')}
        {quizItem('Gamedle', gamedleLogo, 'https://www.gamedle.wtf/')}
      </List>
    )
  }
  // out of adherence for quizzes
  // send condescending email

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
      <Navigation navigationTabs={
        [
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
        ]
      } />
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
