
import './App.css'
import * as React from 'react';
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Link from '@mui/material/Link'
import Avatar from '@mui/material/Avatar'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import cbrLogo from './assets/cbr-logo.svg'
import colliderLogo from './assets/collider-logo.svg'
import comicBookLogo from './assets/comicbook-logo.svg'
import movieWebLogo from './assets/movieweb-logo.svg'
import screenRantLogo from './assets/screenrant-logo.svg'
import theGamerLogo from './assets/thegamer-logo.svg'
import dualShockersLogo from './assets/dualshockers-logo.svg'

interface Site {
  name: string,
  link: string,
  image: string,
  imageAlt: string,
  lowQuality: boolean
}

function App() {
  const [hideLowQuality, setHideLowQuality] = React.useState(true);

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

  const convertToListItem = (site: Site) => {
    return (
      <Link href={site.link} color="inherit" underline='none'>
        <ListItem sx={{
          bgcolor: 'background.paper',
          marginBottom: '10px',
          borderRadius: '25px',
          '&:hover': {
            backgroundColor: '#E0E0E0'
          }
        }}>
          <ListItemAvatar sx={{ margin: 1 }}>
            <Avatar className='logo' sx={{
              backgroundColor: 'black',
              padding: 1
            }}>
              <img src={site.image} alt={site.imageAlt} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={site.name} />

        </ListItem>
      </Link>
    )
  }

  const listItems = listSites
    .filter(filterLowQuality)
    .map(convertToListItem)

  const handleHideLowQualityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHideLowQuality(event.target.checked);
  }

  return (
    <>
      <Box sx={{
        bgcolor: 'background.paper',
        display: 'flex'
      }}>
        <FormControl sx={{
          margin: "10px 0px 10px 20px"
        }}>
          <FormLabel component="legend">Config</FormLabel>
          <FormGroup>
            <FormControlLabel control={
              <Checkbox
                defaultChecked
                checked={hideLowQuality}
                onChange={handleHideLowQualityChange}
              />
            } label="Hide low quality lists" />
          </FormGroup>
        </FormControl>
      </Box>
      <List>
        {listItems}
      </List>
    </>
  )
}

export default App
