import React, {useCallback, useEffect, useState} from 'react';
import {darkTheme, GraphCanvas, GraphEdge, GraphNode} from "reagraph";
import {connector, peerId} from "@/init.ts";
import labelFont from "../assets/Alice-Regular.ttf"
import {Box} from "@mui/material";

const PeerGraph = () => {
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [graphEdges, setGraphEdges] = useState<GraphEdge[]>([]);

  const updateGraph = useCallback(() => {
    const newGraphNodes: GraphNode[] = []
    const newGraphEdges: GraphEdge[] = []

    const nodes = [...new Set([
      ...Object.keys(connector.actions.peerDiscoveryCoordinator.peerMap),
      ...connector.peers.map(conn => conn.targetPeerId)
    ])]

    for (const targetPeerId of nodes) {
      const connectionsLen = (targetPeerId in connector.actions.peerDiscoveryCoordinator.peerMap) ?
        connector.actions.peerDiscoveryCoordinator.peerMap[targetPeerId].connections.length.toString() : "0"

      if (targetPeerId === peerId) {
        newGraphNodes.push({id: peerId, fill: 'green', label: 'me', subLabel: connectionsLen})
        continue
      }
      newGraphNodes.push({
        id: targetPeerId,
        fill: 'gray',
        label: connector.actions.targetPeerNickname(targetPeerId),
        subLabel: connectionsLen
      })
    }

    for (const from of nodes) {
      if (!(from in connector.actions.peerDiscoveryCoordinator.peerMap)) continue

      for (const v of connector.actions.peerDiscoveryCoordinator.peerMap[from].connections) {
        newGraphEdges.push({
          id: `${from}->${v.peerId}`,
          source: from,
          target: v.peerId,
          label: v.connectionType,
          fill: v.connected ? "green" : "red"
        })
      }
    }

    setGraphNodes(newGraphNodes)
    setGraphEdges(newGraphEdges)
  }, [])

  useEffect(() => {
    updateGraph()
    connector.actions.peerDiscoveryCoordinator.eventEmitter.on('mapChanged', updateGraph)
    return () => {
      connector.actions.peerDiscoveryCoordinator.eventEmitter.off('mapChanged', updateGraph)
    }
  }, [updateGraph])

  return (
    <Box sx = {{width:'100%', height:'calc(100% - 15px)'}}>
      <GraphCanvas theme={darkTheme} edgeArrowPosition="end" edgeInterpolation="linear" edgeLabelPosition="inline"
                   labelFontUrl={labelFont} labelType="all" nodes={graphNodes} edges={graphEdges}
                   layoutOverrides={{linkDistance: 150, nodeStrength: -100}}/>
    </Box>
  )
}

export default PeerGraph;