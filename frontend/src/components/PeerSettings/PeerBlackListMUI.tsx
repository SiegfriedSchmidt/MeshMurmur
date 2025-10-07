import React from 'react';
import { Stack, Typography } from "@mui/material";
import { connector } from "@/init.ts";

const PeerBlackList = () => {
    return (
        connector.blackList.size > 0 ? (
            <Stack direction="column" spacing={1}>
                {Array.from(connector.blackList).map((targetPeerId) => (
                    <Typography key={targetPeerId} variant="body2">
                        {targetPeerId}
                    </Typography>
                ))}
            </Stack>
        ) : (
            <Typography variant="body2">Empty</Typography>
        )
    );
};

export default PeerBlackList;
