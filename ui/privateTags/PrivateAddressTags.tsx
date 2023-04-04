import { Box, Button, Skeleton, useDisclosure } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import type { AddressTag } from 'types/api/account';

import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import { PRIVATE_TAG_ADDRESS } from 'stubs/account';
import AccountPageDescription from 'ui/shared/AccountPageDescription';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import AddressModal from './AddressModal/AddressModal';
import AddressTagListItem from './AddressTagTable/AddressTagListItem';
import AddressTagTable from './AddressTagTable/AddressTagTable';
import DeletePrivateTagModal from './DeletePrivateTagModal';

const PrivateAddressTags = () => {
  const { data: addressTagsData, isError, isPlaceholderData } = useApiQuery('private_tags_address', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: Array(3).fill(PRIVATE_TAG_ADDRESS),
    },
  });

  const addressModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();
  const isMobile = useIsMobile();

  const [ addressModalData, setAddressModalData ] = useState<AddressTag>();
  const [ deleteModalData, setDeleteModalData ] = useState<AddressTag>();

  const onEditClick = useCallback((data: AddressTag) => {
    setAddressModalData(data);
    addressModalProps.onOpen();
  }, [ addressModalProps ]);

  const onAddressModalClose = useCallback(() => {
    setAddressModalData(undefined);
    addressModalProps.onClose();
  }, [ addressModalProps ]);

  const onDeleteClick = useCallback((data: AddressTag) => {
    setDeleteModalData(data);
    deleteModalProps.onOpen();
  }, [ deleteModalProps ]);

  const onDeleteModalClose = useCallback(() => {
    setDeleteModalData(undefined);
    deleteModalProps.onClose();
  }, [ deleteModalProps ]);

  if (isError) {
    return <DataFetchAlert/>;
  }

  const list = isMobile ? (
    <Box>
      { addressTagsData?.map((item: AddressTag, index: number) => (
        <AddressTagListItem
          item={ item }
          key={ item.id + (isPlaceholderData ? index : '') }
          onDeleteClick={ onDeleteClick }
          onEditClick={ onEditClick }
          isLoading={ isPlaceholderData }
        />
      )) }
    </Box>
  ) : (
    <AddressTagTable
      isLoading={ isPlaceholderData }
      data={ addressTagsData }
      onDeleteClick={ onDeleteClick }
      onEditClick={ onEditClick }
    />
  );

  return (
    <>
      <AccountPageDescription>
        Use private address tags to track any addresses of interest.
        Private tags are saved in your account and are only visible when you are logged in.
      </AccountPageDescription>
      { Boolean(addressTagsData?.length) && list }
      <Box marginTop={ 8 }>
        <Skeleton isLoaded={ !isPlaceholderData } display="inline-block">
          <Button
            size="lg"
            onClick={ addressModalProps.onOpen }
          >
            Add address tag
          </Button>
        </Skeleton>
      </Box>
      <AddressModal { ...addressModalProps } onClose={ onAddressModalClose } data={ addressModalData }/>
      { deleteModalData && (
        <DeletePrivateTagModal
          { ...deleteModalProps }
          onClose={ onDeleteModalClose }
          data={ deleteModalData }
          type="address"
        />
      ) }
    </>
  );
};

export default PrivateAddressTags;
