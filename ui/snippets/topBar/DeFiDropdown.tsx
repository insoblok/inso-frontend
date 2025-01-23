import { Box, Flex, Link, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { space } from 'lib/html-entities';
import getPageType from 'lib/mixpanel/getPageType';
import * as mixpanel from 'lib/mixpanel/index';
import { Button } from 'toolkit/chakra/button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import IconSvg from 'ui/shared/IconSvg';

import DeFiDropdownItem from './DeFiDropdownItem';

const feature = config.features.deFiDropdown;

const DeFiDropdown = () => {
  const router = useRouter();
  const source = getPageType(router.pathname);
  const { open, onToggle, onOpenChange } = useDisclosure();

  const handleClick = React.useCallback((content: string) => {
    mixpanel.logEvent(mixpanel.EventTypes.BUTTON_CLICK, { Content: content, Source: source });
  }, [ source ]);

  if (!feature.isEnabled) {
    return null;
  }

  const buttonStyles = {
    variant: 'solid' as const,
    borderRadius: 'sm',
    textStyle: 'xs',
    height: 5,
    px: 1.5,
    fontWeight: '500',
    gap: 0,
  };

  const items = feature.items.map((item) => ({
    ...item,
    onClick: () => handleClick(item.text),
  }));

  return items.length > 1 ? (
    <PopoverRoot open={ open } onOpenChange={ onOpenChange } positioning={{ placement: 'bottom-start' }} lazyMount>
      <PopoverTrigger>
        <Button
          onClick={ onToggle }
          expanded={ open }
          { ...buttonStyles }
        >
          <chakra.span display={{ base: 'none', lg: 'inline' }} whiteSpace="pre-wrap">
            Blockscout{ space }
          </chakra.span>
          DeFi
          <IconSvg name="arrows/east-mini" boxSize={ 4 } ml={ 1 } transform="rotate(-90deg)"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent w="auto">
        <PopoverBody >
          <Flex flexDirection="column" gap={ 1 }>
            { items.map((item, index) => (
              <DeFiDropdownItem key={ index } item={ item }/>
            )) }
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  ) : (
    <Button
      asChild
      onClick={ items[0].onClick }
      _hover={{
        color: 'white',
      }}
      { ...buttonStyles }
    >
      <Link
        href={
          items[0].dappId ?
            route({ pathname: '/apps/[id]', query: { id: items[0].dappId, action: 'connect' } }) :
            items[0].url
        }
        target={ items[0].dappId ? '_self' : '_blank' }
      >
        <IconSvg name={ items[0].icon } boxSize={ 3 } mr={{ base: 0, sm: 1 }}/>
        <Box display={{ base: 'none', sm: 'inline' }}>
          { items[0].text }
        </Box>
      </Link>
    </Button>
  );
};

export default chakra(React.memo(DeFiDropdown));
