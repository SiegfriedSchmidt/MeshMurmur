import React from 'react';
import { List, ListItem, ListItemText, Paper } from "@mui/material";
import { AppVersion, peerId } from "@/init.ts";

const PeerInfo = () => {
    return (
        <Paper>
            <List dense>
                <ListItem>
                    <ListItemText primary="App version" secondary={AppVersion} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="PeerId" secondary={peerId} />
                </ListItem>
            </List>
        </Paper>
    );
};

export default PeerInfo;
