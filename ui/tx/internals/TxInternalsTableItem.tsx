import { Tr, Td, Tag, Icon, Box, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import appConfig from 'configs/app/config';
import rightArrowIcon from 'icons/arrows/east.svg';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import TxStatus from 'ui/shared/TxStatus';
import { TX_INTERNALS_ITEMS } from 'ui/tx/internals/utils';

type Props = InternalTransaction

const TxInternalTableItem = ({ type, from, to, value, success, error, gas_limit: gasLimit, created_contract: createdContract }: Props) => {
  const typeTitle = TX_INTERNALS_ITEMS.find(({ id }) => id === type)?.title;
  const toData = to ? to : createdContract;

  return (
    <Tr alignItems="top">
      <Td>
        <Flex rowGap={ 2 } flexWrap="wrap">
          { typeTitle && (
            <Box w="126px" display="inline-block">
              <Tag colorScheme="cyan" mr={ 5 }>{ typeTitle }</Tag>
            </Box>
          ) }
          <TxStatus status={ success ? 'ok' : 'error' } errorText={ error }/>
        </Flex>
      </Td>
      <Td verticalAlign="middle">
        <Address display="inline-flex" maxW="100%">
          <AddressIcon address={ from }/>
          <AddressLink type="address" ml={ 2 } fontWeight="500" hash={ from.hash } alias={ from.name } flexGrow={ 1 }/>
          <CopyToClipboard text={ from.hash }/>
        </Address>
      </Td>
      <Td px={ 0 } verticalAlign="middle">
        <Icon as={ rightArrowIcon } boxSize={ 6 } color="gray.500"/>
      </Td>
      <Td verticalAlign="middle">
        { toData && (
          <Address display="inline-flex" maxW="100%">
            <AddressIcon address={ toData }/>
            <AddressLink type="address" hash={ toData.hash } alias={ toData.name } fontWeight="500" ml={ 2 }/>
            <CopyToClipboard text={ toData.hash }/>
          </Address>
        ) }
      </Td>
      <Td isNumeric verticalAlign="middle">
        { BigNumber(value).div(BigNumber(10 ** appConfig.network.currency.decimals)).toFormat() }
      </Td>
      <Td isNumeric verticalAlign="middle">
        { BigNumber(gasLimit).toFormat() }
      </Td>
    </Tr>
  );
};

export default React.memo(TxInternalTableItem);
