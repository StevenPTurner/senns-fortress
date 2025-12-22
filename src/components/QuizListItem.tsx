import React from "react"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import Box from "@mui/material/Box"
import Site from "../types/Site.types"
import ListItem from "@mui/material/ListItem"
import IconButton from "@mui/material/IconButton"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import Avatar from "@mui/material/Avatar"
import ListItemText from "@mui/material/ListItemText"
import Button from "@mui/material/Button"
import Collapse from "@mui/material/Collapse";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers";


interface QuizListItemProps {
    quizSite: Site
}

const showQuizData = (import.meta.env.VITE_SHOW_QUIZ_DATA === "true");

export default function ListCollection({ quizSite }: QuizListItemProps) {
    const [expanded, setExpanded] = React.useState(false);

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
                secondaryAction={
                    showQuizData ? <IconButton onClick={() => setExpanded(expanded => !expanded)}
                    >
                        {expanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton> : undefined
                }
            >
                <ListItemAvatar>
                    <Avatar
                        sx={{
                            backgroundColor: 'black',
                        }}>
                        <img
                            src={quizSite.image}
                            alt={quizSite.imageAlt}
                        />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={quizSite.name}
                />
                <Button
                    variant='contained'
                    color='primary'
                    href={quizSite.link}
                    sx={{
                        minWidth: 'auto',
                        padding: 1,
                        mr: 2
                    }}
                >
                    <RocketLaunchIcon />
                </Button>
            </ListItem>
            <Collapse
                in={expanded}
                timeout="auto"
                unmountOnExit>
                <Stack
                    sx={{
                        bgcolor: 'background.paper',
                        paddingTop: 2,
                        paddingLeft: 2,
                        paddingRight: 2,
                        paddingBottom: 2
                    }}
                    spacing={1}>
                    <TextField size='small' label="High score" />
                    <DatePicker
                        slotProps={{
                            textField: { size: 'small' }
                        }}
                        label="Last played" />
                    <DatePicker
                        slotProps={{
                            textField: { size: 'small' }
                        }}
                        label="Furthest back played" />
                    <Button variant="contained">Save</Button>
                </Stack>
            </Collapse>
        </Box>
    )
}