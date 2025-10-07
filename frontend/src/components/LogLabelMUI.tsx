import React, { FC } from "react";
import { Chip } from "@mui/material";
import { logType } from "../utils/p2p-library/types.ts";

const LogLabel: FC<{ type: logType["type"] }> = ({ type }) => {
    if (type === "success") {
        return <Chip label="Success" color="success" variant="outlined" size="small" />;
    } else if (type === "info") {
        return <Chip label="Info" color="info" variant="outlined" size="small" />;
    } else if (type === "warn") {
        return <Chip label="Warning" color="warning" variant="outlined" size="small" />;
    } else if (type === "error") {
        return <Chip label="Error" color="error" variant="outlined" size="small" />;
    }
    return null;
};

export default LogLabel;
