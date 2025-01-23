import { Text, Box, Flex, Separator } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import type { ChangeEvent } from 'react';
import React from 'react';

import { useRewardsContext } from 'lib/contexts/rewards';
import * as cookies from 'lib/cookies';
import { apos } from 'lib/html-entities';
import useWallet from 'lib/web3/useWallet';
import { Alert } from 'toolkit/chakra/alert';
import { Button } from 'toolkit/chakra/button';
import { Field } from 'toolkit/chakra/field';
import { Image } from 'toolkit/chakra/image';
import { Input } from 'toolkit/chakra/input';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Switch } from 'toolkit/chakra/switch';
import LinkExternal from 'ui/shared/links/LinkExternal';
import useProfileQuery from 'ui/snippets/auth/useProfileQuery';

type Props = {
  goNext: (isReferral: boolean) => void;
  closeModal: () => void;
  openAuthModal: (isAuth: boolean) => void;
};

const LoginStepContent = ({ goNext, closeModal, openAuthModal }: Props) => {
  const router = useRouter();
  const { connect, isConnected, address } = useWallet({ source: 'Merits' });
  const savedRefCode = cookies.get(cookies.NAMES.REWARDS_REFERRAL_CODE);
  const [ isRefCodeUsed, setIsRefCodeUsed ] = React.useState(Boolean(savedRefCode));
  const [ isLoading, setIsLoading ] = React.useState(false);
  const [ refCode, setRefCode ] = React.useState(savedRefCode || '');
  const [ refCodeError, setRefCodeError ] = React.useState(false);
  const { login, checkUserQuery } = useRewardsContext();
  const profileQuery = useProfileQuery();

  const isAddressMismatch = React.useMemo(() =>
    Boolean(address) &&
    Boolean(profileQuery.data?.address_hash) &&
    profileQuery.data?.address_hash !== address,
  [ address, profileQuery.data ]);

  const isLoggedIntoAccountWithWallet = React.useMemo(() =>
    !profileQuery.isLoading && profileQuery.data?.address_hash,
  [ profileQuery ]);

  const isSignUp = React.useMemo(() =>
    isConnected && !isAddressMismatch && !checkUserQuery.isFetching && !checkUserQuery.data?.exists,
  [ isConnected, isAddressMismatch, checkUserQuery ]);

  const handleRefCodeChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRefCode(event.target.value);
  }, []);

  const loginToRewardsProgram = React.useCallback(async() => {
    try {
      setRefCodeError(false);
      setIsLoading(true);
      const { isNewUser, invalidRefCodeError } = await login(isSignUp && isRefCodeUsed ? refCode : '');
      if (invalidRefCodeError) {
        setRefCodeError(true);
      } else {
        if (isNewUser) {
          goNext(Boolean(refCode));
        } else {
          closeModal();
          router.push({ pathname: '/account/rewards' }, undefined, { shallow: true });
        }
      }
    } catch (error) {}
    setIsLoading(false);
  }, [ login, goNext, setIsLoading, router, closeModal, refCode, setRefCodeError, isRefCodeUsed, isSignUp ]);

  React.useEffect(() => {
    if (isSignUp && isRefCodeUsed && refCode.length > 0 && refCode.length !== 6) {
      setRefCodeError(true);
    } else {
      setRefCodeError(false);
    }
  }, [ refCode, isRefCodeUsed, isSignUp ]);

  const handleLogin = React.useCallback(async() => {
    if (isLoggedIntoAccountWithWallet) {
      loginToRewardsProgram();
    } else {
      openAuthModal(Boolean(profileQuery.data?.email));
    }
  }, [ loginToRewardsProgram, openAuthModal, isLoggedIntoAccountWithWallet, profileQuery ]);

  const handleToggleChange = React.useCallback(() => {
    setIsRefCodeUsed((prev) => !prev);
  }, []);

  const buttonText = React.useMemo(() => {
    if (!isConnected) {
      return 'Connect wallet';
    }
    if (isLoggedIntoAccountWithWallet) {
      return isSignUp ? 'Get started' : 'Continue';
    }
    return profileQuery.data?.email ? 'Add wallet to account' : 'Log in to account';
  }, [ isConnected, isLoggedIntoAccountWithWallet, profileQuery.data, isSignUp ]);

  return (
    <>
      <Image
        src="/static/merits_program.png"
        alt="Merits program"
        mb={ 3 }
        fallback={ <Skeleton w="full" h="120px" mb={ 3 }/> }
      />
      <Box mb={ 6 }>
        Merits are awarded for a variety of different Blockscout activities. Connect a wallet to get started.
        <LinkExternal href="https://docs.blockscout.com/using-blockscout/merits" ml={ 1 } fontWeight="500">
          More about Blockscout Merits
        </LinkExternal>
      </Box>
      { isSignUp && isLoggedIntoAccountWithWallet && (
        <Box mb={ 6 }>
          <Separator mb={ 6 }/>
          <Flex w="full" alignItems="center" justifyContent="space-between">
            I have a referral code
            <Switch
              colorScheme="blue"
              size="md"
              checked={ isRefCodeUsed }
              onCheckedChange={ handleToggleChange }
              aria-label="Referral code switch"
            />
          </Flex>
          { isRefCodeUsed && (
            <Field
              label="Code"
              floating
              id="referral-code"
              size="xl"
              mt={ 3 }
              invalid={ refCodeError }
              helperText="The code should be in format XXXXXX"
              errorText={ refCodeError ? 'Incorrect code or format' : undefined }
            >
              <Input
                value={ refCode }
                onChange={ handleRefCodeChange }
              />
            </Field>
          ) }
        </Box>
      ) }
      { isAddressMismatch && (
        <Alert status="warning" mb={ 4 }>
          Your wallet address doesn{ apos }t match the one in your Blockscout account. Please connect the correct wallet.
        </Alert>
      ) }
      <Button
        variant="solid"
        w="full"
        whiteSpace="normal"
        mb={ 4 }
        onClick={ isConnected ? handleLogin : connect }
        loading={ isLoading || profileQuery.isLoading || checkUserQuery.isFetching }
        loadingText={ isLoading ? 'Sign message in your wallet' : undefined }
        disabled={ isAddressMismatch || refCodeError }
      >
        { buttonText }
      </Button>
      <Text textStyle="sm" color="text_secondary" textAlign="center">
        Already registered for Blockscout Merits on another network or chain? Connect the same wallet here.
      </Text>
    </>
  );
};

export default LoginStepContent;
