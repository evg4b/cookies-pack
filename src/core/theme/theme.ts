import { ActionIcon, Chip, createTheme, Tooltip } from '@mantine/core';

export const cookiesPackTheme = createTheme({
  primaryColor: 'yellow',
  fontSmoothing: true,
  components: {
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: 'subtle',
      },
    }),
    Chip: Chip.extend({
      defaultProps: {
        variant: 'light',
      },
    }),
    Tooltip: Tooltip.extend({
      defaultProps: {
        openDelay: 300,
        multiline: true,
        maw: 220,
        fz: 'xs',
      },
      styles: {
        tooltip: {
          wordBreak: 'break-word',
        },
      },
    }),
  },
});
