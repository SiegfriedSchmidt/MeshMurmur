import React, { ChangeEvent, FC, RefObject, useState } from 'react';
import {
    Box,
    Button,
    Container,
    IconButton,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
    FormControl,
    Snackbar,
    Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useUserData from "@/hooks/useUserData.tsx";
import { connector } from "@/init.ts";
import { AppConfig } from "@/utils/p2p-library/conf.ts";
import TooltipPeerId from "@/components/TooltipPeerId.tsx";

interface Props {
    contentRef: RefObject<HTMLElement | null>;
}

function getCompressedPeerId(peerId: string): string {
    return `${peerId.slice(0, 10)}…${peerId.slice(-10)}`;
}

const AssociatedNicknames: FC<Props> = ({ contentRef }) => {
    const { userData, setUserData } = useUserData();
    const [selectedPeerId, setSelectedPeerId] = useState<string>("");
    const [nickname, setNickname] = useState<string>("");

    // Snackbar state
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({ open: false, message: "", severity: "success" });

    const peerIds: string[] = [
        ...new Set([
            ...connector.connectedPeers.map((conn) => conn.targetPeerId),
            ...Object.keys(connector.actions.associatedNicknames),
        ]),
    ];

    function onChange(e: ChangeEvent<HTMLInputElement>) {
        setNickname(e.target.value);
    }

    function onRemove(peerId: string) {
        const associatedNicknames = { ...userData.associatedNicknames };
        delete associatedNicknames[peerId];
        setUserData({ ...userData, associatedNicknames });
        setSnackbar({ open: true, message: "Nickname removed", severity: "success" });
    }

    function onClear() {
        setSelectedPeerId("");
        setNickname("");
    }

    function onClick() {
        if (!nickname || !selectedPeerId) return;
        if (nickname.length > AppConfig.maxNameLength) {
            setSnackbar({ open: true, message: "Nickname is too long!", severity: "error" });
            return;
        }

        const associatedNicknames = { ...userData.associatedNicknames };
        associatedNicknames[selectedPeerId] = nickname;
        setUserData({ ...userData, associatedNicknames });
        setSelectedPeerId("");
        setNickname("");

        setSnackbar({ open: true, message: "Nickname successfully saved!", severity: "success" });
    }

    return (
        <Container sx={{ p: 0, m: 0 }}>
            <Box display="flex" justifyContent="center" mt={1}>
                <Typography variant="h6">Associated nicknames</Typography>
            </Box>

            <Table size="small" sx={{ mt: 1 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Peer Id</TableCell>
                        <TableCell>Nickname</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(userData.associatedNicknames).map(([peerId, nickname], idx) => (
                        <TableRow key={idx}>
                            <TooltipPeerId peerId={peerId}>
                                <TableCell>{getCompressedPeerId(peerId)}</TableCell>
                            </TooltipPeerId>
                            <TableCell>{nickname}</TableCell>
                            <TableCell>
                                <IconButton size="small" onClick={() => onRemove(peerId)}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}

                    <TableRow>
                        <TableCell>
                            <FormControl size="small" fullWidth>
                                <Select
                                    value={selectedPeerId}
                                    onChange={(e) => setSelectedPeerId(e.target.value)}
                                    displayEmpty
                                    MenuProps={{
                                        container: contentRef?.current || undefined,
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        Select peer Id
                                    </MenuItem>
                                    {peerIds.map((peerId) => (
                                        <MenuItem key={peerId} value={peerId}>
                                            {getCompressedPeerId(peerId)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </TableCell>
                        <TableCell>
                            <TextField
                                placeholder="Empty nickname"
                                size="small"
                                value={nickname}
                                onChange={onChange}
                                fullWidth
                            />
                        </TableCell>
                        <TableCell>
                            <IconButton size="small" onClick={onClear}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <Button sx={{ mt: 2 }} onClick={onClick}>
                Submit
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
        </Container>
    );
};

export default AssociatedNicknames;
