import List from '@mui/material/List'
import './App.css'
import ListItem from '@mui/material/ListItem'
import Link from '@mui/material/Link'
import Avatar from '@mui/material/Avatar'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import cbrLogo from './assets/cbr-logo.svg'
import colliderLogo from './assets/collider-logo.svg'
import comicBookLogo from './assets/comicbook-logo.webp'



function App() {

  return (
    <>
      <List>
        <Link href="https://www.cbr.com/category/lists/">
          <ListItem>
            <ListItemAvatar>
              <Avatar src={cbrLogo} className="logo" alt="CBR logo" />
            </ListItemAvatar>
            <ListItemText primary="Comic Book Resources" />
          </ListItem>
        </Link>
        <Link href="https://collider.com/tag/lists/">
          <ListItem>
            <ListItemAvatar>
              <Avatar src={colliderLogo} className="logo" alt="Collider logo" />
            </ListItemAvatar>
            <ListItemText primary="Collider" />
          </ListItem>
        </Link>
        <Link href="https://comicbook.com/tag/list-feature/">
          <ListItem>
            <ListItemAvatar>
              <Avatar src={comicBookLogo} className="logo" alt="Comic Book logo" />
            </ListItemAvatar>
            <ListItemText primary="Comic Book" />
          </ListItem>
        </Link>
      </List>
    </>
  )
}

export default App
