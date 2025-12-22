import Button from "@mui/material/Button"
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

interface ListLaunchButtonProps {
    launchUrl: string
}

export default function ListLaunchButton({ launchUrl }: ListLaunchButtonProps) {
    return (
        <Button
            variant='contained'
            color='primary'
            href={launchUrl}
            sx={{
                minWidth: 'auto',
                padding: 1,
                mr: 2
            }}
        >
            <RocketLaunchIcon />
        </Button>
    );
}