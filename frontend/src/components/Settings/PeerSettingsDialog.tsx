import * as React from 'react';
import {IconButton, Box, Tab, Tabs} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import PolylineRoundedIcon from '@mui/icons-material/PolylineRounded';
import PeerGraph from "@/components/PeerGraph.tsx"
import NicknameAssigner from "@/components/NicknameAssigner/NicknameAssigner.tsx";
import PeerActions from "@/components/Settings/PeerActionsMUI.tsx";
import PeerBlackList from "@/components/Settings/PeerBlackListMUI.tsx";
import PeerConnectionTable from "@/components/Settings/PeerConnectionTableMUI.tsx";
import Logs from "@/components/LogsMUI.tsx";
import {useRef} from "react";
import CloseIcon from '@mui/icons-material/Close';

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


export default function ResponsiveDialog() {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const contentRef = useRef<HTMLDivElement>(null)

    return (
        <React.Fragment>
            <IconButton onClick={handleClickOpen}>
                <PolylineRoundedIcon sx={{ color: grey[50] }}/>
            </IconButton>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="peer-settings-responsive-dialog-title"
            >
                <DialogTitle id="peer-settings-responsive-dialog-title">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <span>Connection settings</span>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="Peers & Nicknames" {...a11yProps(0)} />
                                <Tab label="Logs" {...a11yProps(1)} />
                                <Tab label="Graph" {...a11yProps(2)} />
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={value} index={0}>
                            <PeerConnectionTable/>
                            <PeerBlackList/>
                            <NicknameAssigner contentRef={contentRef}/>
                            <PeerActions/>
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                            <Logs/>
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={2}>
                            {/* Область для графа с четкими границами */}
                            <Box
                                sx={{
                                    height: '60vh',
                                    border: '2px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    backgroundColor: theme.palette.background.default,
                                    position: 'relative',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                    }
                                }}
                            >
                                <PeerGraph/>
                            </Box>
                        </CustomTabPanel>
                    </Box>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}