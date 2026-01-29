import ListItemAvatar from "@mui/material/ListItemAvatar"
import Avatar from "@mui/material/Avatar"

interface ListLogoProps {
    imageUrl: string
    altText: string,
}

export default function ListLogo({ imageUrl, altText }: ListLogoProps) {
    return (
        <ListItemAvatar>
            <Avatar
                sx={{
                    backgroundColor: 'black',
                }}>
                <img
                    src={new URL(`../../assets/${imageUrl}`, import.meta.url).href}
                    alt={altText}
                />
            </Avatar>
        </ListItemAvatar>
    );
}