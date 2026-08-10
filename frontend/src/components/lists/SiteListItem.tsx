import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import ListLogo from "./ListLogo";
import ListLaunchButton from "./ListLaunchButton";
import ListSite from "../../types/ListSite.types";

interface SiteListItemProps {
    listSite: ListSite
}

export default function SiteListItem({ listSite }: SiteListItemProps) {
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
            >
                <ListLogo
                    imageUrl={listSite.image}
                    altText={listSite.imageAlt} 
                />
                <ListItemText
                    primary={listSite.name}
                />
                <ListLaunchButton
                    launchUrl={listSite.link}
                />
            </ListItem>
        </Box>
    )
}