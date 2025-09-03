import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Link from '@mui/material/Link'
import Avatar from '@mui/material/Avatar'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Site from '../types/Site.types'

interface listCollectionProps {
  listSites: Site[]
}

export default function ListCollection({ listSites }: listCollectionProps) {
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
          <ListItemAvatar sx={{
            margin: 1
          }}>
            <Avatar
              className='logo'
              sx={{
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

  return (
    <List>
      {listSites.map(convertToListItem)}
    </List>
  )
}