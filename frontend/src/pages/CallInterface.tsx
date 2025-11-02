import React, {useEffect, useRef} from 'react';
import AppBar from './components/AppBar.tsx';
import CallButtonpanel from './components/CallButtonpanel.tsx';
import CallMembersList from './components/CallMembersList.tsx';
import {ThemeProvider, createTheme, useColorScheme} from '@mui/material/styles';
import {useLocation} from "react-router-dom";
import {connector} from "@/init.ts";

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        mode: 'light',
      },
    },
    dark: {
      palette: {
        mode: 'dark',
      },
    },
  },
});

const participants = [
  {
    id: '1',
    name: 'Dev',
    isAudioMuted: false,
    isVideoMuted: false,
    isSpeaking: true,
    isCurrentUser: true,
  },
  {
    id: '2',
    name: 'vazelinovoe drislo',
    isAudioMuted: true,
    isVideoMuted: false,
    isSpeaking: false,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    isAudioMuted: false,
    isVideoMuted: true,
    isSpeaking: false,
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    isAudioMuted: true,
    isVideoMuted: true,
    isSpeaking: false,
  },
  {
    id: '5',
    name: 'Thomas Shelby',
    isAudioMuted: true,
    isVideoMuted: true,
    isSpeaking: false,
  },
  {
    id: '6',
    name: 'Niggachain CEO',
    isAudioMuted: true,
    isVideoMuted: true,
    isSpeaking: false,
  },
  {
    id: '7',
    name: 'suicide 69',
    isAudioMuted: true,
    isVideoMuted: true,
    isSpeaking: false,
  },
  {
    id: '8',
    name: 'Niggers 2011',
    isAudioMuted: true,
    isVideoMuted: true,
    isSpeaking: false,
  },
];

const CallInterfaceContent = () => {
  const {mode} = useColorScheme();
  const {state} = useLocation();
  const remoteVideoRef = useRef<HTMLAudioElement>(null);

  async function connectWithStream() {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
    await connector.createConnection(state.targetPeerId, true, state.np, stream, (stream) => {
      if (remoteVideoRef.current) {
        if (remoteVideoRef.current.srcObject) {
          return;
        }
        remoteVideoRef.current.srcObject = stream;
      }
    })
  }

  useEffect(() => {
    void connectWithStream();
  }, [state])

  if (!mode) {
    return null;
  }

  return (
    <>
      <AppBar appBarPosition="sticky"/>
      <audio controls autoPlay ref={remoteVideoRef}/>
      <CallMembersList participants={[{
        id: '1',
        name: state.targetPeerId,
        isAudioMuted: false,
        isVideoMuted: true,
        isSpeaking: true,
        isCurrentUser: false,
      }]} currentUserId="1"/>
      <CallButtonpanel/>
    </>
  );
};

export default function ToggleColorMode() {
  return (
    <ThemeProvider theme={theme}>
      <CallInterfaceContent/>
    </ThemeProvider>
  );
}