import type { TokenCounters, TokenHolder, TokenHolders, TokenInfo, TokenInstance, TokenInventoryResponse, TokenType } from 'types/api/token';
import type { TokenTransfer, TokenTransferResponse } from 'types/api/tokenTransfer';

import { ADDRESS_PARAMS, ADDRESS_HASH } from './addressParams';
import { BLOCK_HASH } from './block';
import { TX_HASH } from './tx';

export const TOKEN_INFO_ERC_20: TokenInfo<'ERC-20'> = {
  address: ADDRESS_HASH,
  decimals: '18',
  exchange_rate: null,
  holders: '16026',
  name: 'Stub Token (goerli)',
  symbol: 'STUB',
  total_supply: '6000000000000000000',
  type: 'ERC-20',
};

export const TOKEN_INFO_ERC_721: TokenInfo<'ERC-721'> = {
  ...TOKEN_INFO_ERC_20,
  type: 'ERC-721',
};

export const TOKEN_INFO_ERC_1155: TokenInfo<'ERC-1155'> = {
  ...TOKEN_INFO_ERC_20,
  type: 'ERC-1155',
};

export const TOKEN_COUNTERS: TokenCounters = {
  token_holders_count: '123456',
  transfers_count: '123456',
};

export const TOKEN_HOLDER: TokenHolder = {
  address: ADDRESS_PARAMS,
  value: '1021378038331138520',
};

export const TOKEN_HOLDERS: TokenHolders = { items: Array(50).fill(TOKEN_HOLDER), next_page_params: null };

export const TOKEN_TRANSFER_ERC_20: TokenTransfer = {
  block_hash: BLOCK_HASH,
  from: ADDRESS_PARAMS,
  log_index: '4',
  method: 'addLiquidity',
  timestamp: '2022-06-24T10:22:11.000000Z',
  to: ADDRESS_PARAMS,
  token: TOKEN_INFO_ERC_20,
  total: {
    decimals: '18',
    value: '9851351626684503',
  },
  tx_hash: TX_HASH,
  type: 'token_minting',
};

export const TOKEN_TRANSFER_ERC_721: TokenTransfer = {
  ...TOKEN_TRANSFER_ERC_20,
  total: {
    token_id: '35870',
  },
  token: TOKEN_INFO_ERC_721,
};

export const TOKEN_TRANSFER_ERC_1155: TokenTransfer = {
  ...TOKEN_TRANSFER_ERC_20,
  total: {
    token_id: '35870',
    value: '123',
    decimals: '18',
  },
  token: TOKEN_INFO_ERC_1155,
};

export const getTokenTransfersStub = (type?: TokenType): TokenTransferResponse => {
  switch (type) {
    case 'ERC-721':
      return { items: Array(50).fill(TOKEN_TRANSFER_ERC_721), next_page_params: null };
    case 'ERC-1155':
      return { items: Array(50).fill(TOKEN_TRANSFER_ERC_1155), next_page_params: null };
    default:
      return { items: Array(50).fill(TOKEN_TRANSFER_ERC_20), next_page_params: null };
  }
};

export const TOKEN_INSTANCE: TokenInstance = {
  animation_url: null,
  external_app_url: 'https://vipsland.com/nft/collections/genesis/188882',
  id: '188882',
  image_url: 'https://ipfs.vipsland.com/nft/collections/genesis/188882.gif',
  is_unique: true,
  metadata: {
    attributes: Array(3).fill({ trait_type: 'skin', value: '6' }),
    description: '**GENESIS #188882**, **8a77ca1bcaa4036f** :: *844th* generation of *#57806 and #57809* :: **eGenetic Hash Code (eDNA)** = *2822355e953a462d*',
    external_url: 'https://vipsland.com/nft/collections/genesis/188882',
    image: 'https://ipfs.vipsland.com/nft/collections/genesis/188882.gif',
    name: 'GENESIS #188882, 8a77ca1bcaa4036f. Blockchain pixel PFP NFT + "on music video" trait inspired by God',
  },
  owner: ADDRESS_PARAMS,
  token: TOKEN_INFO_ERC_1155,
  holder_address_hash: ADDRESS_HASH,
};

export const TOKEN_INSTANCES: TokenInventoryResponse = {
  items: Array(50).fill(TOKEN_INSTANCE),
  next_page_params: null,
};
