import { ActionIcon, Chip, createTheme, DataList, Radio, Tooltip } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';

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
        withArrow: true,
        openDelay: 300,
        multiline: true,
        maw: 400,
        fz: 'xs',
        transitionProps: {
          transition: 'pop',
          duration: 100,
        },
      },
      styles: {
        tooltip: {
          wordBreak: 'break-word',
        },
      },
    }),
    RadioCard: Radio.Card.extend({
      defaultProps: {
        p: 'sm',
        radius: 'md',
      },
    }),
    DateTimePicker: DateTimePicker.extend({
      defaultProps: {
        clearable: true,
        timePickerProps: {
          withDropdown: true,
          popoverProps: { withinPortal: false },
        },
      },
    }),
    DataList: DataList.extend({
      defaultProps: {
        size: 'xs',
        labelWidth: '80px',
      },
    }),
  },
});
