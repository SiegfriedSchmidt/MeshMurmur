import React, {FC, RefObject} from 'react';
import {Container,} from "@chakra-ui/react";
import OwnNickname from "@/components/NicknameAssigner/OwnNicknameMUI.tsx";
import AssociatedNicknames from "@/components/NicknameAssigner/AssociatedNicknamesMUI.tsx";

interface Props {
  contentRef: RefObject<HTMLElement | null>;
}

const NicknameAssigner: FC<Props> = ({contentRef}) => {
  return (
    <Container p='0' m='0'>
      <OwnNickname/>
      <AssociatedNicknames contentRef={contentRef}/>
    </Container>
  );
};

export default NicknameAssigner;