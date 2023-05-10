import { Flex, Skeleton, Tag, Box, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TokenType } from 'types/api/token';
import type { RoutedTab } from 'ui/shared/Tabs/types';

import appConfig from 'configs/app/config';
import iconSuccess from 'icons/status/success.svg';
import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/appContext';
import useContractTabs from 'lib/hooks/useContractTabs';
import getQueryParamString from 'lib/router/getQueryParamString';
import AddressBlocksValidated from 'ui/address/AddressBlocksValidated';
import AddressCoinBalance from 'ui/address/AddressCoinBalance';
import AddressContract from 'ui/address/AddressContract';
import AddressDetails from 'ui/address/AddressDetails';
import AddressInternalTxs from 'ui/address/AddressInternalTxs';
import AddressLogs from 'ui/address/AddressLogs';
import AddressTokens from 'ui/address/AddressTokens';
import AddressTokenTransfers from 'ui/address/AddressTokenTransfers';
import AddressTxs from 'ui/address/AddressTxs';
import AddressWithdrawals from 'ui/address/AddressWithdrawals';
import TextAd from 'ui/shared/ad/TextAd';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import SkeletonTabs from 'ui/shared/skeletons/SkeletonTabs';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';

export const tokenTabsByType: Record<TokenType, string> = {
  'ERC-20': 'tokens_erc20',
  'ERC-721': 'tokens_erc721',
  'ERC-1155': 'tokens_erc1155',
} as const;

const TOKEN_TABS = Object.values(tokenTabsByType);

const AddressPageContent = () => {
  const router = useRouter();

  const appProps = useAppContext();

  const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/accounts');

  const tabsScrollRef = React.useRef<HTMLDivElement>(null);
  const hash = getQueryParamString(router.query.hash);

  const addressQuery = useApiQuery('address', {
    pathParams: { hash },
    queryOptions: { enabled: Boolean(hash) },
  });

  const tags = [
    addressQuery.data?.is_contract ? { label: 'contract', display_name: 'Contract' } : { label: 'eoa', display_name: 'EOA' },
    addressQuery.data?.implementation_address ? { label: 'proxy', display_name: 'Proxy' } : undefined,
    addressQuery.data?.token ? { label: 'token', display_name: 'Token' } : undefined,
    ...(addressQuery.data?.private_tags || []),
    ...(addressQuery.data?.public_tags || []),
    ...(addressQuery.data?.watchlist_names || []),
  ]
    .filter(Boolean)
    .map((tag) => <Tag key={ tag.label }>{ tag.display_name }</Tag>);

  const contractTabs = useContractTabs(addressQuery.data);

  const tabs: Array<RoutedTab> = React.useMemo(() => {
    return [
      { id: 'txs', title: 'Transactions', component: <AddressTxs scrollRef={ tabsScrollRef }/> },
      appConfig.beaconChain.hasBeaconChain && addressQuery.data?.has_beacon_chain_withdrawals ?
        { id: 'withdrawals', title: 'Withdrawals', component: <AddressWithdrawals scrollRef={ tabsScrollRef }/> } :
        undefined,
      addressQuery.data?.has_token_transfers ?
        { id: 'token_transfers', title: 'Token transfers', component: <AddressTokenTransfers scrollRef={ tabsScrollRef }/> } :
        undefined,
      addressQuery.data?.has_tokens ? { id: 'tokens', title: 'Tokens', component: <AddressTokens/>, subTabs: TOKEN_TABS } : undefined,
      { id: 'internal_txns', title: 'Internal txns', component: <AddressInternalTxs scrollRef={ tabsScrollRef }/> },
      { id: 'coin_balance_history', title: 'Coin balance history', component: <AddressCoinBalance/> },
      addressQuery.data?.has_validated_blocks ?
        { id: 'blocks_validated', title: 'Blocks validated', component: <AddressBlocksValidated scrollRef={ tabsScrollRef }/> } :
        undefined,
      addressQuery.data?.has_logs ? { id: 'logs', title: 'Logs', component: <AddressLogs scrollRef={ tabsScrollRef }/> } : undefined,
      addressQuery.data?.is_contract ? {
        id: 'contract',
        title: () => {
          if (addressQuery.data.is_verified) {
            return (
              <>
                <span>Contract</span>
                <Icon as={ iconSuccess } boxSize="14px" color="green.500" ml={ 1 }/>
              </>
            );
          }

          return 'Contract';
        },
        component: <AddressContract tabs={ contractTabs } addressHash={ hash }/>,
        subTabs: contractTabs.map(tab => tab.id),
      } : undefined,
    ].filter(Boolean);
  }, [ addressQuery.data, contractTabs, hash ]);

  const tagsNode = tags.length > 0 ? <Flex columnGap={ 2 }>{ tags }</Flex> : null;

  const content = addressQuery.isError ? null : <RoutedTabs tabs={ tabs } tabListProps={{ mt: 8 }}/>;

  return (
    <Page>
      { addressQuery.isLoading ? <Skeleton h={{ base: 12, lg: 6 }} mb={ 6 } w="100%" maxW="680px"/> : <TextAd mb={ 6 }/> }
      { addressQuery.isLoading ? (
        <Skeleton h={ 10 } w="260px" mb={ 6 }/>
      ) : (
        <PageTitle
          text={ `${ addressQuery.data?.is_contract ? 'Contract' : 'Address' } details` }
          additionalsRight={ tagsNode }
          backLinkUrl={ hasGoBackLink ? appProps.referrer : undefined }
          backLinkLabel="Back to top accounts list"
        />
      ) }
      <AddressDetails addressQuery={ addressQuery } scrollRef={ tabsScrollRef }/>
      { /* should stay before tabs to scroll up with pagination */ }
      <Box ref={ tabsScrollRef }></Box>
      { addressQuery.isLoading ? <SkeletonTabs/> : content }
      { !addressQuery.isLoading && !addressQuery.isError && <Box h={{ base: 0, lg: '40vh' }}/> }
    </Page>
  );
};

export default AddressPageContent;
