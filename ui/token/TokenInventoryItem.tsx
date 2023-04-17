import { Flex, Text, LinkBox, LinkOverlay, useColorModeValue, Hide } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import type { TokenInstance } from 'types/api/token';

import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import LinkInternal from 'ui/shared/LinkInternal';
import NftMedia from 'ui/shared/nft/NftMedia';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

type Props = { item: TokenInstance };

const NFTItem = ({ item }: Props) => {
  return (
    <LinkBox
      w={{ base: '100%', lg: '210px' }}
      border="1px solid"
      borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }
      borderRadius="12px"
      p="10px"
      _hover={{ boxShadow: 'md' }}
      fontSize="sm"
      fontWeight={ 500 }
      lineHeight="20px"
    >
      <NextLink href={{ pathname: '/token/[hash]/instance/[id]', query: { hash: item.token.address, id: item.id } }} passHref legacyBehavior>
        <LinkOverlay>
          <NftMedia
            mb="18px"
            imageUrl={ item.image_url }
            animationUrl={ item.animation_url }
          />
        </LinkOverlay>
      </NextLink>
      { item.id && (
        <Flex mb={ 2 } ml={ 1 }>
          <Text whiteSpace="pre" variant="secondary">ID# </Text>
          <TruncatedTextTooltip label={ item.id }>
            <LinkInternal
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
            >
              { item.id }
            </LinkInternal>
          </TruncatedTextTooltip>
        </Flex>
      ) }
      { item.owner && (
        <Flex mb={ 2 } ml={ 1 }>
          <Text whiteSpace="pre" variant="secondary" mr={ 2 } lineHeight="24px">Owner</Text>
          <Address>
            <Hide below="lg" ssr={ false }><AddressIcon address={ item.owner } mr={ 1 }/></Hide>
            <AddressLink hash={ item.owner.hash } alias={ item.owner.name } type="address" truncation="constant"/>
          </Address>
        </Flex>
      ) }
    </LinkBox>
  );
};

export default NFTItem;
