import { defineSlotRecipe } from '@chakra-ui/react';

export const recipe = defineSlotRecipe({
  className: 'chakra-field',
  slots: [ 'root', 'label', 'requiredIndicator', 'errorText', 'helperText' ],
  base: {
    requiredIndicator: {
      color: 'inherit',
      lineHeight: 'inherit',
    },
    root: {
      display: 'flex',
      width: '100%',
      position: 'relative',
      gap: '1.5',
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      textAlign: 'start',
      textStyle: 'sm',
      fontWeight: '500',
      gap: '0',
      userSelect: 'none',
      _disabled: {
        opacity: '0.5',
      },
      _invalid: {
        color: 'input.fg.error',
      },
    },
    errorText: {
      display: 'inline-flex',
      alignItems: 'center',
      fontWeight: 'medium',
      gap: '1',
      color: 'input.fg.error',
      textStyle: 'xs',
    },
    helperText: {
      color: 'fg.muted',
      textStyle: 'xs',
    },
  },

  variants: {
    floating: {
      'true': {
        label: {
          pos: 'absolute',
          bg: 'bg',
          top: '2px',
          left: '2px',
          w: 'calc(100% - 4px)',
          borderRadius: 'base',
          pointerEvents: 'none',
          transformOrigin: 'top left',
          transitionProperty: 'font-size, line-height, padding, background-color',
          transitionDuration: 'fast',
          transitionTimingFunction: 'ease',
        },
      },
    },
    size: {
      sm: {
        label: {
          fontSize: 'sm',
        },
      },
      md: {
        label: {
          fontSize: 'md',
        },
      },
      lg: {
        label: {
          fontSize: 'md',
        },
      },
      xl: {
        label: {
          fontSize: 'md',
        },
      },
    },
    orientation: {
      vertical: {
        root: {
          flexDirection: 'column',
          alignItems: 'flex-start',
        },
      },
      horizontal: {
        root: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        label: {
          flex: '0 0 var(--field-label-width, 80px)',
        },
      },
    },
  },

  compoundVariants: [
    {
      size: 'xl',
      floating: true,
      css: {
        label: {
          padding: '10px 16px 0px 16px',
          textStyle: 'xs',
          _peerPlaceholderShown: {
            padding: '16px',
            textStyle: 'md',
          },
          _peerFocusVisible: {
            padding: '10px 16px 0px 16px',
            textStyle: 'xs',
          },
          _readOnly: {
            bg: 'input.bg.readOnly',
          },
        },
        errorText: {
          fontSize: 'inherit',
          lineHeight: 'inherit',
        },
      },
    },
  ],

  defaultVariants: {
    floating: false,
    orientation: 'vertical',
  },
});
