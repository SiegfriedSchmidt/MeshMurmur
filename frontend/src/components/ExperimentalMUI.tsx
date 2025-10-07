import React, { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    TextField,
    Typography
} from "@mui/material";
import RTCConfigurationChanger from "@/components/RTCConfigurationChanger.tsx";

const Experimental = () => {
    const [myToken, setMyToken] = useState("");
    const [calleeToken, setCalleeToken] = useState("");
    const [anonymous, setAnonymous] = useState(() => !!localStorage.getItem("anonymous"));

    useEffect(() => {
        setMyToken("NO TOKEN");
    }, []);

    function onClick() {
        setCalleeToken("NOTHING TO DO");
    }

    function onChange(val: boolean) {
        if (val) {
            localStorage.setItem("anonymous", "true");
        } else {
            localStorage.removeItem("anonymous");
        }
        setAnonymous(val);
    }

    return (
        <Container sx={{ mt: 2 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
                This section is experimental, please be careful... I warn you...
            </Alert>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Token
            </Typography>
            <Typography>{myToken}</Typography>

            <FormControl fullWidth required sx={{ mt: 2 }}>
                <TextField
                    label="Callee token"
                    required
                    value={calleeToken}
                    onChange={(e) => setCalleeToken(e.target.value)}
                    helperText="Token of the user you want to send the notification to"
                />
            </FormControl>

            <Button sx={{ mt: 2 }} variant="contained" onClick={onClick}>
                Subscribe
            </Button>

            <Divider sx={{ mt: 2 }} />

            <FormControlLabel
                sx={{ mt: 2 }}
                control={
                    <Checkbox
                        checked={anonymous}
                        onChange={(e) => onChange(e.target.checked)}
                    />
                }
                label="Make anonymous"
            />

            <Divider sx={{ mt: 2 }} />

            <Box sx={{ mt: 2 }}>
                <RTCConfigurationChanger />
            </Box>
        </Container>
    );
};

export default Experimental;
