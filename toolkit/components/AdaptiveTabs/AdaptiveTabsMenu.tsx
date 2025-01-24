import React from 'react';

import type { TabItem } from './types';

import type { ButtonProps } from 'toolkit/chakra/button';
import { Button } from 'toolkit/chakra/button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import { TabsCounter, TabsTrigger } from 'toolkit/chakra/tabs';

import { getTabValue, menuButton } from './utils';

interface Props extends ButtonProps {
  tabs: Array<TabItem>;
  tabsCut: number;
  isActive: boolean;
}

const AdaptiveTabsMenu = ({ tabs, tabsCut, isActive, ...props }: Props, ref: React.Ref<HTMLButtonElement>) => {

  return (
    <PopoverRoot positioning={{ placement: 'bottom-end' }}>
      <PopoverTrigger>
        <Button
          variant="plain"
          color="tabs.solid.fg"
          _hover={{
            color: 'link.primary.hover',
          }}
          _expanded={{
            color: 'tabs.solid.fg.selected',
            bg: 'tabs.solid.bg.selected',
          }}
          ref={ ref }
          expanded={ isActive }
          { ...props }
        >
          { menuButton.title }
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody display="flex" flexDir="column">
          { tabs.slice(tabsCut).map((tab) => {
            const value = getTabValue(tab);

            return (
              <TabsTrigger
                key={ value }
                value={ value }
                w="fit-content"
              >
                { typeof tab.title === 'function' ? tab.title() : tab.title }
                <TabsCounter count={ tab.count }/>
              </TabsTrigger>
            );
          }) }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(React.forwardRef(AdaptiveTabsMenu));
