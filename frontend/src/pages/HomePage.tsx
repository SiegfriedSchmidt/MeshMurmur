import React, {useState} from 'react';
import {Container} from "@chakra-ui/react";
import {completeMessageType} from "@p2p-library/types.ts";
import MessagesBlock from "@/components/MessagesBlock.tsx";
import SendOptions from "@/components/SendOptions/SendOptions.tsx";
import FileProgressBar from "@/components/FileProgressBar.tsx";
import TypingNotification from "@/components/TypingNotification.tsx";
import useMainCallbacks from "@/hooks/useMainCallbacks.tsx";
import AppBarSolid from './components/AppBarSolid.tsx';

const HomePage = () => {
  const [replyMessage, setReplyMessage] = useState<completeMessageType | null>(null)
  const {messages, addMessage} = useMainCallbacks()

  return (
      <>
          <AppBarSolid/>
    <Container width="100%">
      <MessagesBlock messages={messages} setReplyMessage={setReplyMessage}/>
      <SendOptions addMessage={addMessage} replyMessage={replyMessage} resetReplyMessage={() => setReplyMessage(null)}/>
      <FileProgressBar/>
      <TypingNotification/>
    </Container>
      </>
  );
};

export default HomePage;