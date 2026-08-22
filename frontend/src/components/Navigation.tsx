import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AppBar from "@mui/material/AppBar";
import Tab from "@mui/material/Tab";
import React from "react";
import NavigationTab from "../types/NavigationTab.types";
import { Box, Button, Toolbar } from "@mui/material";
import { useAuth } from "../auth/AuthContext";

interface NavigationProps {
    navigationTabs: Array<NavigationTab>
}

export default function Navigation({ navigationTabs }: NavigationProps) {
    const { logout } = useAuth(); 
    const [selectedTab, setSelectedTab] = React.useState('1');

    const onTabChange = (_event: React.SyntheticEvent, value: string) => {
        setSelectedTab(value);
    }

    const createTab = (tab: NavigationTab) => {
        return <Tab
            className='tab'
            label={tab.label}
            value={tab.index}
        />;
    }

    const createTabPanel = (tab: NavigationTab) => {
        return (
            <TabPanel
                value={tab.index}
                sx={{
                    padding: 2
                }}
            >
                {tab.content}
            </TabPanel>
        );
    }

    return (
        <>
            <TabContext
                value={selectedTab}
            >
                <AppBar
                    className='navigation'
                    position='static'
                >
                    <Toolbar
                        sx={{
                            height: 80
                        }}
                    >
                        <TabList
                            onChange={onTabChange}
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
                        </TabList>
                        <Box sx={{ flexGrow: 1 }} />
                        <Button
                            onClick={logout}
                        >
                            Log Out
                        </Button>
                    </Toolbar>
                </AppBar>
                {navigationTabs.map(createTabPanel)}
            </TabContext >
        </>
    );
}