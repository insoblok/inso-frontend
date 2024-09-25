import { Box, Center, Flex, Link, Skeleton, Text, Image } from '@chakra-ui/react';
import React from 'react';

import type { TimeChartItem } from './types';

import { apos } from 'lib/html-entities';

import ChartWidgetGraph from './ChartWidgetGraph';

export type Props = {
  items?: Array<TimeChartItem>;
  title: string;
  units?: string;
  isLoading?: boolean;
  isError?: boolean;
  emptyText?: string;
  handleZoom: () => void;
  isZoomResetInitial: boolean;
  isEnlarged?: boolean;
  noAnimation?: boolean;
}

const ChartWidgetContent = ({
  items,
  title,
  isLoading,
  isError,
  units,
  emptyText,
  handleZoom,
  isZoomResetInitial,
  isEnlarged,
  noAnimation,
}: Props) => {
  const hasItems = items && items.length > 2;

  if (isError) {
    return (
      <Flex
        alignItems="center"
        justifyContent="center"
        flexGrow={ 1 }
        py={ 4 }
      >
        <Text
          variant="secondary"
          fontSize="sm"
          textAlign="center"
        >
          { `The data didn${ apos }t load. Please, ` }
          <Link href={ window.document.location.href }>try to reload the page.</Link>
        </Text>
      </Flex>
    );
  }

  if (isLoading) {
    return <Skeleton flexGrow={ 1 } w="100%"/>;
  }

  if (!hasItems) {
    return (
      <Center flexGrow={ 1 }>
        <Text variant="secondary" fontSize="sm">{ emptyText || 'No data' }</Text>
      </Center>
    );
  }

  return (
    <Box flexGrow={ 1 } maxW="100%" position="relative" h="100%">
      <ChartWidgetGraph
        items={ items }
        onZoom={ handleZoom }
        isZoomResetInitial={ isZoomResetInitial }
        title={ title }
        units={ units }
        isEnlarged={ isEnlarged }
        noAnimation={ noAnimation }
      />
      <Image src="/static/logo.svg"
        position="absolute"
        alt="blockscout logo"
        height="30px"
        opacity={ 0.1 }
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        color="link"
        pointerEvents="none"
      />
    </Box>
  );
};

export default React.memo(ChartWidgetContent);
