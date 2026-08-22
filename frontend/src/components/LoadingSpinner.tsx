import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

interface LoadingSpinnerProps {
    text?: string;
    color?: string;
}

export default function LoadingSpinner({ text, color }: LoadingSpinnerProps) {
    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: {color}
            }}
        >
            <CircularProgress color='inherit'/>
            <Typography
                sx={{
                    mt: 2
                }}
            >
                {text}
            </Typography>
        </Box>
    );
}