import List from '@mui/material/List'
import './App.css'
import ListItem from '@mui/material/ListItem'
import Link from '@mui/material/Link'
import Avatar from '@mui/material/Avatar'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import cbrLogo from './assets/cbr-logo.svg'
import colliderLogo from './assets/collider-logo.svg'
import comicBookLogo from './assets/comicbook-logo.svg'
import movieWebLogo from './assets/movieweb-logo.svg'
import screenRantLogo from './assets/screenrant-logo.svg'
import theGamerLogo from './assets/thegamer-logo.svg'
import dualShockersLogo from './assets/dualshockers-logo.svg'

function App() {
  const listSites = [{
    name: 'Comic Book Resources',
    link: 'https://www.cbr.com/category/lists/',
    image: cbrLogo,
    imageAlt: 'CBR logo'
  }, {
    name: 'Collider',
    link: 'https://collider.com/tag/lists/',
    image: colliderLogo,
    imageAlt: 'Collider logo'
  }, {
    name: 'Comic Book',
    link: 'https://comicbook.com/tag/list-feature/',
    image: comicBookLogo,
    imageAlt: 'Comic Book logo'
  }, {
    name: 'Movie Web',
    link: 'https://movieweb.com/lists/',
    image: movieWebLogo,
    imageAlt: 'Movie Web logo'
  }, {
    name: 'Screen Rant',
    link: 'https://screenrant.com/lists/',
    image: screenRantLogo,
    imageAlt: 'Screen Rant logo'
  }, {
    name: 'The Gamer',
    link: 'https://www.thegamer.com/category/lists/',
    image: theGamerLogo,
    imageAlt: 'The Gamer logo'
  }, {
    name: 'Dual Shockers',
    link: 'https://www.dualshockers.com/lists/',
    image: dualShockersLogo,
    imageAlt: 'Dual Shockers logo'
  }]

  const listItems = listSites.map((site) => {
    return (
      <Link href={site.link} color="inherit" underline='none'>
        <ListItem sx={{
          bgcolor: 'background.paper',
          marginBottom: "10px",
          borderRadius: "25px",
          '&:hover': {
            backgroundColor: '#E0E0E0'
          }
        }}>
          <ListItemAvatar sx={{ margin: 1 }}>
            <Avatar className="logo" sx={{
              backgroundColor: 'black',
              padding: 1
            }}>
              <img className="please" src={site.image} alt="" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={site.name} />

        </ListItem>
      </Link>
    )
  })

  return (
    <>
      <List>
        {listItems}
      </List>
    </>
  )
}

export default App
