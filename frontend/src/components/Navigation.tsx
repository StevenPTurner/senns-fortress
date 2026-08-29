import AppBar from "@mui/material/AppBar";
import Tab from "@mui/material/Tab";
import NavigationTab from "../types/NavigationTab.types";
import { Box, Button, Tabs, Toolbar } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router";

interface NavigationProps {
    selectedTab: number
    navigationTabs: Array<NavigationTab>
}

export default function Navigation({ selectedTab, navigationTabs }: NavigationProps) {
    const { logout } = useAuth();

    const createTab = (tab: NavigationTab) => {
        return <Tab
            className='nav-button'
            value={tab.index}
            label={tab.label}
            component={Link}
            to={tab.link}
        />;
    }

    return (
        <>
            <AppBar
                className='navigation'
                position='static'
            >
                <Toolbar
                    sx={{
                        height: 80
                    }}
                >
                    <Tabs
                        value={selectedTab}
                        sx={{
                            height: '100%',
                            '& .MuiTabs-scroller': {
                                height: '100%',
                            },
                            '& .MuiTabs-flexContainer': {
                                height: '100%',
                            },
                        }}
                    >
                        {navigationTabs.map(createTab)}
                    </Tabs>
                    <Box
                        sx={{
                            flexGrow:
                                1
                        }}
                    />
                    <Button
                        className='nav-button'
                        onClick={logout}
                    >
                        Log Out
                    </Button>
                </Toolbar>
            </AppBar>
        </>
    );
}