import React, {useRef, useState} from 'react';
import {
    Drawer,
    Button,
    Box,
    Tab,
    Tabs,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
} from "@mui/material";
import {IconButton} from '@mui/material'
import PeerSettings from "@/components/PeerSettings/PeerSettings.tsx";
import PeerGraph from "./PeerGraph.tsx"
import NicknameAssigner from "@/components/NicknameAssigner/NicknameAssigner.tsx";
import Experimental from "@/components/ExperimentalMUI.tsx";
import Logs from "@/components/LogsMUI.tsx";
import {Menu as MenuIcon} from "@mui/icons-material";
import { grey } from '@mui/material/colors';
import {CloseButton, SegmentGroup} from "@chakra-ui/react";
import Typography from "@mui/material/Typography";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function TemporaryDrawer() {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(0);
    const contentRef = useRef<HTMLDivElement>(null)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const handleClose = () => {
        setOpen(false);
    };

        const DrawerList = (
            <Box sx={{ width: '100%' }} role="presentation">
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    height: '40px'
                }}>
                    <Typography>Menu</Typography>
                    <IconButton onClick={toggleDrawer(false)}>
                        <CloseButton />
                    </IconButton>
                </Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Settings" {...a11yProps(0)} />
                        <Tab label="Logs" {...a11yProps(1)} />
                        {/*<Tab label="Graph" {...a11yProps(2)} />*/}
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <PeerSettings contentRef={contentRef}/>
                    <NicknameAssigner contentRef={contentRef}/>
                    <Experimental/>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <Logs/>
                </CustomTabPanel>
                {/*<CustomTabPanel value={value} index={2}>*/}
                {/*    <PeerGraph />*/}
                {/*</CustomTabPanel>*/}
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
            </div>
        );
    }