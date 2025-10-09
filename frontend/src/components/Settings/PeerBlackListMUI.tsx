import React from 'react';
import { Stack, Typography, Divider } from "@mui/material";
import { connector } from "@/init.ts";

const PeerBlackList = () => {
    return (
        <Stack direction="column" spacing={1}  sx={{mt: 2}}>
            <Divider>Blacklist</Divider>
            {connector.blackList.size > 0 ? (
                <>
                    {Array.from(connector.blackList).map((targetPeerId) => (
                        <Typography key={targetPeerId} variant="body2">
                            {targetPeerId}
                        </Typography>
                    ))}
                </>
            ) : (
                <Typography>Empty</Typography>
            )}
        </Stack>
    );
};

export default PeerBlackList;
