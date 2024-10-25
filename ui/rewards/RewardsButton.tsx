import type { ButtonProps } from '@chakra-ui/react';
import { Button, chakra, Tooltip } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import { route } from 'nextjs-routes';

import { useRewardsContext } from 'lib/contexts/rewards';
import useIsMobile from 'lib/hooks/useIsMobile';
import IconSvg from 'ui/shared/IconSvg';
import LinkInternal from 'ui/shared/links/LinkInternal';

type Props = {
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
};

const RewardsButton = ({ variant = 'header', size }: Props) => {
  const { isInitialized, apiToken, openLoginModal, dailyRewardQuery, balancesQuery } = useRewardsContext();
  const isMobile = useIsMobile();
  const isLoading = !isInitialized || dailyRewardQuery.isLoading || balancesQuery.isLoading;

  const handleFocus = useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
    e.preventDefault();
  }, []);

  return (
    <Tooltip
      label="Earn merits for using Blockscout"
      textAlign="center"
      padding={ 2 }
      openDelay={ 500 }
      isDisabled={ isMobile || isLoading || Boolean(apiToken) }
      width="150px"
    >
      <Button
        variant={ variant }
        data-selected={ !isLoading && Boolean(apiToken) }
        flexShrink={ 0 }
        as={ apiToken ? LinkInternal : 'button' }
        { ...(apiToken ? { href: route({ pathname: '/account/rewards' }) } : {}) }
        onClick={ apiToken ? undefined : openLoginModal }
        onFocus={ handleFocus }
        fontSize="sm"
        size={ size }
        px={ !isLoading && Boolean(apiToken) ? 2.5 : 4 }
        isLoading={ isLoading }
        loadingText={ isMobile ? undefined : 'Merits' }
        textDecoration="none !important"
      >
        <IconSvg
          name={ dailyRewardQuery.data?.available ? 'merits_with_dot' : 'merits' }
          boxSize={ size === 'sm' ? '26px' : '28px' }
          flexShrink={ 0 }
          mx={ -1 }
        />
        <chakra.span display={{ base: 'none', md: 'inline' }} ml={ 2 }>
          { apiToken ? balancesQuery.data?.total : 'Merits' }
        </chakra.span>
      </Button>
    </Tooltip>
  );
};

export default RewardsButton;
