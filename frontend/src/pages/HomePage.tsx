import React, {useState} from 'react';
import {Container} from "@chakra-ui/react";
import {completeMessageType} from "@p2p-library/types.ts";
import MessagesBlock from "@/components/MessagesBlock.tsx";
import SendOptions from "@/components/SendOptions/SendOptions.tsx";
import FileProgressBar from "@/components/FileProgressBar.tsx";
import TypingNotification from "@/components/TypingNotification.tsx";
import useMainCallbacks from "@/hooks/useMainCallbacks.tsx";
import AppBar from './components/AppBar.tsx';
import { ThemeProvider, createTheme, useColorScheme } from '@mui/material/styles';

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

const HomePageContent = () => {
  const [replyMessage, setReplyMessage] = useState<completeMessageType | null>(null)
  const {messages, addMessage} = useMainCallbacks()
    const { mode } = useColorScheme();

    if (!mode) {
        return null;
    }

  return (
      <>
          <AppBar appBarPosition="sticky"/>
    <Container width="100%">
      <MessagesBlock messages={messages} setReplyMessage={setReplyMessage}/>
      <SendOptions addMessage={addMessage} replyMessage={replyMessage} resetReplyMessage={() => setReplyMessage(null)}/>
      <FileProgressBar/>
      <TypingNotification/>
    </Container>
      </>
  );
};

export default function ToggleColorMode() {
    return (
        <ThemeProvider theme={theme}>
            <HomePageContent />
        </ThemeProvider>
    );
}