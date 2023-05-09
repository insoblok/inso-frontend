import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { Address } from 'types/api/address';
import type { TokenInfo } from 'types/api/token';

import config from 'configs/app/config';
import useIsMobile from 'lib/hooks/useIsMobile';
import AddressFavoriteButton from 'ui/address/details/AddressFavoriteButton';
import AddressQrCode from 'ui/address/details/AddressQrCode';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

interface Props {
  address: Pick<Address, 'hash' | 'is_contract' | 'implementation_name' | 'watchlist_names' | 'watchlist_address_id'>;
  token?: TokenInfo | null;
  isLinkDisabled?: boolean;
  isLoading?: boolean;
}

const AddressHeadingInfo = ({ address, token, isLinkDisabled, isLoading }: Props) => {
  const isMobile = useIsMobile();

  return (
    <Flex alignItems="center">
      <AddressIcon address={ address } isLoading={ isLoading }/>
      <AddressLink
        type="address"
        hash={ address.hash }
        ml={ 2 }
        fontFamily="heading"
        fontWeight={ 500 }
        truncation={ isMobile ? 'constant' : 'none' }
        isDisabled={ isLinkDisabled }
        isLoading={ isLoading }
      />
      <CopyToClipboard text={ address.hash } isLoading={ isLoading }/>
      { !isLoading && address.is_contract && token && <AddressAddToWallet ml={ 2 } token={ token }/> }
      { !isLoading && !address.is_contract && config.isAccountSupported && (
        <AddressFavoriteButton hash={ address.hash } watchListId={ address.watchlist_address_id } ml={ 3 }/>
      ) }
      <AddressQrCode hash={ address.hash } ml={ 2 } isLoading={ isLoading }/>
    </Flex>
  );
};

export default AddressHeadingInfo;
