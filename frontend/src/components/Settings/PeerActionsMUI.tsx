import React, { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { edKeyManager } from "@/init.ts";
import Divider from "@mui/material/Divider";

const PeerActions = () => {
    const [open, setOpen] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(edKeyManager.exportKeyPair());
    };

    return (
        <>
            <Divider sx={{mt: 2}}>Key leak</Divider>
            <Button variant="outlined" fullWidth={true} onClick={() => setOpen(true)}>
                Show keys
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    Keys
                    <IconButton onClick={() => setOpen(false)} size="small">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Never share your private key with others.
                    </Alert>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Show</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ p: 2, border: "1px solid", borderColor: "divider", wordBreak: "break-all" }}>
                                {edKeyManager.exportKeyPair()}
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleCopy}>Copy to clipboard</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PeerActions;
