import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Site from "../../types/QuizSite.types";
import Box from "@mui/material/Box";
import ListLogo from "./ListLogo";
import ListLaunchButton from "./ListLaunchButton";

interface SiteListItemProps {
    listSite: Site
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