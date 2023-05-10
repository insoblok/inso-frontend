import { Flex, Tag, Icon, Box, HStack, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import appConfig from 'configs/app/config';
import eastArrowIcon from 'icons/arrows/east.svg';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TxStatus from 'ui/shared/TxStatus';
import { TX_INTERNALS_ITEMS } from 'ui/tx/internals/utils';

type Props = InternalTransaction;

const TxInternalsListItem = ({ type, from, to, value, success, error, gas_limit: gasLimit, created_contract: createdContract }: Props) => {
  const typeTitle = TX_INTERNALS_ITEMS.find(({ id }) => id === type)?.title;
  const toData = to ? to : createdContract;

  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex>
        { typeTitle && <Tag colorScheme="cyan" mr={ 2 }>{ typeTitle }</Tag> }
        <TxStatus status={ success ? 'ok' : 'error' } errorText={ error }/>
      </Flex>
      <Box w="100%" display="flex" columnGap={ 3 }>
        <Address width="calc((100% - 48px) / 2)">
          <AddressIcon address={ from }/>
          <AddressLink type="address" ml={ 2 } fontWeight="500" hash={ from.hash }/>
          <CopyToClipboard text={ from.hash }/>
        </Address>
        <Icon as={ eastArrowIcon } boxSize={ 6 } color="gray.500"/>
        { toData && (
          <Address width="calc((100% - 48px) / 2)">
            <AddressIcon address={ toData }/>
            <AddressLink type="address" ml={ 2 } fontWeight="500" hash={ toData.hash }/>
            <CopyToClipboard text={ toData.hash }/>
          </Address>
        ) }
      </Box>
      <HStack spacing={ 3 }>
        <Text fontSize="sm" fontWeight={ 500 }>Value { appConfig.network.currency.symbol }</Text>
        <Text fontSize="sm" variant="secondary">
          { BigNumber(value).div(BigNumber(10 ** appConfig.network.currency.decimals)).toFormat() }
        </Text>
      </HStack>
      <HStack spacing={ 3 }>
        <Text fontSize="sm" fontWeight={ 500 }>Gas limit</Text>
        <Text fontSize="sm" variant="secondary">{ BigNumber(gasLimit).toFormat() }</Text>
      </HStack>
    </ListItemMobile>
  );
};

export default TxInternalsListItem;
