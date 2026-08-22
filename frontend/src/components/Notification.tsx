import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

interface NotificationProps {
    open: boolean;
    onClose: () => void;
    message: string;
}

export default function Notification({ open, onClose, message }: NotificationProps) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}

        >
            <Alert
                onClose={onClose}
                severity="success"
                variant="filled"
                icon={<CheckIcon fontSize="inherit" />}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}