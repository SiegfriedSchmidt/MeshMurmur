import React from 'react';
import Hero from './components/Hero';
import Recent from './components/Recent';
import AppBar from './components/AppBar';
import { ThemeProvider, createTheme, useColorScheme } from '@mui/material/styles';

const theme = createTheme({
    colorSchemes: {
        light: {
            palette: {
                mode: 'light',
            },
        },
        dark: {
            palette: {
                mode: 'dark',
            },
        },
    },
});

const CallPageContent = () => {
    const { mode } = useColorScheme();

    if (!mode) {
        return null;
    }

    return (
        <div
            style={{
                backgroundImage: 'url(/Background1.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 0,
                }}
            />

            <div style={{
                position: 'relative',
                zIndex: 1,
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <AppBar/>
                <Hero />
                <Recent />
            </div>
        </div>
    );
};

export default function ToggleColorMode() {
    return (
        <ThemeProvider theme={theme}>
            <CallPageContent />
        </ThemeProvider>
    );
}