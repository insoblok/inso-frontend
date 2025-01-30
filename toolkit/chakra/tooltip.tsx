import { Tooltip as ChakraTooltip, Portal } from '@chakra-ui/react';
import { useClickAway } from '@uidotdev/usehooks';
import * as React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';

export interface TooltipProps extends ChakraTooltip.RootProps {
  selected?: boolean;
  showArrow?: boolean;
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  content: React.ReactNode;
  contentProps?: ChakraTooltip.ContentProps;
  disabled?: boolean;
  disableOnMobile?: boolean;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
    const {
      showArrow: showArrowProp,
      onOpenChange,
      variant,
      selected,
      children,
      disabled,
      disableOnMobile,
      portalled = true,
      content,
      contentProps,
      portalRef,
      defaultOpen = false,
      lazyMount = true,
      unmountOnExit = true,
      ...rest
    } = props;

    const [ open, setOpen ] = React.useState(defaultOpen);

    const isMobile = useIsMobile();
    const triggerRef = useClickAway<HTMLButtonElement>(() => setOpen(false));

    const handleOpenChange = React.useCallback((details: { open: boolean }) => {
      setOpen(details.open);
      onOpenChange?.(details);
    }, [ onOpenChange ]);

    const handleTriggerClick = React.useCallback(() => {
      setOpen((prev) => !prev);
    }, [ ]);

    if (disabled || (disableOnMobile && isMobile)) return children;

    const defaultShowArrow = variant === 'popover' ? false : true;
    const showArrow = showArrowProp !== undefined ? showArrowProp : defaultShowArrow;

    const positioning = {
      ...rest.positioning,
      offset: {
        mainAxis: 4,
        ...rest.positioning?.offset,
      },
    };

    return (
      <ChakraTooltip.Root
        openDelay={ 100 }
        closeDelay={ 100 }
        open={ open }
        onOpenChange={ isMobile ? undefined : handleOpenChange }
        closeOnClick={ false }
        variant={ variant }
        lazyMount={ lazyMount }
        unmountOnExit={ unmountOnExit }
        { ...rest }
        positioning={ positioning }
      >
        <ChakraTooltip.Trigger
          ref={ triggerRef }
          asChild
          onClick={ isMobile ? handleTriggerClick : undefined }
        >
          { children }
        </ChakraTooltip.Trigger>
        <Portal disabled={ !portalled } container={ portalRef }>
          <ChakraTooltip.Positioner>
            <ChakraTooltip.Content
              ref={ ref }
              { ...(selected ? { 'data-selected': true } : {}) }
              { ...contentProps }
            >
              { showArrow && (
                <ChakraTooltip.Arrow>
                  <ChakraTooltip.ArrowTip/>
                </ChakraTooltip.Arrow>
              ) }
              { content }
            </ChakraTooltip.Content>
          </ChakraTooltip.Positioner>
        </Portal>
      </ChakraTooltip.Root>
    );
  },
);
