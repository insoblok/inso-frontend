import type { Feature } from './types';

import apis from '../apis';
import { getEnvValue } from '../utils';

const title = 'Ton Application Chain (TAC)';

const tonExplorerUrl = getEnvValue('NEXT_PUBLIC_TAC_TON_EXPLORER_URL');

const config: Feature<{ explorerUrl: string }> = (() => {
  if (apis.tac && tonExplorerUrl) {
    return Object.freeze({
      title,
      isEnabled: true,
      explorerUrl: tonExplorerUrl,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
