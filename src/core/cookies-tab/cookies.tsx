import React, { FC, useCallback, useEffect, useState } from 'react';
import { useTimedValue } from '@shared/hooks/timed';
import { Column, Row } from '@shared/components';

interface CookiesParams {
  current: string;
  currentPath: string;
  setCookies(clear: boolean, path: string, cookies: string): void;
}

const value = (event: Event | React.FormEvent<HTMLElement>) =>
  (event?.target as any).value;
const checked = (event: Event | React.FormEvent<HTMLElement>) =>
  (event?.target as any).checked;

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
        <Row justifyContent="space-between" alignItems="end">
          <div>Existing cookies</div>
          <button
            disabled={ copied }
            style={ { marginBottom: '6px' } }
            onClick={ toClipboard }
          >
            { copied ? 'Copied' : 'Copy' }
          </button>
        </Row>
        <textarea readOnly={ true } value={ current } rows={ 10 }/>
      </Column>
      <Column gap={ 8 }>
        <textarea
          rows={ 10 }
          value={ newCookies }
          onInput={ (event) => setNewCookies(value(event)) }
        >
          Update cookies with a cookie header, e.g. foo=bar; bat=baz; oof=rab
        </textarea>
      </Column>
      <Column gap={ 8 }>
        <Column gap={ 2 }>
          <div>Cookies path</div>
          <Row justifyContent="stretch" alignItems="center" gap={ 18 }>
            <input
              disabled={ !customPath }
              value={ path }
              onChange={ (event) => setPath(value(event)) }
              style={ { flex: '1 1 auto' } }
            />
            <input
              type="checkbox"
              checked={ customPath }
              onChange={ (event) => setCustomPath(checked(event)) }
            />
            <label>Custom path</label>
          </Row>
        </Column>
        <Row justifyContent="space-between">
          <input
            type="checkbox"
            checked={ clear }
            onChange={ (event) => setClear(checked(event)) }
          />
          <label>Clear existing cookies first</label>
          <pre>{ clear }</pre>
          <button onClick={ updateCookies }>Set Cookies</button>
        </Row>
      </Column>
    </Column>
  );
};
