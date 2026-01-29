import List from "@mui/material/List";

interface SiteListProps {
    children?:React.ReactNode
}

export default function SiteList({children}: SiteListProps) {
    return <List
          sx={{
          gap: 2,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {children}
        </List>
}