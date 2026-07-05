import { FC } from 'react';
import { Button, Flex, Input, PolymorphicComponentProps, Switch, Textarea } from '@mantine/core';

export type CookiesBatchUpdateProps = PolymorphicComponentProps<'div'>;

export const CookiesBatchUpdate: FC<CookiesBatchUpdateProps> = (props) => {
  return (
    <Flex {...props} flex={1} gap="xs" direction='column'>
      <Textarea flex="1 0 auto" />
      <Flex direction='row' align="center" gap='xs'>
        <Input flex={1} />
        <Switch
          defaultChecked
          label="I agree to sell my privacy"
        />
      </Flex>
      <Flex direction='row' align='center' justify='space-between' gap='xs'>
        <Switch
          defaultChecked
          label="I agree to sell my privacy"
        />
        <Button>
          Replace
        </Button>
      </Flex>
    </Flex>
  );
};