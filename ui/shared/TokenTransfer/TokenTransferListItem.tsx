import { Text, Flex, Tag, Icon } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import eastArrowIcon from 'icons/arrows/east.svg';
import transactionIcon from 'icons/transactions.svg';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import InOutTag from 'ui/shared/InOutTag';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TokenSnippet from 'ui/shared/TokenSnippet/TokenSnippet';
import { getTokenTransferTypeText } from 'ui/shared/TokenTransfer/helpers';
import TokenTransferNft from 'ui/shared/TokenTransfer/TokenTransferNft';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';

import CopyToClipboard from '../CopyToClipboard';

type Props = TokenTransfer & {
  baseAddress?: string;
  showTxInfo?: boolean;
  enableTimeIncrement?: boolean;
}

const TokenTransferListItem = ({
  token,
  total,
  tx_hash: txHash,
  from,
  to,
  baseAddress,
  showTxInfo,
  type,
  timestamp,
  enableTimeIncrement,
}: Props) => {
  const value = (() => {
    if (!('value' in total)) {
      return null;
    }

    return BigNumber(total.value).div(BigNumber(10 ** Number(total.decimals))).dp(8).toFormat();
  })();

  const timeAgo = useTimeAgoIncrement(timestamp, enableTimeIncrement);

  const addressWidth = `calc((100% - ${ baseAddress ? '50px' : '0px' }) / 2)`;
  return (
    <ListItemMobile rowGap={ 3 } isAnimated>
      <Flex w="100%" justifyContent="space-between">
        <Flex flexWrap="wrap" rowGap={ 1 } mr={ showTxInfo && txHash ? 2 : 0 }>
          <TokenSnippet hash={ token.address } w="auto" maxW="calc(100% - 140px)" name={ token.name || 'Unnamed token' }/>
          <Tag flexShrink={ 0 } ml={ 2 } mr={ 2 }>{ token.type }</Tag>
          <Tag colorScheme="orange">{ getTokenTransferTypeText(type) }</Tag>
        </Flex>
        { showTxInfo && txHash && (
          <TxAdditionalInfo hash={ txHash } isMobile/>
        ) }
      </Flex>
      { 'token_id' in total && <TokenTransferNft hash={ token.address } id={ total.token_id }/> }
      { showTxInfo && txHash && (
        <Flex justifyContent="space-between" alignItems="center" lineHeight="24px" width="100%">
          <Flex>
            <Icon
              as={ transactionIcon }
              boxSize="30px"
              mr={ 2 }
              color="link"
            />
            <Address width="100%">
              <AddressLink
                hash={ txHash }
                type="transaction"
                fontWeight="700"
                truncation="constant"
              />
            </Address>
          </Flex>
          { timestamp && <Text variant="secondary" fontWeight="400" fontSize="sm">{ timeAgo }</Text> }
        </Flex>
      ) }
      <Flex w="100%" columnGap={ 3 }>
        <Address width={ addressWidth }>
          <AddressIcon address={ from }/>
          <AddressLink type="address" ml={ 2 } fontWeight="500" hash={ from.hash } isDisabled={ baseAddress === from.hash }/>
          { baseAddress !== from.hash && <CopyToClipboard text={ from.hash }/> }
        </Address>
        { baseAddress ?
          <InOutTag isIn={ baseAddress === to.hash } isOut={ baseAddress === from.hash } w="50px" textAlign="center"/> :
          <Icon as={ eastArrowIcon } boxSize={ 6 } color="gray.500"/>
        }
        <Address width={ addressWidth }>
          <AddressIcon address={ to }/>
          <AddressLink type="address" ml={ 2 } fontWeight="500" hash={ to.hash } isDisabled={ baseAddress === to.hash }/>
          { baseAddress !== to.hash && <CopyToClipboard text={ to.hash }/> }
        </Address>
      </Flex>
      { value && (
        <Flex columnGap={ 2 } w="100%">
          <Text fontWeight={ 500 } flexShrink={ 0 }>Value</Text>
          <Text variant="secondary">{ value }</Text>
        </Flex>
      ) }
    </ListItemMobile>
  );
};

export default React.memo(TokenTransferListItem);
