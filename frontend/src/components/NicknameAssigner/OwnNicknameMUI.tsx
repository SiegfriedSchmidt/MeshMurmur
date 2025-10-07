import React, { ChangeEvent, useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    TextField,
    FormHelperText,
    Snackbar,
    Alert
} from "@mui/material";
import { AppConfig } from "@/utils/p2p-library/conf.ts";
import useUserData from "@/hooks/useUserData.tsx";

const OwnNickname = () => {
    const { userData, setUserData } = useUserData();
    const [inputValue, setInputValue] = useState(userData.nickname);
    const [invalid, setInvalid] = useState<boolean>(false);

    // Snackbar state
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({ open: false, message: "", severity: "success" });

    function onChange(e: ChangeEvent<HTMLInputElement>) {
        setInputValue(e.target.value);
        setInvalid(false);
    }

    function onSave() {
        if (
            inputValue.length === 0 ||
            inputValue.length > AppConfig.maxNameLength
        ) {
            setInvalid(true);
            return;
        }
        setUserData({ ...userData, nickname: inputValue });
        setSnackbar({
            open: true,
            message: "Nickname saved!",
            severity: "success",
        });
    }

    return (
        <Box display="flex" alignItems="center" pl={2}>
            <FormControl error={invalid} sx={{ flex: 1 }}>
                <TextField
                    id="nickname-input"
                    placeholder="Empty nickname"
                    size="small"
                    value={inputValue}
                    onChange={onChange}
                    error={invalid}
                    fullWidth
                />
                {invalid && (
                    <FormHelperText>Nickname is too big!</FormHelperText>
                )}
            </FormControl>

            <Button
                onClick={onSave}
                variant="outlined"
                size="small"
                sx={{ ml: 1 }}
            >
                Save
            </Button>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default OwnNickname;
