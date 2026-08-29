import { Button } from "@mui/material";
import { useAuth } from "./AuthContext";

export default function LogoutButton() {
    const { logout } = useAuth();

    return (
        <Button
            className='nav-button'
            onClick={logout}
        >
            Log Out
        </Button>
    );
}