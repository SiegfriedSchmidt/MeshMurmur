import React, {useRef} from 'react';
import {
    Drawer,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
} from "@mui/material";
import {IconButton} from '@mui/material'
import {Menu as MenuIcon} from "@mui/icons-material";
import SettingsIcon from '@mui/icons-material/Settings';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import CallIcon from '@mui/icons-material/Call';
import QuizIcon from '@mui/icons-material/Quiz';
import ErrorIcon from '@mui/icons-material/Error';
import { grey } from '@mui/material/colors';
import SettingsDialog from './Settings/SettingsDialog.tsx';

export default function TemporaryDrawer() {
    const [open, setOpen] = React.useState(false);
    const [settingsOpen, setSettingsOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const handleSettingsClick = () => {
        setSettingsOpen(true);
        setOpen(false); // Закрываем меню при открытии настроек
    };

    const handleCloseSettings = () => {
        setSettingsOpen(false);
    };
    const contentRef = useRef<HTMLDivElement>(null);

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                {['Chat', 'Calls'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton href={index === 0 ? '/#/' : '/#/call'}>
                            <ListItemIcon>
                                {index === 0 ? <ChatBubbleRoundedIcon/> : <CallIcon/>}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />

            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleSettingsClick}>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItemButton>
                </ListItem>
            </List>

            <Divider />
            <List>
                {['FAQ', 'Feedback'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton href={index === 0 ? '/#/FAQ' : '/#/Feedback'}>
                            <ListItemIcon>
                                {index === 0 ? <QuizIcon /> : <ErrorIcon /> }
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <div>
            <IconButton onClick={toggleDrawer(true)}>
                <MenuIcon sx={{ color: grey[50] }}/>
            </IconButton>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>

            {/* Диалог настроек */}
            <SettingsDialog open={settingsOpen} onClose={handleCloseSettings} contentRef={contentRef}/>
        </div>
    );
}