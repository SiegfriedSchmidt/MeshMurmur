import React, { useState } from 'react';
import { Box, Button, Container, useTheme, useMediaQuery } from '@mui/material';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import VideocamOffRoundedIcon from '@mui/icons-material/VideocamOffRounded';
import ScreenshotMonitorRoundedIcon from '@mui/icons-material/ScreenshotMonitorRounded';

const CallButtonPanel = () => {
    const [micActive, setMicActive] = useState(true);
    const [cameraActive, setCameraActive] = useState(true);
    const [screenShareActive, setScreenShareActive] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleMicClick = () => {
        setMicActive(!micActive);
    };

    const handleCameraClick = () => {
        setCameraActive(!cameraActive);
    };

    const handleScreenShareClick = () => {
        setScreenShareActive(!screenShareActive);
    };

    const handleExitClick = () => {
        // Дополнительная логика выхода при необходимости
        window.location.href = '/#/call';
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#262626',
                borderTop: 1,
                borderColor: 'divider',
                p: isMobile ? 1 : 2,
                zIndex: 1000
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', gap: isMobile ? 1 : 2, justifyContent: 'center'}}>

                    <Button onClick={handleScreenShareClick} variant="contained" color = {screenShareActive ? 'error' : 'primary'} startIcon={<ScreenshotMonitorRoundedIcon/>}>
                        Screen share
                    </Button>

                    <Button onClick={handleMicClick} variant="contained" color = {micActive ? 'primary' : 'error'} startIcon={micActive ? <MicRoundedIcon /> : <MicOffRoundedIcon />}>
                        Mic
                    </Button>

                    <Button onClick={handleCameraClick} variant="contained" color = {cameraActive ? 'primary' : 'error'} startIcon={cameraActive ? <VideocamRoundedIcon /> : <VideocamOffRoundedIcon />}>
                        Cam
                    </Button>
                    <Button onClick={handleExitClick} variant="contained" color={'error'} startIcon={<ExitToAppRoundedIcon />}>
                        Exit
                    </Button>

                </Box>
            </Container>
        </Box>
    );
}

export default CallButtonPanel;