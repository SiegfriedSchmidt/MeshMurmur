import React, {RefObject} from 'react';
import {Dialog, DialogTitle, DialogContent, Box, IconButton} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import PeerOptions from "@/components/Settings/PeerOptionsMUI.tsx";
import PeerInfo from "@/components/Settings/PeerInfoMUI.tsx";
import Experimental from "@/components/Settings/ExperimentalMUI.tsx";
import CloseIcon from '@mui/icons-material/Close';

interface SettingsDialogProps {
    open: boolean;
    onClose: () => void;
    contentRef: RefObject<HTMLElement | null>;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose, contentRef }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm')); // Полный экран на мобильных устройствах


    return (
        <Dialog open={open} onClose={onClose} fullScreen={fullScreen}>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <span>Settings</span>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <PeerInfo/>
                <PeerOptions contentRef={contentRef}/>
                <Experimental/>
            </DialogContent>
        </Dialog>
    );
};

export default SettingsDialog;
