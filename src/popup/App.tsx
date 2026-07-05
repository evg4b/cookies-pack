import { Button, Flex } from '@mantine/core';
import '@mantine/core/styles.css';
import { CookiesPackThemeProvider } from '@core/theme';
import { CookiesTable } from '@core/components/CookiesTable.tsx';

export default function App() {
  return (
    <CookiesPackThemeProvider>
      <Flex direction="column">
        <CookiesTable rows={[]} />
        <Button variant="filled">Button</Button>
        <Button variant="filled">Button</Button>
        <Button variant="filled">Button</Button>
        <Button variant="filled">Button</Button>
      </Flex>
    </CookiesPackThemeProvider>
  );
}
