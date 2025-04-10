import {HStack, Progress} from '@chakra-ui/react';
import React, {FC} from 'react';
import {fileProgressType} from "@/utils/p2p-library/types.ts";

interface Props {
  data: fileProgressType | null
}

const FileProgressBar: FC<Props> = ({data}) => {
  return (
    data ?
      <Progress.Root value={data.progress} maxW="sm">
        <Progress.Label>{data.title}: {data.bitrate}kb/s</Progress.Label>
        <HStack gap="5">
          <Progress.Track flex="1">
            <Progress.Range/>
          </Progress.Track>
          <Progress.ValueText>{data.progress}%</Progress.ValueText>
        </HStack>
      </Progress.Root> : <></>
  );
};

export default FileProgressBar;