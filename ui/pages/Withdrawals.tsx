import { Flex, Hide, Show, Skeleton, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import getCurrencyValue from 'lib/getCurrencyValue';
import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/Pagination';
import WithdrawalsListItem from 'ui/withdrawals/WithdrawalsListItem';
import WithdrawalsTable from 'ui/withdrawals/WithdrawalsTable';

const Withdrawals = () => {
  const isMobile = useIsMobile();

  const { data, isError, isLoading, isPaginationVisible, pagination } = useQueryWithPages({
    resourceName: 'withdrawals',
  });

  const countersQuery = useApiQuery('withdrawals_counters');

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>{ data.items.map((item => <WithdrawalsListItem key={ item.index } item={ item } view="list"/>)) }</Show>
      <Hide below="lg" ssr={ false }><WithdrawalsTable items={ data.items } view="list" top={ isPaginationVisible ? 80 : 0 }/></Hide>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isLoading) {
      return (
        <Skeleton
          w={{ base: '100%', lg: '320px' }}
          h="24px"
          mb={{ base: 6, lg: isPaginationVisible ? 0 : 7 }}
          mt={{ base: 0, lg: isPaginationVisible ? 0 : 7 }}
        />
      );
    }

    if (countersQuery.isError) {
      return null;
    }

    const { valueStr } = getCurrencyValue({ value: countersQuery.data.withdrawal_sum });
    return (
      <Text mb={{ base: 6, lg: isPaginationVisible ? 0 : 6 }} lineHeight={{ base: '24px', lg: '32px' }}>
        { BigNumber(countersQuery.data.withdrawal_count).toFormat() } withdrawals processed and { valueStr } ETH withdrawn
      </Text>
    );
  })();

  const actionBar = (
    <>
      { (isMobile || !isPaginationVisible) && text }
      { isPaginationVisible && (
        <ActionBar mt={ -6 }>
          <Flex alignItems="center" justifyContent="space-between" w="100%">
            { !isMobile && text }
            <Pagination ml="auto" { ...pagination }/>
          </Flex>
        </ActionBar>
      ) }
    </>
  );

  return (
    <Page>
      <PageTitle text="Withdrawals" withTextAd/>
      <DataListDisplay
        isError={ isError }
        isLoading={ isLoading }
        items={ data?.items }
        skeletonProps={{ skeletonDesktopColumns: Array(6).fill(`${ 100 / 6 }%`), skeletonDesktopMinW: '950px' }}
        emptyText="There are no withdrawals."
        content={ content }
        actionBar={ actionBar }
      />
    </Page>
  );
};

export default Withdrawals;
