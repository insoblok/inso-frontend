import { Tr, Td, Box, Flex, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import config from 'configs/app';
import rightArrowIcon from 'icons/arrows/east.svg';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import Icon from 'ui/shared/chakra/Icon';
import Tag from 'ui/shared/chakra/Tag';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import InOutTag from 'ui/shared/InOutTag';
import TxStatus from 'ui/shared/TxStatus';
import { TX_INTERNALS_ITEMS } from 'ui/tx/internals/utils';

type Props = InternalTransaction & { currentAddress: string; isLoading?: boolean }

const AddressIntTxsTableItem = ({
  type,
  from,
  to,
  value,
  success,
  error,
  created_contract: createdContract,
  transaction_hash: txnHash,
  block,
  timestamp,
  currentAddress,
  isLoading,
}: Props) => {
  const typeTitle = TX_INTERNALS_ITEMS.find(({ id }) => id === type)?.title;
  const toData = to ? to : createdContract;

  const isOut = Boolean(currentAddress && currentAddress === from.hash);
  const isIn = Boolean(currentAddress && currentAddress === to?.hash);

  const timeAgo = useTimeAgoIncrement(timestamp, true);

  return (
    <Tr alignItems="top">
      <Td verticalAlign="middle">
        <Flex rowGap={ 3 } flexWrap="wrap">
          <TxEntity
            hash={ txnHash }
            isLoading={ isLoading }
            fontWeight={ 700 }
            noIcon
          />
          { timestamp && (
            <Skeleton isLoaded={ !isLoading } color="text_secondary" fontWeight="400" fontSize="sm">
              <span>{ timeAgo }</span>
            </Skeleton>
          ) }
        </Flex>
      </Td>
      <Td verticalAlign="middle">
        <Flex rowGap={ 2 } flexWrap="wrap">
          { typeTitle && (
            <Box w="126px" display="inline-block">
              <Tag colorScheme="cyan" mr={ 5 } isLoading={ isLoading }>{ typeTitle }</Tag>
            </Box>
          ) }
          <TxStatus status={ success ? 'ok' : 'error' } errorText={ error } isLoading={ isLoading }/>
        </Flex>
      </Td>
      <Td verticalAlign="middle">
        <BlockEntity
          isLoading={ isLoading }
          number={ block }
          noIcon
          fontSize="sm"
          lineHeight={ 5 }
          fontWeight={ 500 }
        />
      </Td>
      <Td verticalAlign="middle">
        <Address display="inline-flex" maxW="100%">
          <AddressIcon address={ from } isLoading={ isLoading }/>
          <AddressLink
            type="address"
            ml={ 2 }
            fontWeight="500"
            hash={ from.hash }
            alias={ from.name }
            flexGrow={ 1 }
            isDisabled={ isOut }
            isLoading={ isLoading }
          />
          { isIn && <CopyToClipboard text={ from.hash } isLoading={ isLoading }/> }
        </Address>
      </Td>
      <Td px={ 0 } verticalAlign="middle">
        { (isIn || isOut) ?
          <InOutTag isIn={ isIn } isOut={ isOut } isLoading={ isLoading }/> :
          <Icon as={ rightArrowIcon } boxSize={ 6 } color="gray.500" isLoading={ isLoading }/>
        }
      </Td>
      <Td verticalAlign="middle">
        { toData && (
          <Address display="inline-flex" maxW="100%">
            <AddressIcon address={ toData } isLoading={ isLoading }/>
            <AddressLink type="address" hash={ toData.hash } alias={ toData.name } fontWeight="500" ml={ 2 } isDisabled={ isIn } isLoading={ isLoading }/>
            { isOut && <CopyToClipboard text={ toData.hash } isLoading={ isLoading }/> }
          </Address>
        ) }
      </Td>
      <Td isNumeric verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline-block" minW={ 6 }>
          { BigNumber(value).div(BigNumber(10 ** config.chain.currency.decimals)).toFormat() }
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default React.memo(AddressIntTxsTableItem);
