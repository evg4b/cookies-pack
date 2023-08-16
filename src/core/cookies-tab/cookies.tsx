import React, { FC, useCallback, useEffect, useState } from 'react';
import { useTimedValue } from '@shared/hooks/timed';
import { Column, Row } from '@shared/components';
import { Button, Checkbox, Input } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

interface CookiesParams {
  current: string;
  currentPath: string;
  setCookies(clear: boolean, path: string, cookies: string): void;
}

const value = (event: Event | React.FormEvent<HTMLElement>) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (event?.target as any).value;
const checked = (event: CheckboxChangeEvent) => event.target.checked;

export const Cookies: FC<CookiesParams> = ({
  current,
  currentPath,
  setCookies,
}) => {
  const [customPath, setCustomPath] = useState(false);
  const [path, setPath] = useState('/');
  const [newCookies, setNewCookies] = useState('');
  const [clear, setClear] = useState(true);
  const [copied, setCopied] = useTimedValue(false, 1500);

  useEffect(
    () => setPath(customPath ? currentPath : '/'),
    [customPath, currentPath],
  );

  const toClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(current);
    setCopied(true);
  }, [current, setCopied]);

  const updateCookies = useCallback(() => {
    setCookies(clear, path, newCookies);
    setNewCookies('');
  }, [setCookies, clear, path, newCookies]);

  return (
    <Column gap={ 8 }>
      <Column gap={ 2 }>
        <Row justifyContent="space-between" alignItems="center">
          <div>Existing cookies</div>
          <Button disabled={ copied } onClick={ toClipboard }>
            { copied ? 'Copied' : 'Copy' }
          </Button>
        </Row>
        <Input.TextArea readOnly={ true } value={ current } rows={ 7 }/>
      </Column>
      <Column gap={ 8 }>
        <Input.TextArea rows={ 7 } value={ newCookies } onInput={ (event) => setNewCookies(value(event)) }>
          Update cookies with a cookie header, e.g. foo=bar; bat=baz; oof=rab
        </Input.TextArea>
      </Column>
      <Column gap={ 8 }>
        <Column gap={ 2 }>
          <div>Cookies path</div>
          <Row justifyContent="stretch" alignItems="center" gap={ 18 }>
            <Input
              disabled={ !customPath }
              value={ path }
              onChange={ (event) => setPath(value(event)) }
              style={ { flex: '1 1 auto' } }
            />
            <Checkbox
              checked={ customPath }
              onChange={ (event) => setCustomPath(checked(event)) }
            >
              Custom path
            </Checkbox>
          </Row>
        </Column>
        <Row justifyContent="space-between">
          <Checkbox
            checked={ clear }
            onChange={ (event) => setClear(checked(event)) }
          >
            Clear existing cookies first
          </Checkbox>
          <Button type="primary" onClick={ updateCookies }>Set Cookies</Button>
        </Row>
      </Column>
    </Column>
  );
};
