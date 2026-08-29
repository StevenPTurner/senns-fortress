import AppBar from "@mui/material/AppBar";
import Tab from "@mui/material/Tab";
import NavigationTab from "../types/NavigationTab.types";
import { Box, Tabs, Toolbar } from "@mui/material";
import { Link } from "react-router";
import LogoutButton from "../auth/LogoutButton";

interface NavigationProps {
    selectedTab: number
    navigationTabs: Array<NavigationTab>
}

export default function Navigation({ selectedTab, navigationTabs }: NavigationProps) {

    const createTab = (tab: NavigationTab) => {
        return <Tab
            className='nav-button'
            value={tab.index}
            label={tab.label}
            component={Link}
            to={tab.link}
        />;
    }
    console.log(selectedTab)

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
                            flexGrow: 1
                        }}
                    />
                    <LogoutButton />
                </Toolbar>
            </AppBar>
        </>
    );
}