import React, {FC, RefObject, useCallback, useEffect, useState} from 'react';
import {
    Button,
    Menu,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {connector, logger} from "@/init.ts";
import {connectionStageType} from "@/utils/p2p-library/types.ts";

interface Props {
    contentRef: RefObject<HTMLElement | null>;
}

type StateType = connectionStageType | 'discovered' | 'signaler'
type PeerInfoType = { id: string, connections: string, nickname: string, state: StateType }

const stateValues: Record<StateType, number> = {
    'pinging': 1,
    'connected': 1,
    'negotiating': 2,
    'connecting': 2,
    'reconnecting': 2,
    'disconnected': 3,
    'discovered': 3,
    'signaler': 4
}

const PeerConnectionTable: FC<Props> = ({contentRef}) => {
    const [peers, setPeers] = useState<PeerInfoType[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuPeerId, setMenuPeerId] = useState<string | null>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, peerId: string) => {
        setAnchorEl(event.currentTarget);
        setMenuPeerId(peerId);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setMenuPeerId(null);
    };

    const updatePeers = useCallback(() => {
        const newPeers: PeerInfoType[] = []
        const discoveredPeers = new Set(Object.keys(connector.actions.peerDiscoveryCoordinator.peerMap))
        for (const targetPeerId of discoveredPeers) {
            let state: StateType = 'signaler'
            if (targetPeerId in connector.connections) {
                state = connector.connections[targetPeerId].connectionStage
            } else {
                state = "discovered"
            }

            if (connector.peerId != targetPeerId) {
                newPeers.push({
                    id: targetPeerId,
                    connections: connector.actions.peerDiscoveryCoordinator.peerMap[targetPeerId].connections.length.toString(),
                    nickname: connector.actions.targetPeerNickname(targetPeerId),
                    state
                });
            }
        }

        for (const targetPeerId of connector.potentialPeers) {
            if (!discoveredPeers.has(targetPeerId)) {
                let state: StateType = 'signaler'
                if (targetPeerId in connector.connections) {
                    state = connector.connections[targetPeerId].connectionStage
                } else {
                    state = "signaler"
                }
                newPeers.push({
                    id: targetPeerId,
                    connections: "-",
                    nickname: connector.actions.targetPeerNickname(targetPeerId),
                    state
                });
            }
        }
        newPeers.sort((a, b) => {
            return stateValues[a.state] - stateValues[b.state]
        })
        setPeers(newPeers)
    }, [])

    useEffect(() => {
        updatePeers()
        connector.actions.peerDiscoveryCoordinator.eventEmitter.on('mapChanged', updatePeers)
        return () => {
            connector.actions.peerDiscoveryCoordinator.eventEmitter.off('mapChanged', updatePeers)
        }
    }, [updatePeers])

    function onSelect(targetPeerId: string, value: string) {
        if (value === 'disconnect') {
            connector.actions.emitDisconnectEvent(targetPeerId)
            connector.connections[targetPeerId].disconnect()
        } else if (value === 'connect') {
            connector.createConnection(targetPeerId, true).then()
        } else if (value === 'ping') {
            connector.connections[targetPeerId].ping().then(latency => {
                if (latency) {
                    logger.success(`Ping latency: ${latency} ms`)
                } else {
                    logger.error("No response...")
                }
            })
        }
        handleClose()
    }

    return (
        <>
            {peers.length > 0 ? (
                <Table size="small" sx={{mt: 2}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nickname</TableCell>
                            <TableCell>Peers</TableCell>
                            <TableCell>State</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {peers.map(({id, state, connections, nickname}) =>
                            <TableRow key={id}>
                                <TableCell sx={{wordBreak: "break-all"}}>{nickname}</TableCell>
                                <TableCell>{connections}</TableCell>
                                <TableCell>{state}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={(e) => handleClick(e, id)}
                                    >
                                        Open
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            ) : (
                <Typography>Empty</Typography>
            )}

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                container={contentRef?.current || undefined}
            >
                {menuPeerId && peers.find(p => p.id === menuPeerId) && (() => {
                    const peer = peers.find(p => p.id === menuPeerId)!;
                    if (['connected', 'connecting', 'negotiating'].includes(peer.state)) {
                        return (
                            <>
                                <MenuItem onClick={() => onSelect(peer.id, "disconnect")}>Disconnect...</MenuItem>
                                <MenuItem onClick={() => onSelect(peer.id, "ping")}>Ping</MenuItem>
                            </>
                        );
                    } else {
                        return (
                            <MenuItem onClick={() => onSelect(peer.id, "connect")}>Connect</MenuItem>
                        );
                    }
                })()}
            </Menu>
        </>
    );
};

export default PeerConnectionTable;
