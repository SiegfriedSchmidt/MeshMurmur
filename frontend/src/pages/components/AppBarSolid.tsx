import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    CssBaseline,
    Chip,
} from '@mui/material';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';
import { connector } from "@/init.ts";
import { Toaster } from "@/components/ui/toaster.tsx";
import MainMenuMUI from "@/components/MainMenuMUI.tsx";

interface Props {
    window?: () => Window;
}

function HideOnScroll(props: Props & { children: React.ReactElement }) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
    });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

export default function OverlayAppBar(props: Props) {
    const [numberOfPeers, setNumberOfPeers] = useState(connector.connectedPeers.length);

    const updatePeers = useCallback(() => {
        setNumberOfPeers(connector.connectedPeers.length);
    }, []);

    useEffect(() => {
        connector.eventEmitter.on('onPeerConnectionChanged', updatePeers);
        return () => {
            connector.eventEmitter.off('onPeerConnectionChanged', updatePeers);
        };
    }, [updatePeers]);

    return (
        <React.Fragment>
            <CssBaseline />
            <HideOnScroll {...props}>
                <AppBar
                    position="sticky"
                    sx={{
                        backgroundColor: 'rgba(0,0,0,0.85)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <Toolbar>
                        <MainMenuMUI/>

                        <Typography
                            variant="h4"
                            component="div"
                            sx={{
                                flexGrow: 1,
                                textAlign: 'center',
                            }}
                        >
                            MeshMurmur
                        </Typography>

                        {/* Статус пиров */}
                        <Chip
                            label={`${numberOfPeers} peers`}
                            color="success"
                            variant="filled"
                            sx={{
                                backgroundColor: '#00c853',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        />

                        {/* Тостер */}
                        <Toaster />
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
        </React.Fragment>
    );
}