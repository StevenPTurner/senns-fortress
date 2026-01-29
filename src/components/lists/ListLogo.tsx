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
                    src={imageUrl}
                    alt={altText}
                />
            </Avatar>
        </ListItemAvatar>
    );
}