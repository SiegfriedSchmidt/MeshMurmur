import React, { FC, RefObject } from 'react';
import {
    Box,
    Switch,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select
} from "@mui/material";
import useUserData from "@/hooks/useUserData.tsx";
import { signalerNameType } from "@/utils/p2p-library/types.ts";
import {useColorScheme} from "@mui/material/styles";

interface Props {
    contentRef: RefObject<HTMLElement | null>;
}

const signalers: signalerNameType[] = [
    "FirebaseSignaler",
    "WebsocketSignalerBipki",
    "WebsocketSignalerDev",
];

const PeerOptions: FC<Props> = ({ contentRef }) => {
    const { userData, setUserData } = useUserData();

    function onValue(selected: signalerNameType) {
        setUserData({
            ...userData,
            connectorConfig: { ...userData.connectorConfig, signaler: selected },
        });
    }

    const { mode, setMode } = useColorScheme();
    if (!mode) {
        return null;
    }

    return (
        <Box mt={2} display="flex" flexDirection="column" gap={2}>
            <FormControlLabel
                control={
                    <Switch
                        checked={userData.connectorConfig.autoconnect}
                        onChange={(e) =>
                            setUserData({
                                ...userData,
                                connectorConfig: {
                                    ...userData.connectorConfig,
                                    autoconnect: e.target.checked,
                                },
                            })
                        }
                    />
                }
                label="Autoconnect"
            />

            <FormControlLabel
                control={
                    <Switch
                        checked={userData.connectorConfig.autoreconnect}
                        onChange={(e) =>
                            setUserData({
                                ...userData,
                                connectorConfig: {
                                    ...userData.connectorConfig,
                                    autoreconnect: e.target.checked,
                                },
                            })
                        }
                    />
                }
                label="Autoreconnect"
            />

            <FormControl size="small" sx={{ width: '100%' }}>
                <InputLabel id="signaler-select-label">Signaler</InputLabel>
                <Select
                    labelId="signaler-select-label"
                    label="Signaler"
                    value={userData.connectorConfig.signaler}
                    onChange={(e) => onValue(e.target.value as signalerNameType)}
                    MenuProps={{
                        container: contentRef?.current || undefined,
                    }}
                >
                    {signalers.map((signaler) => (
                        <MenuItem key={signaler} value={signaler}>
                            {signaler}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl size="small" sx={{ width: '100%' }}>
                <InputLabel id="app-theme-label">Theme</InputLabel>
                <Select
                    labelId="app-theme-label"
                    label="Theme"
                    value={mode}
                    onChange={(event) =>
                        setMode(event.target.value as 'system' | 'light' | 'dark')
                    }
                >
                    <MenuItem value="system">System</MenuItem>
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default PeerOptions;
