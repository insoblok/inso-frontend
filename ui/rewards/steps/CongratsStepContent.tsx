import { Text, Box, Flex, Button, Skeleton } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import { useRewardsContext } from 'lib/contexts/rewards';
import IconSvg from 'ui/shared/IconSvg';

import CopyField from '../CopyField';

type Props = {
  isReferral: boolean;
}

const CongratsStepContent = ({ isReferral }: Props) => {
  const { referralsQuery, rewardsConfigQuery } = useRewardsContext();

  const registrationReward = rewardsConfigQuery.data?.rewards.registration;
  const referralReward = Number(rewardsConfigQuery.data?.rewards.registration_with_referral) - Number(rewardsConfigQuery.data?.rewards.registration);
  const refLink = `https://eth.blockscout.com?ref=${ referralsQuery.data?.code }`;
  const shareText = `Just signed up for @blockscoutcom Merits program and got ${ registrationReward } merits!\n\nUse my referral link to get extra ${ referralReward } merits: ${ refLink }`; // eslint-disable-line max-len
  return (
    <>
      <Flex
        alignItems="center"
        background="linear-gradient(254.96deg, #9CD8FF 9.09%, #D0EFFF 88.45%)"
        borderRadius="md"
        padding={ 2 }
        mb={ 8 }
      >
        <IconSvg name="merits_colored" boxSize="60px" mb={ -1 }/>
        <Skeleton isLoaded={ !rewardsConfigQuery.isLoading }>
          <Text fontSize="30px" fontWeight="700" color="blue.700">
            +{ rewardsConfigQuery.data?.rewards[ isReferral ? 'registration_with_referral' : 'registration' ] }
          </Text>
        </Skeleton>
        { isReferral && (
          <Flex alignItems="center" h="56px">
            <Box w="1px" h="full" bgColor="whiteAlpha.800" mx={ 8 }/>
            <Flex flexDirection="column" justifyContent="space-between">
              { [
                {
                  title: 'Registration',
                  value: registrationReward,
                },
                {
                  title: 'Referral program',
                  value: referralReward,
                },
              ].map(({ title, value }) => (
                <Flex key={ title } alignItems="center">
                  <IconSvg name="merits_colored" boxSize={ 8 }/>
                  <Skeleton isLoaded={ !rewardsConfigQuery.isLoading }>
                    <Text fontSize="sm" fontWeight="700" color="blue.700">
                      +{ value }
                    </Text>
                  </Skeleton>
                  <Text fontSize="sm" color="blue.700" ml={ 2 }>
                    { title }
                  </Text>
                </Flex>
              )) }
            </Flex>
          </Flex>
        ) }
      </Flex>
      <Flex flexDirection="column" alignItems="flex-start" px={ 3 } mb={ 8 }>
        <Flex alignItems="center" gap={ 2 }>
          <Box w={ 8 } h={ 8 } p={ 1.5 } borderRadius="8px" backgroundColor="blue.50">
            <IconSvg name="profile" boxSize={ 5 } color="blue.500"/>
          </Box>
          <Text fontSize="lg" fontWeight="500">
            Referral program
          </Text>
        </Flex>
        <Text fontSize="md" mt={ 2 }>
          Receive a{ ' ' }
          <Skeleton as="span" isLoaded={ !rewardsConfigQuery.isLoading }>
            { Number(rewardsConfigQuery.data?.rewards.referral_share || 0) * 100 }%
          </Skeleton>
          { ' ' }bonus on all merits earned by your referrals
        </Text>
        <CopyField
          label="Referral link"
          value={ refLink }
          isLoading={ referralsQuery.isLoading }
          mt={ 3 }
        />
        <Button
          as="a"
          target="_blank"
          mt={ 6 }
          isLoading={ referralsQuery.isLoading }
          href={ `https://x.com/intent/tweet?text=${ encodeURIComponent(shareText) }` }
        >
          Share on <IconSvg name="social/twitter" boxSize={ 6 } ml={ 1 }/>
        </Button>
      </Flex>
      <Flex flexDirection="column" alignItems="flex-start" px={ 3 }>
        <Flex alignItems="center" gap={ 2 }>
          <Box w={ 8 } h={ 8 } p={ 1 } borderRadius="8px" backgroundColor="blue.50">
            <IconSvg name="stats" boxSize={ 6 } color="blue.500"/>
          </Box>
          <Text fontSize="lg" fontWeight="500">
            Dashboard
          </Text>
        </Flex>
        <Text fontSize="md" mt={ 2 }>
          Explore your current merits balance, find activities to boost your merits,
          and view your capybara NFT badge collection on the dashboard
        </Text>
        <Button mt={ 3 } as="a" href={ route({ pathname: '/account/rewards' }) }>
          Open
        </Button>
      </Flex>
    </>
  );
};

export default CongratsStepContent;
