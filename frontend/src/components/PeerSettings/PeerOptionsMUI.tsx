import React, { FC, RefObject } from 'react';
import {
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select
} from "@mui/material";
import useUserData from "@/hooks/useUserData.tsx";
import { signalerNameType } from "@/utils/p2p-library/types.ts";

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

    return (
        <Box mt={2} display="flex" flexDirection="column" gap={2}>
            <FormControlLabel
                control={
                    <Checkbox
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
                    <Checkbox
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

            <FormControl size="small" sx={{ width: 320 }}>
                <Select
                    labelId="signaler-select-label"
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
        </Box>
    );
};

export default PeerOptions;
