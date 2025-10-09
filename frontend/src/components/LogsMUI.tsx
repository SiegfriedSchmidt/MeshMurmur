import React, { useCallback, useEffect, useState } from 'react';
import {
    Button,
    Divider,
    Stack,
    Typography
} from "@mui/material";
import LogLabel from "@/components/LogLabelMUI.tsx";
import { connector, logger } from "@/init.ts";
import { logType } from "@/utils/p2p-library/types.ts";

const Logs = () => {
    const [isDebugMode, setDebugMode] = useState<boolean>(false);
    const [logs, setLogs] = useState<logType[]>([]);

    const updateLogs = useCallback(() => {
        setLogs(logger.logs.filter(log => log.type === 'debug' ? isDebugMode : true));
    }, [isDebugMode]);

    function onClickDebug() {
        setDebugMode(!isDebugMode);
    }

    function onClickClear() {
        logger.logs = [];
        setLogs([]);
    }

    useEffect(() => {
        updateLogs();
        connector.eventEmitter.on('onPeerConnectionChanged', updateLogs);
        return () => {
            connector.eventEmitter.off('onPeerConnectionChanged', updateLogs);
        };
    }, [updateLogs]);

    return (
        <Stack spacing={1} padding={2}>
            <Stack direction="row" spacing={1}>
                <Button
                    variant={isDebugMode ? "contained" : "outlined"}
                    color={isDebugMode ? "success" : "primary"}
                    sx={{ width: '100%' }}
                    onClick={onClickDebug}
                >
                    {isDebugMode ? "Debug mode" : "Info mode"}
                </Button>
                <Button variant="outlined" sx={{ width: '100%' }} onClick={onClickClear}>
                    Clear logs
                </Button>
            </Stack>

            <Divider />

            {logs.map((log, idx) => (
                <Stack key={idx} direction="row" spacing={1} alignItems="center">
                    <LogLabel type={log.type} />
                    <Typography variant="body2">{log.text}</Typography>
                </Stack>
            ))}
        </Stack>
    );
};

export default Logs;
